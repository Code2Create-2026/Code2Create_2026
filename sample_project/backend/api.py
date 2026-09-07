"""
sample_project/backend/api.py

This is a minimal sample Python Flask API for testing the analysis engine.

The analysis engine should detect:
  - Endpoint: /api/user
  - Backend provides: userId, name, email

The frontend (App.jsx) uses: user_id, name, email

Expected analysis result:
  userId  vs user_id  → POSSIBLE MISMATCH  ⚠
  name    vs name     → MATCH              ✓
  email   vs email    → MATCH              ✓
"""

from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/api/user")
def get_user():
    return {
        "userId": 101,
        "name": "Mithul",
        "email": "mithul@example.com"
    }


@app.route("/api/health")
def health():
    return {
        "status": "ok"
    }


if __name__ == "__main__":
    app.run(debug=True)
