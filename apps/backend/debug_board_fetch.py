import sys
import os
from sqlalchemy.orm import Session

sys.path.append(os.getcwd())
from app.db.session import SessionLocal
from app.models.project import Project
from app.models.task import Task
from app.models.card import Card
from app.models.list import List as DbList

def debug_fetch():
    db = SessionLocal()
    try:
        print("Attempting to query Projects...")
        # This is likely what getBoard does
        projects = db.query(Project).all()
        print(f"Found {len(projects)} projects.")
        
        for p in projects:
            print(f"Project: {p.name} ({p.id})")
            # Force load relationships
            print(f"  - Tasks: {len(p.tasks)}")
            for t in p.tasks:
                print(f"    - Task: {t.title}")
                # Trigger lazy loads if any
                # print(t.assignee) 
                
        print("Attempting to query Lists/Cards (Kanban Board)...")
        lists = db.query(DbList).all()
        print(f"Found {len(lists)} lists.")
        for l in lists:
            print(f"  List: {l.title}")
            print(f"    Cards: {len(l.cards)}")
            for c in l.cards:
                print(f"      Card: {c.title}")
                # Trigger loading of attachments/time_entries
                print(f"      - Attachments: {len(c.attachments)}")
                print(f"      - TimeEntries: {len(c.time_entries)}")

        print("SUCCESS: No errors during fetch.")

    except Exception as e:
        print("\nCRITICAL ERROR DURING FETCH:")
        print(e)
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_fetch()
