from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timedelta
from uuid import UUID
from app import models, schemas

def create_workspace_invitation(
    db: Session, 
    obj_in: schemas.WorkspaceInvitationCreate, 
    workspace_id: UUID, 
    invited_by_id: UUID
):
 
    target_user = db.query(models.User).filter(models.User.email == obj_in.email).first()
    if not target_user:
        raise ValueError("User with this email does not exist")

    expires_at = datetime.utcnow() + timedelta(days=7)
    
    db_obj = models.WorkspaceInvitation(
        workspace_id=workspace_id,
        invited_user_id=target_user.id,
        role=obj_in.role,
        invited_by_id=invited_by_id, 
        expires_at=expires_at
    )
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)

   
    return db.query(models.WorkspaceInvitation)\
        .options(joinedload(models.WorkspaceInvitation.invitee))\
        .filter(models.WorkspaceInvitation.id == db_obj.id)\
        .first()

def get_invitation_by_token(db: Session, token: str):
  
    return db.query(models.WorkspaceInvitation)\
        .options(joinedload(models.WorkspaceInvitation.invitee))\
        .filter(
            models.WorkspaceInvitation.token == token,
            models.WorkspaceInvitation.is_accepted == False,
            models.WorkspaceInvitation.expires_at > datetime.utcnow()
        ).first()

def accept_workspace_invitation(db: Session, invitation: models.WorkspaceInvitation, user_id: UUID):
 
    new_member = models.WorkspaceMember(
        workspace_id=invitation.workspace_id,
        user_id=user_id,
        role=invitation.role
    )
    db.add(new_member)
    
 
    invitation.is_accepted = True
    
    db.commit()
    db.refresh(new_member)
    return new_member