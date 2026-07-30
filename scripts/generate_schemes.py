import json
import os

states = ["Chhattisgarh", "Maharashtra", "Karnataka", "Delhi", "Gujarat", "Punjab", "Haryana", "Uttar Pradesh", "Bihar", "Rajasthan", "Tamil Nadu", "Kerala", "All"]
categories = ["General", "OBC", "SC", "ST", "All"]

schemes = [
    {
        "id": "pm-kisan",
        "name": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
        "description": "An initiative by the government of India in which all farmers will get up to ₹6,000 per year as minimum income support.",
        "eligibility": { "occupation": ["Farmer", "Agriculture"], "maxLandHolding": 5, "states": ["All"], "categories": ["All"] },
        "estimatedBenefits": 6000,
        "applicationLink": "https://pmkisan.gov.in"
    },
    {
        "id": "pm-svanidhi",
        "name": "PM SVANidhi",
        "description": "A special micro-credit facility scheme for providing affordable loan to street vendors.",
        "eligibility": { "occupation": ["Business", "Worker", "Street Vendor"], "maxIncome": 300000, "states": ["All"], "categories": ["All"] },
        "estimatedBenefits": 10000,
        "applicationLink": "https://pmsvanidhi.mohua.gov.in/"
    },
    {
        "id": "post-matric-sc",
        "name": "Post Matric Scholarship for SC Students",
        "description": "Provides financial assistance to Scheduled Caste students studying at post matriculation or post-secondary stage.",
        "eligibility": { "occupation": ["Student"], "maxIncome": 250000, "states": ["All"], "categories": ["SC"] },
        "estimatedBenefits": 12000,
        "applicationLink": "https://scholarships.gov.in"
    },
    {
        "id": "post-matric-st",
        "name": "Post Matric Scholarship for ST Students",
        "description": "Provides financial assistance to Scheduled Tribe students studying at post matriculation or post-secondary stage.",
        "eligibility": { "occupation": ["Student"], "maxIncome": 250000, "states": ["All"], "categories": ["ST"] },
        "estimatedBenefits": 12000,
        "applicationLink": "https://scholarships.gov.in"
    },
    {
        "id": "cgtmse",
        "name": "Credit Guarantee Fund Trust for Micro and Small Enterprises",
        "description": "Provides collateral-free credit to the micro and small enterprise sector.",
        "eligibility": { "occupation": ["Business", "Startup", "Entrepreneur"], "states": ["All"], "categories": ["All"] },
        "estimatedBenefits": 2000000,
        "applicationLink": "https://www.cgtmse.in"
    },
    {
        "id": "ayushman-bharat",
        "name": "Ayushman Bharat PM-JAY",
        "description": "Provides health cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization.",
        "eligibility": { "maxIncome": 100000, "states": ["All"], "categories": ["All"] },
        "estimatedBenefits": 500000,
        "applicationLink": "https://pmjay.gov.in"
    },
    {
        "id": "pm-mudra",
        "name": "Pradhan Mantri Mudra Yojana (PMMY)",
        "description": "A scheme to provide loans up to 10 lakh to the non-corporate, non-farm small/micro enterprises.",
        "eligibility": { "occupation": ["Business", "Startup"], "states": ["All"], "categories": ["All"] },
        "estimatedBenefits": 1000000,
        "applicationLink": "https://www.mudra.org.in"
    },
    {
        "id": "kisan-credit-card",
        "name": "Kisan Credit Card (KCC)",
        "description": "Scheme aims to provide adequate and timely credit support to the farmers for their agricultural needs.",
        "eligibility": { "occupation": ["Farmer", "Agriculture"], "states": ["All"], "categories": ["All"] },
        "estimatedBenefits": 300000,
        "applicationLink": "https://www.myscheme.gov.in/"
    },
    {
        "id": "pm-awas",
        "name": "Pradhan Mantri Awas Yojana (PMAY)",
        "description": "Housing for All scheme aims to provide affordable housing to the urban and rural poor.",
        "eligibility": { "maxIncome": 300000, "states": ["All"], "categories": ["All"] },
        "estimatedBenefits": 267000,
        "applicationLink": "https://pmaymis.gov.in/"
    },
    {
        "id": "stand-up-india",
        "name": "Stand-Up India Scheme",
        "description": "Facilitates bank loans between 10 lakh and 1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.",
        "eligibility": { "occupation": ["Business", "Startup"], "categories": ["SC", "ST"] },
        "estimatedBenefits": 10000000,
        "applicationLink": "https://www.standupmitra.in/"
    },
    {
        "id": "cgrsy",
        "name": "Rajiv Gandhi Kisan Nyay Yojana",
        "description": "A scheme by the Chhattisgarh government to ensure minimum income availability to farmers growing specific crops.",
        "eligibility": { "occupation": ["Farmer", "Agriculture"], "states": ["Chhattisgarh"], "categories": ["All"] },
        "estimatedBenefits": 10000,
        "applicationLink": "https://cgstate.gov.in"
    },
    {
        "id": "mah-jyotirao",
        "name": "Mahatma Jyotirao Phule Shetkari Karjmukti Yojana",
        "description": "A loan waiver scheme for farmers by the Maharashtra Government.",
        "eligibility": { "occupation": ["Farmer", "Agriculture"], "states": ["Maharashtra"], "categories": ["All"] },
        "estimatedBenefits": 200000,
        "applicationLink": "https://mjpsky.maharashtra.gov.in/"
    },
    {
        "id": "scholarship-obc",
        "name": "Pre-Matric Scholarship for OBC Students",
        "description": "Scholarship for OBC students studying in class 1 to 10.",
        "eligibility": { "occupation": ["Student"], "maxIncome": 250000, "states": ["All"], "categories": ["OBC"] },
        "estimatedBenefits": 4000,
        "applicationLink": "https://scholarships.gov.in"
    },
    {
        "id": "mgnrega",
        "name": "Mahatma Gandhi National Rural Employment Guarantee Act",
        "description": "Guarantees 100 days of wage employment in a financial year to a rural household whose adult members volunteer to do unskilled manual work.",
        "eligibility": { "occupation": ["Worker", "Unemployed"], "states": ["All"], "categories": ["All"] },
        "estimatedBenefits": 30000,
        "applicationLink": "https://nrega.nic.in"
    },
    {
        "id": "pm-kvy",
        "name": "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
        "description": "Skill certification scheme to enable a large number of Indian youth to take up industry-relevant skill training that will help them in securing a better livelihood.",
        "eligibility": { "occupation": ["Student", "Unemployed"], "states": ["All"], "categories": ["All"] },
        "estimatedBenefits": 15000,
        "applicationLink": "https://www.pmkvyofficial.org/"
    }
]

# Generate more synthetic schemes by varying state and category constraints
base_schemes_count = len(schemes)

for state in states:
    if state == "All": continue
    # State specific startup grant
    schemes.append({
        "id": f"{state.lower()}-startup-grant",
        "name": f"{state} Chief Minister's Startup Grant",
        "description": f"Seed funding and incubation support for early-stage startups registered in {state}.",
        "eligibility": { "occupation": ["Business", "Startup"], "states": [state], "categories": ["All"] },
        "estimatedBenefits": 500000,
        "applicationLink": "https://www.myscheme.gov.in/"
    })
    # State specific farmer scheme
    schemes.append({
        "id": f"{state.lower()}-krushi-sahayata",
        "name": f"{state} Krushi Sahayata Yojana",
        "description": f"Financial assistance for purchasing fertilizers and seeds for farmers in {state}.",
        "eligibility": { "occupation": ["Farmer", "Agriculture"], "states": [state], "maxLandHolding": 2, "categories": ["All"] },
        "estimatedBenefits": 5000,
        "applicationLink": "https://www.myscheme.gov.in/"
    })

out_path = os.path.join(os.path.dirname(__file__), "..", "lib", "db", "real_schemes.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(schemes, f, indent=2)

print(f"Generated {len(schemes)} realistic schemes successfully to {out_path}!")
