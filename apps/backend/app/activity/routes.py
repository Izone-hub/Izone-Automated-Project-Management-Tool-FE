from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db.session import get_db
from . import crud, schema

router = APIRouter(prefix="/activity", tags=["Activity"])

@router.get("/{workspace_id}", response_model=List[schema.ActivityLogOut])
def get_workspace_activity(workspace_id: str, db: Session = Depends(get_db)):
    return crud.get_workspace_activity(db, workspace_id)
