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
    Parse a single JS/JSX file and return a list of field names accessed
    from known API response variable names.

    Example file content:
        const name = data.user_id;
        const email = data.name;

    Returns:
        ["user_id", "name"]
    """
    with open(filepath, "r", encoding="utf-8") as f:
        source = f.read()

    matches = _FIELD_ACCESS_PATTERN.findall(source)

    # Return unique field names, preserving order of first occurrence.
    # Skip known JavaScript built-in method names (e.g. res.json, promise.then).
    seen = set()
    unique_fields = []
    for field in matches:
        if field not in seen and field not in _JS_BUILTINS:
            seen.add(field)
            unique_fields.append(field)

    return unique_fields


def parse_frontend(frontend_dir):
    """
    Walk the entire frontend directory, parse all JS/JSX/TS/TSX files,
    and collect all unique field names accessed from API response variables.

    Returns:
        List of unique field name strings:
        ["user_id", "name", "email"]
    """
    all_fields = []
    seen = set()

    if not os.path.isdir(frontend_dir):
        print(f"  [frontend_parser] Directory not found: {frontend_dir}")
        return all_fields

    for root, _, files in os.walk(frontend_dir):
        for filename in files:
            if filename.endswith((".js", ".jsx", ".ts", ".tsx")):
                filepath = os.path.join(root, filename)
                print(f"  [frontend_parser] Parsing: {filepath}")
                fields = parse_frontend_file(filepath)
                for field in fields:
                    if field not in seen:
                        seen.add(field)
                        all_fields.append(field)

    return all_fields
