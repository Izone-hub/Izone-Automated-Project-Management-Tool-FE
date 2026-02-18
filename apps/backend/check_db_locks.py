from app.db.session import SessionLocal
from sqlalchemy import text
import time

def check_locks():
    db = SessionLocal()
    try:
        print("Checking for blocking queries...")
        # Query to find blocking activity in PostgreSQL
        query = text("""
            SELECT
                pid,
                usename,
                pg_blocking_pids(pid) as blocked_by,
                query as query,
                state,
                wait_event_type,
                wait_event
            FROM pg_stat_activity
            WHERE state != 'idle'
            AND pid != pg_backend_pid();
        """)
        
        results = db.execute(query).fetchall()
        
        if not results:
            print("No active non-idle queries found.")
        else:
            print(f"Found {len(results)} active queries:")
            for row in results:
                print("-" * 50)
                print(f"PID: {row.pid}")
                print(f"User: {row.usename}")
                print(f"Blocked By: {row.blocked_by}")
                print(f"State: {row.state}")
                print(f"Wait: {row.wait_event_type} - {row.wait_event}")
                print(f"Query: {row.query}")

    except Exception as e:
        print(f"Error checking locks: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_locks()
