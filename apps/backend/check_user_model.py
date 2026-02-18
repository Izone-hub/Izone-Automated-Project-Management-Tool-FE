from app.db.session import SessionLocal
from app.models.user import User
from sqlalchemy import text

def check_user_db():
    db = SessionLocal()
    try:
        print("Checking DB connection...")
        db.execute(text("SELECT 1"))
        print("DB Connection OK.")
        
        print("Querying Users table...")
        user = db.query(User).first()
        if user:
            print(f"Found user: {user.email}")
        else:
            print("No users found (but query succeeded).")
            
    except Exception as e:
        print(f"DB Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_user_db()
