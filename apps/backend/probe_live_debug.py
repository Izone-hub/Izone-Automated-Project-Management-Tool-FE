import sys
import os
import requests

# Assuming local server is running
API_URL = "http://127.0.0.1:8000"

def probe():
    print("--------------------------------------------------")
    print("PROBING BACKEND API")
    print("--------------------------------------------------")

    # 1. Inspect ROOT
    try:
        r = requests.get(f"{API_URL}/")
        print(f"ROOT: {r.status_code} {r.json()}")
    except Exception as e:
        print(f"ROOT: FAILED TO CONNECT - {e}")
        return

    # 2. Get Workspaces (to find a board context)
    try:
        r = requests.get(f"{API_URL}/workspaces")
        if r.status_code != 200:
            print(f"WORKSPACES: FAILED {r.status_code} - {r.text}")
        else:
            workspaces = r.json()
            print(f"WORKSPACES: Found {len(workspaces)}")
            if workspaces:
                ws_id = workspaces[0]['id']
                
                # 3. Get Project/Board
                r = requests.get(f"{API_URL}/projects", params={"workspace_id": ws_id})
                projects = r.json()
                print(f"PROJECTS: Found {len(projects)}")
                
                if projects:
                    board_id = projects[0]['id']
                    print(f"Fetching Board {board_id}...")
                    r_board = requests.get(f"{API_URL}/projects/{board_id}")
                    if r_board.status_code == 200:
                        print("BOARD: SUCCESS")
                    else:
                        print(f"BOARD: FAILED {r_board.status_code}")
                        print(r_board.text) # This will give us the traceback if debug is on
    except Exception as e:
        print(f"CRITICAL PROBE ERROR: {e}")

if __name__ == "__main__":
    probe()
