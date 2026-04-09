// CRA uses process.env instead of import.meta.env
// We point to localhost:5000 as a fallback for your local development
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  // We ensure there's no double slash if path starts with /
  const url = `${API_BASE_URL}${path}`.replace(/([^:]\/)\/+/g, "$1");

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = new Error(data.error || data.message || "Request failed");
    err.status = response.status;
    err.payload = data;
    throw err;
  }

  return data;
}