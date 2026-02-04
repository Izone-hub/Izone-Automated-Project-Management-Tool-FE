from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from ..models.workspace import Workspace
from ..db.session import get_db
from .schema import WorkspaceCreate, WorkspaceOut, WorkspaceUpdate, MemberAdd, MemberOut
from .crud import create_workspace, get_workspace_by_id, update_workspace, delete_workspace, add_member, remove_member, get_members_with_details
from ..auth.security import get_current_user
from ..models.user import User

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])


# CREATE
@router.post("/", response_model=WorkspaceOut, status_code=status.HTTP_201_CREATED)
def create_workspace_endpoint(
    payload: WorkspaceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    payload.owner_id = current_user.id
    return create_workspace(db, payload, current_user.id)

# READ ONE
@router.get("/", response_model=list[WorkspaceOut])
def list_workspaces(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workspaces = db.query(Workspace).filter(
        Workspace.owner_id == current_user.id
    ).all()
    return workspaces


# UPDATE
@router.put("/{workspace_id}", response_model=WorkspaceOut)
def update_workspace_endpoint(
    workspace_id: UUID,
    payload: WorkspaceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_workspace(db, workspace_id, payload, current_user.id)


# DELETE
@router.delete("/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workspace_endpoint(
    workspace_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not delete_workspace(db, workspace_id, current_user.id):
        raise HTTPException(status_code=404, detail="Workspace not found")
    return None


# ADD MEMBER
@router.post("/{workspace_id}/members", response_model=MemberOut, status_code=status.HTTP_201_CREATED)
def add_member_endpoint(
    workspace_id: UUID,
    payload: MemberAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    member = add_member(db, workspace_id, payload, current_user.id)
    return MemberOut(
        user_id=member.user_id,
        email=member.user.email if member.user else None,
        role=member.role,
        created_at=member.created_at
    )


# LIST MEMBERS
@router.get("/{workspace_id}/members", response_model=list[MemberOut])
def list_members_endpoint(
    workspace_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Anyone who can see the workspace should see members (or add admin check if desired)
    return get_members_with_details(db, workspace_id)


# REMOVE MEMBER
@router.delete("/{workspace_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_member_endpoint(
    workspace_id: UUID,
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    remove_member(db, workspace_id, user_id, current_user.id)
    return None
