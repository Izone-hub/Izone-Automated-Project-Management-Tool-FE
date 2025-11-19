from sqlalchemy.orm import Session
from fastapi import HTTPException

from ..models.task import Task
from ..models.project import Project
from ..models.user import User
from .schema import TaskCreate, TaskUpdate


# ---------- Helpers ----------
def _project_exists(db: Session, project_id: str):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


def _user_exists(db: Session, user_id: str):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def _task_exists(db: Session, task_id: str):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


# ---------- Create ----------
def create_task(db: Session, data: TaskCreate, user_id: str) -> Task:
    _project_exists(db, data.project_id)
    if data.assignee_id:
        _user_exists(db, data.assignee_id)
    _user_exists(db, user_id)

    task = Task(
        project_id=data.project_id,
        title=data.title,
        description=data.description,
        due_date=data.due_date,
        status=data.status,
        priority=data.priority,
        assignee_id=data.assignee_id,
        position=data.position,
        created_by=user_id
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


# ---------- Read ----------
def get_task(db: Session, task_id: str) -> Task:
    return _task_exists(db, task_id)


def list_tasks(db: Session, project_id: str):
    _project_exists(db, project_id)
    return db.query(Task).filter(Task.project_id == project_id).order_by(Task.position.asc()).all()


# ---------- Update ----------
def update_task(db: Session, task_id: str, data: TaskUpdate, user_id: str) -> Task:
    task = _task_exists(db, task_id)

    if task.created_by != user_id:
        raise HTTPException(status_code=403, detail="Not allowed to update this task")

    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)
    return task


# ---------- Delete ----------
def delete_task(db: Session, task_id: str, user_id: str):
    task = _task_exists(db, task_id)

    if task.created_by != user_id:
        raise HTTPException(status_code=403, detail="Not allowed to delete this task")

    db.delete(task)
    db.commit()
