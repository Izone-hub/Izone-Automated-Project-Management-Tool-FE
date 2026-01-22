
import sys
import os
sys.path.append(os.getcwd())

from app.db.session import engine
from sqlalchemy import text

def fix_schema():
    print("Attempting to fix database schema...")
    with engine.connect() as connection:
        # 1. Add card_id column if it doesn't exist
        print("Adding card_id column...")
        try:
            connection.execute(text("ALTER TABLE comments ADD COLUMN IF NOT EXISTS card_id UUID REFERENCES cards(id);"))
            print("card_id added (or existed).")
        except Exception as e:
            print(f"Error adding card_id: {e}")

        # 2. Make task_id nullable (so we can save comments without task_id)
        print("Making task_id nullable...")
        try:
            connection.execute(text("ALTER TABLE comments ALTER COLUMN task_id DROP NOT NULL;"))
            print("task_id matches nullable.")
        except Exception as e:
            print(f"Error making task_id nullable: {e}")
            
        # 3. Make author_id nullable (just in case, though we used fallback)
        print("Making author_id nullable...")
        try:
            connection.execute(text("ALTER TABLE comments ALTER COLUMN author_id DROP NOT NULL;"))
            print("author_id matches nullable.")
        except Exception as e:
            print(f"Error making author_id nullable: {e}")

        connection.commit()
    print("Schema fix complete.")

if __name__ == "__main__":
    fix_schema()
