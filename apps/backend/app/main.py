from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .auth.auth import router as auth_router
from .db.session import engine
from .db.base import Base
from .workspaces import routes as workspace_router
from .projects import routes as project_router
from .tasks import routes as task_router
from .comments import routes as comment_router
from .lists import routes as list_router
from app.cards.routes import router as card_router
from  app.attachment.routes import router as  attachment_router
from .auth.google_auth import router as google_auth_router

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()



app.include_router(auth_router)
app.include_router(workspace_router.router)
app.include_router(project_router.router)
app.include_router(task_router.router)
app.include_router(comment_router.router)
app.include_router(list_router.router)
app.include_router(card_router)
app.include_router(attachment_router)
app.include_router(google_auth_router)

# Configure CORS

origins = [
    "http://localhost:3000", 
    "https://your-production-domain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.get("/")
def read_root():
    return {"message": "FastAPI backend is running 🚀"}