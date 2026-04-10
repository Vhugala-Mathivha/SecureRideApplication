#  SecureRide

SecureRide is an e-hailing identity authentication system designed to reduce crime, featuring a modern web frontend and backend.

---

## Features

- **Safe Registration & Login** – Multi-step forms for both drivers and passengers
- **User Roles** – Driver/passenger with ID verification steps
- **Book a Ride** – Passengers can book rides and select drivers
- **REST API** – Flask backend for authentication and business logic
- **React Frontend** – Smooth, single-page application experience

---

## Project Structure

```
SecureRideApplication/
├── backend/   # Flask REST API backend
│   ├── app.py
│   ├── db.py
│   └── ...
├── frontend/  # React frontend application
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md
```

---

## Frontend

- **Location:** `frontend/`
- **Tech:** React (with modern hooks and components)
- **Install dependencies:**
  ```bash
  cd frontend
  npm install
  ```
- **Run locally:**
  ```bash
  npm start
  ```
- **Build for production:**
  ```bash
  npm run build
  ```
- **Deploy:** Recommended with [Vercel](https://secure-ride-application.vercel.app/) (auto-detects React).  
- **API Configuration:**  
  Update `.env` in `frontend/` to point to the backend API:
  ```
  REACT_APP_API_URL=https://your-backend-url.onrender.com/api
  ```

---

## Backend

- **Location:** `backend/`
- **Tech:** Flask (Python), PyMySQL 
- **Install dependencies:**
  ```bash
  pip install -r requirements.txt
  ```
- **Run locally:**
  ```bash
  python app.py
  ```
- **Deploy:** Recommended with [Render]([https://secureride-api.onrender.com)
- **Environment variable:**  
  Set `DATABASE_URL` to point to your production MySQL database.

---

## How to Run the Full Stack Locally

1. **Start your backend:**
    ```bash
    cd backend
    python app.py
    ```
2. **Start your frontend (in a new terminal window):**
    ```bash
    cd frontend
    npm start
    ```
3. **Frontend runs on** `http://localhost:3000`  
   **Backend runs on** `http://localhost:5000`

---

## License

This project is for educational/application prototyping use.

---

## Author

[Vhugala Mathivha](https://github.com/Vhugala-Mathivha)
