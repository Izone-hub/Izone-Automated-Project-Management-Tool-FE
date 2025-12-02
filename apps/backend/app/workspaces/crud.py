from sqlalchemy.orm import Session
from fastapi import HTTPException
from uuid import UUID

from ..models.workspace import Workspace, WorkspaceMember
from ..models.user import User
from ..workspaces.schema import WorkspaceCreate, WorkspaceUpdate, MemberAdd
from .schema import RoleEnum


# ---------- Helper ----------
def _user_exists(db: Session, user_id: UUID) -> User:
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=400, detail="User does not exist")
    return user


# ---------- Workspace ----------
def create_workspace(db: Session, data: WorkspaceCreate, current_user_id: UUID) -> Workspace:
    ws = Workspace(
        name=data.name,
        description=data.description or None,
        owner_id=current_user_id,        # you already have this
        created_by=current_user_id       # THIS IS THE MISSING LINE
    )
    db.add(ws)
    db.flush()  # generates ws.id

    # Owner automatically becomes admin
    db.add(WorkspaceMember(
        workspace_id=ws.id,
        user_id=current_user_id,
        role=RoleEnum.admin
    ))

    db.commit()
    db.refresh(ws)
    return ws

def get_workspace_by_id(db: Session, workspace_id: UUID) -> Workspace | None:
    return db.get(Workspace, workspace_id)


def update_workspace(db: Session, workspace_id: UUID, data: WorkspaceUpdate, user_id: UUID) -> Workspace:
    ws = get_workspace_by_id(db, workspace_id)
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")
    if ws.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Only owner can update")

    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ws, key, value)

    db.commit()
    db.refresh(ws)
    return ws


def delete_workspace(db: Session, workspace_id: UUID, user_id: UUID) -> bool:
    ws = get_workspace_by_id(db, workspace_id)
    if not ws:
        return False
    if ws.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Only owner can delete")

    db.delete(ws)
    db.commit()
    return True


# ---------- Members ----------
def is_admin(db: Session, workspace_id: UUID, user_id: UUID) -> bool:
    member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == user_id,
        WorkspaceMember.role == RoleEnum.admin
    ).first()
    return member is not None


def add_member(db: Session, workspace_id: UUID, data: MemberAdd, requester_id: UUID) -> WorkspaceMember:
    if not is_admin(db, workspace_id, requester_id):
        raise HTTPException(status_code=403, detail="Only admin can add members")

    if not get_workspace_by_id(db, workspace_id):
        raise HTTPException(status_code=404, detail="Workspace not found")

    _user_exists(db, data.user_id)

    # Prevent duplicate
    exists = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == data.user_id
    ).first()
    if exists:
        raise HTTPException(status_code=400, detail="User is already a member")

    member = WorkspaceMember(
        workspace_id=workspace_id,
        user_id=data.user_id,
        role=data.role
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


def remove_member(db: Session, workspace_id: UUID, user_id: UUID, requester_id: UUID) -> None:
    if not is_admin(db, workspace_id, requester_id):
        raise HTTPException(status_code=403, detail="Only admin can remove members")

    member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == user_id
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    # Prevent removing last admin
    admin_count = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.role == RoleEnum.admin
    ).count()
    if member.role == RoleEnum.admin and admin_count <= 1:
        raise HTTPException(status_code=400, detail="Cannot remove the last admin")

    db.delete(member)
    db.commit()
