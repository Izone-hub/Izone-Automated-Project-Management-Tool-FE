import sys
import os
import traceback
from uuid import uuid4
from datetime import datetime

sys.path.append(os.getcwd())
import app.db.base # Register models
from app.db.session import SessionLocal
from app.models.user import User
from app.models.task import Task
from app.models.time_entry import TimeEntry

def debug():
    db = SessionLocal()
    try:
        print("--- DB STATE ---")
        user = db.query(User).first()
        if user:
            print(f"User Found: {user.id} ({user.email})")
        else:
            print("CRITICAL: No User found in DB!")
            
        task = db.query(Task).first()
        if task:
            print(f"Task Found: {task.id} ({task.title})")
        else:
            print("CRITICAL: No Task found in DB!")
            
        if not user or not task:
            print("Aborting test due to missing data.")
            return

        print("\n--- TEST: Create Time Entry via CRUD ---")
        try:
            # Simulate what routes.py does
            new_entry = TimeEntry(
                task_id=task.id,
                user_id=user.id,
                start_time=datetime.now()
            )
            db.add(new_entry)
            db.commit()
            print("SUCCESS: TimeEntry created via DB session directly.")
            
            # Clean up
            db.delete(new_entry)
            db.commit()
            print("Cleaned up test entry.")
            
        except Exception:
            print("FAILED: CRUD operation failed.")
            traceback.print_exc()
            
    finally:
        db.close()

if __name__ == "__main__":
    debug()
