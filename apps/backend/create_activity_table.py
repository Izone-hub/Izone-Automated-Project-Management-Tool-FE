import sys
import os

# Ensure the app module is in the python path
sys.path.append(os.getcwd())

from app.db.session import engine, Base
from app.models.activity import ActivityLog

def create_table():
    print("Creating activity_logs table...")
    ActivityLog.__table__.create(bind=engine)
    print("Table created successfully!")

if __name__ == "__main__":
    create_table()
