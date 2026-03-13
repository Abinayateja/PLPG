from app.ai.path_generator import generate_learning_path

user_skills = ["python"]

goal = "data_scientist"

path = generate_learning_path(user_skills, goal)

print("Recommended Learning Path:")
print(path)