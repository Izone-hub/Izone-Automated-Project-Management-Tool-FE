
import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from uuid import UUID

# Add backend app to path
sys.path.append(os.path.abspath("apps/backend"))

from app.db.session import SessionLocal
from app.cards import crud as card_crud
from app.tasks import crud as task_crud
from app.projects import crud as project_crud

db = SessionLocal()

try:
    print("--- Verifying Card Comment Counts ---")
    # Just get any card
    from app.models.card import Card
    card = db.query(Card).first()
    if card:
        card_with_count = card_crud.get_card(db, str(card.id))
        print(f"Card: {card_with_count.title}, Comment Count: {card_with_count.comment_count}")
    else:
        print("No cards found.")

    print("\n--- Verifying Task Comment Counts ---")
    from app.models.task import Task
    task = db.query(Task).first()
    if task:
        task_with_count = task_crud.get_task(db, str(task.id))
        print(f"Task: {task_with_count.name}, Comment Count: {task_with_count.comment_count}")
    else:
        print("No tasks found.")

    print("\n--- Verifying Project Comment Counts ---")
    from app.models.project import Project
    project = db.query(Project).first()
    if project:
        project_with_count = project_crud.get_project(db, str(project.id))
        print(f"Project: {project_with_count.name}, Comment Count: {project_with_count.comment_count}")
    else:
        print("No projects found.")

finally:
    db.close()
