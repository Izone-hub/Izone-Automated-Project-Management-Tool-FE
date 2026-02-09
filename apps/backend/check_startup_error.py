import sys
import os

# Add the project root to the python path
sys.path.append(os.getcwd())

try:
    print("Attempting to import app.main...")
    from app.main import app
    print("SUCCESS: app.main imported successfully.")
    
    print("Attempting to import models...")
    from app.models.time_entry import TimeEntry
    from app.models.card import Card
    print("SUCCESS: Models imported.")

except Exception as e:
    print(f"CRITICAL ERROR: {e}")
    import traceback
    traceback.print_exc()
