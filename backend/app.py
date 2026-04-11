from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime
from db import db  # Import your live database connection

app = Flask(__name__)
application = app

ALLOWED_ORIGINS = [
    "https://secure-ride-application.vercel.app", 
    "http://localhost:3000",
    "http://localhost:5173"
]

CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS}}, supports_credentials=True)

def now_iso():
    return datetime.utcnow().isoformat(timespec="seconds") + "Z"

@app.route("/")
def index():
    return jsonify({"message": "SecureRide API is live on Render!"})

@app.post("/api/auth/register")
def register():
    data = request.get_json(silent=True) or {}
    
    # Debug: This will show in your Render logs so you can see if data is arriving
    print("Incoming Registration Data:", data)

    # Map the React frontend keys to local variables
    # We use .get() to avoid crashes if a field is missing
    full_names = data.get("fullNames")
    id_number = data.get("idNumber")
    gender = data.get("gender")
    race = data.get("race")
    account_type = data.get("accountType")
    address = data.get("address")
    email = data.get("email")
    contact_number = data.get("contactNumber")
    password = data.get("password")

    # Basic Validation
    if not email or not password or not full_names:
        return jsonify({"error": "Required fields (Name, Email, Password) are missing"}), 400

    cursor = db.cursor(dictionary=True)
    try:
        # 1. Check if user already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "User with this email already exists"}), 409

        # 2. Insert into MySQL
        sql = """
            INSERT INTO users 
            (full_names, id_number, gender, race, account_type, address, email, contact_number, password) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (full_names, id_number, gender, race, account_type, address, email, contact_number, password)
        
        cursor.execute(sql, values)
        db.commit() # CRITICAL: This saves the data permanently

        return jsonify({
            "message": "Registration successful",
            "user": {
                "full_names": full_names,
                "email": email,
                "account_type": account_type
            }
        }), 201

    except Exception as e:
        db.rollback() # Undo changes if something goes wrong
        print("Database Error:", str(e))
        return jsonify({"error": "Database error occurred"}), 500
    finally:
        cursor.close()

@app.post("/api/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")

    cursor = db.cursor(dictionary=True)
    try:
        # Search for the user in Aiven Cloud
        sql = "SELECT * FROM users WHERE email = %s AND password = %s"
        cursor.execute(sql, (email, password))
        user = cursor.fetchone()

        if user:
            return jsonify({
                "message": "Login successful",
                "user": user
            }), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)