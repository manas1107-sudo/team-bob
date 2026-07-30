import kagglehub
from kagglehub import KaggleDatasetAdapter
import json
import pandas as pd

try:
    print("Downloading dataset...")
    path = kagglehub.dataset_download("jainamgada45/indian-government-schemes")
    print("Dataset downloaded to:", path)
    import os
    print("Files:", os.listdir(path))
    
    # Let's see what's in there
    for file in os.listdir(path):
        if file.endswith('.csv'):
            df = pd.read_csv(os.path.join(path, file))
            print(f"Loaded {file} with {len(df)} rows.")
            print("Columns:", df.columns.tolist())
            records = df.to_dict(orient="records")
            with open("lib/db/real_schemes.json", "w") as f:
                json.dump(records, f, indent=2)
            print("Successfully saved to lib/db/real_schemes.json")
            break
except Exception as e:
    print(f"Error: {e}")
