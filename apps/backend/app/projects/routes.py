from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from ..db.session import get_db
from .crud import create_project, get_project, list_projects, update_project, delete_project, archive_project
from .schema import ProjectCreate, ProjectUpdate, ProjectOut

router = APIRouter(prefix="/projects", tags=["Projects"])


# ---------- Create ----------
@router.post("/", response_model=ProjectOut)
def create_project_endpoint(data: ProjectCreate, user_id: str, db: Session = Depends(get_db)):
    return create_project(db, data, user_id)


# ---------- Read ----------
@router.get("/{project_id}", response_model=ProjectOut)
def get_project_endpoint(project_id: str, db: Session = Depends(get_db)):
    return get_project(db, project_id)


@router.get("/", response_model=List[ProjectOut])
def list_projects_endpoint(workspace_id: str, db: Session = Depends(get_db)):
    return list_projects(db, workspace_id)


# ---------- Update ----------
@router.patch("/{project_id}", response_model=ProjectOut)
def update_project_endpoint(project_id: str, data: ProjectUpdate, user_id: str, db: Session = Depends(get_db)):
    return update_project(db, project_id, data, user_id)


# ---------- Archive ----------
@router.put("/{project_id}/archive", response_model=ProjectOut)
def archive_project_endpoint(project_id: str, user_id: str, db: Session = Depends(get_db)):
    return archive_project(db, project_id, user_id)


# ---------- Delete ----------
@router.delete("/{project_id}", status_code=204)
def delete_project_endpoint(project_id: str, user_id: str, db: Session = Depends(get_db)):
    delete_project(db, project_id, user_id)
    return {"detail": "Project deleted"}
