import requests
import time

API_URL = "http://localhost:8000/api/v1/projects/{project_id}/lists"
# Need a valid project ID. IDK what it is, but let's try a dummy one or find one.
# If I use a random UUID, it should return [] (empty list) quickly, unless authentication blocks it.
# The code in routes.py doesn't seem to enforce auth on this specific endpoint? 
# Wait, routes.py uses `Depends(get_db)`. It doesn't look like it uses `get_current_user`. 
# Let's check main.py for global dependencies.

def test_lists():
    project_id = "cbab4bc2-9b90-48e9-ab65-abbae0aaac9d" # From screenshot in previous turn
    url = f"http://localhost:8000/api/v1/projects/{project_id}/lists/"
    
    print(f"Testing URL: {url}")
    try:
        start = time.time()
        # Add a dummy token if needed, or try without. 
        # The frontend log said "Building headers, token exists: true"
        headers = {} 
        
        response = requests.get(url, headers=headers, timeout=5)
        end = time.time()
        
        print(f"Status: {response.status_code}")
        print(f"Time: {end - start:.2f}s")
        print(f"Response: {response.text[:200]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_lists()
