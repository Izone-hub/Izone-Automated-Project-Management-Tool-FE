# 🚀 Automated Project Management Tool

A modern and scalable **monorepo** project built with **Next.js (TypeScript)** for the frontend and **FastAPI (Python)** for the backend.  
This tool aims to streamline project management tasks — planning, tracking, collaboration, and reporting — all in one place.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | Next.js (TypeScript) |
| Backend | FastAPI (Python 3.10+) |
| Database | PostgreSQL |
| Package Manager | npm / pip |
| API Communication | REST |
| Deployment | Docker & Docker Compose |

---

## 🗂️ Monorepo Structure

```
automated-project-management-tool/
│
├── frontend/                  # Next.js app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── styles/
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
├── backend/                   # FastAPI app
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml         # Combined services (frontend, backend, db)
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Guide

### 🪟 For Windows

#### 1️⃣ Install Required Tools
- [Node.js (LTS)](https://nodejs.org)
- [Python 3.10+](https://www.python.org/downloads/)
- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [VS Code](https://code.visualstudio.com/)

#### 2️⃣ Clone the Repository
```bash
git clone https://github.com/Izone-hub/Izone-Automated-Project-Management-Tool-FE.git
cd Izone-Automated-Project-Management-Tool-FE
```

#### 3️⃣ Setup Frontend
```bash
cd frontend
yarn install
yarn dev
```
The app will run at: **http://localhost:3000**

#### 4️⃣ Setup Backend
```bash
cd ../backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
The API will run at: **http://localhost:8000**

---

### 🐧 For Linux

#### 1️⃣ Install Required Tools
```bash
sudo apt update
sudo apt install nodejs npm python3 python3-venv python3-pip git docker.io docker-compose -y
```

#### 2️⃣ Clone the Repository
```bash
git clone https://github.com/Izone-hub/Izone-Automated-Project-Management-Tool-FE.git
cd Izone-Automated-Project-Management-Tool-FE
```

#### 3️⃣ Setup Frontend
```bash
cd frontend
yarn install
yarn dev
```

#### 4️⃣ Setup Backend
```bash
cd ../backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 🐳 Optional: Run with Docker

You can spin up the full stack (frontend + backend + PostgreSQL) using Docker Compose.

```bash
docker-compose up --build
```

Then visit:
- Frontend → [http://localhost:3000](http://localhost:3000)
- Backend → [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧩 Environment Variables

Create a `.env` file in both `frontend/` and `backend/`:

**frontend/.env**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**backend/.env**
```
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
SECRET_KEY=your_secret_key
```

---

## 🗄️ Database Migrations

This project uses **Alembic** for database migrations. Follow these steps when you need to update your database schema.

### Prerequisites

- Make sure your virtual environment is activated
- Ensure your database connection is configured in `.env` file
- Database server is running

### 📝 Step-by-Step Migration Guide

#### 1. Update Your Model

Edit your SQLAlchemy model file (e.g., `apps/backend/app/models/user.py`) to add, modify, or remove fields:

#### 2. Generate Migration

Navigate to the backend directory and generate a new migration:

```bash
cd apps/backend
source venv/bin/activate  # On Linux/Mac
# or
venv\Scripts\activate     # On Windows

alembic revision --autogenerate -m "describe your change"
```

**Example:**
```bash
alembic revision --autogenerate -m "add full_name to users table"
```

This creates a new migration file in `migrations/versions/` with a timestamp and description.

#### 3. Review the Generated Migration

Always review the generated migration file before applying it:

- Check the file path: `migrations/versions/XXXXX_describe_your_change.py`
- Verify:
  - Column types match your model definition
  - Constraints (nullable, unique, etc.) are correct
  - The migration matches your intended changes

#### 4. Apply the Migration

Run the migration to update your database:

```bash
alembic upgrade head
```

This applies all pending migrations to your database.

### 🔧 Useful Migration Commands

| Command | Description |
|---------|-------------|
| `alembic current` | Show the current migration version |
| `alembic history` | View all migration history |
| `alembic upgrade head` | Apply all pending migrations |
| `alembic downgrade -1` | Rollback the last migration |
| `alembic revision --autogenerate -m "message"` | Generate a new migration |

### ⚠️ Important Notes

- **Always review** auto-generated migrations before applying
- **Test migrations** on a development database first
- **Commit migration files** to version control
- **Use descriptive messages** for migration descriptions
- **Don't edit** existing migrations that have been applied to production

### 🐛 Troubleshooting

If you encounter issues:

1. **Check database connection**: Verify your `.env` file has correct database credentials
2. **Check model imports**: Ensure all models are imported in `app/db/base.py`
3. **Review migration file**: Check for syntax errors in the generated migration
4. **Database state**: Use `alembic current` to verify your database state matches expectations

---

## 🧠 Future Enhancements
- 🔐 Authentication (JWT)
- 🗓️ Task scheduling & reminders
- 📊 Dashboard analytics
- 👥 Team collaboration module
- ☁️ Cloud deployment with CI/CD

---

## 🪪 License
This project is licensed under the **MIT License**.