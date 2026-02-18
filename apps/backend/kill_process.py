from app.db.session import SessionLocal
from sqlalchemy import text

def kill_pid(pid):
    db = SessionLocal()
    try:
        print(f"Attempting to terminate PID {pid}...")
        # pg_terminate_backend returns true if successful
        result = db.execute(text(f"SELECT pg_terminate_backend({pid})"))
        print(f"Result: {result.scalar()}")
        db.commit()
    except Exception as e:
        print(f"Error killing PID: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # PID found in previous step
    kill_pid(3682009)
