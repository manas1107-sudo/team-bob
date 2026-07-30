import { NextResponse } from "next/server";
import schemes from "@/lib/db/real_schemes.json";

type Profile = {
  occupation?: string;
  category?: string;
  state?: string;
  income?: number;
  landHolding?: number;
};

function normalize(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function containsMatch(value: string, options: unknown[]): boolean {
  const normalizedValue = normalize(value);

  if (!normalizedValue) return false;

  return options.some((option) => {
    const normalizedOption = normalize(option);

    return (
      normalizedOption === "all" ||
      normalizedOption.includes(normalizedValue) ||
      normalizedValue.includes(normalizedOption)
    );
  });
} 

function occupationMatches(
  occupation: string,
  requiredOccupations: unknown[]
): boolean {
  if (!requiredOccupations?.length) return true;

  const userOccupation = normalize(occupation);

  if (!userOccupation) return true;

  if (
    requiredOccupations.some(
      (item) => normalize(item) === "all"
    )
  ) {
    return true;
  }

  return requiredOccupations.some((item) => {
    const required = normalize(item);

    return (
      required.includes(userOccupation) ||
      userOccupation.includes(required)
    );
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const profile: Profile = body?.profile ?? {};

    const userIncome =
      profile.income !== undefined
        ? Number(profile.income)
        : undefined;

    const userLand =
      profile.landHolding !== undefined
        ? Number(profile.landHolding)
        : undefined;

    const results = (schemes as any[])
      .map((scheme) => {
        const eligibility = scheme.eligibility ?? {};

        let score = 40;
        const reasons: string[] = [];

        // Occupation
        const occupations = eligibility.occupation ?? [];

        if (
          occupationMatches(
            profile.occupation ?? "",
            occupations
          )
        ) {
          if (profile.occupation) {
            score += 20;
            reasons.push(
              `Relevant to ${profile.occupation}`
            );
          }
        } else {
          return null;
        }

        // State
        const states = eligibility.states ?? [];

        if (states.length > 0) {
          if (
            containsMatch(profile.state ?? "", states)
          ) {
            score += 20;
            reasons.push(
              `Available in ${profile.state}`
            );
          } else {
            return null;
          }
        } else if (profile.state) {
          score += 5;
          reasons.push(
            `Available in ${profile.state}`
          );
        }

        // Income
        if (
          userIncome !== undefined &&
          eligibility.maxIncome !== undefined &&
          eligibility.maxIncome !== null
        ) {
          const maxIncome = Number(
            eligibility.maxIncome
          );

          if (
            !Number.isNaN(maxIncome) &&
            userIncome > maxIncome
          ) {
            return null;
          }

          score += 10;

          reasons.push(
            `Income is within the eligible limit`
          );
        }

        // Category
        const categories =
          eligibility.categories ?? [];

        if (
          profile.category &&
          categories.length > 0
        ) {
          if (
            containsMatch(
              profile.category,
              categories
            )
          ) {
            score += 10;

            reasons.push(
              `Matches ${profile.category} category`
            );
          }
        }

        // Land holding
        if (
          userLand !== undefined &&
          eligibility.maxLandHolding !== undefined &&
          eligibility.maxLandHolding !== null
        ) {
          const maxLand = Number(
            eligibility.maxLandHolding
          );

          if (
            !Number.isNaN(maxLand) &&
            userLand > maxLand
          ) {
            return null;
          }

          score += 10;

          reasons.push(
            `Land holding is within the eligible limit`
          );
        }

        const applicationLink =
          scheme.applicationLink ??
          scheme.url ??
          "";

        return {
          scheme: {
            ...scheme,
            applicationLink,
          },
          score: Math.min(99, score),
          reasons:
            reasons.length > 0
              ? reasons
              : ["Open to eligible citizens"],
          missingInfo: [],
          isEligible: true,
        };
      })
      .filter(Boolean)
      .sort(
        (a: any, b: any) =>
          b.score - a.score
      )
      .slice(0, 10);

    return NextResponse.json({
      recommendations: results,
      profile,
    });
  } catch (error) {
    console.error(
      "Recommendation API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to generate recommendations.",
      },
      { status: 500 }
    );
  }
}
