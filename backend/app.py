from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime
from db import db 

app = Flask(__name__)
application = app

ALLOWED_ORIGINS = [
    "https://secure-ride-application.vercel.app", 
    "http://localhost:3000",
    "http://localhost:5173"
]

CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS}}, supports_credentials=True)

@app.route("/")
def index():
    return jsonify({"message": "SecureRide API is live on Render!"})

# --- NEW VEHICLE REGISTRATION ENDPOINT ---
@app.post("/api/vehicles/register")
def register_vehicle():
    data = request.get_json(silent=True) or {}
    
    driver_id = data.get("driverId") 
    make = data.get("make")
    model = data.get("model")
    year = data.get("year")
    plate_number = data.get("plateNumber")
    color = data.get("color")
    expiry_date = data.get("licenseExpiryDate")
    photo_path = data.get("licensePhotoName")

    if not driver_id or not make or not plate_number:
        return jsonify({"error": "Missing required vehicle fields"}), 400

    cursor = db.cursor(dictionary=True)
    try:
        sql = """
            INSERT INTO vehicles 
            (driver_id, make, model, year, plate_number, color, 
             license_expiry_date, license_photo_path) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (driver_id, make, model, year, plate_number, color, expiry_date, photo_path)
        cursor.execute(sql, values)
        db.commit()
        return jsonify({"message": "Vehicle registered successfully"}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()

@app.post("/api/auth/register")
def register():
    data = request.get_json(silent=True) or {}
    full_names = data.get("fullNames")
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password or not full_names:
        return jsonify({"error": "Missing critical registration data"}), 400

    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "User already exists"}), 409

        sql = """
            INSERT INTO users 
            (full_names, id_number, gender, race, account_type, address, email, 
             contact_number, password, consent_given, document_type, 
             document_path, verification_status) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            full_names, data.get("idNumber"), data.get("gender"), data.get("race"),
            data.get("accountType"), data.get("address"), email, 
            data.get("contactNumber"), password, data.get("consentGiven", False),
            data.get("documentType"), data.get("documentPath"), 2
        )
        cursor.execute(sql, values)
        db.commit() 
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": "Registration failed"}), 500
    finally:
        cursor.close()

@app.post("/api/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")
    cursor = db.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM users WHERE email = %s AND password = %s"
        cursor.execute(sql, (email, password))
        user = cursor.fetchone()
        if user:
            return jsonify({"message": "Login successful", "user": user}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)