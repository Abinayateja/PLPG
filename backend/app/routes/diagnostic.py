# backend/app/routes/diagnostic.py
from fastapi import APIRouter
import json, os, random

router = APIRouter(prefix="/diagnostic", tags=["diagnostic"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "questions.json")

with open(DATA_PATH, "r") as f:
    ALL_QUESTIONS = json.load(f)

SKILL_MAP = {
    "AI Engineer":      "machine learning",
    "Data Scientist":   "machine learning",
    "Web Developer":    "javascript",
    "Mobile Developer": "javascript",
    "DevOps Engineer":  "devops",
    "Cybersecurity":    "devops",
}

def pick_questions(skill: str, count: int = 5):
    skill = skill.strip().lower()
    pool = [q for q in ALL_QUESTIONS if q.get("skill", "").strip().lower() == skill]
    if not pool:
        # fallback: just grab any 5
        pool = ALL_QUESTIONS
    return random.sample(pool, min(count, len(pool)))

@router.get("/start/{skill}")
def start(skill: str):
    questions = pick_questions(skill)
    # store in a simple in-memory session keyed by skill
    return {"questions": questions}