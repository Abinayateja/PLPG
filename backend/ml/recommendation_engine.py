import joblib
import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer

model = joblib.load("ml/recommender_model.pkl")

def predict_best_course(skills, goal, courses):

    rows = []

    for course in courses:

        rows.append({
            "skills": skills,
            "goal": goal,
            "course": course
        })

    df = pd.DataFrame(rows)

    df["skills"] = df["skills"].apply(lambda x: x.split(","))

    mlb = MultiLabelBinarizer()
    skills_encoded = pd.DataFrame(
        mlb.fit_transform(df["skills"])
    )

    goal_encoded = pd.get_dummies(df["goal"])
    course_encoded = pd.get_dummies(df["course"])

    X = pd.concat([skills_encoded, goal_encoded, course_encoded], axis=1)

    predictions = model.predict_proba(X)[:,1]

    best_index = predictions.argmax()

    return courses[best_index]