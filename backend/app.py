from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Temporary in-memory users (resets when backend restarts)
users = []


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "message": "Backend is working (no DB)"}), 200


@app.post("/api/auth/register")
def register():
    data = request.get_json(silent=True) or {}

    full_names = (data.get("fullNames") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    account_type = (data.get("accountType") or "").strip().lower()

    if not full_names or not email or not password or not account_type:
        return jsonify({"error": "fullNames, email, password, accountType are required"}), 400

    if account_type not in ["driver", "passenger"]:
        return jsonify({"error": "accountType must be 'driver' or 'passenger'"}), 400

    existing = next((u for u in users if u["email"] == email), None)
    if existing:
        return jsonify({"error": "Email already exists"}), 409

    user = {
        "id": len(users) + 1,
        "fullNames": full_names,
        "email": email,
        "password": password,  # demo only
        "accountType": account_type,
        "carDetailsCompleted": False,
        "verificationConsentGiven": False,
        "idDocumentUploaded": False,
        "faceVerified": False,
    }
    users.append(user)

    safe_user = {k: v for k, v in user.items() if k != "password"}
    return jsonify({"message": "Registered successfully", "user": safe_user}), 201


@app.post("/api/auth/login")
def login():
    data = request.get_json(silent=True) or {}

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = next((u for u in users if u["email"] == email and u["password"] == password), None)
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    safe_user = {k: v for k, v in user.items() if k != "password"}
    return jsonify({"message": "Login successful", "user": safe_user}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)