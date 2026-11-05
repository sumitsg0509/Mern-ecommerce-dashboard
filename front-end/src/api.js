import { getToken, clearAuth } from "./utils/auth";

const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Single fetch wrapper: injects the JWT, parses JSON and normalizes errors.
// On an expired/invalid token it clears the session and sends the user to login.
const request = async (path, { method = "GET", body, headers = {} } = {}) => {
  const token = getToken();

  const config = {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, config);
  } catch {
    throw new ApiError(
      "Cannot reach the server. Please check your connection and try again.",
      0
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    // Session expired: only auto-logout when a token was actually sent
    if (token && (response.status === 401 || response.status === 403)) {
      clearAuth();
      window.location.assign("/login");
    }

    throw new ApiError(data?.message || "Something went wrong", response.status);
  }

  return data;
};

const api = {
  // Auth
  register: (payload) => request("/register", { method: "POST", body: payload }),
  login: (payload) => request("/login", { method: "POST", body: payload }),

  // Products
  getProducts: () => request("/products"),
  getProduct: (id) => request(`/product/${id}`),
  addProduct: (payload) => request("/add-product", { method: "POST", body: payload }),
  updateProduct: (id, payload) =>
    request(`/product/${id}`, { method: "PUT", body: payload }),
  deleteProduct: (id) => request(`/product/${id}`, { method: "DELETE" }),
  searchProducts: (key) => request(`/search/${encodeURIComponent(key)}`),

  // Dashboard
  getStats: () => request("/stats"),
};

export { ApiError };
export default api;
