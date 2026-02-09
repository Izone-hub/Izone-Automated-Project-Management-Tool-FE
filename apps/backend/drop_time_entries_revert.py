import sys
import os
from sqlalchemy import text

sys.path.append(os.getcwd())
from app.db.session import SessionLocal

def drop_table():
    db = SessionLocal()
    try:
        print("Dropping time_entries table to revert schema...")
        db.execute(text("DROP TABLE IF EXISTS time_entries CASCADE"))
        db.commit()
        print("SUCCESS: Table dropped.")
    except Exception as e:
        print(f"FAILED: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    drop_table()
