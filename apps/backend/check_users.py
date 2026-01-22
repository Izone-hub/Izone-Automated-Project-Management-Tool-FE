
import sys
import os
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.user import User
from app.auth.security import hash_password
import uuid

def check_users():
    db = SessionLocal()
    try:
        user = db.query(User).first()
        if user:
            print(f"User found: ID={user.id}, Email={user.email}")
        else:
            print("No users found!")
            # Create a dummy user
            print("Creating dummy system user...")
            dummy_user = User(
                id=uuid.uuid4(),
                email="system@example.com",
                hashed_password=hash_password("password"),
                full_name="System Admin"
            )
            db.add(dummy_user)
            db.commit()
            print(f"Created user: {dummy_user.id}")
            
    except Exception as e:
        print(f"Error checking users: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    check_users()
