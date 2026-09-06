"""
comparator.py — Compares backend API fields with frontend data usage.

Given:
  - backend_fields: list of field names the backend provides (e.g. ["userId", "name"])
  - frontend_fields: list of field names the frontend accesses (e.g. ["user_id", "name"])

Produces a comparison result for each field, classifying it as one of:

  MATCH              — same name exists on both sides
  MISSING_IN_BACKEND — frontend uses it, backend doesn't provide it
  MISSING_IN_FRONTEND — backend provides it, frontend never uses it
  POSSIBLE_MISMATCH  — names are different but look like the same thing
                       (e.g. camelCase vs snake_case)

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


def compare_fields(backend_fields, frontend_fields):
    """
    Compare backend and frontend field lists and produce a structured result.

    Parameters:
        backend_fields  (list of str): Fields provided by the backend
        frontend_fields (list of str): Fields accessed by the frontend

    Returns:
        List of comparison result dicts, each with:
        {
            "backend_field": str or None,
            "frontend_field": str or None,
            "status": "match" | "missing_in_backend" | "missing_in_frontend" | "possible_mismatch",
            "message": str
        }
    """
    results = []

    backend_set = set(backend_fields)
    frontend_set = set(frontend_fields)

    # Build normalization maps: normalized_name → original_name
    backend_norm = {_normalize(f): f for f in backend_fields}
    frontend_norm = {_normalize(f): f for f in frontend_fields}

    processed_backend = set()
    processed_frontend = set()

    # Check every backend field against every frontend field
    for b_field in backend_fields:
        if b_field in frontend_set:
            # Exact match
            results.append({
                "backend_field": b_field,
                "frontend_field": b_field,
                "status": "match",
                "message": f"Fields match: '{b_field}'"
            })
            processed_backend.add(b_field)
            processed_frontend.add(b_field)

        else:
            # Check for possible mismatch (same normalized form)
            b_norm = _normalize(b_field)
            if b_norm in frontend_norm:
                f_field = frontend_norm[b_norm]
                results.append({
                    "backend_field": b_field,
                    "frontend_field": f_field,
                    "status": "possible_mismatch",
                    "message": (
                        f"Possible naming mismatch: "
                        f"backend uses '{b_field}', frontend uses '{f_field}'"
                    )
                })
                processed_backend.add(b_field)
                processed_frontend.add(f_field)

    # Backend fields with no frontend match at all
    for b_field in backend_fields:
        if b_field not in processed_backend:
            results.append({
                "backend_field": b_field,
                "frontend_field": None,
                "status": "missing_in_frontend",
                "message": f"Backend provides '{b_field}' but frontend never uses it"
            })
            processed_backend.add(b_field)

    # Frontend fields with no backend match at all
    for f_field in frontend_fields:
        if f_field not in processed_frontend:
            results.append({
                "backend_field": None,
                "frontend_field": f_field,
                "status": "missing_in_backend",
                "message": f"Frontend uses '{f_field}' but backend never provides it"
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
