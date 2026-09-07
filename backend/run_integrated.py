"""
run_integrated.py — Integration Runner for Code2Create 2026.

This script verifies the full-stack integration between:
  1. Python Flask Analysis Engine API (Mithul_Backend)
  2. React + Vite Frontend (rohith-frontend)

Usage:
  py run_integrated.py --test     # Runs test_engine.py against sample_project
  py run_integrated.py --server   # Starts Flask backend server at http://localhost:5000
  py run_integrated.py            # Runs verification and starts server
"""

import os
import sys
import argparse

# Fix Unicode output on Windows terminals
if hasattr(sys.stdout, "reconfigure") and sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, PROJECT_ROOT)


def verify_dependencies():
    print("[1/3] Checking dependencies...")
    missing = []
    for pkg in ["flask", "flask_cors"]:
        try:
            __import__(pkg)
        except ImportError:
            missing.append(pkg)

    if missing:
        print(f"  [!] Missing required Python packages: {missing}")
        print("  [!] Run: py -m pip install flask flask-cors")
        return False
    print("  [OK] Flask and Flask-CORS are installed.")
    return True


def run_tests():
    print("\n[2/3] Running AST Analysis Engine verification...")
    from test_engine import test_analysis_engine
    try:
        test_analysis_engine()
        print("  [OK] All analysis engine assertions passed successfully.")
        return True
    except Exception as e:
        print(f"  [X] Test verification failed: {e}")
        return False


def start_backend():
    print("\n[3/3] Starting Code2Create Analysis Engine Server...")
    print("  API Base: http://localhost:5000")
    print("  Health:   http://localhost:5000/api/health")
    print("  Analyze:  http://localhost:5000/api/analyze")
    print("\nTo start the frontend:")
    print("  cd \"Code2Create Web Application\"")
    print("  pnpm run dev  (or npm run dev)")
    print("=" * 60)

    backend_dir = os.path.join(PROJECT_ROOT, "backend")
    sys.path.insert(0, backend_dir)
    from app import app
    app.run(debug=True, port=5000)


def main():
    parser = argparse.ArgumentParser(description="Code2Create Integration Runner")
    parser.add_argument("--test", action="store_true", help="Run tests only")
    parser.add_argument("--server", action="store_true", help="Start backend server only")
    args = parser.parse_args()

    if not verify_dependencies():
        sys.exit(1)

    if args.test:
        success = run_tests()
        sys.exit(0 if success else 1)

    if args.server:
        start_backend()
        return

    # Default: Run tests then start server
    if run_tests():
        start_backend()


if __name__ == "__main__":
    main()
