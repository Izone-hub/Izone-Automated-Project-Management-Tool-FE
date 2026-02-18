from app.db.session import SessionLocal
from app.models.card import Card
from app.models.attachment import Attachment
from app.models.list import List
from app.models.user import User
import uuid

def verify_relationship():
    db = SessionLocal()
    try:
        # Create a dummy card
        card_id = uuid.uuid4()
        # Ensure we have a list to attach to (or mock it if constraints allow)
        # For this test, we assume we can just try to insert an attachment linked to a non-existent card 
        # to see if it fails with FK violation on "cards" table, or "tasks" table.
        # Actually better to create a card.
        
        # But to avoid complex setup, let's just inspect the mapper
        from sqlalchemy import inspect
        insp = inspect(Attachment)
        print(f"Attachment mapped table: {insp.tables[0].name}")
        for col in insp.columns:
            if col.name == 'task_id':
                print(f"Column task_id foreign keys: {col.foreign_keys}")
                
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_relationship()
