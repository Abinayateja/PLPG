from fastapi import APIRouter, UploadFile, File, HTTPException
from app.ai.resume_analyzer import extract_text_from_pdf, extract_skills
from app.ai.skill_gap_analyzer import analyze_skill_gap

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/analyze/{goal}")
async def analyze_resume(goal: str, file: UploadFile = File(...)):

    try:

        text = extract_text_from_pdf(file.file)

        user_skills = extract_skills(text)

        gap = analyze_skill_gap(goal, user_skills)

        return {
            "skills_found": user_skills,
            "missing_skills": gap["missing"],
            "required_skills": gap["required"]
        }

    except Exception as e:

        raise HTTPException(status_code=500, detail=str(e))