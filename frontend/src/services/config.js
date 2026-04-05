export const API_URL = import.meta.env.VITE_API_URL;

export const fetchWithToken = async (endpoint, options = {}) => {
  const storedData = localStorage.getItem("user");
  const user = storedData ? JSON.parse(storedData) : null;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (user && user.token) {
    headers["Authorization"] = `Bearer ${user.token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Sesión expirada");
  }

  return res;
};