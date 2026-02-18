import requests

def debug_login():
    url = "http://127.0.0.1:8000/auth/login"
    
    payload = {
        "email": "biruk12@example.com",
        "password": "password123"
    }
    
    try:
        print(f"Attempting login at {url}...")
        response = requests.post(url, json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_login()
