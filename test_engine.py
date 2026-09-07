"""
test_engine.py — Test script for the Code2Create 2026 analysis engine.

Runs the engine against the sample_project and verifies the results
match what we expect.

No test framework required — just plain Python assert statements.
Run from the project root:

    python test_engine.py
"""

import os
import sys
import json
import shutil

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
    b_names = [f["name"] for f in user_endpoint["backend_fields"]]
    assert "userId" in b_names, f"Expected 'userId' in backend_fields, got: {b_names}"
    assert "name" in b_names, f"Expected 'name' in backend_fields, got: {b_names}"
    assert "email" in b_names, f"Expected 'email' in backend_fields, got: {b_names}"
    print(f"✓ Backend fields correctly identified: {b_names}")

    # Add tests for source locations
    b_field_obj = next(f for f in user_endpoint["backend_fields"] if f["name"] == "userId")
    assert "file" in b_field_obj and b_field_obj["file"], "Backend field missing file info"
    assert "line" in b_field_obj and b_field_obj["line"] > 0, "Backend field missing line info"
    print(f"✓ Backend field source info preserved: {b_field_obj['file']}:{b_field_obj['line']}")

    # 5. Frontend should have found the correct fields (from flat list)
    f_names = [f["name"] for f in user_endpoint["frontend_fields"]]
    assert "user_id" in f_names, f"Expected 'user_id' in frontend_fields, got: {f_names}"
    assert "name" in f_names, f"Expected 'name' in frontend_fields, got: {f_names}"
    assert "email" in f_names, f"Expected 'email' in frontend_fields, got: {f_names}"
    print(f"✓ Frontend fields correctly identified: {f_names}")

    f_field_obj = next(f for f in user_endpoint["frontend_fields"] if f["name"] == "user_id")
    assert "file" in f_field_obj and f_field_obj["file"], "Frontend field missing file info"
    assert "line" in f_field_obj and f_field_obj["line"] > 0, "Frontend field missing line info"
    print(f"✓ Frontend field source info preserved: {f_field_obj['file']}:{f_field_obj['line']}")

    # 6. Should detect userId vs user_id as a possible_mismatch
    mismatch_results = [
        r for r in user_endpoint["results"]
        if r["status"] == "possible_mismatch"
    ]
    assert len(mismatch_results) >= 1, (
        f"Expected at least one possible_mismatch, got: {user_endpoint['results']}"
    )
    mismatch = mismatch_results[0]
    assert mismatch["backend_field"]["name"] == "userId", (
        f"Expected backend_field='userId', got '{mismatch['backend_field']}'"
    )
    assert mismatch["frontend_field"]["name"] == "user_id", (
        f"Expected frontend_field='user_id', got '{mismatch['frontend_field']}'"
    )
    assert "file" in mismatch["backend_field"]
    assert "file" in mismatch["frontend_field"]
    print(f"✓ Detected possible_mismatch preserving BOTH source locations")

    # 7. The mismatch should have confidence = "confirmed" because App.jsx has fetch("/api/user")
    assert mismatch.get("confidence") == "confirmed", (
        f"Expected confidence='confirmed' for /api/user mismatch in App.jsx, got '{mismatch.get('confidence')}'"
    )
    print(f"✓ Mismatch has confidence='confirmed' (App.jsx explicitly fetches /api/user)")

    # 8. name and email should be matches
    match_results = [
        r for r in user_endpoint["results"]
        if r["status"] == "match"
    ]
    match_fields = [r["backend_field"]["name"] for r in match_results]
    assert "name" in match_fields, f"Expected 'name' to be a match, got: {match_results}"
    assert "email" in match_fields, f"Expected 'email' to be a match, got: {match_results}"
    print(f"✓ 'name' and 'email' correctly identified as matches")

    # 9. Matches should also carry confidence
    name_match = next(r for r in match_results if r["backend_field"]["name"] == "name")
    assert "confidence" in name_match, "Match result missing confidence field"
    print(f"✓ Match results carry confidence level: '{name_match['confidence']}'")


def test_large_project():
    print("\n" + "=" * 60)
    print("Running analysis engine test against sample_project_large...")
    print("=" * 60)

    large_project_path = os.path.join(os.path.dirname(__file__), "sample_project_large")

    # Run analysis on the large project
    result = run_analysis(large_project_path)

    # 1. Ignored directories shouldn't be analyzed
    all_frontend_names = set()
    all_backend_names = set()
    for e in result["endpoints"]:
        for r in e.get("results", []):
            if r.get("frontend_field"):
                all_frontend_names.add(r["frontend_field"]["name"])
            if r.get("backend_field"):
                all_backend_names.add(r["backend_field"]["name"])

    assert "ignored_field" not in all_frontend_names, "Parsed node_modules"
    assert "ignored_minified_field" not in all_frontend_names, "Parsed minified file"
    assert "ignored_backend_field" not in all_backend_names, "Parsed venv"

    # 2. Syntax errors shouldn't crash
    assert len(result["endpoints"]) >= 99, f"Expected 99 valid endpoints, got {len(result['endpoints'])}"

    # 3. All results should have confidence field
    for e in result["endpoints"]:
        for r in e.get("results", []):
            assert "confidence" in r, f"Result missing confidence field: {r}"

    print("✓ Ignored directories correctly skipped")
    print("✓ Syntax errors isolated without crashing")
    print("✓ All results carry confidence levels")
    print("✓ Large project parsed successfully")


def test_endpoint_isolation():
    """
    Phase 4 Test A/F: Verify endpoint isolation.

    Backend:
        /api/users -> userId
        /api/posts -> title

    Frontend:
        User.jsx -> fetch("/api/users") -> data.user_id
        Post.jsx -> fetch("/api/posts") -> data.title
    """
    print("\n" + "=" * 60)
    print("Running Phase 4 endpoint isolation test...")
    print("=" * 60)

    test_dir = os.path.join(os.path.dirname(__file__), "_test_phase4_isolation")
    try:
        # Create test project
        os.makedirs(os.path.join(test_dir, "backend"), exist_ok=True)
        os.makedirs(os.path.join(test_dir, "frontend"), exist_ok=True)

        with open(os.path.join(test_dir, "backend", "api.py"), "w", encoding="utf-8") as f:
            f.write('''
from flask import Flask
app = Flask(__name__)

@app.route("/api/users")
def get_users():
    return {"userId": 1, "name": "Alice"}

@app.route("/api/posts")
def get_posts():
    return {"title": "Hello", "body": "World"}
''')

        with open(os.path.join(test_dir, "frontend", "User.jsx"), "w", encoding="utf-8") as f:
            f.write('''
import React from "react";
function UserProfile() {
    fetch("/api/users")
        .then(res => res.json())
        .then(data => {
            console.log(data.user_id);
            console.log(data.name);
        });
}
''')

        with open(os.path.join(test_dir, "frontend", "Post.jsx"), "w", encoding="utf-8") as f:
            f.write('''
import React from "react";
function PostList() {
    fetch("/api/posts")
        .then(res => res.json())
        .then(data => {
            console.log(data.title);
            console.log(data.body);
        });
}
''')

        result = run_analysis(test_dir)

        # Find the /api/users endpoint
        users_ep = next((e for e in result["endpoints"] if e["endpoint"] == "/api/users"), None)
        assert users_ep is not None, "Expected /api/users endpoint"

        # Find the /api/posts endpoint
        posts_ep = next((e for e in result["endpoints"] if e["endpoint"] == "/api/posts"), None)
        assert posts_ep is not None, "Expected /api/posts endpoint"

        # A. /api/users should have confirmed results for User.jsx
        users_confirmed = [r for r in users_ep["results"] if r["confidence"] == "confirmed"]
        users_confirmed_files = set(r["frontend_field"]["file"] for r in users_confirmed if r["frontend_field"])
        # User.jsx should be confirmed for /api/users
        assert any("User.jsx" in f for f in users_confirmed_files), (
            f"Expected User.jsx to be confirmed for /api/users, got files: {users_confirmed_files}"
        )
        # Post.jsx should NOT be confirmed for /api/users
        assert not any("Post.jsx" in f for f in users_confirmed_files), (
            f"Post.jsx should NOT be confirmed for /api/users, got files: {users_confirmed_files}"
        )
        print("✓ User.jsx is confirmed for /api/users, Post.jsx is not")

        # B. /api/posts should have confirmed results for Post.jsx
        posts_confirmed = [r for r in posts_ep["results"] if r["confidence"] == "confirmed"]
        posts_confirmed_files = set(r["frontend_field"]["file"] for r in posts_confirmed if r["frontend_field"])
        assert any("Post.jsx" in f for f in posts_confirmed_files), (
            f"Expected Post.jsx to be confirmed for /api/posts, got files: {posts_confirmed_files}"
        )
        assert not any("User.jsx" in f for f in posts_confirmed_files), (
            f"User.jsx should NOT be confirmed for /api/posts, got files: {posts_confirmed_files}"
        )
        print("✓ Post.jsx is confirmed for /api/posts, User.jsx is not")

        # C. Verify the mismatch: userId vs user_id should be possible_mismatch + confirmed
        users_mismatches = [r for r in users_ep["results"]
                           if r["status"] == "possible_mismatch" and r["confidence"] == "confirmed"]
        assert len(users_mismatches) >= 1, (
            f"Expected confirmed possible_mismatch for userId/user_id"
        )
        mismatch = users_mismatches[0]
        assert mismatch["backend_field"]["name"] == "userId"
        assert mismatch["frontend_field"]["name"] == "user_id"
        print("✓ userId vs user_id detected as possible_mismatch with confidence=confirmed")

        # D. title should be a confirmed match under /api/posts, not /api/users
        posts_title_results = [r for r in posts_ep["results"]
                               if r["status"] == "match"
                               and r["confidence"] == "confirmed"
                               and r.get("backend_field", {}).get("name") == "title"]
        assert len(posts_title_results) >= 1, "Expected title to be a confirmed match for /api/posts"

        users_title_confirmed = [r for r in users_ep["results"]
                                 if r["confidence"] == "confirmed"
                                 and r.get("frontend_field")
                                 and r["frontend_field"].get("name") == "title"]
        assert len(users_title_confirmed) == 0, (
            "title should NOT be a confirmed dependency of /api/users"
        )
        print("✓ title is confirmed under /api/posts, not under /api/users")

        print("✓ Endpoint isolation test PASSED")

    finally:
        shutil.rmtree(test_dir, ignore_errors=True)


def test_dynamic_api_call():
    """
    Phase 4 Test C/E: Dynamic API calls should be uncertain, not confirmed.
    """
    print("\n" + "=" * 60)
    print("Running Phase 4 dynamic API call test...")
    print("=" * 60)

    test_dir = os.path.join(os.path.dirname(__file__), "_test_phase4_dynamic")
    try:
        os.makedirs(os.path.join(test_dir, "backend"), exist_ok=True)
        os.makedirs(os.path.join(test_dir, "frontend"), exist_ok=True)

        with open(os.path.join(test_dir, "backend", "api.py"), "w", encoding="utf-8") as f:
            f.write('''
from flask import Flask
app = Flask(__name__)

@app.route("/api/profile")
def get_profile():
    return {"userName": "Alice"}
''')

        with open(os.path.join(test_dir, "frontend", "Dynamic.jsx"), "w", encoding="utf-8") as f:
            f.write('''
const url = getApiUrl();
fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data.user_name);
    });
''')

        result = run_analysis(test_dir)

        profile_ep = next((e for e in result["endpoints"] if e["endpoint"] == "/api/profile"), None)
        assert profile_ep is not None, "Expected /api/profile endpoint"

        # Dynamic.jsx has fetch(url) — dynamic, no explicit endpoint string
        # The field user_name should NOT be confirmed for /api/profile
        confirmed_results = [r for r in profile_ep["results"] if r["confidence"] == "confirmed"]
        assert len(confirmed_results) == 0, (
            f"Dynamic API call should not produce confirmed results, got: {confirmed_results}"
        )

        # It should be uncertain
        uncertain_results = [r for r in profile_ep["results"]
                             if r["confidence"] == "uncertain"
                             and r.get("frontend_field")]
        assert len(uncertain_results) >= 1, (
            "Expected at least one uncertain result for dynamic API call"
        )
        print("✓ Dynamic API call correctly classified as uncertain")
        print("✓ Dynamic API call test PASSED")

    finally:
        shutil.rmtree(test_dir, ignore_errors=True)


def test_pure_component():
    """
    Phase 4 Test D: Pure presentation component with no API call should be uncertain.
    """
    print("\n" + "=" * 60)
    print("Running Phase 4 pure component test...")
    print("=" * 60)

    test_dir = os.path.join(os.path.dirname(__file__), "_test_phase4_pure")
    try:
        os.makedirs(os.path.join(test_dir, "backend"), exist_ok=True)
        os.makedirs(os.path.join(test_dir, "frontend"), exist_ok=True)

        with open(os.path.join(test_dir, "backend", "api.py"), "w", encoding="utf-8") as f:
            f.write('''
from flask import Flask
app = Flask(__name__)

@app.route("/api/items")
def get_items():
    return {"itemName": "Widget"}
''')

        with open(os.path.join(test_dir, "frontend", "PureDisplay.jsx"), "w", encoding="utf-8") as f:
            f.write('''
function PureDisplay({ data }) {
    return <div>{data.item_name}</div>;
}
''')

        result = run_analysis(test_dir)

        items_ep = next((e for e in result["endpoints"] if e["endpoint"] == "/api/items"), None)
        assert items_ep is not None, "Expected /api/items endpoint"

        # PureDisplay.jsx has no fetch/axios and no endpoint strings
        confirmed_results = [r for r in items_ep["results"] if r["confidence"] == "confirmed"]
        assert len(confirmed_results) == 0, (
            f"Pure component should not produce confirmed results, got: {confirmed_results}"
        )

        uncertain_results = [r for r in items_ep["results"] if r["confidence"] == "uncertain"]
        assert len(uncertain_results) >= 1, "Expected uncertain results for pure component"
        print("✓ Pure component correctly classified as uncertain")
        print("✓ Pure component test PASSED")

    finally:
        shutil.rmtree(test_dir, ignore_errors=True)


def test_multiple_endpoints_one_file():
    """
    Phase 4 Test C: Multiple endpoints in a single frontend file.
    """
    print("\n" + "=" * 60)
    print("Running Phase 4 multiple endpoints in one file test...")
    print("=" * 60)

    test_dir = os.path.join(os.path.dirname(__file__), "_test_phase4_multi")
    try:
        os.makedirs(os.path.join(test_dir, "backend"), exist_ok=True)
        os.makedirs(os.path.join(test_dir, "frontend"), exist_ok=True)

        with open(os.path.join(test_dir, "backend", "api.py"), "w", encoding="utf-8") as f:
            f.write('''
from flask import Flask
app = Flask(__name__)

@app.route("/api/users")
def get_users():
    return {"userName": "Alice"}

@app.route("/api/settings")
def get_settings():
    return {"theme": "dark"}
''')

        with open(os.path.join(test_dir, "frontend", "Dashboard.jsx"), "w", encoding="utf-8") as f:
            f.write('''
function Dashboard() {
    fetch("/api/users").then(res => res.json()).then(data => {
        console.log(data.user_name);
    });
    fetch("/api/settings").then(res => res.json()).then(data => {
        console.log(data.theme);
    });
}
''')

        result = run_analysis(test_dir)

        users_ep = next((e for e in result["endpoints"] if e["endpoint"] == "/api/users"), None)
        settings_ep = next((e for e in result["endpoints"] if e["endpoint"] == "/api/settings"), None)
        assert users_ep is not None, "Expected /api/users endpoint"
        assert settings_ep is not None, "Expected /api/settings endpoint"

        # Dashboard.jsx explicitly references both endpoints
        # So both endpoints should have confirmed results from Dashboard.jsx
        users_confirmed = [r for r in users_ep["results"] if r["confidence"] == "confirmed"]
        settings_confirmed = [r for r in settings_ep["results"] if r["confidence"] == "confirmed"]

        assert len(users_confirmed) >= 1, "Expected confirmed results for /api/users from Dashboard.jsx"
        assert len(settings_confirmed) >= 1, "Expected confirmed results for /api/settings from Dashboard.jsx"

        print("✓ Both endpoints have confirmed associations from Dashboard.jsx")
        print("✓ Multiple endpoints in one file test PASSED")

    finally:
        shutil.rmtree(test_dir, ignore_errors=True)


if __name__ == "__main__":
    test_analysis_engine()
    test_endpoint_isolation()
    test_dynamic_api_call()
    test_pure_component()
    test_multiple_endpoints_one_file()
    if os.path.isdir(os.path.join(os.path.dirname(__file__), "sample_project_large")):
        test_large_project()

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED ✓")
    print("=" * 60)
