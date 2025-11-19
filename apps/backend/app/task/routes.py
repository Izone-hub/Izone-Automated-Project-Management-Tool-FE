from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..db.session import get_db
from .crud import create_task, get_task, list_tasks, update_task, delete_task
from .schema import TaskCreate, TaskUpdate, TaskOut

router = APIRouter(prefix="/tasks", tags=["Tasks"])


# ---------- Create ----------
@router.post("/", response_model=TaskOut)
def create_task_endpoint(data: TaskCreate, user_id: str, db: Session = Depends(get_db)):
    return create_task(db, data, user_id)


# ---------- Read ----------
@router.get("/{task_id}", response_model=TaskOut)
def get_task_endpoint(task_id: str, db: Session = Depends(get_db)):
    return get_task(db, task_id)


@router.get("/", response_model=List[TaskOut])
def list_tasks_endpoint(project_id: str, db: Session = Depends(get_db)):
    return list_tasks(db, project_id)


# ---------- Update ----------
@router.patch("/{task_id}", response_model=TaskOut)
def update_task_endpoint(task_id: str, data: TaskUpdate, user_id: str, db: Session = Depends(get_db)):
    return update_task(db, task_id, data, user_id)


# ---------- Delete ----------
@router.delete("/{task_id}", status_code=204)
def delete_task_endpoint(task_id: str, user_id: str, db: Session = Depends(get_db)):
    delete_task(db, task_id, user_id)
    return {"detail": "Task deleted"}
