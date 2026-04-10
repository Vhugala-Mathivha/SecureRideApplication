from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)
application = app

# 1. UPDATED: Explicitly allow your Vercel URL
# We include the specific URL you provided and common local ports
ALLOWED_ORIGINS = [
    "https://secure-ride-application.vercel.app", 
    "http://localhost:3000",
    "http://localhost:5173"
]

# 2. UPDATED: Apply CORS to ALL routes and be more permissive with origins
# Removing the r"/api/*" restriction helps if you have routes like "/" or "/health"
CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS}}, supports_credentials=True)

def now_iso():
    # Using datetime.now(timezone.utc) is the modern way, but keeping your logic
    return datetime.utcnow().isoformat(timespec="seconds") + "Z"

@app.route("/")
def index():
    return jsonify({"message": "SecureRide API is live on Render!"})

@app.get("/api/health")
def health():
    return jsonify({
        "status": "ok",
        "message": "Backend is working"
    }), 200

@app.post("/api/auth/register")
def register():
    data = request.get_json(silent=True) or {}

    full_names = (data.get("fullNames") or "").strip()
    if not full_names:
        return jsonify({"error": "Full names is required"}), 400

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
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)