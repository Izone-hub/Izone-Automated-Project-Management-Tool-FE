from alembic.config import Config
from alembic import command
import os

def run_migrations():
    # Assumes alembic.ini is in the current directory
    alembic_cfg = Config("alembic.ini")
    
    # Generate revision
    try:
        command.revision(alembic_cfg, message="update_attachment_fk_to_cards", autogenerate=True)
        print("Revision generated.")
    except Exception as e:
        print(f"Error generating revision: {e}")
        
    # Apply migration
    try:
        command.upgrade(alembic_cfg, "head")
        print("Migration applied.")
    except Exception as e:
        print(f"Error applying migration: {e}")

if __name__ == "__main__":
    run_migrations()
