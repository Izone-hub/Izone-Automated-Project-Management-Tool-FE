from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.project import Project
from app.projects import schema

router = APIRouter(prefix="/projects", tags=["Projects"])

# CREATE
@router.post("/", response_model=schema.ProjectResponse)
def create_project(project: schema.ProjectCreate, db: Session = Depends(get_db)):
    new_project = Project(
        name=project.name,
        description=project.description,
        organization_id=project.organization_id
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

# UPDATE
@router.put("/{project_id}", response_model=schema.ProjectResponse)
def update_project(project_id: int, project: schema.ProjectUpdate, db: Session = Depends(get_db)):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.name:
        db_project.name = project.name
    if project.description:
        db_project.description = project.description
    if project.is_archived is not None:
        db_project.is_archived = project.is_archived

    db.commit()
    db.refresh(db_project)
    return db_project

# ARCHIVE
@router.put("/{project_id}/archive", response_model=schema.ProjectResponse)
def archive_project(project_id: int, db: Session = Depends(get_db)):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    db_project.is_archived = True
    db.commit()
    db.refresh(db_project)
    return db_project

# LIST (optional)
@router.get("/", response_model=list[schema.ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).filter(Project.is_archived == False).all()