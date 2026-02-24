from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from app.db.session import get_db
from app.models.user import User
from ..models.workspace import Workspace, WorkspaceInvitation
from ..db.session import get_db
from ..auth.security import get_current_user
from ..models.user import User
from ..models.workspace import WorkspaceMember
from .schema import (
    WorkspaceCreate, WorkspaceOut, WorkspaceUpdate, 
    MemberAdd, MemberOut, WorkspaceInvitationCreate, WorkspaceInvitationResponse
)
from .crud import (
    create_workspace, update_workspace, delete_workspace, 
    add_member, remove_member, get_members_with_details,
    create_workspace_invitation, get_invitation_by_token, accept_workspace_invitation
)
from app.utils.email import send_invitation_email  # Ensure this matches your path

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])


@router.post("/", response_model=WorkspaceOut, status_code=status.HTTP_201_CREATED)
def create_workspace_endpoint(
    payload: WorkspaceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_workspace(db, payload, current_user.id)

@router.get("/", response_model=List[WorkspaceOut])
def list_workspaces(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Workspace).filter(Workspace.owner_id == current_user.id).all()

@router.put("/{workspace_id}", response_model=WorkspaceOut)
def update_workspace_endpoint(
    workspace_id: UUID,
    payload: WorkspaceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_workspace(db, workspace_id, payload, current_user.id)

@router.delete("/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workspace_endpoint(
    workspace_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not delete_workspace(db, workspace_id, current_user.id):
        raise HTTPException(status_code=404, detail="Workspace not found")
    return None

# --- REAL-TIME INVITATIONS ---

@router.post("/{workspace_id}/invite", response_model=WorkspaceInvitationResponse)
async def invite_to_workspace(
    workspace_id: UUID,
    invite_in: WorkspaceInvitationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Verify workspace exists
    workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    # 2. Create DB Record (This fills the 'No Data' table in your image)
    new_invite = create_workspace_invitation(
        db, 
        obj_in=invite_in, 
        workspace_id=workspace_id, 
        invited_by_id=current_user.id
    )

   
    invite_link = f"http://localhost:3000/accept-invite?token={new_invite.token}"
    
    background_tasks.add_task(
        send_invitation_email,
        email=invite_in.email,
        workspace_name=workspace.name,
        invite_link=invite_link
    )

    return new_invite

@router.post("/accept-invitation/{token}", status_code=status.HTTP_201_CREATED)
def accept_invite_endpoint(
    token: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Find valid invitation
    invitation = get_invitation_by_token(db, token=token)
    if not invitation:
        raise HTTPException(status_code=400, detail="Invalid or expired invitation")

    # 2. Convert to member using CRUD
    member = accept_workspace_invitation(db, invitation=invitation, user_id=current_user.id)
    
    return {"message": f"Successfully joined {invitation.workspace.name}"}

# --- MEMBER MANAGEMENT ---

@router.get("/{workspace_id}/members", response_model=List[MemberOut])
def list_members_endpoint(
    workspace_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_members_with_details(db, workspace_id)

@router.delete("/{workspace_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_member_endpoint(
    workspace_id: UUID,
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    remove_member(db, workspace_id, user_id, current_user.id)
    return None
