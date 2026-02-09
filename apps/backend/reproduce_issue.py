import sys
import os
from datetime import datetime

# Add the current directory to sys.path so we can import 'app'
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.user import User
from app.models.task import Task
from app.models.time_entry import TimeEntry
from app.models.project import Project
from app.models.workspace import Workspace

def debug_db():
    db = SessionLocal()
    try:
        print("--- DEBUGGING DATABASE ---")
        
        # 1. Check User
        user = db.query(User).first()
        if not user:
            print("ERROR: No users found!")
            return
        print(f"Found User: {user.id}")

        # 2. Check Task (Get any task)
        task = db.query(Task).first()
        if not task:
            print("ERROR: No tasks found!")
            
            # Create dummy Project/Workspace first if needed... assumes they exist if User exists
            # For debugging we just want to see if we can insert TimeEntry if Task exists
            return
        print(f"Found Task: {task.id}")

        # 3. Try to Create TimeEntry
        print("\nAttempting to create TimeEntry...")
        try:
            entry = TimeEntry(
                task_id=task.id,
                user_id=user.id,
                start_time=datetime.now()
            )
            db.add(entry)
            db.commit()
            print("SUCCESS: TimeEntry created!")
            
            # Clean up
            db.delete(entry)
            db.commit()
            print("Cleaned up test entry.")
            
        except Exception as e:
            print("\n!!! FAILURE !!!")
            print(e)
            import traceback
            traceback.print_exc()

    finally:
        db.close()

if __name__ == "__main__":
    debug_db()
