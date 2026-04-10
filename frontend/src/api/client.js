// Proper API base selection: deployed backend URL from env var, fallback to local dev
const isProd = process.env.NODE_ENV === "production";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  (isProd ? "https://secureride-api.onrender.com" : "http://localhost:5000/api");

/**
 * Wrapper for making backend API requests.
 * @param {string} path - The API endpoint path, e.g. '/login'
 * @param {object} options - fetch options (method, body, etc.)
 */
export async function apiRequest(path, options = {}) {
  // Ensure path starts with single slash only
  const fixedPath = path.startsWith("/") ? path : `/${path}`;
  // Safely build the URL
  const url = `${API_BASE_URL}${fixedPath}`.replace(/([^:]\/)\/+/g, "$1");

  // Use the fetch API
  const response = await fetch(url, {
    // Always send JSON unless overridden
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    // UNCOMMENT this line if your backend uses cookie-based authentication:
    // credentials: "include",
    ...options,
  });

  // Try to parse response as JSON (handles cases with no response body)
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  // Throw error for non-2xx results
  if (!response.ok) {
    const errMsg =
      data.error ||
      data.message ||
      (typeof data === "string" ? data : "Request failed");
    const err = new Error(errMsg);
    err.status = response.status;
    err.payload = data;
    throw err;
  }

  return data;
}