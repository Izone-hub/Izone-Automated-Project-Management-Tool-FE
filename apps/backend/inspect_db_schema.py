import sys
import os
from sqlalchemy import text, inspect

sys.path.append(os.getcwd())
from app.db.session import engine, SessionLocal

def inspect_db():
    print("INSPECTING DATABASE SCHEMA...")
    inspector = inspect(engine)
    
    # 1. Check if tables exist
    tables = inspector.get_table_names()
    print(f"Tables found: {tables}")
    
    if "time_entries" not in tables:
        print("CRITICAL: 'time_entries' table is MISSING!")
    else:
        print("SUCCESS: 'time_entries' table exists.")
        
        # 2. Check columns in time_entries
        columns = [c['name'] for c in inspector.get_columns("time_entries")]
        print(f"Columns in 'time_entries': {columns}")
        
        if "card_id" in columns:
            print("SUCCESS: 'card_id' column found.")
        elif "task_id" in columns:
            print("CRITICAL: Found 'task_id' instead of 'card_id'. Schema migration failed.")
        else:
            print("CRITICAL: Neither 'card_id' nor 'task_id' found!")

if __name__ == "__main__":
    inspect_db()
