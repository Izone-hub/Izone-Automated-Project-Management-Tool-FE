from sqlalchemy.orm import Session
from fastapi import HTTPException
from uuid import UUID, uuid4
from datetime import datetime, timedelta

from ..models.workspace import Workspace, WorkspaceMember, WorkspaceInvitation
from ..models.user import User
from ..workspaces.schema import WorkspaceCreate, WorkspaceUpdate, MemberAdd
from .schema import RoleEnum


# ---------- Helper ----------
def _user_exists(db: Session, user_id: UUID) -> User:
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=400, detail="User does not exist")
    return user


def get_workspace_by_id(db: Session, workspace_id: UUID) -> Workspace | None:
    return db.get(Workspace, workspace_id)


def is_admin(db: Session, workspace_id: UUID, user_id: UUID) -> bool:
    member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == user_id,
        WorkspaceMember.role == RoleEnum.admin
    ).first()
    return member is not None


# ---------- Workspace ----------
def create_workspace(db: Session, data: WorkspaceCreate, current_user_id: UUID) -> Workspace:
    ws = Workspace(
        name=data.name,
        description=data.description or None,
        owner_id=current_user_id,
        created_by=current_user_id
    )
    db.add(ws)
    db.flush()

    # Owner automatically becomes admin
    db.add(WorkspaceMember(
        workspace_id=ws.id,
        user_id=current_user_id,
        role=RoleEnum.admin
    ))

    db.commit()
    db.refresh(ws)
    return ws


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
def add_member(db: Session, workspace_id: UUID, data: MemberAdd, requester_id: UUID) -> WorkspaceMember:
    if not is_admin(db, workspace_id, requester_id):
        raise HTTPException(status_code=403, detail="Only admin can add members")

    workspace = get_workspace_by_id(db, workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User with email {data.email} not found")

    member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == user.id
    ).first()

    if member:
        member.role = data.role
        db.commit()
        db.refresh(member)
        return member

    member = WorkspaceMember(
        workspace_id=workspace_id,
        user_id=user.id,
        role=data.role
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


def get_members_with_details(db: Session, workspace_id: UUID) -> list:
    results = db.query(WorkspaceMember, User.email).join(
        User, WorkspaceMember.user_id == User.id
    ).filter(
        WorkspaceMember.workspace_id == workspace_id
    ).all()

    output = []
    for member, email in results:
        member.email = email
        output.append(member)
    return output


def remove_member(db: Session, workspace_id: UUID, user_id: UUID, requester_id: UUID) -> None:
    if not is_admin(db, workspace_id, requester_id):
        raise HTTPException(status_code=403, detail="Only admin can remove members")

    member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == user_id
    ).first()

    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    admin_count = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.role == RoleEnum.admin
    ).count()

    if member.role == RoleEnum.admin and admin_count <= 1:
        raise HTTPException(status_code=400, detail="Cannot remove the last admin")

    db.delete(member)
    db.commit()


# ---------- Invitations ----------
def create_workspace_invitation(
    db: Session,
    obj_in,
    workspace_id: UUID,
    invited_by_id: UUID
):
    if not is_admin(db, workspace_id, invited_by_id):
        raise HTTPException(status_code=403, detail="Only admin can invite users")

    workspace = get_workspace_by_id(db, workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    user = db.query(User).filter(User.email == obj_in.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token = str(uuid4())


    invitation = WorkspaceInvitation(
        invited_user_id=user.id,
        workspace_id=workspace_id,
        invited_by_id=invited_by_id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(days=1)
    )

    db.add(invitation)
    db.commit()
    db.refresh(invitation)
    return invitation


def get_invitation_by_token(db: Session, token: str):
    invitation = db.query(WorkspaceInvitation).filter(
        WorkspaceInvitation.token == token
    ).first()

    if not invitation:
        return None

    if invitation.expires_at < datetime.utcnow():
        return None

    return invitation


def accept_workspace_invitation(db: Session, invitation, user_id: UUID):
    existing_member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == invitation.workspace_id,
        WorkspaceMember.user_id == user_id
    ).first()

    if existing_member:
        raise HTTPException(status_code=400, detail="User already a member")

    member = WorkspaceMember(
        workspace_id=invitation.workspace_id,
        user_id=user_id,
        role=RoleEnum.member
    )

    db.add(member)
    db.delete(invitation)
    db.commit()
    db.refresh(member)
    return member
