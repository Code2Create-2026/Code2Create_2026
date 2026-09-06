"""
app.py — Flask application entry point for Code2Create 2026 backend.

Starts the server and registers all API routes.
"""

from flask import Flask
from flask_cors import CORS
from routes import register_routes

app = Flask(__name__)

# Allow Rohith's frontend (running on a different port) to call this API
CORS(app)

# Register all routes defined in routes.py
register_routes(app)

if __name__ == "__main__":
    print("Code2Create 2026 — Analysis Engine API")
    print("Running at http://localhost:5000")
    app.run(debug=True, port=5000)
