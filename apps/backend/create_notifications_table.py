import sys
import os

# Ensure the app module is in the python path
sys.path.append(os.getcwd())

from app.db.session import engine, Base
from app.models.notification import Notification

def create_table():
    print("Creating notifications table...")
    Notification.__table__.create(bind=engine)
    print("Table created successfully!")

if __name__ == "__main__":
    create_table()
