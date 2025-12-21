from sqlalchemy.orm import Session
from app.models.list import List
from app.lists.schema import ListCreate, ListUpdate



def create_list(db: Session, data: ListCreate):
    new_list = List(
        title=data.title,
        position=data.position,
        project_id=data.project_id
    )
    db.add(new_list)
    db.commit()
    db.refresh(new_list)
    return new_list


def get_lists_by_project(db: Session, project_id: str):
    return (
        db.query(List)
        .filter(List.project_id == project_id)
        .order_by(List.position)
        .all()
    )


def get_list(db: Session, list_id: str):
    return db.query(List).filter(List.id == list_id).first()


def update_list(db: Session, list_id: str, data: ListUpdate):
    list_obj = get_list(db, list_id)
    if not list_obj:
        return None

    if data.title is not None:
        list_obj.title = data.title
    if data.position is not None:
        list_obj.position = data.position

    db.commit()
    db.refresh(list_obj)
    return list_obj


def delete_list(db: Session, list_id: str):
    list_obj = get_list(db, list_id)
    if not list_obj:
        return None

    db.delete(list_obj)
    db.commit()
    return list_obj
