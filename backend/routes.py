"""
routes.py — API route definitions for Code2Create 2026 backend.

Endpoints:
  GET  /api/health              → confirms the server is running
  GET  /api/sample              → returns info about the bundled sample project
  POST /api/analyze             → runs analysis on a given project path (or sample project)
  POST /api/upload-and-analyze  → accepts a ZIP archive of a project and runs analysis
"""

import sys
import os
import zipfile
import tempfile
import shutil
from flask import request, jsonify

# Add the project root to the path so we can import analysis_engine
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SAMPLE_PROJECT_PATH = os.path.join(PROJECT_ROOT, "sample_project")

sys.path.insert(0, PROJECT_ROOT)

from analysis_engine.engine import run_analysis


def _resolve_project_path(raw_path):
    """
    Resolves a raw path to an absolute path.
    If empty or 'sample' / 'sample_project', points to the bundled sample project.
    Otherwise checks relative to current directory and PROJECT_ROOT.
    """
    if not raw_path or raw_path.strip().lower() in ("", "sample", "sample_project"):
        return SAMPLE_PROJECT_PATH

    # If already absolute and exists
    if os.path.isabs(raw_path) and os.path.isdir(raw_path):
        return raw_path

    # Try relative to repo root
    from_root = os.path.abspath(os.path.join(PROJECT_ROOT, raw_path))
    if os.path.isdir(from_root):
        return from_root

    # Try relative to cwd
    from_cwd = os.path.abspath(raw_path)
    if os.path.isdir(from_cwd):
        return from_cwd

    return None


def register_routes(app):
    """Register all routes on the given Flask app."""

    @app.route("/api/health", methods=["GET"])
    def health():
        """Simple health check — confirms the backend is running."""
        return jsonify({
            "status": "ok",
            "message": "Analysis engine is running.",
            "sample_project_available": os.path.isdir(SAMPLE_PROJECT_PATH)
        })

    @app.route("/api/sample", methods=["GET"])
    def get_sample_info():
        """Returns details about the bundled sample project."""
        return jsonify({
            "name": "sample_project",
            "path": SAMPLE_PROJECT_PATH,
            "has_backend": os.path.isdir(os.path.join(SAMPLE_PROJECT_PATH, "backend")),
            "has_frontend": os.path.isdir(os.path.join(SAMPLE_PROJECT_PATH, "frontend"))
        })

    @app.route("/api/analyze", methods=["POST"])
    def analyze():
        """
        Accepts a project path (or empty for sample project), runs the analysis engine, returns results.

        Request body:
            { "project_path": "/path/to/project" }   # optional, defaults to sample_project
        """
        data = request.get_json(silent=True) or {}
        raw_path = data.get("project_path", "")

        resolved_path = _resolve_project_path(raw_path)

        if not resolved_path or not os.path.isdir(resolved_path):
            return jsonify({
                "error": f"Project path does not exist or is not a directory: '{raw_path}'"
            }), 400

        try:
            result = run_analysis(resolved_path)
            result["project_path"] = resolved_path
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": f"Analysis failed: {str(e)}"}), 500

    @app.route("/api/upload-and-analyze", methods=["POST"])
    def upload_and_analyze():
        """
        Accepts a ZIP file containing a project with /backend and /frontend directories,
        extracts to a temporary directory, executes analysis, and cleans up.
        """
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded. Expected multipart form field 'file'."}), 400

        file = request.files["file"]
        if not file.filename or not file.filename.lower().endswith(".zip"):
            return jsonify({"error": "Only .zip files are supported."}), 400

        temp_dir = tempfile.mkdtemp(prefix="c2c_analysis_")
        try:
            zip_path = os.path.join(temp_dir, "uploaded.zip")
            file.save(zip_path)

            extract_dir = os.path.join(temp_dir, "extracted")
            os.makedirs(extract_dir, exist_ok=True)

            with zipfile.ZipFile(zip_path, "r") as z:
                z.extractall(extract_dir)

            # Determine project root inside the zip (might be at extracted root or inside a single subdirectory)
            project_dir = extract_dir
            subitems = os.listdir(extract_dir)
            if len(subitems) == 1 and os.path.isdir(os.path.join(extract_dir, subitems[0])):
                project_dir = os.path.join(extract_dir, subitems[0])

            result = run_analysis(project_dir)
            result["project_name"] = file.filename
            return jsonify(result)

        except Exception as e:
            return jsonify({"error": f"Failed to analyze uploaded archive: {str(e)}"}), 500
        finally:
            # Clean up temporary directory
            shutil.rmtree(temp_dir, ignore_errors=True)
