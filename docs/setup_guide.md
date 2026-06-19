# Setup Guide

Follow these steps to run Omnidrop locally on your development machine.

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for PostgreSQL database)
- Python 3.11+
- Node.js 20+

---

## 1. Start the Database
Omnidrop uses a PostgreSQL database container.

1. Open your terminal in the root directory.
2. Run the Docker Compose command:
   ```bash
   docker compose up -d
   ```
3. The database will spin up and listen on port **5433** (mapped to the container's 5432 to avoid local conflicts).

---

## 2. Start the Backend (FastAPI)

1. Open a new terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   
   # macOS/Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
   **CRITICAL**: You must add your `GEMINI_API_KEY` to the `.env` file to enable the AI Chatbot and AI Delivery Estimates. Without it, those features will fail.

5. Start the server:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

*Note: The backend automatically creates the database tables and seeds sample data (products, a demo user, and dark stores) upon startup.*

### Running Backend Tests
To verify the backend logic (including hyper-local inventory and checkout flows), run Pytest:
```bash
python -m pytest tests/ -v
```

---

## 3. Start the Frontend (React + Vite)

1. Open another terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node packages:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`.

### Running Frontend Tests
To verify the React components and Auth context, run Vitest:
```bash
npm run test
```

---

## Demo Credentials
If you'd rather not sign up for a new account, a demo customer is automatically created during the backend seed process:
- **Email**: `demo@example.com`
- **Password**: `demo1234`
