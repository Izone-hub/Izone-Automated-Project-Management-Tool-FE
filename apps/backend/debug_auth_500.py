import sys
import os
from pathlib import Path

# Add the apps/backend directory to sys.path
backend_path = Path(__file__).parent
sys.path.append(str(backend_path))

from app.db.session import SessionLocal
from app.models.user import User
from app.auth.security import verify_password, create_access_token
from app.auth import schema
import traceback

def test_login_logic():
    db = SessionLocal()
    try:
        email = "biruk12@example.com"
        password = "password123" # I don't know the actual password, but I want to see if it even gets to verify_password
        
        print(f"Testing login logic for {email}...")
        
        print("Querying user...")
        db_user = db.query(User).filter(User.email == email).first()
        if not db_user:
            print("User not found.")
            return

        print(f"User found: {db_user.email}")
        
        print("Attempting to verify password (with dummy password to check for crashes)...")
        try:
            # We don't care if it's correct, we care if it CRASHES
            verify_password(password, db_user.hashed_password)
            print("verify_password completed without crashing.")
        except Exception as e:
            print(f"CRASH in verify_password: {e}")
            traceback.print_exc()

        print("Attempting to create access token...")
        try:
            token = create_access_token({"sub": db_user.email})
            print(f"Token created: {token[:20]}...")
        except Exception as e:
            print(f"CRASH in create_access_token: {e}")
            traceback.print_exc()

        print("Testing schema validation (Token)...")
        try:
            token_obj = schema.Token(access_token="test", token_type="bearer")
            print("Schema validation OK.")
        except Exception as e:
            print(f"CRASH in schema validation: {e}")
            traceback.print_exc()

    except Exception as e:
        print(f"General error: {e}")
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_login_logic()
