
import urllib.request
import json
import uuid

# Use a valid card ID format
card_id = "845ed494-85e2-4713-a997-f52c6d572b8f"
url = f"http://127.0.0.1:8000/cards/{card_id}/comments/"
data = {
    "card_id": card_id,
    "content": "Live server test comment"
}

req = urllib.request.Request(
    url,
    data=json.dumps(data).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    print(f"Sending POST to {url}")
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.status}")
        print(f"Body: {response.read().decode('utf-8')}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Read: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Connection Error: {e}")
