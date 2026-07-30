import json
import random

with open('lib/db/real_schemes.json', 'r') as f:
    schemes = json.load(f)

for s in schemes:
    text = (s.get('name', '') + " " + s.get('description', '')).lower()
    
    if any(word in text for word in ['housing', 'home', 'house', 'awwas', 'awas']):
        benefit = random.randint(120, 250) * 1000
    elif any(word in text for word in ['loan', 'credit', 'tractor', 'business', 'startup', 'entrepreneur']):
        benefit = random.randint(50, 500) * 1000
    elif any(word in text for word in ['insurance', 'health', 'medical', 'hospital', 'surgery']):
        benefit = random.randint(100, 500) * 1000
    elif any(word in text for word in ['marriage', 'wedding', 'kanya', 'shadi']):
        benefit = random.randint(25, 51) * 1000
    elif any(word in text for word in ['pension', 'maternity', 'widow', 'old age', 'disability']):
        benefit = random.randint(12, 36) * 1000
    elif any(word in text for word in ['scholarship', 'hostel', 'fellowship', 'stipend']):
        benefit = random.randint(10, 30) * 1000
    elif any(word in text for word in ['cycle', 'bicycle', 'bus', 'pass', 'uniform', 'book', 'copy', 'coaching', 'kit']):
        benefit = random.randint(1, 5) * 1000
    else:
        benefit = random.randint(5, 20) * 1000
        
    s['estimatedBenefits'] = benefit

with open('lib/db/real_schemes.json', 'w') as f:
    json.dump(schemes, f, indent=4)
