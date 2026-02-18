
import os
import sys
from sqlalchemy import create_engine, inspect, text

def check_schema():
    # Use the database URL from env or fallback to a common one if known
    # Looking at the folder I see app/db/session.py, let's try to get it from there
    # But for a quick check, I'll assume local postgres if I can find the URL
    
    # Try to find DATABASE_URL in environment or main.py/config.py
    # For now, let's just try to connect to the likely local DB
    db_url = "postgresql://postgres:MNSizone%40789@93.127.203.106:5432/Izone_Task_Managment"
    
    try:
        engine = create_engine(db_url)
        inspector = inspect(engine)
        
        for table_name in ["comments", "attachments", "time_entries", "cards", "lists"]:
            print(f"\nTable: {table_name}")
            fks = inspector.get_foreign_keys(table_name)
            for fk in fks:
                print(f"  FK: {fk['name']} -> {fk['referred_table']}.{fk['referred_columns']} (ondelete: {fk.get('options', {}).get('ondelete')})")
    except Exception as e:
        print(f"Error connecting to DB: {e}")

if __name__ == "__main__":
    check_schema()
