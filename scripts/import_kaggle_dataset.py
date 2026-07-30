import kagglehub
from kagglehub import KaggleDatasetAdapter
import pandas as pd
import json
import re
import os

def clean_text(text):
    if pd.isna(text): return ""
    return str(text).strip()

def map_row_to_scheme(row, columns):
    # Try to find the best matching columns for our schema
    cols_lower = {c.lower(): c for c in columns}
    
    def get_val(keywords, default=""):
        for k in keywords:
            for c in cols_lower:
                if k in c:
                    return clean_text(row[cols_lower[c]])
        return default

    name = get_val(["name", "title", "scheme"], "Unknown Scheme")
    desc = get_val(["desc", "detail", "about"], "No description provided.")
    benefits = get_val(["benefit", "amount", "financial"], "Refer to official documentation for benefits.")
    eligibility_text = get_val(["eligibility", "criteria", "who"], "")
    link = get_val(["link", "url", "apply", "website"], "https://www.myscheme.gov.in/")
    
    # Very basic parsing for eligibility
    max_income = 250000 if "income" in eligibility_text.lower() else 10000000
    
    return {
        "id": re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-'),
        "name": name,
        "description": desc,
        "eligibility": {
            "maxIncome": max_income,
            "states": ["All"],
            "categories": ["All"]
        },
        "estimatedBenefits": 50000, # Mock value as dataset might not have exact ints
        "benefitsDescription": benefits,
        "requiredDocuments": ["Aadhaar Card"],
        "applicationLink": link,
        "tags": ["Government", "Welfare"]
    }

def main():
    print("Downloading dataset from Kaggle...")
    try:
        # Download dataset directory
        dataset_path = kagglehub.dataset_download("jainamgada45/indian-government-schemes")
        print(f"Dataset downloaded to {dataset_path}")
        
        # Find the CSV file
        csv_files = [f for f in os.listdir(dataset_path) if f.endswith('.csv')]
        if not csv_files:
            raise Exception("No CSV file found in the dataset.")
            
        csv_path = os.path.join(dataset_path, csv_files[0])
        print(f"Loading {csv_path}...")
        df = pd.read_csv(csv_path)
        
        print("Dataset loaded successfully!")
        print("First 5 records:\n", df.head())
        
        print("\nMapping columns to internal schema...")
        columns = df.columns.tolist()
        
        schemes = []
        for _, row in df.iterrows():
            schemes.append(map_row_to_scheme(row, columns))
            
        # Deduplicate by ID
        unique_schemes = {s['id']: s for s in schemes}.values()
        
        out_path = os.path.join(os.path.dirname(__file__), "..", "lib", "db", "real_schemes.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(list(unique_schemes), f, indent=2)
            
        print(f"Successfully exported {len(unique_schemes)} schemes to {out_path}!")
        print("Restart your Next.js dev server to see the new data.")
        
    except Exception as e:
        print(f"Failed to fetch dataset: {e}")

if __name__ == "__main__":
    main()
