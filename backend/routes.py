"""
routes.py — API route definitions for Code2Create 2026 backend.

Endpoints:
  GET  /api/health   → confirms the server is running
  POST /api/analyze  → runs analysis on a given project path

Input (for /api/analyze):
  JSON body: { "project_path": "/path/to/project" }

Output (for /api/analyze):
  See API contract in implementation_plan.md
"""

import sys
import os
from flask import request, jsonify

# Add the project root to the path so we can import analysis_engine
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from analysis_engine.engine import run_analysis


def register_routes(app):
    """Register all routes on the given Flask app."""

    @app.route("/api/health", methods=["GET"])
    def health():
        """Simple health check — confirms the backend is running."""
        return jsonify({"status": "ok", "message": "Analysis engine is running."})

    @app.route("/api/analyze", methods=["POST"])
    def analyze():
        """
        Accepts a project path, runs the analysis engine, returns results.

        Request body:
            { "project_path": "/absolute/or/relative/path/to/project" }

        Response:
            See API contract in implementation_plan.md
        """
        data = request.get_json()

        if not data or "project_path" not in data:
            return jsonify({
                "error": "Missing required field: project_path"
            }), 400

        project_path = data["project_path"]

        if not os.path.isdir(project_path):
            return jsonify({
                "error": f"Project path does not exist or is not a directory: {project_path}"
            }), 400

        result = run_analysis(project_path)
        return jsonify(result)
