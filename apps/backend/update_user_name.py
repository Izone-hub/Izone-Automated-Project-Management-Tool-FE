# Quick script to check and update user name
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/izone_db")

# Parse connection string
if DATABASE_URL.startswith("postgresql://"):
    # Parse: postgresql://user:password@host:port/dbname
    parts = DATABASE_URL.replace("postgresql://", "").split("@")
    user_pass = parts[0].split(":")
    host_port_db = parts[1].split("/")
    host_port = host_port_db[0].split(":")
    
    conn = psycopg2.connect(
        host=host_port[0],
        port=host_port[1] if len(host_port) > 1 else 5432,
        database=host_port_db[1],
        user=user_pass[0],
        password=user_pass[1]
    )
else:
    conn = psycopg2.connect(DATABASE_URL)

cur = conn.cursor()

# List all users
print("=== Current Users ===")
cur.execute("SELECT id, email, full_name FROM users")
users = cur.fetchall()
for user in users:
    print(f"  ID: {user[0]}")
    print(f"  Email: {user[1]}")
    print(f"  Name: {user[2]}")
    print()

# Update specific user
email_to_update = "mahider12@gmail.com"
new_name = "Mahder Mekdes"

print(f"=== Updating user {email_to_update} to name '{new_name}' ===")
cur.execute("UPDATE users SET full_name = %s WHERE email = %s RETURNING id, email, full_name", (new_name, email_to_update))
updated = cur.fetchone()
if updated:
    print(f"Updated: {updated}")
    conn.commit()
else:
    print("User not found!")

conn.close()
print("Done!")
