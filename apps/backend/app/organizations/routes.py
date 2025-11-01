from fastapi import APIRouter

router = APIRouter(prefix="/organizations", tags=["Organizations"])

@router.get("/")
def list_organizations():
    return [{"id": 1, "name": "Example Organization"}]