import numpy as np
import json
import random


def evaluate_answers(questions, answers):

    correct = 0
    level_score = {
        "beginner": 0,
        "intermediate": 0,
        "advanced": 0
    }

    level_weight = {
        "beginner": 1,
        "intermediate": 2,
        "advanced": 3
    }

    total_weight = 0
    earned_weight = 0

    for q, ans in zip(questions, answers):

        q_level = q.get("level", "beginner")
        weight = level_weight[q_level]

        total_weight += weight

        if ans == q["answer"]:
            correct += 1
            earned_weight += weight
            level_score[q_level] += 1

    # weighted score (important)
    score = earned_weight / total_weight if total_weight else 0

    confidence = round(score * np.log(len(questions) + 1), 3)

    # smarter level detection
    if score < 0.4:
        level = "beginner"
    elif score < 0.7:
        level = "intermediate"
    else:
        level = "advanced"

    return {
        "score": correct,
        "total": len(questions),
        "weighted_score": round(score, 3),
        "confidence": confidence,
        "level": level,
        "breakdown": level_score
    }


import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "questions.json")

with open(DATA_PATH, "r") as f:
    questions_db = json.load(f)


def get_questions(skill, level, count=5):

    if not skill:
        raise ValueError("Skill is required")

    skill = skill.strip().lower()
    level = level.strip().lower()

    filtered = [
        q for q in questions_db
        if q["skill"].strip().lower() == skill
        and q["level"].strip().lower() == level
    ]

    return random.sample(filtered, min(count, len(filtered))) if filtered else []

def update_level(level, correct):

    if correct:
        if level == "beginner":
            return "intermediate"
        elif level == "intermediate":
            return "advanced"

    else:
        if level == "advanced":
            return "intermediate"
        elif level == "intermediate":
            return "beginner"

    return level