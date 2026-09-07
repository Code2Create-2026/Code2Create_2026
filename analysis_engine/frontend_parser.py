"""
frontend_parser.py — Parses React/JavaScript code to find which data fields
the frontend accesses from API responses.

How it works:
  - Scans all .js, .jsx, .ts, .tsx files in the frontend folder
  - Uses regex to find patterns like: data.fieldName, response.fieldName, etc.
  - Collects all unique field names accessed this way

Why regex (not tree-sitter)?
  For the hackathon MVP, regex is sufficient and has zero extra dependencies.
  The pattern `data.fieldName` is simple and consistent enough that regex
  reliably captures it. If the frontend uses more complex patterns in the
  future, we can upgrade to tree-sitter then.

What it does NOT handle (intentionally, for MVP simplicity):
  - Destructured access: const { userId } = data (not captured)
  - Chained access: data.user.id (only captures first level)
  - Dynamic access: data[key] (not captured)

The variable names we look for: data, response, res, result, apiData.
This can be extended if needed.
"""

import re
import os


# Variable names commonly used in React to hold API response data.
# We look for patterns like: data.fieldName, response.fieldName, etc.
API_RESPONSE_VARIABLE_NAMES = [
    "data",
    "response",
    "res",
    "result",
    "apiData",
]

# Build a regex pattern that matches: <variable>.<fieldName>
# We compile it once for efficiency.
_VARIABLE_PATTERN = "|".join(re.escape(v) for v in API_RESPONSE_VARIABLE_NAMES)
_FIELD_ACCESS_PATTERN = re.compile(
    rf"\b(?:{_VARIABLE_PATTERN})\.([a-zA-Z_][a-zA-Z0-9_]*)\b"
)

# Known JavaScript method/property names that are NOT API data fields.
# These appear as patterns like res.json(), promise.then(), etc.
# We exclude them to avoid false positives.
_JS_BUILTINS = {
    "json", "then", "catch", "finally", "toString", "valueOf",
    "length", "keys", "values", "entries", "map", "filter",
    "forEach", "reduce", "find", "some", "every", "includes",
    "push", "pop", "shift", "unshift", "slice", "splice",
    "log", "error", "warn", "info",
}


def parse_frontend_file(filepath):
    """
    Parse a single JS/JSX file and return a list of field access objects.

    Returns:
        [
            {"name": "user_id", "file": "frontend/App.jsx", "line": 25},
            {"name": "name", "file": "frontend/App.jsx", "line": 26}
        ]
    """
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            source = f.read()
    except Exception as e:
        print(f"  [frontend_parser] Skipping {filepath} — File Read Error: {e}")
        return []

    matches = _FIELD_ACCESS_PATTERN.finditer(source)

    fields = []
    for match in matches:
        field = match.group(1)
        if field not in _JS_BUILTINS:
            line_num = source[:match.start()].count("\n") + 1
            fields.append({
                "name": field,
                "file": filepath,
                "line": line_num
            })

    return fields


def parse_frontend(frontend_dir):
    """
    Walk the entire frontend directory, parse all JS/JSX/TS/TSX files,
    and collect all field names accessed from API response variables.

    Returns:
        List of field dicts:
        [
            {"name": "user_id", "file": "...", "line": 10},
            ...
        ]
    """
    all_fields = []

    if not os.path.isdir(frontend_dir):
        print(f"  [frontend_parser] Directory not found: {frontend_dir}")
        return all_fields

    IGNORED_DIRS = {"node_modules", ".git", "__pycache__", "venv", "env", "build", "dist", ".next"}

    for root, dirs, files in os.walk(frontend_dir):
        # Prevent traversal into ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]

        for filename in files:
            if filename.endswith((".js", ".jsx", ".ts", ".tsx")) and not filename.endswith(".min.js"):
                filepath = os.path.join(root, filename)
                print(f"  [frontend_parser] Parsing: {filepath}")
                fields = parse_frontend_file(filepath)
                all_fields.extend(fields)

    return all_fields
