from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.chat_mentor import mentor_reply

router = APIRouter(prefix="/chat", tags=["AI Mentor"])


class ChatRequest(BaseModel):

    message: str
    profile: dict = {}
    user_skills: list = []


@router.post("/")
def chat(data: ChatRequest):

    response = mentor_reply(
        data.message,
        data.profile,
        data.user_skills
    )

    return {"response": response}