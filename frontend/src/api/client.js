/**
 * client.js - Centralized API handler for SecureRide
 */

const isProd = process.env.NODE_ENV === "production";

// 1. UPDATE THIS URL: Replace with your actual Render "Onrender" link
// Ensure it ends with /api to match your Flask routes
const LIVE_BACKEND_URL = "https://secureride-api.onrender.com/api"; 

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  (isProd ? LIVE_BACKEND_URL : "http://localhost:5000/api");

/**
 * Wrapper for making backend API requests.
 * @param {string} path - The API endpoint path, e.g. '/auth/register'
 * @param {object} options - fetch options (method, body, etc.)
 */
export async function apiRequest(path, options = {}) {
  // Ensure path starts with a single slash
  const fixedPath = path.startsWith("/") ? path : `/${path}`;
  
  // Build the URL and remove any double slashes (except after http://)
  const url = `${API_BASE_URL}${fixedPath}`.replace(/([^:]\/)\/+/g, "$1");

  // Debugging: This will show you in the F12 console exactly where the request is going
  console.log(`[SecureRide API] ${options.method || 'GET'} to: ${url}`);

  try {
    const response = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    // Handle JSON parsing safely
    let data = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Throw error for non-2xx results (e.g., 400, 404, 500)
    if (!response.ok) {
      const errMsg =
        (data && data.error) ||
        (data && data.message) ||
        (typeof data === "string" ? data : "Request failed");
      
      const err = new Error(errMsg);
      err.status = response.status;
      err.payload = data;
      throw err;
    }

    return data;

  } catch (error) {
    // This blocks "Failed to fetch" errors - usually CORS or wrong URL
    console.error("Fetch Error:", error.message);
    throw error;
  }
}