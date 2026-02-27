from sqlalchemy.orm import Session
from fastapi import HTTPException
from uuid import UUID

from ..models.project import Project
from ..models.workspace import Workspace
from ..models.user import User

from .schema import ProjectCreate, ProjectUpdate


# ---------- Helpers ----------
def _workspace_exists(db: Session, workspace_id: str) -> Workspace:
    ws = db.get(Workspace, workspace_id)
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return ws


def _user_exists(db: Session, user_id: str) -> User:
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def _project_exists(db: Session, project_id: str) -> Project:
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# ---------- Create ----------
def create_project(db: Session, data: ProjectCreate, user_id: str) -> Project:
    _workspace_exists(db, data.workspace_id)
    _user_exists(db, user_id)

    project = Project(
        name=data.name,
        description=data.description,
        background_color=data.background_color,
        workspace_id=data.workspace_id,
        created_by=user_id,
    )

    db.add(project)
    db.commit()
    db.refresh(project)
    return project


# ---------- Read ----------
def get_project(db: Session, project_id: str) -> Project:
    project = _project_exists(db, project_id)
    project.comment_count = sum(len(task.comments) for task in project.tasks)
    return project


def list_projects(db: Session, workspace_id: str):
    _workspace_exists(db, workspace_id)
    projects = (
        db.query(Project)
        .filter(Project.workspace_id == workspace_id)
        .order_by(Project.created_at.desc())
        .all()
    )
    for project in projects:
        project.comment_count = sum(len(task.comments) for task in project.tasks)
    return projects


# ---------- Update ----------
def update_project(db: Session, project_id: str, data: ProjectUpdate, user_id: str) -> Project:
    project = _project_exists(db, project_id)

    # Only creator can update
    if str(project.created_by) != user_id:
        raise HTTPException(status_code=403, detail="Not allowed to update this project")

    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)

    db.commit()
    db.refresh(project)
    return project


# ---------- Archive / Delete ----------
def archive_project(db: Session, project_id: str, user_id: str) -> Project:
    project = _project_exists(db, project_id)

    if project.created_by != user_id:
        raise HTTPException(status_code=403, detail="Not allowed to archive this project")

    project.archived = True
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project_id: str, user_id: str) -> None:
    project = _project_exists(db, project_id)

    if project.created_by != user_id:
        raise HTTPException(status_code=403, detail="Not allowed to delete this project")

    db.delete(project)
    db.commit()
