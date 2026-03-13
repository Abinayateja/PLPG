from fastapi import APIRouter, HTTPException

from app.services.user_skill_service import get_user_skills
from app.ai.skill_gap_analyzer import analyze_skill_gap

router = APIRouter(prefix="/skill-gap", tags=["Skill Gap"])


@router.get("/{goal}/{user_id}")
def skill_gap(goal: str, user_id: str):

    try:

        user_skills = get_user_skills(user_id)

        result = analyze_skill_gap(goal, user_skills)

        return result

    except Exception as e:

        raise HTTPException(status_code=500, detail=str(e))