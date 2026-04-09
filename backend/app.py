from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime
from db import db  # <-- Import your MySQL connection

app = Flask(__name__)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
CORS(app, resources={r"/api/*": {"origins": [FRONTEND_URL, "http://localhost:3000"]}})

def now_iso():
    return datetime.utcnow().isoformat(timespec="seconds") + "Z"

def safe_user(row):
    if not row: return None
    # Remove the password field
    return {k: v for k, v in row.items() if k != "password"}

@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "message": "Backend is working with DB"}), 200

@app.post("/api/auth/register")
def register():
    data = request.get_json(silent=True) or {}

    full_names = (data.get("fullNames") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()
    account_type = (data.get("accountType") or "").strip().lower()

    if not full_names:
        return jsonify({"error": "Full names is required"}), 400
    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400
    if not account_type or account_type not in ["driver", "passenger"]:
        return jsonify({"error": "Account type must be 'driver' or 'passenger'"}), 400

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
    if cursor.fetchone():
        cursor.close()
        return jsonify({"error": "Email already exists"}), 409

    sql = "INSERT INTO users (full_names, email, password, account_type, created_at) VALUES (%s, %s, %s, %s, %s)"
    cursor.execute(sql, (full_names, email, password, account_type, now_iso()))
    db.commit()
    user_id = cursor.lastrowid

    cursor.execute("SELECT id, full_names, email, account_type, created_at FROM users WHERE id=%s", (user_id,))
    user = cursor.fetchone()
    cursor.close()

    return jsonify({"message": "Registered successfully", "user": user}), 201

@app.post("/api/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400

    cursor = db.cursor(dictionary=True)
    sql = "SELECT id, full_names, email, account_type, created_at FROM users WHERE email=%s AND password=%s"
    cursor.execute(sql, (email, password))
    user = cursor.fetchone()
    cursor.close()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful", "user": user}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)