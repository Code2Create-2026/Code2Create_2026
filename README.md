# Code2Create_2026

A small toolchain and example app that detects and helps prevent frontend/backend contract mismatches (the kind of break that happens when a backend field like `user_id` is renamed to `userId` and the frontend instantly crashes). It provides an analysis engine that parses frontend and backend code, a comparator to identify breaking differences, a web UI for inspection, and a small sample project to exercise the system.

## Project Structure

This repository is split into two main directories:

- **`backend/`**: The core analysis engine and Python Flask backend. It exposes the API to run the analysis, and orchestrates the parsing of frontend and backend code.
- **`frontend/`**: The React + Vite frontend application. It provides the web UI to interact with the analysis engine, upload zip files, and visualize the API mismatches.

```text
Code2Create_2026/
├── backend/                  # Python backend and Analysis Engine
│   ├── analysis_engine/      # Core AST parsing and matching logic
│   ├── backend/              # Flask API routes and app setup
│   ├── sample_project/       # Demo projects to test the engine
│   ├── run_integrated.py     # Main script to run the server
│   └── test_engine.py        # Test harness for the engine
├── frontend/                 # React + Vite web UI
│   ├── src/                  # React components and services
│   ├── package.json          # Frontend dependencies
│   └── vite.config.ts        # Vite configuration
└── README.md                 # This file
```

## How to Run Locally

You will need two separate terminal windows to run the frontend and backend simultaneously.

### 1. Run the Backend (Python)
The backend is a Flask server that runs the analysis engine.

```bash
cd backend
python -m venv .venv
# Activate the virtual environment:
# Windows: .venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate

pip install -r backend/requirements.txt

# Start the backend server on http://localhost:5000
python run_integrated.py --server
```

### 2. Run the Frontend (Vite + React)
The frontend is the interactive dashboard used to view the analysis results.

```bash
cd frontend
# Install dependencies
npm install
# Start the development server (usually on http://localhost:5173)
npm run dev
```

## How it works
- The **`analysis_engine`** (in the backend folder) contains AST parsers for frontend (React/JS/TS) and backend (Python/Java/C++) code.
- The **comparator** cross-references backend API definitions with frontend fetch/axios calls to find likely-breaking changes (like `userId` vs `user_id`).
- When a user uploads a project `.zip` file via the web UI, the backend extracts the code, runs the engine over it, and returns the analysis results, highlighting missing or mismatched fields.

## Recent Fixes
- **Duplicate Mismatch Fix**: The comparator now properly deduplicates frontend fields by their `(name, file)` mapping. A field appearing multiple times in the same file no longer generates duplicate mismatch cards in the UI.
- **Test Directory Isolation**: The backend parser correctly ignores nested test/sample directories when scanning uploaded zips, preventing false positives and inflated issue counts.
