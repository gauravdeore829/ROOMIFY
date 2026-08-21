import re
from typing import Dict, Any

def parse_natural_query(query: str) -> Dict[str, Any]:
    query_lower = query.lower()
    extracted = {
        "originalQuery": query,
        "maxRent": None,
        "roomType": None,
        "location": None,
        "facilities": [],
        "city": None,
    }

    # Extract Budget / Rent (e.g., 8000, 8k, 6000 ke andar, 10000 under)
    budget_patterns = [
        r'(\d+)\s*(?:k|thousand)',
        r'(?:under|below|budget|andar|max|upto)\s*(\d+)',
        r'(\d+)\s*(?:rupees|rs|INR|per month|\/month)?'
    ]

    for pattern in budget_patterns:
        match = re.search(pattern, query_lower)
        if match:
            val = match.group(1)
            num = int(val)
            if 'k' in query_lower[match.start():match.end()]:
                num *= 1000
            if num >= 1000:
                extracted["maxRent"] = float(num)
                break

    # Extract Room Type
    if 'single' in query_lower or '1 sharing' in query_lower or 'private' in query_lower:
        extracted["roomType"] = "Single"
    elif '2 sharing' in query_lower or 'double' in query_lower or 'two sharing' in query_lower or '2-sharing' in query_lower:
        extracted["roomType"] = "2 Sharing"
    elif '3 sharing' in query_lower or 'triple' in query_lower or '3-sharing' in query_lower:
        extracted["roomType"] = "3 Sharing"

    # Extract Facilities
    facility_keywords = {
        "wifi": ["wifi", "wi-fi", "internet"],
        "ac": ["ac", "air conditioner", "cooling"],
        "food": ["food", "meal", "mess", "breakfast", "khana"],
        "attachedBathroom": ["attached bathroom", "attached bath", "private washroom", "attached washroom"],
        "washingMachine": ["washing machine", "laundry"],
        "furnished": ["furnished", "fully furnished"],
        "parking": ["parking", "bike parking", "car parking"],
    }

    for fac_key, keywords in facility_keywords.items():
        if any(kw in query_lower for kw in keywords):
            extracted["facilities"].append(fac_key)

    # Extract Cities / Key locations
    cities = ["pune", "bangalore", "bengaluru", "delhi", "mumbai", "hyderabad", "noida", "gurgaon"]
    for city in cities:
        if city in query_lower:
            extracted["city"] = city.capitalize()
            break

    return extracted
