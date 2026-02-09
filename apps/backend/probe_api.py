import urllib.request
import urllib.error
import json

BASE_URL = "http://127.0.0.1:8000"

def check_endpoint(path, method="GET", data=None):
    url = f"{BASE_URL}{path}"
    print(f"Checking {method} {path}...", end=" ")
    try:
        req = urllib.request.Request(url, method=method)
        if data:
            req.add_header('Content-Type', 'application/json')
            req.data = json.dumps(data).encode('utf-8')
        
        with urllib.request.urlopen(req) as response:
            print(f"OK ({response.getcode()})")
            return True
            
    except urllib.error.HTTPError as e:
        print(f"FAILED ({e.code})")
        print(e.read().decode('utf-8'))
        return False
    except urllib.error.URLError as e:
        print(f"FAILED (Connection Refused/Error: {e.reason})")
        return False

if __name__ == "__main__":
    print(f"Probing Backend at {BASE_URL}")
    
    # 1. Health Check
    if not check_endpoint("/"):
        print("CRITICAL: Root endpoint failed. Backend might be down.")
        exit(1)

    # 2. Check Auth/Users (Basic read)
    # We might not have a public list users endpoint, but let's try active timer which we fixed
    check_endpoint("/time-entries/active")
    
    # 3. Check Workspaces (likely where getBoard starts)
    check_endpoint("/workspaces/")
    
    # 4. Check Projects/Boards
    # We don't valid IDs, but 404 is better than 500
    check_endpoint("/projects/")
    
    print("\nProbe Complete.")
