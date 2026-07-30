export interface SchemeEligibility {
  occupation?: string[];
  maxIncome?: number;
  minIncome?: number;
  states?: string[]; // e.g. ["All"] or ["Chhattisgarh", "Maharashtra"]
  minAge?: number;
  maxAge?: number;
  gender?: string[]; // "Male", "Female", "Other", "All"
  categories?: string[]; // "SC", "ST", "OBC", "General", "All"
  maxLandHolding?: number; // in acres
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibility: SchemeEligibility;
  estimatedBenefits: number; // yearly monetary value or one-time
  benefitsDescription: string;
  requiredDocuments: string[];
  applicationLink: string;
  tags: string[];
}

const mockSchemes: Scheme[] = [
  {
    id: "pm-kisan",
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    description: "An initiative by the government of India in which all farmers will get up to ₹6,000 per year as minimum income support.",
    eligibility: {
      occupation: ["Farmer", "Agriculture"],
      maxLandHolding: 5, // typically up to 2 hectares (~5 acres) but varies
      states: ["All"],
      categories: ["All"]
    },
    estimatedBenefits: 6000,
    benefitsDescription: "₹6,000 per year in three equal installments of ₹2,000 each.",
    requiredDocuments: ["Aadhaar Card", "Bank Account Details", "Land Ownership Records"],
    applicationLink: "https://pmkisan.gov.in/",
    tags: ["Agriculture", "Direct Benefit Transfer", "Farmers"]
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat PM-JAY",
    description: "A national public health insurance fund of the Government of India that aims to provide free access to health insurance coverage for low income earners in the country.",
    eligibility: {
      maxIncome: 250000, // Approximate rough proxy for deprivation criteria
      states: ["All"],
      categories: ["All"]
    },
    estimatedBenefits: 500000,
    benefitsDescription: "Health insurance cover of up to ₹5,00,000 per family per year.",
    requiredDocuments: ["Aadhaar Card", "Ration Card", "PMJAY Golden Card"],
    applicationLink: "https://pmjay.gov.in/",
    tags: ["Healthcare", "Insurance", "Low Income"]
  },
  {
    id: "post-matric-sc",
    name: "Post Matric Scholarship for SC Students",
    description: "Provides financial assistance to Scheduled Caste students studying at post matriculation or post-secondary stage.",
    eligibility: {
      categories: ["SC"],
      maxIncome: 250000,
      states: ["All"]
    },
    estimatedBenefits: 12000,
    benefitsDescription: "Covers tuition fees, maintenance allowance, and other academic expenses.",
    requiredDocuments: ["Caste Certificate", "Income Certificate", "Aadhaar Card", "Bank Passbook"],
    applicationLink: "https://scholarships.gov.in/",
    tags: ["Education", "Scholarship", "SC"]
  },
  {
    id: "cgtmse",
    name: "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
    description: "Provides collateral-free credit to the micro and small enterprise sector.",
    eligibility: {
      occupation: ["Business", "Startup", "Entrepreneur"],
      states: ["All"],
      categories: ["All"]
    },
    estimatedBenefits: 20000000, // up to 2 crores
    benefitsDescription: "Collateral free loan up to ₹200 Lakhs.",
    requiredDocuments: ["Business Plan", "Aadhaar Card", "PAN Card", "IT Returns", "Udyam Registration"],
    applicationLink: "https://www.cgtmse.in/",
    tags: ["Business", "Startup", "Loan"]
  }
];

let exportedSchemes: Scheme[] = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const realSchemes = require('./real_schemes.json');
  if (Array.isArray(realSchemes) && realSchemes.length > 0) {
    exportedSchemes = realSchemes;
  } else {
    exportedSchemes = mockSchemes;
  }
} catch (e) {
  exportedSchemes = mockSchemes;
}

export const SEED_SCHEMES = exportedSchemes;
