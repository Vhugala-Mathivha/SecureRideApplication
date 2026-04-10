from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime

# from db import db  # Uncomment when DB is ready

app = Flask(__name__)
application = app

# Frontend URLs allowed to reach the backend (add more as needed)
VERCEL_FRONTEND = os.getenv("FRONTEND_URL", "https://your-frontend.vercel.app")  # Set this in Render dashboard or .env
ALLOWED_ORIGINS = [
    VERCEL_FRONTEND.rstrip("/"),
    "http://localhost:3000",     # CRA/dev local frontend (React default)
    "http://localhost:5173",     # Vite/dev local frontend (if ever used)
]

# CORS: Only for /api/* endpoints, restricts to listed origins
CORS(app, resources={r"/api/*": {"origins": ALLOWED_ORIGINS}}, supports_credentials=True)

def now_iso():
    return datetime.utcnow().isoformat(timespec="seconds") + "Z"

@app.route("/")
def index():
    return jsonify({"message": "SecureRide API is live on Render!"})

@app.get("/api/health")
def health():
    return jsonify({
        "status": "ok",
        "message": "Backend is working (Database connection skipped for deployment test)"
    }), 200

@app.post("/api/auth/register")
def register():
    data = request.get_json(silent=True) or {}

    full_names = (data.get("fullNames") or "").strip()
    if not full_names:
        return jsonify({"error": "Full names is required"}), 400

    # Mocked response for test mode
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

    # Mocked response for testing only
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
    # Render sets PORT env var automatically; defaults to 5000 for local/dev
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)