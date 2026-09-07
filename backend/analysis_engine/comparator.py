"""
comparator.py — Endpoint-aware comparison of backend API fields with frontend data usage.

Phase 4 upgrade: The comparator now accepts file-centric frontend records and
produces endpoint-aware results with confidence levels.

Given:
  - backend_endpoint: the backend route string (e.g. "/api/user")
  - backend_fields: list of field dicts the backend provides
  - frontend_files: list of file-centric records from the frontend parser

Produces a comparison result for each field relationship, classifying it as:

  MATCH              — same name exists on both sides
  MISSING_IN_BACKEND — frontend uses it, backend doesn't provide it
  MISSING_IN_FRONTEND — backend provides it, frontend never uses it
  POSSIBLE_MISMATCH  — names are different but look like the same thing
                       (e.g. camelCase vs snake_case)

Each result also carries a confidence level:

  confirmed  — the frontend file explicitly contains the exact backend endpoint string
  uncertain  — the frontend file has no explicit endpoint evidence for this backend endpoint

How POSSIBLE_MISMATCH works:
  We normalize both field names to lowercase with no separators.
  If two fields normalize to the same string, they are likely the same
  field written in different conventions.

  Example:
    "userId"  → "userid"
    "user_id" → "userid"
  These normalize to the same string → POSSIBLE_MISMATCH
"""


def _normalize(field_name):
    """
    Normalize a field name for fuzzy comparison.
    Converts to lowercase and removes underscores.

    Examples:
      "userId"  → "userid"
      "user_id" → "userid"
      "UserID"  → "userid"
    """
    return field_name.lower().replace("_", "")


def _classify_confidence(backend_endpoint, frontend_file):
    """
    Determine the confidence level for associating a frontend file
    with a specific backend endpoint.

    Returns:
        "confirmed"  — the file explicitly references the backend endpoint
        "uncertain"  — no explicit endpoint evidence for this backend endpoint
    """
    if backend_endpoint in frontend_file.get("explicit_endpoints", []):
        return "confirmed"
    return "uncertain"


def compare_fields(backend_endpoint, backend_fields, frontend_files):
    """
    Compare backend fields for a specific endpoint against file-centric
    frontend records, producing endpoint-aware results with confidence.

    Parameters:
        backend_endpoint (str): The backend route string, e.g. "/api/user"
        backend_fields   (list of dict): Fields provided by the backend endpoint
        frontend_files   (list of dict): File-centric frontend records from parser

    Returns:
        List of comparison result dicts with confidence levels.
    """
    results = []

    # Build a unified map of frontend fields across all files,
    # preserving file context but deduplicating by (name, file)
    frontend_map = {}     # exact name → list of (field_with_file, confidence)
    frontend_norm = {}    # normalized name → list of (field_with_file, confidence)
    seen_field_file = set()  # track (name, file) pairs to avoid duplicates

    for file_record in frontend_files:
        filepath = file_record["file"]
        confidence = _classify_confidence(backend_endpoint, file_record)

        for field in file_record["fields"]:
            name = field["name"]
            dedup_key = (name, filepath)

            # Skip if we've already seen this field in this file
            if dedup_key in seen_field_file:
                continue
            seen_field_file.add(dedup_key)

            enriched_field = {
                "name": name,
                "file": filepath,
                "line": field["line"]
            }

            norm = _normalize(name)

            if name not in frontend_map:
                frontend_map[name] = []
            frontend_map[name].append((enriched_field, confidence))

            if norm not in frontend_norm:
                frontend_norm[norm] = []
            frontend_norm[norm].append((enriched_field, confidence))

    processed_backend = set()
    processed_frontend = set()

    def get_f_key(f):
        return (f["name"], f.get("file", ""), f.get("line", 0))

    # Check every backend field against frontend fields
    for b_field in backend_fields:
        b_name = b_field["name"]

        if b_name in frontend_map:
            # Exact match - could be multiple frontend locations
            for f_field, confidence in frontend_map[b_name]:
                results.append({
                    "backend_field": b_field,
                    "frontend_field": f_field,
                    "status": "match",
                    "confidence": confidence,
                    "message": f"Fields match: '{b_name}'"
                })
                processed_frontend.add(get_f_key(f_field))
            processed_backend.add(b_name)

        else:
            # Check for possible mismatch (same normalized form)
            b_norm = _normalize(b_name)
            if b_norm in frontend_norm:
                for f_field, confidence in frontend_norm[b_norm]:
                    results.append({
                        "backend_field": b_field,
                        "frontend_field": f_field,
                        "status": "possible_mismatch",
                        "confidence": confidence,
                        "message": (
                            f"Possible naming mismatch: "
                            f"backend uses '{b_name}', frontend uses '{f_field['name']}'"
                        )
                    })
                    processed_frontend.add(get_f_key(f_field))
                processed_backend.add(b_name)

    # Backend fields with no frontend match at all
    for b_field in backend_fields:
        b_name = b_field["name"]
        if b_name not in processed_backend:
            results.append({
                "backend_field": b_field,
                "frontend_field": None,
                "status": "missing_in_frontend",
                "confidence": "uncertain",
                "message": f"Backend provides '{b_name}' but frontend never uses it"
            })
            processed_backend.add(b_name)

    # Frontend fields with no backend match at all — only from files
    # that are associated with this endpoint (confirmed files)
    seen_missing = set()  # deduplicate by (name, file)
    for file_record in frontend_files:
        filepath = file_record["file"]
        confidence = _classify_confidence(backend_endpoint, file_record)

        # Only report missing_in_backend for confirmed files to avoid
        # noise from unrelated files
        if confidence != "confirmed":
            continue

        for field in file_record["fields"]:
            name = field["name"]
            dedup_key = (name, filepath)

            # Skip if already seen this (name, file) pair
            if dedup_key in seen_missing:
                continue
            seen_missing.add(dedup_key)

            enriched_field = {
                "name": name,
                "file": filepath,
                "line": field["line"]
            }
            if get_f_key(enriched_field) not in processed_frontend:
                results.append({
                    "backend_field": None,
                    "frontend_field": enriched_field,
                    "status": "missing_in_backend",
                    "confidence": confidence,
                    "message": f"Frontend uses '{name}' but backend never provides it"
                })

    return results


def summarize(comparison_results):
    """
    Given a list of comparison results, return a summary dict.

    Returns:
        {
            "total": int,
            "matches": int,
            "possible_mismatches": int,
            "missing_in_backend": int,
            "missing_in_frontend": int,
            "has_issues": bool
        }
    """
    total = len(comparison_results)
    matches = sum(1 for r in comparison_results if r["status"] == "match")
    possible_mismatches = sum(1 for r in comparison_results if r["status"] == "possible_mismatch")
    missing_in_backend = sum(1 for r in comparison_results if r["status"] == "missing_in_backend")
    missing_in_frontend = sum(1 for r in comparison_results if r["status"] == "missing_in_frontend")

    has_issues = (possible_mismatches + missing_in_backend) > 0

    return {
        "total": total,
        "matches": matches,
        "possible_mismatches": possible_mismatches,
        "missing_in_backend": missing_in_backend,
        "missing_in_frontend": missing_in_frontend,
        "has_issues": has_issues
    }
