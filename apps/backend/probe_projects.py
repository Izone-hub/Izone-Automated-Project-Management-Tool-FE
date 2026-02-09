import urllib.request
import urllib.error
import json

BASE_URL = "http://127.0.0.1:8000"

def get_projects(workspace_id):
    url = f"{BASE_URL}/projects/?workspace_id={workspace_id}"
    print(f"Checking GET {url}...", end=" ")
    try:
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req) as response:
            print(f"OK ({response.getcode()})")
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"FAILED: {e}")
        return []

def get_project_detail(project_id):
    url = f"{BASE_URL}/projects/{project_id}"
    print(f"Checking GET {url}...", end=" ")
    try:
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req) as response:
            print(f"OK ({response.getcode()})")
            return True
    except urllib.error.HTTPError as e:
        print(f"FAILED ({e.code})")
        print(e.read().decode('utf-8'))
        return False
    except Exception as e:
        print(f"FAILED: {e}")
        return False

# We need a workspace ID to list projects. Let's try to get one from the DB or use a known one.
# For debugging I'll assume we can list workspaces first.

def get_workspaces():
    url = f"{BASE_URL}/workspaces/"
    print(f"Checking GET {url}...", end=" ")
    try:
        # Assuming user_id query param matches what we fixed earlier? Or just all?
        # Workspace routes usually filter by user_id. Let's look at workspace routes later if this fails.
        # But we can try to fetch all if allowed.
        req = urllib.request.Request(url, method="GET") 
        # Wait, workspaces route usually needs user_id.
        # Let's try to grab a user first?
        # Actually, let's just inspect the DB directly with a python script to get valid IDs.
        pass
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    try:
        # Direct DB Inspection to get valid IDs
        import sys
        import os
        import traceback
        
        sys.path.append(os.getcwd())
        # Import base to register all models
        import app.db.base 
        from app.db.session import SessionLocal
        from app.models.project import Project
        
        db = SessionLocal()
        try:
            project = db.query(Project).first()
            if project:
                print(f"Found Project ID: {project.id}")
                get_project_detail(str(project.id))
            else:
                print("No projects found in DB.")
        finally:
            db.close()
    except Exception:
        with open("error.log", "w") as f:
            traceback.print_exc(file=f)
        print("Error occurred. See error.log")
        sys.exit(1) 
