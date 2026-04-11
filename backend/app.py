@app.post("/api/auth/register")
def register():
    data = request.get_json(silent=True) or {}
    
    # Debug: Check your Render logs to see the full Step 1-5 payload
    print("Final Submission Data:", data)

    # 1. User Info (Step 1)
    full_names = data.get("fullNames")
    id_number = data.get("idNumber")
    gender = data.get("gender")
    race = data.get("race")
    account_type = data.get("accountType")
    address = data.get("address")
    email = data.get("email")
    contact_number = data.get("contactNumber")
    password = data.get("password")

    # 2. Consent (Step 2)
    consent_given = data.get("consentGiven", False)

    # 3. Document (Step 3)
    document_type = data.get("documentType")
    document_path = data.get("documentPath")

    # 4. Verification Logic (Step 4 & 5)
    # Since they clicked "Continue & Register", we set status to 2 (Verified)
    verification_status = 2 

    if not email or not password or not full_names:
        return jsonify({"error": "Missing critical registration data"}), 400

    cursor = db.cursor(dictionary=True)
    try:
        # Check if user exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "User already exists"}), 409

        # Insert everything into Aiven Cloud
        sql = """
            INSERT INTO users 
            (full_names, id_number, gender, race, account_type, address, email, 
             contact_number, password, consent_given, document_type, 
             document_path, verification_status) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            full_names, id_number, gender, race, account_type, address, email, 
            contact_number, password, consent_given, document_type, 
            document_path, verification_status
        )
        
        cursor.execute(sql, values)
        db.commit() 

        return jsonify({
            "message": "User verified and registered successfully",
            "status": "Verified"
        }), 201

    except Exception as e:
        db.rollback()
        print("Database Error:", str(e))
        return jsonify({"error": "Failed to complete verification and registration"}), 500
    finally:
        cursor.close()