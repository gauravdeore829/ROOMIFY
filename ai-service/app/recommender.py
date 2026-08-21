from typing import List, Dict, Any

def calculate_recommendation_score(user_pref: Dict[str, Any], property_item: Dict[str, Any]) -> float:
    score = 0.0

    # 1. Budget Score (30%)
    user_budget = user_pref.get("budget")
    min_rent = property_item.get("minRent", 0)
    if user_budget and user_budget > 0 and min_rent > 0:
        if min_rent <= user_budget:
            # Rent is within budget
            budget_score = 1.0 - (min_rent / (user_budget * 1.5))
            score += max(0.2, budget_score) * 30.0
        else:
            # Slightly over budget
            diff_ratio = (min_rent - user_budget) / user_budget
            if diff_ratio <= 0.2:
                score += 15.0
            elif diff_ratio <= 0.5:
                score += 5.0

    # 2. Location Score (25%)
    pref_location = (user_pref.get("preferredLocation") or "").lower()
    city = (property_item.get("city") or "").lower()
    area = (property_item.get("area") or "").lower()
    address = (property_item.get("address") or "").lower()

    if pref_location:
        if pref_location in area or area in pref_location:
            score += 25.0
        elif pref_location in city or pref_location in address:
            score += 15.0
        else:
            score += 5.0
    else:
        score += 15.0

    # 3. Room Type Score (15%)
    pref_room_type = (user_pref.get("roomType") or "").lower()
    rooms = property_item.get("rooms", [])
    has_room_type = any(pref_room_type in (r.get("roomType") or "").lower() for r in rooms) if pref_room_type else False

    if has_room_type:
        score += 15.0
    elif rooms:
        score += 5.0

    # 4. Facilities Score (15%)
    pref_facilities = user_pref.get("facilities", [])
    amenities = property_item.get("amenities") or {}

    if pref_facilities and amenities:
        matched = sum(1 for fac in pref_facilities if amenities.get(fac) is True)
        fac_score = (matched / len(pref_facilities)) * 15.0
        score += fac_score
    else:
        score += 8.0

    # 5. Rating Score (10%)
    rating = property_item.get("avgRating", 4.0)
    score += (rating / 5.0) * 10.0

    # 6. Availability Score (5%)
    total_avail = property_item.get("totalAvailableBeds", 0)
    if total_avail > 0:
        score += 5.0

    return min(100.0, max(10.0, round(score, 1)))

def rank_properties(user_pref: Dict[str, Any], properties: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    ranked = []
    for prop in properties:
        match_score = calculate_recommendation_score(user_pref, prop)
        prop_copy = dict(prop)
        prop_copy["matchScore"] = match_score
        ranked.append(prop_copy)

    ranked.sort(key=lambda x: x["matchScore"], reverse=True)
    return ranked
