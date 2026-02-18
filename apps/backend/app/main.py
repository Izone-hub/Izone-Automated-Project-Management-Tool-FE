from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from os import environ
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from apps/backend/.env if present
env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(env_path)
try:
    # preferred: use Starlette's SessionMiddleware (requires itsdangerous)
    from starlette.middleware.sessions import SessionMiddleware  # type: ignore
    _have_session_middleware = True
except Exception:
    # itsdangerous not installed or import failed — provide a tiny fallback
    _have_session_middleware = False

    class _SimpleSessionMiddleware:
        def __init__(self, app, secret_key: str = "secret"):
            self.app = app

        async def __call__(self, scope, receive, send):
            if scope.get("type") == "http":
                # ensure a session dict exists on the scope
                scope.setdefault("session", {})
            await self.app(scope, receive, send)
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

# Session middleware is required for OAuth flows to store state.
if _have_session_middleware:
    app.add_middleware(
        SessionMiddleware, 
        secret_key=environ.get("SECRET_KEY", "CHANGE_ME"),
        session_cookie="izone_session",
        same_site="lax",  # Required for some browsers during redirects
        https_only=False, # Set to True in production with SSL
    )
else:
    app.add_middleware(_SimpleSessionMiddleware, secret_key=environ.get("SECRET_KEY", "CHANGE_ME"))


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