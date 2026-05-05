import { clearAuthSession, getAuthToken } from "./session";

export const API_URL = import.meta.env.VITE_API_URL || "/api";

export const fetchWithToken = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;

  const headers = { ...options.headers };

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearAuthSession();
    window.location.href = "/login";
    throw new Error("Sesión expirada");
  }

  return res;
};