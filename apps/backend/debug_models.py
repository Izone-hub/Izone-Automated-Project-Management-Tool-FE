import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

def debug_imports():
    print("Attempting to import app.db.base...")
    try:
        from app.db import base
        print("SUCCESS: app.db.base imported.")
        
        # Verify metadata
        print("Registered Tables:")
        for table in base.Base.metadata.tables.keys():
            print(f" - {table}")
            
    except Exception as e:
        print("\n!!! IMPORT FAILED !!!")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Message: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_imports()
