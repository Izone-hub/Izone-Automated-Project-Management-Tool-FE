from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from uuid import UUID

from app.db.session import get_db
from app.utils.email import send_invitation_email 
from app.models import Workspace, WorkspaceInvitation, User
from app.workspace_invitation.schema import WorkspaceInvitationCreate, WorkspaceInvitationResponse
from app.auth.auth import get_current_user
from app.workspace_invitation.crud import create_workspace_invitation, get_invitation_by_token

router = APIRouter()

@router.post("/workspaces/{workspace_id}/invite", response_model=WorkspaceInvitationResponse)
async def invite_to_workspace(
    workspace_id: UUID, 
    invite_in: WorkspaceInvitationCreate, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) 
):

    workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    target_user = db.query(User).filter(User.email == invite_in.email).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User with this email does not exist")

    existing_invite = db.query(WorkspaceInvitation).filter(
        WorkspaceInvitation.workspace_id == workspace.id,
        WorkspaceInvitation.invited_user_id == target_user.id,
        WorkspaceInvitation.is_accepted == False,
        WorkspaceInvitation.expires_at > datetime.utcnow()
    ).first()

    if existing_invite:
        raise HTTPException(status_code=400, detail="An active invitation already exists for this user")

    try:
        new_invite = create_workspace_invitation(
            db, 
            obj_in=invite_in, 
            workspace_id=workspace_id, 
            invited_by_id=current_user.id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    invite_link = f"http://localhost:3000/join-workspace?token={new_invite.token}"
    background_tasks.add_task(
        send_invitation_email,
        email=invite_in.email,
        workspace_name=workspace.name,
        invite_link=invite_link
    )

    return new_invite


@router.get("/workspaces/invitations/{token}", response_model=WorkspaceInvitationResponse)
async def get_invitation(token: str, db: Session = Depends(get_db)):
  
    invite = get_invitation_by_token(db, token)
    
    if not invite:
        raise HTTPException(status_code=404, detail="Invitation not found or expired")
    
    return invite