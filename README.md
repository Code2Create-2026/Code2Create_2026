# Code2Create_2026

A small toolchain and example app that detects and helps prevent frontend/backend contract mismatches (the kind of break that happens when a backend field like `user_id` is renamed to `userId` and the frontend instantly crashes). It provides an analysis engine that parses frontend and backend code, a comparator to identify breaking differences, a web UI for inspection, and a small sample project to exercise the system.

## Stack
- Language(s): Python (analysis + backend) and TypeScript (React) for the web UI
- Framework / runtime: Flask-style Python backend (serves API + templates) and Vite + React + TypeScript for the frontend
- Notable libraries: Flask / Jinja2 (backend templates & routes), Vite + React + TypeScript (frontend), Python stdlib AST/regex utilities used by the analysis engine

## How it's organized
Top-level structure (important entries only):

```
.gitignore
run_integrated.py            # Integration runner / orchestration script
test_engine.py               # Small test harness for the analysis engine
analysis_engine/             # Core analysis code: parsers, comparator, orchestrator
  __init__.py
  backend_parser.py
  frontend_parser.py
  comparator.py
  engine.py
backend/                     # Python backend that serves the web UI and API
  app.py
  routes.py
  requirements.txt
  templates/
    index.html               # Backend-served template / UI shell
Code2Create Web Application/ # Frontend app (Vite + React + TypeScript)
  package.json
  tsconfig.json
  vite.config.ts
  src/
    App.tsx
    main.tsx
sample_project/              # Minimal example frontend + backend to demo analyses
  backend/
    api.py
  frontend/
```

How it fits together:
- The analysis_engine contains parsers for frontend and backend code that extract symbols/fields and a comparator that finds mismatches and likely-breaking changes.
- The backend provides an API and serves the UI (templates/index.html) so you can upload or point to code, run analysis, and view results.
- The "Code2Create Web Application" directory is the React + Vite frontend used as the interactive UI. The sample_project folder contains a tiny backend and frontend to demonstrate or reproduce contract mismatches.
- run_integrated.py and test_engine.py are convenience scripts to run an end-to-end analysis or exercise the engine locally.

## How to run (quickstart)
Backend (Python)
```bash
# from repository root
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

# option A: run Flask-style (if app.py exposes app)
export FLASK_APP=backend.app
export FLASK_ENV=development
flask run

# option B: run directly if app.py has a main runner
python backend/app.py
```

Frontend (Vite + React)
```bash
cd "Code2Create Web Application"
# use npm, yarn, or pnpm depending on your preference
npm install
npm run dev
# By default Vite serves on http://localhost:5173 (or a different port shown in the terminal)
```

Integrated / analysis scripts
```bash
# run the integrated orchestration (may call backend analysis functions)
python run_integrated.py

# run the test harness for the engine
python test_engine.py
```

Notes and configuration
- The frontend will need the backend API URL to be configured (commonly via an environment variable or a file the frontend reads at build/runtime). Check App.tsx and any environment usage in `Code2Create Web Application` for the expected variable (e.g., REACT_APP_API_URL or VITE_API_URL).
- If the backend serves the frontend (templates/index.html), ensure the backend is running before opening the served URL.
- If you run into missing dependencies, open `backend/requirements.txt` and `Code2Create Web Application/package.json` for exact packages.

## Files to inspect first
- analysis_engine/engine.py — main orchestrator for parsing + comparing
- analysis_engine/comparator.py — heuristics and matching rules used to detect breaking changes
- backend/routes.py and backend/app.py — API endpoints and how uploads/analyses are triggered
- Code2Create Web Application/src/App.tsx — frontend integration and API calls
- run_integrated.py — example of running an end-to-end analysis

## Contributing
- Add tests for new comparator heuristics under additions to `test_engine.py`.
- If you change the frontend contract, add or update a sample in `sample_project/` to exercise the new case.

## Try asking
- How does the comparator decide when a field rename (e.g., `user_id` -> `userId`) is a breaking change? (see analysis_engine/comparator.py)
- What API endpoints does the frontend call in `Code2Create Web Application/src/App.tsx` and what request payloads do they expect? (see backend/routes.py and App.tsx)
- Does run_integrated.py require external services or credentials, or can it run entirely locally with the sample_project?
