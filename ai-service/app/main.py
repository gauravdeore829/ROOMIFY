from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from app.recommender import rank_properties
from app.nlp_parser import parse_natural_query

app = FastAPI(
    title="RoomEase AI Microservice",
    description="Weighted Recommendations & Natural Language Search Engine for RoomEase",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecommendationRequest(BaseModel):
    userPreferences: Dict[str, Any]
    properties: List[Dict[str, Any]]

class NLPQueryRequest(BaseModel):
    query: str

@app.get("/")
def read_root():
    return {"status": "ACTIVE", "service": "RoomEase AI Recommendation Microservice"}

@app.post("/recommend")
def recommend_properties(data: RecommendationRequest):
    try:
        ranked = rank_properties(data.userPreferences, data.properties)
        return {
            "success": True,
            "count": len(ranked),
            "recommendations": ranked
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/parse-search")
def parse_search(data: NLPQueryRequest):
    try:
        extracted = parse_natural_query(data.query)
        return {
            "success": True,
            "parsed": extracted
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
