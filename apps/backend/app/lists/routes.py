from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.lists import crud
from app.lists.schema import ListCreate, ListUpdate, ListResponse


router = APIRouter(
    prefix="/projects/{project_id}/lists",
    tags=["Lists"]
)


@router.post("/", response_model=ListResponse, status_code=status.HTTP_201_CREATED)
def create_list(
    project_id: str,
    data: ListCreate,
    db: Session = Depends(get_db)
):
    data.project_id = project_id
    return crud.create_list(db, data)


@router.get("/", response_model=list[ListResponse])
def get_lists(
    project_id: str,
    db: Session = Depends(get_db)
):
    return crud.get_lists_by_project(db, project_id)
@router.put("/{list_id}", response_model=ListResponse)
def update_list(
    list_id: str,
    data: ListUpdate,
    db: Session = Depends(get_db)
):
    updated = crud.update_list(db, list_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="List not found")
    return updated


@router.delete("/{list_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_list(
    list_id: str,
    db: Session = Depends(get_db)
):
    deleted = crud.delete_list(db, list_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="List not found")
