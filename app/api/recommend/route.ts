import { NextResponse } from "next/server";
import schemesRaw from "@/lib/db/real_schemes.json";

// Force Node.js runtime (not Edge). The Edge runtime has a smaller bundle
// size ceiling and different JSON-import behavior — pinning this avoids a
// class of "works locally, 500s on Vercel" bugs.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------- Types ----------

type Profile = {
  occupation?: string;
  category?: string;
  state?: string;
  income?: number;
  landHolding?: number;
};

type SchemeEligibility = {
  occupation?: unknown[];
  states?: unknown[];
  categories?: unknown[];
  maxIncome?: number | null;
  maxLandHolding?: number | null;
};

type Scheme = {
  id?: string;
  name?: string;
  description?: string;
  eligibility?: SchemeEligibility;
  applicationLink?: string;
  url?: string;
  tags?: unknown[];
  estimatedBenefits?: number;
};

// ---------- Helpers (all defensive — never throw on bad data) ----------

function normalize(value: unknown): string {
  try {
    return String(value ?? "").trim().toLowerCase();
  } catch {
    return "";
  }
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function containsMatch(value: string, options: unknown[]): boolean {
  const normalizedValue = normalize(value);
  if (!normalizedValue) return false;

  return asArray(options).some((option) => {
    const normalizedOption = normalize(option);
    return (
      normalizedOption === "all" ||
      normalizedOption.includes(normalizedValue) ||
      normalizedValue.includes(normalizedOption)
    );
  });
}

function occupationMatches(occupation: string, requiredOccupations: unknown[]): boolean {
  const required = asArray(requiredOccupations);
  if (!required.length) return true;

  const userOccupation = normalize(occupation);
  if (!userOccupation) return true;

  if (required.some((item) => normalize(item) === "all")) return true;

  return required.some((item) => {
    const req = normalize(item);
    return req.includes(userOccupation) || userOccupation.includes(req);
  });
}

function toFiniteNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

// Validate + coerce the incoming body into a safe Profile, never throwing.
function parseProfile(body: unknown): Profile {
  const raw = (body && typeof body === "object" ? (body as any).profile : undefined) ?? {};

  return {
    occupation: typeof raw.occupation === "string" ? raw.occupation : undefined,
    category: typeof raw.category === "string" ? raw.category : undefined,
    state: typeof raw.state === "string" ? raw.state : undefined,
    income: toFiniteNumber(raw.income),
    landHolding: toFiniteNumber(raw.landHolding),
  };
}

// ---------- Core scoring (isolated so one bad scheme entry can't kill the whole request) ----------

function scoreScheme(scheme: Scheme, profile: Profile): {
  scheme: Scheme & { applicationLink: string };
  score: number;
  reasons: string[];
  missingInfo: string[];
  isEligible: boolean;
} | null {
  const eligibility = scheme.eligibility ?? {};
  let score = 40;
  const reasons: string[] = [];

  // Occupation — hard filter
  const occupations = asArray(eligibility.occupation);
  if (occupationMatches(profile.occupation ?? "", occupations)) {
    if (profile.occupation) {
      score += 20;
      reasons.push(`Relevant to ${profile.occupation}`);
    }
  } else {
    return null;
  }

  // State — hard filter if scheme restricts states
  const states = asArray(eligibility.states);
  if (states.length > 0) {
    if (containsMatch(profile.state ?? "", states)) {
      score += 20;
      reasons.push(`Available in ${profile.state}`);
    } else {
      return null;
    }
  } else if (profile.state) {
    score += 5;
    reasons.push(`Available in ${profile.state}`);
  }

  // Income — hard filter if over the cap
  const maxIncome = toFiniteNumber(eligibility.maxIncome);
  if (profile.income !== undefined && maxIncome !== undefined) {
    if (profile.income > maxIncome) return null;
    score += 10;
    reasons.push("Income is within the eligible limit");
  }

  // Category — soft boost only
  const categories = asArray(eligibility.categories);
  if (profile.category && categories.length > 0 && containsMatch(profile.category, categories)) {
    score += 10;
    reasons.push(`Matches ${profile.category} category`);
  }

  // Land holding — hard filter if over the cap
  const maxLand = toFiniteNumber(eligibility.maxLandHolding);
  if (profile.landHolding !== undefined && maxLand !== undefined) {
    if (profile.landHolding > maxLand) return null;
    score += 10;
    reasons.push("Land holding is within the eligible limit");
  }

  const applicationLink =
    (typeof scheme.applicationLink === "string" && scheme.applicationLink) ||
    (typeof scheme.url === "string" && scheme.url) ||
    "";

  return {
    scheme: { ...scheme, applicationLink },
    score: Math.min(99, score),
    reasons: reasons.length > 0 ? reasons : ["Open to eligible citizens"],
    missingInfo: [],
    isEligible: true,
  };
}

// ---------- Route handler ----------

export async function POST(req: Request) {
  // 1. Parse the request body defensively.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON.", detail: "Could not parse JSON body." },
      { status: 400 }
    );
  }

  const profile = parseProfile(body);

  // 2. Validate the schemes dataset loaded correctly at build time.
  const schemes: Scheme[] = Array.isArray(schemesRaw) ? (schemesRaw as Scheme[]) : [];
  if (schemes.length === 0) {
    console.error("Recommendation API: real_schemes.json is missing or empty at runtime.");
    return NextResponse.json(
      {
        error: "Scheme database is unavailable.",
        detail: "lib/db/real_schemes.json loaded as empty or non-array. Check the file is committed and valid JSON.",
      },
      { status: 503 }
    );
  }

  // 3. Score every scheme, isolating failures per-entry so one bad record
  //    can't 500 the whole request.
  const results: ReturnType<typeof scoreScheme>[] = [];
  let skipped = 0;

  for (const scheme of schemes) {
    try {
      const result = scoreScheme(scheme, profile);
      if (result) results.push(result);
    } catch (err) {
      skipped += 1;
      console.error("Recommendation API: skipped a malformed scheme entry", scheme?.id, err);
    }
  }

  if (skipped > 0) {
    console.warn(`Recommendation API: skipped ${skipped} malformed scheme entries.`);
  }

  const top = results
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return NextResponse.json({
    recommendations: top,
    profile,
    meta: {
      totalSchemesConsidered: schemes.length,
      malformedSchemesSkipped: skipped,
    },
  });
}

// Handy for sanity-checking the deployment itself: GET /api/recommend
// tells you immediately whether the dataset loaded, without needing a POST.
export async function GET() {
  const schemes: Scheme[] = Array.isArray(schemesRaw) ? (schemesRaw as Scheme[]) : [];
  return NextResponse.json({
    status: "ok",
    schemesLoaded: schemes.length,
  });
}
