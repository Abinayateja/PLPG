import pandas as pd
import random

# Career goals
goals = [
    "data_scientist",
    "ai_engineer",
    "web_developer"
]

# Detailed learning paths (skill progression)
course_paths = {

    "data_scientist": [
        "python_basics",
        "python_oop",
        "numpy",
        "pandas",
        "statistics",
        "probability",
        "linear_algebra",
        "data_cleaning",
        "data_visualization",
        "machine_learning",
        "feature_engineering",
        "model_evaluation",
        "deep_learning",
        "mlops"
    ],

    "ai_engineer": [
        "python_basics",
        "data_structures",
        "algorithms",
        "linear_algebra",
        "probability",
        "machine_learning",
        "deep_learning",
        "cnn",
        "computer_vision",
        "nlp",
        "transformers",
        "llm_engineering",
        "model_deployment",
        "mlops"
    ],

    "web_developer": [
        "html",
        "css",
        "responsive_design",
        "javascript",
        "dom_manipulation",
        "react",
        "state_management",
        "backend_basics",
        "rest_api",
        "authentication",
        "sql",
        "database_design",
        "deployment",
        "docker"
    ]
}

rows = []

for i in range(50000):

    goal = random.choice(goals)

    path = course_paths[goal]

    # choose a stage in the learning path
    level = random.randint(1, len(path) - 1)

    known_skills = path[:level]

    # next course recommendation candidate
    next_course = path[level]

    # sometimes give wrong course to create negative examples
    if random.random() < 0.7:
        course = next_course
        completion = 1
    else:
        course = random.choice(path)
        completion = 0

    rows.append({
        "user_id": i,
        "skills": ",".join(known_skills),
        "goal": goal,
        "course": course,
        "completion": completion
    })

df = pd.DataFrame(rows)

df.to_csv("data/learning_dataset.csv", index=False)

print("Dataset generated successfully with realistic learning paths!")