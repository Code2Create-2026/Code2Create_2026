"""
test_engine.py — Simple test script for the analysis engine.

Runs the engine against the sample_project and verifies the results
match what we expect.

No test framework required — just plain Python assert statements.
Run from the project root:

    python test_engine.py
"""

import os
import sys

# Fix Unicode output on Windows terminals
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

# Make sure the project root is on the Python path
sys.path.insert(0, os.path.dirname(__file__))

from analysis_engine.engine import run_analysis

# Path to the sample project (relative to this file)
SAMPLE_PROJECT_PATH = os.path.join(os.path.dirname(__file__), "sample_project")


def test_analysis_engine():
    print("=" * 60)
    print("Running analysis engine test against sample_project...")
    print("=" * 60)

    result = run_analysis(SAMPLE_PROJECT_PATH)

    print("\n" + "=" * 60)
    print("RAW RESULT:")
    import json
    print(json.dumps(result, indent=2))
    print("=" * 60)

    # --- Assertions ---

    # 1. Overall status should be "warning" (we have a mismatch)
    assert result["status"] == "warning", (
        f"Expected status 'warning', got '{result['status']}'"
    )
    print("\n✓ Overall status is 'warning'")

    # 2. Should have found at least one endpoint
    assert len(result["endpoints"]) >= 1, "Expected at least one endpoint"
    print(f"✓ Found {len(result['endpoints'])} endpoint(s)")

    # 3. Find the /api/user endpoint result
    user_endpoint = next(
        (e for e in result["endpoints"] if e["endpoint"] == "/api/user"),
        None
    )
    assert user_endpoint is not None, "Expected /api/user endpoint in results"
    print("✓ Found /api/user endpoint in results")

    # 4. Backend should have found the correct fields
    assert "userId" in user_endpoint["backend_fields"], (
        f"Expected 'userId' in backend_fields, got: {user_endpoint['backend_fields']}"
    )
    assert "name" in user_endpoint["backend_fields"], (
        f"Expected 'name' in backend_fields, got: {user_endpoint['backend_fields']}"
    )
    assert "email" in user_endpoint["backend_fields"], (
        f"Expected 'email' in backend_fields, got: {user_endpoint['backend_fields']}"
    )
    print(f"✓ Backend fields correctly identified: {user_endpoint['backend_fields']}")

    # 5. Frontend should have found the correct fields
    assert "user_id" in user_endpoint["frontend_fields"], (
        f"Expected 'user_id' in frontend_fields, got: {user_endpoint['frontend_fields']}"
    )
    assert "name" in user_endpoint["frontend_fields"], (
        f"Expected 'name' in frontend_fields, got: {user_endpoint['frontend_fields']}"
    )
    assert "email" in user_endpoint["frontend_fields"], (
        f"Expected 'email' in frontend_fields, got: {user_endpoint['frontend_fields']}"
    )
    print(f"✓ Frontend fields correctly identified: {user_endpoint['frontend_fields']}")

    # 6. Should detect userId vs user_id as a possible_mismatch
    mismatch_results = [
        r for r in user_endpoint["results"]
        if r["status"] == "possible_mismatch"
    ]
    assert len(mismatch_results) >= 1, (
        f"Expected at least one possible_mismatch, got: {user_endpoint['results']}"
    )
    mismatch = mismatch_results[0]
    assert mismatch["backend_field"] == "userId", (
        f"Expected backend_field='userId', got '{mismatch['backend_field']}'"
    )
    assert mismatch["frontend_field"] == "user_id", (
        f"Expected frontend_field='user_id', got '{mismatch['frontend_field']}'"
    )
    print(f"✓ Detected possible_mismatch: 'userId' (backend) vs 'user_id' (frontend)")

    # 7. name and email should be matches
    match_results = [
        r for r in user_endpoint["results"]
        if r["status"] == "match"
    ]
    match_fields = [r["backend_field"] for r in match_results]
    assert "name" in match_fields, f"Expected 'name' to be a match, got: {match_results}"
    assert "email" in match_fields, f"Expected 'email' to be a match, got: {match_results}"
    print(f"✓ 'name' and 'email' correctly identified as matches")

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED ✓")
    print("=" * 60)


if __name__ == "__main__":
    test_analysis_engine()
