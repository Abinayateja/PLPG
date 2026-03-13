from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from app.ai.semantic_match import recommend_courses
from ml.recommendation_engine import predict_best_course

router = APIRouter(prefix="/recommend", tags=["Course Recommendation"])


class SkillRequest(BaseModel):
    skills: str
    goal: str


@router.post("/")
def recommend(data: SkillRequest):

    try:

        # Step 1: semantic search to get candidate courses
        courses = recommend_courses([data.skills])

        course_titles = [c["title"] for c in courses]

        # Step 2: ML model selects best course
        best_course = predict_best_course(
            data.skills,
            data.goal,
            course_titles
        )

        return {
            "recommended_course": best_course,
            "candidate_courses": course_titles
        }

    except Exception as e:

        raise HTTPException(status_code=500, detail=str(e))