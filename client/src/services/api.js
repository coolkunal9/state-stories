import { API_BASE_URL } from "../config/api";

/**
 * Fetch helper with auth header and clearer errors when the API is down.
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const token = localStorage.getItem("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config = { ...options, headers };

  let response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    const hint =
      "Start the backend from the project root: npm start (port 8000).";
    console.error(`[API] Network error for ${url}:`, err);
    throw new Error(
      `Cannot reach the API at ${API_BASE_URL}. ${hint}`
    );
  }

  const contentType = response.headers.get("content-type") || "";
  let data;

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    throw new Error(
      text?.slice(0, 200) || `Unexpected response (${response.status}) from API`
    );
  }

  if (!response.ok) {
    const errorMessage =
      data.message || `Request failed (${response.status})`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.errors = data.errors || null;
    throw error;
  }

  return data;
};

const api = {
  get: (endpoint, options) =>
    apiRequest(endpoint, { method: "GET", ...options }),
  post: (endpoint, body, options) =>
    apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),
  put: (endpoint, body, options) =>
    apiRequest(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),
  delete: (endpoint, options) =>
    apiRequest(endpoint, { method: "DELETE", ...options }),
};

export default api;
