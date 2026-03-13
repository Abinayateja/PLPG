from app.services.supabase_auth import supabase


def get_user_skills(user_id):

    response = (
        supabase
        .table("skill_profiles")
        .select("skill")
        .eq("user_id", user_id)
        .execute()
    )

    skills = []

    if response.data:

        for row in response.data:
            skills.append(row["skill"])

    return skills