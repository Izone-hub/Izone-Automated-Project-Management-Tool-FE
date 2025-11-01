from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth.auth import router as auth_router
from app.db.session import engine
from app.db.base import Base
from app.projects.routes import router as project_router
from app.organizations.routes import router as organization_router


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router)
app.include_router(organization_router)
app.include_router(project_router)



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