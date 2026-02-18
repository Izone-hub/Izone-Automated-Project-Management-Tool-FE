from app.db.session import SessionLocal
from sqlalchemy import text

def fix_fk():
    db = SessionLocal()
    try:
        # First check if constraint exists and what it is
        # But easier to just try to drop it if it exists and add the new one.
        # Function to find constraint name might be needed if it's auto-generated.
        
        # Explicit SQL for PostgreSQL
        # 1. Drop existing FK if it points to tasks
        # We need to find the name of the constraint first.
        
        # Inspect columns
        print("Inspecting columns of 'attachments' table...")
        result = db.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'attachments';
        """))
        columns = result.fetchall()
        for col in columns:
            print(f"Column: {col[0]}, Type: {col[1]}")
            
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_fk()
