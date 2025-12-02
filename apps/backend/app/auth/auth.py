# app/auth/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.auth import schema
from app.auth.security import hash_password, verify_password, create_access_token, get_current_user
import uuid
from app.workspaces.schema import RoleEnum 
from app.models import Workspace, WorkspaceMember



router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=schema.User)
def register_user(user: schema.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)
    new_user = User(
        id=str(uuid.uuid4()),
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # ---------------------------
    # CREATE DEFAULT WORKSPACE
    # ---------------------------
    default_ws = Workspace(
        name=f"{new_user.full_name or 'My'} Workspace",
        description="Default workspace created automatically",
        owner_id=new_user.id,
        created_by=new_user.id
    )
    db.add(default_ws)
    db.flush()   # to get workspace ID

    # add user as admin
    db.add(WorkspaceMember(
        workspace_id=default_ws.id,
        user_id=new_user.id,
        role=RoleEnum.admin
    ))

    db.commit()
    # ---------------------------

    return new_user


@router.post("/login", response_model=schema.Token)
def login(user: schema.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schema.User)
def get_current_user(current_user: schema.User = Depends(get_current_user)):
    return current_user