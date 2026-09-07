"""
backend_parser.py — Parses Python backend code to extract API endpoint information.

How it works:
  - Uses Python's built-in `ast` module (no extra dependencies)
  - Walks through all .py files in the backend folder
  - Finds functions decorated with Flask route decorators: @app.route("/path")
  - Looks at the return statement inside those functions
  - Extracts the dictionary keys from the returned dict — those are the API fields

What it does NOT do (intentionally, for MVP simplicity):
  - Does not follow variable references (only handles inline dicts in return)
  - Does not handle jsonify() wrapping (only plain dict literals)
  - Does not handle nested dicts

This is sufficient for the hackathon prototype and honest about its limitations.
"""

import ast
import os
import re


def extract_route_decorator(decorator):
    """
    Given a decorator AST node, return the route path string if it's a
    Flask @app.route("/path") decorator, otherwise return None.

    Example decorator: @app.route("/api/user")
    Returns: "/api/user"
    """
    # The decorator should be a function call: app.route("/api/user")
    if not isinstance(decorator, ast.Call):
        return None

    # The function being called should be app.route (an Attribute node)
    func = decorator.func
    if not isinstance(func, ast.Attribute):
        return None

    if func.attr != "route":
        return None

    # The first positional argument is the route path string
    if not decorator.args:
        return None

    first_arg = decorator.args[0]
    if isinstance(first_arg, ast.Constant) and isinstance(first_arg.value, str):
        return first_arg.value

    return None


def extract_return_dict_keys(func_node, filepath):
    """
    Given a function AST node, find the first return statement that returns
    a dictionary literal and extract its string keys.

    Example:
        return {"userId": 101, "name": "Mithul"}
    Returns:
        [
            {"name": "userId", "file": "backend/api.py", "line": 10},
            {"name": "name", "file": "backend/api.py", "line": 10}
        ]
    """
    keys = []

    for node in ast.walk(func_node):
        if isinstance(node, ast.Return) and node.value is not None:
            returned = node.value

            # Handle plain dict: return {"key": value}
            if isinstance(returned, ast.Dict):
                for key in returned.keys:
                    if isinstance(key, ast.Constant) and isinstance(key.value, str):
                        keys.append({
                            "name": key.value,
                            "file": filepath,
                            "line": key.lineno
                        })
                # Stop after the first return dict we find
                break

    return keys


def parse_backend_file(filepath):
    """
    Parse a single Python file and return a list of endpoint dictionaries.

    Each entry in the list looks like:
        {
            "endpoint": "/api/user",
            "fields": ["userId", "name"]
        }
    """
    with open(filepath, "r", encoding="utf-8") as f:
        source = f.read()

    try:
        tree = ast.parse(source, filename=filepath)
    except SyntaxError as e:
        print(f"  [backend_parser] Skipping {filepath} — SyntaxError: {e}")
        return []
    except Exception as e:
        print(f"  [backend_parser] Skipping {filepath} — Parse Error: {e}")
        return []

    endpoints = []

    for node in ast.walk(tree):
        # We are looking for function definitions with decorators
        if not isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            continue

        for decorator in node.decorator_list:
            route_path = extract_route_decorator(decorator)
            if route_path is not None:
                fields = extract_return_dict_keys(node, filepath)
                endpoints.append({
                    "endpoint": route_path,
                    "fields": fields
                })
                break  # One route per function is enough

    return endpoints

def extract_fields_from_text(text, filepath):
    """
    Simple heuristic to find string literals used as keys (e.g., in maps or JSON objects).
    Looks for "fieldName": or "fieldName", or put("fieldName"
    """
    fields = []
    # Pattern looks for "key" followed by : or , or inside put("key" or ["key"]
    pattern = re.compile(r'put\s*\(\s*["\']([a-zA-Z0-9_]+)["\']|\[\s*["\']([a-zA-Z0-9_]+)["\']\s*\]|["\']([a-zA-Z0-9_]+)["\']\s*[:|,]')
    for match in pattern.finditer(text):
        key = match.group(1) or match.group(2) or match.group(3)
        if key:
            line_no = text.count('\n', 0, match.start()) + 1
            fields.append({
                "name": key,
                "file": filepath,
                "line": line_no
            })
    return fields

def parse_java_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()
    endpoints = []
    # Find Spring Boot annotations: @GetMapping("/api/...")
    route_pattern = re.compile(r'@(?:GetMapping|PostMapping|RequestMapping|PutMapping|DeleteMapping)\s*\(\s*["\']([^"\']+)["\']\s*\)')
    for match in route_pattern.finditer(text):
        route = match.group(1)
        fields = extract_fields_from_text(text, filepath)
        endpoints.append({
            "endpoint": route,
            "fields": fields
        })
    return endpoints

def parse_cpp_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()
    endpoints = []
    # Find Crow routes: CROW_ROUTE(app, "/api/...")
    route_pattern = re.compile(r'CROW_ROUTE\s*\(\s*[a-zA-Z0-9_]+\s*,\s*["\']([^"\']+)["\']\s*\)')
    for match in route_pattern.finditer(text):
        route = match.group(1)
        fields = extract_fields_from_text(text, filepath)
        endpoints.append({
            "endpoint": route,
            "fields": fields
        })
    return endpoints

def parse_c_file(filepath):
    # Same basic heuristic as CPP for now
    return parse_cpp_file(filepath)


def parse_backend(backend_dir):
    """
    Walk the entire backend directory, parse all .py files, and collect
    all discovered API endpoints and their fields.

    Returns:
        List of endpoint dicts:
        [
            {"endpoint": "/api/user", "fields": ["userId", "name"]},
            ...
        ]
    """
    all_endpoints = []

    if not os.path.isdir(backend_dir):
        print(f"  [backend_parser] Directory not found: {backend_dir}")
        return all_endpoints

    IGNORED_DIRS = {"node_modules", ".git", "__pycache__", "venv", "env", "build", "dist", ".next", "test", "tests", "templates"}
    IGNORED_PREFIXES = ("sample_", "_test_", "test_", ".")

    for root, dirs, files in os.walk(backend_dir):
        # Prevent traversal into ignored directories and sample/test fixtures
        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS and not d.startswith(IGNORED_PREFIXES)]

        for filename in files:
            filepath = os.path.join(root, filename)
            if filename.endswith(".py"):
                print(f"  [backend_parser] Parsing: {filepath}")
                endpoints = parse_backend_file(filepath)
                all_endpoints.extend(endpoints)
            elif filename.endswith(".java"):
                print(f"  [backend_parser] Parsing Java: {filepath}")
                endpoints = parse_java_file(filepath)
                all_endpoints.extend(endpoints)
            elif filename.endswith(".cpp") or filename.endswith(".cc"):
                print(f"  [backend_parser] Parsing C++: {filepath}")
                endpoints = parse_cpp_file(filepath)
                all_endpoints.extend(endpoints)
            elif filename.endswith(".c"):
                print(f"  [backend_parser] Parsing C: {filepath}")
                endpoints = parse_c_file(filepath)
                all_endpoints.extend(endpoints)

    return all_endpoints
