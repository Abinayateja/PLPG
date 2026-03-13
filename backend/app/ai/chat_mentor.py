from app.ai.path_generator import generate_learning_path
from app.ai.course_recommender import recommend_course
from app.ai.skill_gap_analyzer import analyze_skill_gap


def mentor_reply(message, profile=None, user_skills=None):

    if profile is None:
        profile = {}

    if user_skills is None:
        user_skills = []

    goal = profile.get("goal", "career")

    try:

        gap = analyze_skill_gap(goal, user_skills)

        missing_skills = gap.get("missing", [])

    except Exception:

        return "Sorry, I couldn't analyze your learning path right now."

    response = f"\nPersonalized roadmap for {goal}\n\n"

    if not missing_skills:

        response += "You already have most of the required skills.\n"

        return response

    response += "Skills you should learn next:\n\n"

    for i, skill in enumerate(missing_skills, 1):

        response += f"{i}. {skill}\n"

        try:

            course = recommend_course(skill)

            if course:

                response += f"Course: {course[0].get('title','Unknown')}\n"
                response += f"Watch: {course[0].get('youtube','Not available')}\n"

        except Exception:
            pass

        response += "\n"

    return response