import pandas as pd
import json
import re
import os
import math

def clean_text(text):
    if pd.isna(text): return ""
    return str(text).strip()

def extract_features(text):
    text_lower = text.lower()
    
    # Extract occupation
    occupation = ["All"]
    if any(k in text_lower for k in ["farmer", "agriculture", "crop"]):
        occupation = ["Farmer", "Agriculture"]
    elif any(k in text_lower for k in ["student", "school", "scholarship", "college", "degree"]):
        occupation = ["Student"]
    elif any(k in text_lower for k in ["business", "enterprise", "startup", "entrepreneur", "msme"]):
        occupation = ["Business", "Startup"]
    elif any(k in text_lower for k in ["worker", "labour", "employment"]):
        occupation = ["Worker"]
        
    # Extract category
    categories = ["All"]
    if "obc" in text_lower or "backward" in text_lower:
        categories.append("OBC")
    if "sc" in text_lower or "scheduled caste" in text_lower:
        categories.append("SC")
    if "st" in text_lower or "scheduled tribe" in text_lower:
        categories.append("ST")
    if len(categories) > 1:
        categories.remove("All")
        
    # Income logic
    max_income = 10000000 # default
    if "income" in text_lower:
        # try to find numbers like 2,50,000 or 1 lakh
        if "1 lakh" in text_lower or "1,00,000" in text_lower: max_income = 100000
        elif "2.5 lakh" in text_lower or "2,50,000" in text_lower: max_income = 250000
        elif "8 lakh" in text_lower or "8,00,000" in text_lower: max_income = 800000
        
    # State logic
    states = ["All"]
    indian_states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
        "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
        "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Andaman and Nicobar", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", 
        "Lakshadweep", "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
    ]
    for st in indian_states:
        if st.lower() in text_lower:
            if "All" in states: states.remove("All")
            states.append(st)
            
    if not states: states = ["All"]
            
    return occupation, categories, max_income, states

def map_row_to_scheme(row):
    name = clean_text(row.get('scheme_name', 'Unknown'))
    desc = clean_text(row.get('details', ''))
    benefits = clean_text(row.get('benefits', ''))
    eligibility_text = clean_text(row.get('eligibility', ''))
    link = clean_text(row.get('application', ''))
    
    # Extract actual URL or fallback to Google Search
    url_match = re.search(r'(https?://[^\s]+)', link + " " + desc)
    if url_match:
        final_link = url_match.group(1)
    else:
        # Create a highly effective fallback Google search link to find the official portal
        final_link = f"https://www.google.com/search?q={name.replace(' ', '+')}+apply+online+official"
    
    combined_text = name + " " + desc + " " + eligibility_text
    occupation, categories, max_income, states = extract_features(combined_text)
    
    return {
        "id": re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')[:50],
        "name": name,
        "description": desc[:300] + "..." if len(desc) > 300 else desc,
        "eligibility": {
            "occupation": occupation,
            "maxIncome": max_income,
            "states": states,
            "categories": categories
        },
        "estimatedBenefits": 50000, # Static fallback for UI
        "applicationLink": final_link,
        "tags": [clean_text(row.get('schemeCategory', 'Government'))]
    }

def main():
    csv_path = os.path.join(os.path.dirname(__file__), "..", "updated_data.csv")
    print(f"Reading {csv_path}...")
    df = pd.read_csv(csv_path)
    
    # Process rows
    schemes = []
    seen_ids = set()
    
    # Randomize and slice to first 1000 to keep JSON size optimized for Next.js frontend ML 
    # (Since 3400 full schemes is a massive string block and we're parsing entirely in-browser)
    df = df.sample(frac=1).reset_index(drop=True)
    
    for _, row in df.iterrows():
        scheme = map_row_to_scheme(row)
        if scheme['id'] and scheme['id'] not in seen_ids:
            seen_ids.add(scheme['id'])
            schemes.append(scheme)
            
        if len(schemes) >= 1500: # Optimal limit
            break
            
    out_path = os.path.join(os.path.dirname(__file__), "..", "lib", "db", "real_schemes.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(schemes, f, indent=2)
        
    print(f"Successfully exported {len(schemes)} schemes to {out_path}!")

if __name__ == "__main__":
    main()
