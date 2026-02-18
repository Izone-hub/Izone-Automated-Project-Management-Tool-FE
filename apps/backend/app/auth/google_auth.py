from os import environ
print("DEBUG: LOADING GOOGLE_AUTH.PY - VERSION WITH JWT FIX")
import uuid

from fastapi import APIRouter, Request, Depends, HTTPException
from starlette.responses import RedirectResponse, JSONResponse
from authlib.integrations.starlette_client import OAuth
from sqlalchemy.orm import Session

from app.models.user import User
from app.db.session import get_db
from app.auth.security import create_access_token

oauth = OAuth()
oauth.register(
    name="google",
    client_id=environ.get("GOOGLE_CLIENT_ID"),
    client_secret=environ.get("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

router = APIRouter()

@router.get("/auth/google/login")
async def login(request: Request, db: Session = Depends(get_db)):
    # Quick config checks to provide clearer errors instead of a 500
    client_id = environ.get("GOOGLE_CLIENT_ID")
    client_secret = environ.get("GOOGLE_CLIENT_SECRET")
    dev_oauth = environ.get("DEV_OAUTH", "false").lower() == "true"
    
    print(f"DEBUG: client_id present: {bool(client_id)}")
    print(f"DEBUG: client_secret present: {bool(client_secret)}")
    print(f"DEBUG: dev_oauth raw: {environ.get('DEV_OAUTH')}")
    print(f"DEBUG: dev_oauth resolved: {dev_oauth}")

    if not client_id or not client_secret:
        if dev_oauth:
            print("DEBUG: DEV_OAUTH is ACTIVE. Bypassing Google Login.")
            # Development fallback: find the first user and issue a real JWT
            frontend = environ.get("FRONTEND_URL", "http://localhost:3000")
            user = db.query(User).first()
            if not user:
                return JSONResponse({"error": "DEV_OAUTH: No users in database. Register a user first."}, status_code=500)
            token = create_access_token({"sub": user.email})
            return RedirectResponse(url=f"{frontend}/auth/success?token={token}")
        return JSONResponse({"error": "Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET."}, status_code=503)

    try:
        redirect_uri = request.url_for("google_callback")
        
        # FIX: Force localhost if 127.0.0.1 is used, to match Google Console
        redirect_uri_str = str(redirect_uri)
        if "127.0.0.1" in redirect_uri_str:
            redirect_uri_str = redirect_uri_str.replace("127.0.0.1", "localhost")
        
        # Ensure HTTPS for redirect_uri in production/proxied environments
        if environ.get("Render") or environ.get("VERCEL") or request.headers.get("x-forwarded-proto") == "https":
             redirect_uri_str = redirect_uri_str.replace("http://", "https://")
        
        print(f"DEBUG: Generated redirect_uri: {redirect_uri_str}")

        # Force account selection so user sees the Google Page
        return await oauth.google.authorize_redirect(request, redirect_uri_str, prompt="select_account")
    except Exception as exc:
        return JSONResponse({"error": "authorize_redirect failed", "details": str(exc)}, status_code=500)

@router.get("/auth/google/callback", name="google_callback")
async def auth_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception as exc:
        return JSONResponse({"error": "authorize_access_token failed", "details": str(exc)}, status_code=500)
    if not token:
        raise HTTPException(status_code=400, detail="Missing token")
    userinfo = token.get("userinfo") or await oauth.google.parse_id_token(request, token)
    email = userinfo.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email not provided by Google")
    user = db.query(User).filter_by(email=email).first()
    if not user:
        user = User(
            email=email,
            full_name=userinfo.get("name") or "",
            avatar_url=userinfo.get("picture"),
            hashed_password=str(uuid.uuid4())  # placeholder since hashed_password is required
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    access_token = create_access_token({"sub": user.email})
    frontend = environ.get("FRONTEND_URL", "http://localhost:3000")
    return RedirectResponse(url=f"{frontend}/auth/success?token={access_token}")