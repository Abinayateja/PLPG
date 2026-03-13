import numpy as np


def evaluate_answers(questions, answers):

    correct = 0

    for q, ans in zip(questions, answers):

        if ans == q["answer"]:
            correct += 1

    score = correct / len(questions)

    confidence = round(score * np.log(len(questions) + 1), 3)

    if score < 0.4:
        level = "beginner"

    elif score < 0.7:
        level = "intermediate"

    else:
        level = "advanced"

    return {
        "score": correct,
        "total": len(questions),
        "confidence": confidence,
        "level": level
    }