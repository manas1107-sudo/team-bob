import os
import json
import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.neural_network import MLPRegressor
import numpy as np

app = FastAPI(title="JanSetu AI Deep Learning Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load real schemes
SCHEMES_PATH = os.path.join(os.path.dirname(__file__), "..", "lib", "db", "real_schemes.json")
try:
    with open(SCHEMES_PATH, "r") as f:
        SCHEMES = json.load(f)
except FileNotFoundError:
    print("WARNING: real_schemes.json not found. Using empty array.")
    SCHEMES = []

# --- Occupation synonym map ---
# Maps common free-text occupations to canonical scheme occupation tags
OCCUPATION_SYNONYMS = {
    "fisherman": ["fisher", "fishermen", "fishing", "aquaculture", "marine", "coastal"],
    "fisher": ["fisherman", "fishing", "fishermen", "aquaculture"],
    "artisan": ["handicraft", "craft", "weaver", "artisan", "handloom", "karigar"],
    "weaver": ["handloom", "weaver", "artisan", "textile", "handicraft"],
    "carpenter": ["carpenter", "artisan", "skilled worker", "construction", "wood"],
    "mason": ["mason", "construction", "builder", "skilled worker"],
    "plumber": ["plumber", "skilled worker", "construction"],
    "electrician": ["electrician", "skilled worker", "engineer"],
    "tailor": ["tailor", "artisan", "handloom", "textile"],
    "potter": ["potter", "artisan", "handicraft", "ceramic"],
    "blacksmith": ["blacksmith", "artisan", "skilled worker", "metal"],
    "painter": ["painter", "artisan", "skilled worker", "construction"],
    "driver": ["driver", "transport", "self-employed"],
    "hawker": ["hawker", "vendor", "street vendor", "self-employed", "retail"],
    "vendor": ["vendor", "street vendor", "hawker", "self-employed"],
    "domestic worker": ["domestic", "worker", "self-employed", "labour"],
    "labour": ["labour", "worker", "labourer", "daily wage", "construction"],
    "labourer": ["labour", "worker", "labourer", "daily wage"],
    "migrant worker": ["migrant", "worker", "labour", "labourer"],
    "tribal": ["tribal", "st", "forest", "adivasi"],
    "senior citizen": ["senior", "elderly", "pension", "old age", "retirement"],
    "widow": ["widow", "women", "female", "single mother"],
    "disabled": ["disabled", "differently abled", "disability", "handicapped"],
    "student": ["student", "education", "scholarship"],
    "farmer": ["farmer", "agriculture", "kisan", "farming", "crop"],
    "business": ["business", "msme", "startup", "entrepreneur", "enterprise"],
}

def get_occupation_keywords(occupation: str) -> list[str]:
    """Get all keywords associated with an occupation including synonyms."""
    occ_lower = occupation.lower().strip()
    keywords = [occ_lower]
    
    # Direct lookup
    for key, synonyms in OCCUPATION_SYNONYMS.items():
        if key in occ_lower or occ_lower in key:
            keywords.extend(synonyms)
            keywords.append(key)
        # Also check if user occupation matches any synonym
        for syn in synonyms:
            if syn in occ_lower:
                keywords.extend(synonyms)
                keywords.append(key)
    
    return list(set(keywords))

def occupation_matches_scheme(user_occ: str, scheme: dict) -> tuple:
    """
    Returns (matches, strength) where strength is 0.0-1.0.
    - strength 1.0 = direct occupation match
    - strength 0.7 = keyword/tag match
    - strength 0.5 = generic scheme open to all
    - False = hard exclude (scheme for a completely different specific occupation)
    """
    keywords = get_occupation_keywords(user_occ)
    occ_lower = user_occ.lower().strip()
    
    reqs = scheme.get("eligibility", {})
    scheme_occupations = [str(o).lower() for o in reqs.get("occupation", [])]
    scheme_tags = [str(t).lower() for t in scheme.get("tags", [])]
    scheme_name = scheme.get("name", "").lower()
    scheme_desc = scheme.get("description", "").lower()
    
    # If scheme is open to ALL occupations — always include (generic)
    if not scheme_occupations or "all" in scheme_occupations:
        # Still boost score if keywords appear in name/tags/description
        match_strength = 0.4  # base for open-to-all
        for keyword in keywords:
            if len(keyword) < 3:
                continue
            if keyword in scheme_name:
                match_strength = max(match_strength, 0.8)
            if any(keyword in t for t in scheme_tags):
                match_strength = max(match_strength, 0.7)
            if keyword in scheme_desc:
                match_strength = max(match_strength, 0.55)
        return True, match_strength
    
    # Scheme has specific occupation requirements
    # Check if user occupation matches any of those requirements
    for keyword in keywords:
        if len(keyword) < 3:
            continue
        for s_occ in scheme_occupations:
            if keyword in s_occ or s_occ in keyword:
                return True, 1.0  # Direct match
    
    # Scheme requires a specific occupation that doesn't match — hard exclude
    return False, 0.0


def encode_features(user_profile, scheme):
    def norm(val, m):
        if val is None: return 0.5
        return min(float(val) / m, 1.0)
        
    u_inc = norm(user_profile.get("income"), 1000000)
    u_land = norm(user_profile.get("landHolding"), 10)
    u_occ = str(user_profile.get("occupation", "")).lower()
    
    u_is_student = 1.0 if any(k in u_occ for k in ["student"]) else 0.0
    u_is_farmer = 1.0 if any(k in u_occ for k in ["farmer", "kisan", "agriculture"]) else 0.0
    u_is_business = 1.0 if any(k in u_occ for k in ["business", "startup", "entrepreneur", "msme"]) else 0.0
    u_state = str(user_profile.get("state", "")).lower()
    
    reqs = scheme.get("eligibility", {})
    s_inc = norm(reqs.get("maxIncome"), 1000000) if reqs.get("maxIncome") else 1.0
    s_land = norm(reqs.get("maxLandHolding"), 10) if reqs.get("maxLandHolding") else 1.0
    
    s_reqs_occ = [str(o).lower() for o in reqs.get("occupation", [])]
    s_req_student = 1.0 if any("student" in o for o in s_reqs_occ) else 0.0
    s_req_farmer = 1.0 if any("farmer" in o or "agriculture" in o for o in s_reqs_occ) else 0.0
    s_req_business = 1.0 if any("business" in o or "msme" in o for o in s_reqs_occ) else 0.0
    
    s_states = [str(s).lower() for s in reqs.get("states", [])]
    if "all" in s_states:
        s_req_state_match = 0.5
    elif u_state and any(u_state in s for s in s_states):
        s_req_state_match = 1.0
    else:
        s_req_state_match = 0.0
    
    return [u_inc, u_land, u_is_student, u_is_farmer, u_is_business, 
            s_inc, s_land, s_req_student, s_req_farmer, s_req_business, s_req_state_match]

def compute_knn_label(features):
    u_inc, u_land, u_is_student, u_is_farmer, u_is_business, s_inc, s_land, s_req_student, s_req_farmer, s_req_business, s_req_state_match = features
    
    score = 0.5 
    
    if u_inc > s_inc: score -= 0.5
    if u_land > s_land: score -= 0.5
    if s_req_student > 0 and u_is_student == 0: score -= 0.8
    if s_req_farmer > 0 and u_is_farmer == 0: score -= 0.8
    if s_req_business > 0 and u_is_business == 0: score -= 0.8
    if s_req_state_match == 0.0: score -= 0.8
    
    if s_req_student > 0 and u_is_student == 1: score += 0.5
    if s_req_farmer > 0 and u_is_farmer == 1: score += 0.5
    if s_req_business > 0 and u_is_business == 1: score += 0.5
    if s_req_state_match == 1.0: score += 0.5
    
    return min(1.0, max(0.0, score))

# Define the Deep Learning Model (Multi-Layer Perceptron)
model = MLPRegressor(hidden_layer_sizes=(32, 16), activation='relu', solver='adam', max_iter=200)

if SCHEMES:
    print("Synthetically training Deep Neural Network on startup...")
    X_train = []
    Y_train = []
    
    for _ in range(3000):
        u = {
            "income": random.randint(0, 1000000), 
            "occupation": random.choice(["Student", "Farmer", "Business", "Fisherman", "Artisan", "Senior Citizen"]),
            "state": random.choice(["Maharashtra", "Chhattisgarh", "Karnataka", "Delhi"])
        }
        s = random.choice(SCHEMES)
        features = encode_features(u, s)
        label = compute_knn_label(features)
        
        X_train.append(features)
        Y_train.append(label)

    model.fit(np.array(X_train), np.array(Y_train))
    print("Training Complete! Ready for Neural Network Inference.")

@app.post("/predict")
def predict_schemes(payload: dict):
    user = payload.get("profile", {})
    user_occupation = str(user.get("occupation", "")).strip()
    results = []
    
    X_inference = [encode_features(user, scheme) for scheme in SCHEMES]
    if X_inference:
        predictions = model.predict(np.array(X_inference))
        
        for i, scheme in enumerate(SCHEMES):
            prediction = float(predictions[i])
            
            reqs = scheme.get("eligibility", {})
            reasons = []
            
            # --- Occupation relevance check ---
            occ_match, occ_strength = occupation_matches_scheme(user_occupation, scheme)
            if not occ_match:
                continue  # Hard exclude for schemes requiring different occupation
            
            # Boost score by occupation relevance
            boosted_prediction = prediction * 0.4 + occ_strength * 0.6
            
            if occ_strength >= 0.7:
                reasons.append(f"\u2713 Relevant to {user_occupation}")
            elif occ_strength >= 0.5:
                reasons.append(f"\u2713 Applicable to {user_occupation} workers")
            
            # --- State check (empty states = available to all) ---
            scheme_states = reqs.get("states", [])
            if scheme_states and "All" not in scheme_states and len(scheme_states) > 0:
                user_state = str(user.get("state", "")).lower()
                state_names_lower = [str(s).lower() for s in scheme_states]
                if user_state and not any(user_state in s or s in user_state for s in state_names_lower):
                    continue  # Hard state mismatch
                else:
                    reasons.append(f"\u2713 Matches state: {user.get('state')}")
            else:
                if user.get("state"):
                    reasons.append(f"\u2713 Available in {user.get('state')}")
                    
            # --- Income check ---
            if user.get("income") is not None and reqs.get("maxIncome"):
                if int(user["income"]) > int(reqs["maxIncome"]):
                    continue  # Hard income mismatch
                else:
                    reasons.append(f"\u2713 Income below \u20b9{int(reqs['maxIncome']):,}")
            
            # --- Category check (advisory only — boost, never hard exclude) ---
            scheme_cats = reqs.get("categories", [])
            user_cat = user.get("category", "")
            if scheme_cats and user_cat:
                if user_cat in scheme_cats:
                    reasons.append(f"\u2713 Eligible for {user_cat} category")
                    boosted_prediction = min(1.0, boosted_prediction + 0.1)
                elif user_cat == "General":
                    # General users can still apply to most schemes
                    pass
                else:
                    # User has SC/ST/OBC but scheme is for different category
                    # Soft penalty instead of hard exclude
                    boosted_prediction = max(0.0, boosted_prediction - 0.2)
                    
            if len(reasons) == 0:
                reasons.append("\u2713 Open to all eligible citizens")
            
            if boosted_prediction > 0.2:  # Lower threshold to show more results
                ui_score = int(boosted_prediction * 100)
                ui_score = min(99, max(70, ui_score))
                
                results.append({
                    "scheme": scheme,
                    "score": ui_score,
                    "reasons": reasons,
                    "missingInfo": [],
                    "isEligible": True
                })
                
    results.sort(key=lambda x: x["score"], reverse=True)
    return {"recommendations": results[:10], "profile": user}
