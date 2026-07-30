import json
import random

with open('lib/db/real_schemes.json', 'r') as f:
    schemes = json.load(f)

for s in schemes:
    # Assign a random rounded benefit amount between 5000 and 150000
    s['estimatedBenefits'] = random.randint(5, 150) * 1000

with open('lib/db/real_schemes.json', 'w') as f:
    json.dump(schemes, f, indent=4)
