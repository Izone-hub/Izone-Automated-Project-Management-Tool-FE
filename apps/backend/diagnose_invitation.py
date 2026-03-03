from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.workspace import WorkspaceInvitation, Workspace
from app.workspaces.schema import WorkspaceInvitationResponse
from uuid import UUID

def diagnose():
    db = SessionLocal()
    token = "750b3d52-a4d7-4958-9be6-af1bf53ccbb5"
    invitation = db.query(WorkspaceInvitation).filter(WorkspaceInvitation.token == token).first()
    
    if not invitation:
        print(f"ERROR: Invitation with token {token} not found in DB.")
        return

    print(f"SUCCESS: Found invitation {invitation.id}")
    print(f"Invitee ID: {invitation.invited_user_id}")
    
    try:
        print(f"Email via proxy: {invitation.email}")
    except Exception as e:
        print(f"ERROR: Failed to access invitation.email proxy: {e}")

    try:
        workspace = db.query(Workspace).filter(Workspace.id == invitation.workspace_id).first()
        print(f"Workspace: {workspace.name if workspace else 'None'}")
        
        # Test validation
        print("Testing Pydantic validation...")
        response = WorkspaceInvitationResponse.model_validate(invitation)
        response.workspace_name = workspace.name if workspace else "Unknown"
        print("Validation SUCCESS")
        print(response.model_dump_json())
    except Exception as e:
        print(f"Validation FAILED: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    diagnose()
