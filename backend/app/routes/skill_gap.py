from fastapi import APIRouter
from app.ai.skill_graph import skill_graph
from app.ai.skill_gap_analyzer import analyze_skill_gap
from supabase import create_client
import os

# ✅ DEFINE ROUTER FIRST
router = APIRouter(prefix="/skill-gap", tags=["Skill Gap"])

# ✅ SUPABASE INIT
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)


# ✅ THEN USE DECORATOR
@router.get("/{user_id}")
def get_skill_gap(user_id: str):

    try:
        response = supabase.table("skill_profiles") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .limit(1) \
            .execute()

        if not response.data or len(response.data) == 0:
            return {
                "user_skill": "none",
                "level": "beginner",
                "gap": [],
                "learning_path": []
            }

        data = response.data[0]

        user_skill = data.get("skill", "python")
        level = data.get("level", "beginner")

        level_map = {
            "beginner": [],
            "intermediate": [user_skill],
            "advanced": skill_graph.get_prerequisites(user_skill) + [user_skill]
        }

        user_skills = level_map.get(level, [])

        next_skills = skill_graph.get_next_skills(user_skill)
        goal_skill = next_skills[0] if next_skills else user_skill

        gap = analyze_skill_gap(user_skills, goal_skill, skill_graph)
        path = skill_graph.get_learning_path(gap + [goal_skill])

        return {
            "user_skill": user_skill,
            "level": level,
            "gap": gap,
            "learning_path": path
        }

    except Exception as e:
        print("ERROR IN SKILL GAP:", str(e))
        return {
            "error": "Skill gap failed",
            "details": str(e)
        }