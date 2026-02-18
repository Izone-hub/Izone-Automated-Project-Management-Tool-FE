
from app.db.session import engine
from sqlalchemy import text

def apply_fixes():
    queries = [
        # Fix comments
        "ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_card_id_fkey;",
        "ALTER TABLE comments ADD CONSTRAINT comments_card_id_fkey FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE;",
        
        # Fix attachments
        "ALTER TABLE attachments DROP CONSTRAINT IF EXISTS attachments_card_id_fkey;",
        "ALTER TABLE attachments ADD CONSTRAINT attachments_card_id_fkey FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE;",
        
        # Ensure lists -> project is cascade (just in case)
        "ALTER TABLE lists DROP CONSTRAINT IF EXISTS lists_project_id_fkey;",
        "ALTER TABLE lists ADD CONSTRAINT lists_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;",
        
        # Ensure cards -> list is cascade (just in case)
        "ALTER TABLE cards DROP CONSTRAINT IF EXISTS cards_list_id_fkey;",
        "ALTER TABLE cards ADD CONSTRAINT cards_list_id_fkey FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE;"
    ]
    
    with engine.connect() as conn:
        for query in queries:
            print(f"Executing: {query}")
            try:
                conn.execute(text(query))
                conn.commit()
                print("Success.")
            except Exception as e:
                print(f"Failed: {e}")
                conn.rollback()

if __name__ == "__main__":
    apply_fixes()
