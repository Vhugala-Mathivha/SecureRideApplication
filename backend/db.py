import mysql.connector
import os

# Render will have these variables, your laptop will use the defaults
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASS", "SYSTEM") # Your local password
DB_NAME = os.getenv("DB_NAME", "secureride_db")
DB_PORT = os.getenv("DB_PORT", "3306")

def get_db_connection():
    try:
        # If we are on Render (DB_HOST is not localhost), we might need SSL
        if DB_HOST != "localhost":
            return mysql.connector.connect(
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASS,
                database=DB_NAME,
                port=DB_PORT,
                ssl_disabled=False # This tells the code to use a secure connection for Aiven
            )
        else:
            # Local connection for your laptop
            return mysql.connector.connect(
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASS,
                database=DB_NAME,
                port=DB_PORT
            )
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

# Create the global connection object
db = get_db_connection()