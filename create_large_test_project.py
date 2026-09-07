import os

def create_large_project(base_dir):
    os.makedirs(base_dir, exist_ok=True)
    
    # Create ignored dirs
    ignored_dirs = ["node_modules", ".git", "__pycache__", "venv", "env", "build", "dist", ".next"]
    for d in ignored_dirs:
        dir_path = os.path.join(base_dir, d)
        os.makedirs(dir_path, exist_ok=True)
        # Add a file in ignored dir that shouldn't be parsed
        if d == "node_modules":
            with open(os.path.join(dir_path, "index.js"), "w", encoding="utf-8") as f:
                f.write("console.log(data.ignored_field);")
        if d == "venv":
            with open(os.path.join(dir_path, "test.py"), "w", encoding="utf-8") as f:
                f.write("def func(): return {'ignored_backend_field': 1}")

    # Create backend
    backend_dir = os.path.join(base_dir, "backend")
    os.makedirs(backend_dir, exist_ok=True)
    
    # 99 valid backend files
    for i in range(1, 100):
        with open(os.path.join(backend_dir, f"api_{i}.py"), "w", encoding="utf-8") as f:
            f.write(f'''
@app.route("/api/endpoint_{i}")
def get_data_{i}():
    return {{"field_{i}": 123}}
''')

    # 1 malformed backend file
    with open(os.path.join(backend_dir, "api_malformed.py"), "w", encoding="utf-8") as f:
        f.write("def @invalid_syntax::")

    # Create frontend
    frontend_dir = os.path.join(base_dir, "frontend")
    os.makedirs(frontend_dir, exist_ok=True)
    
    # 98 valid frontend files
    for i in range(1, 99):
        with open(os.path.join(frontend_dir, f"Component{i}.jsx"), "w", encoding="utf-8") as f:
            f.write(f"const val = data.field_{i};")
            
    # 1 minified frontend file (should be ignored)
    with open(os.path.join(frontend_dir, "vendor.min.js"), "w", encoding="utf-8") as f:
        f.write("const x=data.ignored_minified_field;")
        
    # 1 duplicate occurrence test file
    with open(os.path.join(frontend_dir, "ComponentDuplicate.jsx"), "w", encoding="utf-8") as f:
        f.write("const a = data.duplicate_field;\nconst b = data.duplicate_field;")

if __name__ == "__main__":
    create_large_project("sample_project_large")
