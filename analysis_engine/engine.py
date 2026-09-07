"""
engine.py — Orchestrator for the Code2Create 2026 analysis engine.

This is the main entry point for running an analysis.
It ties together the backend parser, frontend parser, and comparator.

Usage:
    from analysis_engine.engine import run_analysis

    result = run_analysis("/path/to/project")

The project folder must have this structure:
    /project
        /backend    ← Python API code
        /frontend   ← React/JS code

Output structure (the API contract):
    {
        "status": "ok" | "warning" | "error",
        "summary": {
            "total": int,
            "matches": int,
            "possible_mismatches": int,
            "missing_in_backend": int,
            "missing_in_frontend": int,
            "has_issues": bool
        },
        "endpoints": [
            {
                "endpoint": "/api/user",
                "backend_fields": [{"name": "userId", "file": "backend/api.py", "line": 10}],
                "frontend_fields": [{"name": "user_id", "file": "frontend/App.jsx", "line": 25}],
                "results": [
                    {
                        "backend_field": {"name": "userId", "file": "backend/api.py", "line": 10},
                        "frontend_field": {"name": "user_id", "file": "frontend/App.jsx", "line": 25},
                        "status": "possible_mismatch",
                        "confidence": "confirmed",
                        "message": "..."
                    },
                    ...
                ]
            }
        ]
    }
"""

import os
from analysis_engine.backend_parser import parse_backend
from analysis_engine.frontend_parser import parse_frontend
from analysis_engine.comparator import compare_fields, summarize


def _flatten_frontend_fields(frontend_files):
    """
    Convert file-centric frontend records back into a flat list of field dicts
    for backward compatibility with the frontend_fields key in the API response.

    Each field dict contains: name, file, line.
    """
    flat = []
    for file_record in frontend_files:
        filepath = file_record["file"]
        for field in file_record["fields"]:
            flat.append({
                "name": field["name"],
                "file": filepath,
                "line": field["line"]
            })
    return flat


def run_analysis(project_path):
    """
    Run the full analysis pipeline on a project directory.

    Parameters:
        project_path (str): Absolute or relative path to the project folder.
                            Must contain /backend and /frontend subdirectories.

    Returns:
        dict: Structured analysis result (see module docstring for shape).
    """
    backend_dir = os.path.join(project_path, "backend")
    frontend_dir = os.path.join(project_path, "frontend")

    print(f"\n[engine] Starting analysis of: {project_path}")
    print(f"[engine] Backend directory: {backend_dir}")
    print(f"[engine] Frontend directory: {frontend_dir}")

    # Step 1 — Parse the backend to find all API endpoints and their fields
    print("\n[engine] Step 1: Parsing backend...")
    backend_endpoints = parse_backend(backend_dir)
    print(f"[engine] Found {len(backend_endpoints)} endpoint(s) in backend.")

    # Step 2 — Parse the frontend to find all data fields accessed (file-centric)
    print("\n[engine] Step 2: Parsing frontend...")
    frontend_files = parse_frontend(frontend_dir)
    total_fields = sum(len(fr["fields"]) for fr in frontend_files)
    print(f"[engine] Found {len(frontend_files)} frontend file(s) with {total_fields} field usage(s).")

    # Step 3 — Compare each endpoint's fields against frontend files (endpoint-aware)
    print("\n[engine] Step 3: Comparing backend fields with frontend fields...")
    endpoint_results = []
    all_comparison_results = []

    # Flatten frontend fields once for backward-compatible API response
    flat_frontend_fields = _flatten_frontend_fields(frontend_files)

    for endpoint_info in backend_endpoints:
        endpoint = endpoint_info["endpoint"]
        b_fields = endpoint_info["fields"]

        comparison = compare_fields(endpoint, b_fields, frontend_files)
        all_comparison_results.extend(comparison)

        endpoint_results.append({
            "endpoint": endpoint,
            "backend_fields": b_fields,
            "frontend_fields": flat_frontend_fields,
            "results": comparison
        })

    # Step 4 — Build summary and overall status
    summary = summarize(all_comparison_results)
    overall_status = "warning" if summary["has_issues"] else "ok"

    print(f"\n[engine] Analysis complete. Status: {overall_status}")

    return {
        "status": overall_status,
        "summary": summary,
        "endpoints": endpoint_results
    }
