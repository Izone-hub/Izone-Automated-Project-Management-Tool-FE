import uvicorn
import sys
import os
import threading
import time

# Add current directory to path
sys.path.append(os.getcwd())

def start_server():
    try:
        from app.main import app
        # Determine strict_slashes=False is not an option for uvicorn run, but handled by FastAPI
        config = uvicorn.Config(app, host="127.0.0.1", port=8001, log_level="info")
        server = uvicorn.Server(config)
        server.run()
    except Exception as e:
        print(f"Server Startup Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("Attempting to start backend on port 8001 (test mode)...")
    t = threading.Thread(target=start_server)
    t.daemon = True
    t.start()
    
    time.sleep(5)
    print("Check finished (5s timeout). If no error printed above, startup is healthy.")
