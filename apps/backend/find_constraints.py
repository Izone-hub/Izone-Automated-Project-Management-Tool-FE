
from app.db.session import engine
from sqlalchemy import text

def find_constraints():
    tables = ["comments", "attachments", "time_entries", "cards", "lists"]
    
    with engine.connect() as conn:
        with open("constraints_info.txt", "w") as f:
            for table in tables:
                f.write(f"\n--- Constraints for {table} ---\n")
                query = text("""
                    SELECT
                        tc.constraint_name, 
                        kcu.column_name, 
                        ccu.table_name AS foreign_table_name,
                        ccu.column_name AS foreign_column_name 
                    FROM 
                        information_schema.table_constraints AS tc 
                        JOIN information_schema.key_column_usage AS kcu
                          ON tc.constraint_name = kcu.constraint_name
                          AND tc.table_schema = kcu.table_schema
                        JOIN information_schema.constraint_column_usage AS ccu
                          ON ccu.constraint_name = tc.constraint_name
                          AND ccu.table_schema = tc.table_schema
                    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = :table;
                """)
                result = conn.execute(query, {"table": table})
                for row in result:
                    f.write(f"Name: {row[0]}, Column: {row[1]}, RefTable: {row[2]}, RefCol: {row[3]}\n")

if __name__ == "__main__":
    find_constraints()
