from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)

# Allow localhost during development + Render frontend via env var
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
CORS(app, resources={r"/api/*": {"origins": [FRONTEND_URL, "http://localhost:3000"]}})

# Temporary in-memory storage (resets when backend restarts)
users = []
trips = []
emergency_contacts = []
notifications = []

trip_id_counter = 1
contact_id_counter = 1
notification_id_counter = 1


def now_iso():
    return datetime.utcnow().isoformat(timespec="seconds") + "Z"


def find_user_by_id(user_id: int):
    return next((u for u in users if u["id"] == user_id), None)


def find_user_by_email(email: str):
    return next((u for u in users if u["email"] == email), None)


def safe_user(user):
    return {k: v for k, v in user.items() if k != "password"}


def create_notification(user_id, account_type, title, message, kind="info", meta=None):
    global notification_id_counter
    item = {
        "id": notification_id_counter,
        "userId": int(user_id),
        "accountType": account_type,
        "title": title,
        "message": message,
        "kind": kind,  # success | info | warning | error
        "meta": meta or {},
        "read": False,
        "createdAt": now_iso(),
    }
    notification_id_counter += 1
    notifications.append(item)
    return item


def notify_user(user, title, message, kind="info", meta=None):
    if not user:
        return
    create_notification(
        user_id=user["id"],
        account_type=user["accountType"],
        title=title,
        message=message,
        kind=kind,
        meta=meta,
    )


def parse_int(value, field_name):
    try:
        return int(value)
    except (TypeError, ValueError):
        raise ValueError(f"{field_name} must be a valid integer")


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "message": "Backend is working (no DB)"}), 200


# -------------------------
# AUTH
# -------------------------
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
    if not account_type:
        return jsonify({"error": "Account type is required"}), 400
    if account_type not in ["driver", "passenger"]:
        return jsonify({"error": "Account type must be 'driver' or 'passenger'"}), 400

    if find_user_by_email(email):
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
        "vehicleModel": (data.get("vehicleModel") or "").strip() or None,
        "licensePlate": (data.get("licensePlate") or "").strip() or None,
    }
    users.append(user)

    notify_user(
        user,
        title="Registration successful",
        message="Your SecureRide account was created successfully.",
        kind="success",
        meta={"event": "register"},
    )

    return jsonify({"message": "Registered successfully", "user": safe_user(user)}), 201


@app.post("/api/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400

    user = next((u for u in users if u["email"] == email and u["password"] == password), None)
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    notify_user(
        user,
        title="Login successful",
        message="You have logged in successfully.",
        kind="success",
        meta={"event": "login"},
    )

    return jsonify({"message": "Login successful", "user": safe_user(user)}), 200


# -------------------------
# NOTIFICATIONS
# -------------------------
@app.get("/api/notifications")
def list_notifications():
    user_id = request.args.get("userId", type=int)
    account_type = (request.args.get("accountType") or "").strip().lower()

    if not user_id:
        return jsonify({"error": "userId is required"}), 400

    data = [n for n in notifications if n["userId"] == user_id]
    if account_type in ["driver", "passenger"]:
        data = [n for n in data if n["accountType"] == account_type]

    data.sort(key=lambda x: x["id"], reverse=True)
    return jsonify({"notifications": data}), 200


@app.post("/api/notifications/<int:notification_id>/read")
def mark_notification_read(notification_id):
    n = next((x for x in notifications if x["id"] == notification_id), None)
    if not n:
        return jsonify({"error": "Notification not found"}), 404

    n["read"] = True
    return jsonify({"message": "Notification marked as read", "notification": n}), 200


@app.post("/api/notifications/clear")
def clear_notifications():
    data = request.get_json(silent=True) or {}
    user_id = data.get("userId")
    account_type = (data.get("accountType") or "").strip().lower()

    if user_id is None:
        return jsonify({"error": "userId is required"}), 400

    try:
        user_id = parse_int(user_id, "userId")
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    before = len(notifications)
    if account_type in ["driver", "passenger"]:
        remaining = [n for n in notifications if not (n["userId"] == user_id and n["accountType"] == account_type)]
    else:
        remaining = [n for n in notifications if n["userId"] != user_id]

    notifications.clear()
    notifications.extend(remaining)
    return jsonify({"message": "Notifications cleared", "deleted": before - len(notifications)}), 200


# -------------------------
# PASSENGER: DRIVERS
# -------------------------
@app.get("/api/passenger/drivers")
def get_registered_drivers():
    drivers = []
    for u in users:
        if u.get("accountType") == "driver":
            name = u.get("fullNames", "Driver").strip()
            initials = "".join([part[0] for part in name.split() if part])[:2].upper() or "DR"

            drivers.append({
                "id": u.get("id"),
                "name": name,
                "initials": initials,
                "vehicle": u.get("vehicleModel") or "Vehicle not set",
                "plate": u.get("licensePlate") or "Plate N/A",
                "distance": "N/A",
                "eta": "N/A",
                "fare": None,
                "rating": 5.0,
            })

    return jsonify({"drivers": drivers}), 200


# -------------------------
# EMERGENCY CONTACTS
# -------------------------
@app.get("/api/emergency-contacts")
def list_emergency_contacts():
    user_id = request.args.get("userId", type=int)
    account_type = (request.args.get("accountType") or "").strip().lower()

    if not user_id:
        return jsonify({"error": "userId is required"}), 400

    items = [c for c in emergency_contacts if c["userId"] == user_id]
    if account_type in ["driver", "passenger"]:
        items = [c for c in items if c["accountType"] == account_type]

    primary = next((c for c in items if c["type"] == "primary"), None)
    secondary = [c for c in items if c["type"] == "secondary"]

    return jsonify({"contacts": items, "primary": primary, "secondary": secondary}), 200


@app.post("/api/emergency-contacts")
def create_emergency_contact():
    global contact_id_counter
    data = request.get_json(silent=True) or {}

    user_id = data.get("userId")
    account_type = (data.get("accountType") or "").strip().lower()
    name = (data.get("name") or "").strip()
    number = (data.get("number") or "").strip()
    relationship = (data.get("relationship") or "").strip()
    contact_type = (data.get("type") or "secondary").strip().lower()

    if user_id is None:
        return jsonify({"error": "userId is required"}), 400
    try:
        user_id = parse_int(user_id, "userId")
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    if account_type not in ["driver", "passenger"]:
        return jsonify({"error": "accountType must be 'driver' or 'passenger'"}), 400
    if not name:
        return jsonify({"error": "Contact name is required"}), 400
    if not number:
        return jsonify({"error": "Contact number is required"}), 400
    if not relationship:
        return jsonify({"error": "Relationship is required"}), 400
    if contact_type not in ["primary", "secondary"]:
        return jsonify({"error": "type must be 'primary' or 'secondary'"}), 400

    user = find_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if contact_type == "primary":
        existing_primary = next(
            (c for c in emergency_contacts if c["userId"] == user_id and c["type"] == "primary"),
            None
        )
        if existing_primary:
            return jsonify({"error": "Primary contact already exists"}), 409

    contact = {
        "id": contact_id_counter,
        "userId": user_id,
        "accountType": account_type,
        "name": name,
        "number": number,
        "relationship": relationship,
        "type": contact_type,
        "createdAt": now_iso(),
        "updatedAt": now_iso(),
    }
    contact_id_counter += 1
    emergency_contacts.append(contact)

    return jsonify({"message": "Contact created", "contact": contact}), 201


@app.put("/api/emergency-contacts/<int:contact_id>")
def update_emergency_contact(contact_id):
    data = request.get_json(silent=True) or {}
    contact = next((c for c in emergency_contacts if c["id"] == contact_id), None)

    if not contact:
        return jsonify({"error": "Contact not found"}), 404

    name = (data.get("name") or contact["name"]).strip()
    number = (data.get("number") or contact["number"]).strip()
    relationship = (data.get("relationship") or contact["relationship"]).strip()
    contact_type = (data.get("type") or contact["type"]).strip().lower()

    if contact_type not in ["primary", "secondary"]:
        return jsonify({"error": "type must be 'primary' or 'secondary'"}), 400

    if contact_type == "primary":
        existing_primary = next(
            (c for c in emergency_contacts if c["userId"] == contact["userId"] and c["type"] == "primary" and c["id"] != contact_id),
            None
        )
        if existing_primary:
            return jsonify({"error": "Primary contact already exists for this user"}), 409

    contact["name"] = name
    contact["number"] = number
    contact["relationship"] = relationship
    contact["type"] = contact_type
    contact["updatedAt"] = now_iso()

    return jsonify({"message": "Contact updated", "contact": contact}), 200


@app.delete("/api/emergency-contacts/<int:contact_id>")
def delete_emergency_contact(contact_id):
    idx = next((i for i, c in enumerate(emergency_contacts) if c["id"] == contact_id), None)
    if idx is None:
        return jsonify({"error": "Contact not found"}), 404

    deleted = emergency_contacts.pop(idx)
    return jsonify({"message": "Contact removed", "contact": deleted}), 200


# -------------------------
# TRIP FLOW + HISTORY
# -------------------------
@app.post("/api/passenger/trips/request")
def request_trip():
    global trip_id_counter
    data = request.get_json(silent=True) or {}

    passenger_id = data.get("passengerId")
    pickup = (data.get("pickup") or "").strip()
    destination = (data.get("destination") or "").strip()
    ride_type = (data.get("rideType") or "standard").strip().lower()
    payment_method = (data.get("paymentMethod") or "card").strip().lower()

    if passenger_id is None:
        return jsonify({"error": "passengerId is required"}), 400
    try:
        passenger_id = parse_int(passenger_id, "passengerId")
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    if not pickup:
        return jsonify({"error": "Pickup is required"}), 400
    if not destination:
        return jsonify({"error": "Destination is required"}), 400

    passenger = find_user_by_id(passenger_id)
    if not passenger or passenger.get("accountType") != "passenger":
        return jsonify({"error": "Passenger not found"}), 404

    trip = {
        "id": trip_id_counter,
        "passengerId": passenger_id,
        "passengerName": passenger["fullNames"],
        "driverId": None,
        "driverName": None,
        "pickup": pickup,
        "destination": destination,
        "rideType": ride_type,
        "paymentMethod": payment_method,
        "requestedAt": now_iso(),
        "acceptedAt": None,
        "arrivalTime": None,
        "startedAt": None,
        "completedAt": None,
        "cancelledAt": None,
        "date": datetime.utcnow().strftime("%Y-%m-%d"),
        "status": "requested",
        "vehicle": None,
        "plate": None,
        "distance": "N/A",
        "eta": "N/A",
        "fare": None,
        "earnings": None,
        "rating": None,
    }

    trip_id_counter += 1
    trips.append(trip)

    notify_user(
        passenger,
        title="Trip request created",
        message=f"Your trip request from {pickup} to {destination} was created.",
        kind="info",
        meta={"event": "trip_requested", "tripId": trip["id"]},
    )

    for u in users:
        if u.get("accountType") == "driver":
            notify_user(
                u,
                title="New trip request",
                message=f"Passenger requested a trip: {pickup} → {destination}.",
                kind="info",
                meta={"event": "new_trip_request", "tripId": trip["id"]},
            )

    return jsonify({"message": "Trip requested", "trip": trip}), 201


@app.get("/api/driver/trips/requests")
def driver_trip_requests():
    requested = [t for t in trips if t["status"] == "requested"]
    requested.sort(key=lambda x: x["id"], reverse=True)
    return jsonify({"trips": requested}), 200


@app.post("/api/driver/trips/<int:trip_id>/accept")
def accept_trip(trip_id):
    data = request.get_json(silent=True) or {}
    driver_id = data.get("driverId")
    eta = (data.get("eta") or "N/A").strip()
    distance = (data.get("distance") or "N/A").strip()
    fare = data.get("fare")

    if driver_id is None:
        return jsonify({"error": "driverId is required"}), 400
    try:
        driver_id = parse_int(driver_id, "driverId")
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    driver = find_user_by_id(driver_id)
    if not driver or driver.get("accountType") != "driver":
        return jsonify({"error": "Driver not found"}), 404

    trip = next((t for t in trips if t["id"] == trip_id), None)
    if not trip:
        return jsonify({"error": "Trip not found"}), 404
    if trip["status"] != "requested":
        return jsonify({"error": f"Trip cannot be accepted in status '{trip['status']}'"}), 409

    trip["driverId"] = driver_id
    trip["driverName"] = driver["fullNames"]
    trip["vehicle"] = driver.get("vehicleModel") or "Vehicle not set"
    trip["plate"] = driver.get("licensePlate") or "Plate N/A"
    trip["eta"] = eta
    trip["distance"] = distance
    trip["fare"] = fare if fare is not None else None
    trip["acceptedAt"] = now_iso()
    trip["status"] = "accepted"

    passenger_user = find_user_by_id(trip["passengerId"])

    notify_user(
        passenger_user,
        title="Driver accepted your trip",
        message=f"{trip['driverName']} accepted your trip request.",
        kind="success",
        meta={"event": "trip_accepted", "tripId": trip["id"]},
    )

    notify_user(
        driver,
        title="Trip accepted",
        message=f"You accepted trip #{trip['id']} ({trip['pickup']} → {trip['destination']}).",
        kind="success",
        meta={"event": "driver_accepted_trip", "tripId": trip["id"]},
    )

    return jsonify({"message": "Trip accepted", "trip": trip}), 200


@app.post("/api/trips/<int:trip_id>/arrive")
def mark_arrived(trip_id):
    trip = next((t for t in trips if t["id"] == trip_id), None)
    if not trip:
        return jsonify({"error": "Trip not found"}), 404
    if trip["status"] not in ["accepted", "in_progress"]:
        return jsonify({"error": f"Trip cannot be arrived in status '{trip['status']}'"}), 409

    trip["arrivalTime"] = now_iso()
    if trip["status"] == "accepted":
        trip["status"] = "in_progress"

    return jsonify({"message": "Arrival marked", "trip": trip}), 200


@app.post("/api/trips/<int:trip_id>/complete")
def complete_trip(trip_id):
    data = request.get_json(silent=True) or {}
    trip = next((t for t in trips if t["id"] == trip_id), None)

    if not trip:
        return jsonify({"error": "Trip not found"}), 404
    if trip["status"] not in ["accepted", "in_progress"]:
        return jsonify({"error": f"Trip cannot be completed in status '{trip['status']}'"}), 409

    if data.get("fare") is not None:
        trip["fare"] = data.get("fare")

    if data.get("earnings") is not None:
        trip["earnings"] = data.get("earnings")
    elif trip.get("fare") is not None:
        trip["earnings"] = round(float(trip["fare"]) * 0.85, 2)

    if data.get("rating") is not None:
        trip["rating"] = data.get("rating")

    if not trip.get("arrivalTime"):
        trip["arrivalTime"] = now_iso()

    trip["completedAt"] = now_iso()
    trip["status"] = "completed"

    passenger_user = find_user_by_id(trip["passengerId"])
    driver_user = find_user_by_id(trip["driverId"]) if trip.get("driverId") else None

    if passenger_user:
        notify_user(
            passenger_user,
            title="Trip completed",
            message=f"Your trip #{trip['id']} has been completed successfully.",
            kind="success",
            meta={"event": "trip_completed", "tripId": trip["id"]},
        )
    if driver_user:
        notify_user(
            driver_user,
            title="Trip completed",
            message=f"Trip #{trip['id']} has been completed.",
            kind="success",
            meta={"event": "trip_completed", "tripId": trip["id"]},
        )

    return jsonify({"message": "Trip completed", "trip": trip}), 200


@app.post("/api/trips/<int:trip_id>/cancel")
def cancel_trip(trip_id):
    trip = next((t for t in trips if t["id"] == trip_id), None)
    if not trip:
        return jsonify({"error": "Trip not found"}), 404
    if trip["status"] in ["completed", "cancelled"]:
        return jsonify({"error": f"Trip cannot be cancelled in status '{trip['status']}'"}), 409

    trip["cancelledAt"] = now_iso()
    trip["status"] = "cancelled"

    passenger_user = find_user_by_id(trip["passengerId"])
    driver_user = find_user_by_id(trip["driverId"]) if trip.get("driverId") else None

    if passenger_user:
        notify_user(
            passenger_user,
            title="Trip cancelled",
            message=f"Trip #{trip['id']} was cancelled.",
            kind="warning",
            meta={"event": "trip_cancelled", "tripId": trip["id"]},
        )
    if driver_user:
        notify_user(
            driver_user,
            title="Trip cancelled",
            message=f"Trip #{trip['id']} was cancelled.",
            kind="warning",
            meta={"event": "trip_cancelled", "tripId": trip["id"]},
        )

    return jsonify({"message": "Trip cancelled", "trip": trip}), 200


@app.get("/api/passenger/trips/history")
def passenger_trip_history():
    passenger_id = request.args.get("passengerId", type=int)
    if not passenger_id:
        return jsonify({"error": "passengerId is required"}), 400

    passenger = find_user_by_id(passenger_id)
    if not passenger or passenger.get("accountType") != "passenger":
        return jsonify({"error": "Passenger not found"}), 404

    data = [t for t in trips if t["passengerId"] == passenger_id]
    data.sort(key=lambda x: x["id"], reverse=True)
    return jsonify({"trips": data}), 200


@app.get("/api/driver/trips/history")
def driver_trip_history():
    driver_id = request.args.get("driverId", type=int)
    if not driver_id:
        return jsonify({"error": "driverId is required"}), 400

    driver = find_user_by_id(driver_id)
    if not driver or driver.get("accountType") != "driver":
        return jsonify({"error": "Driver not found"}), 404

    data = [t for t in trips if t.get("driverId") == driver_id]
    data.sort(key=lambda x: x["id"], reverse=True)
    return jsonify({"trips": data}), 200


@app.get("/api/debug/state")
def debug_state():
    return jsonify({
        "usersCount": len(users),
        "tripsCount": len(trips),
        "contactsCount": len(emergency_contacts),
        "notificationsCount": len(notifications),
        "users": [safe_user(u) for u in users],
        "trips": trips,
        "emergencyContacts": emergency_contacts,
        "notifications": notifications,
    }), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)