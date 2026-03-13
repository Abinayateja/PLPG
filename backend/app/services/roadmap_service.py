from app.ai.path_generator import generate_learning_path
from app.ai.skill_gap_analyzer import analyze_skill_gap
from app.services.user_skill_service import get_user_skills


class RoadmapService:

    def generate(self, goal, user_id):

        # get user skills from supabase
        user_skills = get_user_skills(user_id)

        # detect skill gap
        gap = analyze_skill_gap(goal, user_skills)

        missing_skills = gap["missing"]

        # generate roadmap from missing skills
        path = generate_learning_path(missing_skills)

        return path