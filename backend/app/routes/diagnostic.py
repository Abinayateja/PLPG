from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from app.ai.ai_question_generator import generate_ai_question
from app.ai.diagnostic_engine import evaluate_answers

router = APIRouter(prefix="/diagnostic", tags=["Diagnostic"])


class AnswerRequest(BaseModel):
    questions: List[dict]
    answers: List[str]


@router.get("/generate/{skill}")
def generate_questions(skill: str):

    questions = []

    try:

        for _ in range(5):

            q = generate_ai_question(skill, "medium")

            questions.append(q)

    except Exception as e:

        print("Question generation error:", e)

    # remove duplicate questions
    unique_questions = list(
        {q["question"]: q for q in questions}.values()
    )

    if len(unique_questions) == 0:

        raise HTTPException(
            status_code=500,
            detail="Question generator failed"
        )

    return {
        "skill": skill,
        "total_questions": len(unique_questions),
        "questions": unique_questions
    }


@router.post("/submit")
def submit_answers(data: AnswerRequest):

    if len(data.questions) == 0:

        raise HTTPException(
            status_code=400,
            detail="No questions provided"
        )

    if len(data.answers) != len(data.questions):

        raise HTTPException(
            status_code=400,
            detail="Answers count does not match questions"
        )

    result = evaluate_answers(data.questions, data.answers)

    return {
        "score": result["score"],
        "total": result["total"],
        "confidence": result["confidence"],
        "level": result["level"]
    }