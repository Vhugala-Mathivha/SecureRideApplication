from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime

# We comment this out so Render doesn't crash during the test
# from db import db  

app = Flask(__name__)

# This allows your Vercel URL (once deployed) and your local dev environment
FRONTEND_URL = os.getenv("FRONTEND_URL", "*") 
CORS(app, resources={r"/api/*": {"origins": [FRONTEND_URL, "http://localhost:3000", "http://localhost:5173"]}})

def now_iso():
    return datetime.utcnow().isoformat(timespec="seconds") + "Z"

@app.route("/")
def index():
    return jsonify({"message": "SecureRide API is live on Render!"})

@app.get("/api/health")
def health():
    # Changed message to show we are in 'Test Mode'
    return jsonify({
        "status": "ok", 
        "message": "Backend is working (Database connection skipped for deployment test)"
    }), 200

@app.post("/api/auth/register")
def register():
    data = request.get_json(silent=True) or {}
    
    # Still doing basic validation so you can test your frontend forms
    full_names = (data.get("fullNames") or "").strip()
    if not full_names:
        return jsonify({"error": "Full names is required"}), 400

    # Instead of DB logic, we return a mock success message
    return jsonify({
        "message": "MOCK Registration successful (No DB connection yet)",
        "user": {
            "id": 999,
            "full_names": full_names,
            "email": data.get("email"),
            "account_type": data.get("accountType"),
            "created_at": now_iso()
        }
    }), 201

@app.post("/api/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()

    # Mock Login Logic: Any password works for this test!
    return jsonify({
        "message": "MOCK Login successful",
        "user": {
            "id": 999,
            "full_names": "Test User",
            "email": email,
            "account_type": "passenger",
            "created_at": now_iso()
        }
    }), 200

if __name__ == "__main__":
    # Render uses the PORT environment variable
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)