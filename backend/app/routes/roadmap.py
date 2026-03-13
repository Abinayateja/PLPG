from fastapi import APIRouter, HTTPException

from app.services.roadmap_service import RoadmapService

router = APIRouter(prefix="/roadmap", tags=["Learning Path"])

service = RoadmapService()


@router.get("/{goal}")
def roadmap(goal: str):

    try:

        result = service.generate(goal)

        return {
            "goal": goal,
            "roadmap": result
        }

    except Exception as e:

        raise HTTPException(status_code=500, detail=str(e))