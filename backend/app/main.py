from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import roadmap
from app.routes import resume
from app.routes import chat
from app.routes import diagnostic
from app.routes import skill_gap

app = FastAPI(
    title="SkillVault AI",
    description="AI-powered personalized learning path generator",
    version="1.0"
)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(roadmap.router)
app.include_router(resume.router)
app.include_router(chat.router)
app.include_router(diagnostic.router)
app.include_router(skill_gap.router)


@app.get("/")
def home():

    return {
        "status": "running",
        "service": "SkillVault AI Backend"
    }