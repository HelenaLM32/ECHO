import { clearAuthSession, getAuthToken } from "./session";

export const API_URL = import.meta.env.VITE_API_URL || "/api";
export const API_FALLBACK_URL = import.meta.env.VITE_API_FALLBACK_URL || "";
export const ENABLE_LOCAL_API_FALLBACK = import.meta.env.VITE_ENABLE_LOCAL_API_FALLBACK === "true";

function buildApiBases() {
  const bases = [API_URL];

  if (API_FALLBACK_URL && API_FALLBACK_URL !== API_URL) {
    bases.push(API_FALLBACK_URL);
  }

  // Optional local-only fallback when proxy /api is unstable during development.
  if (
    ENABLE_LOCAL_API_FALLBACK &&
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") &&
    API_URL.startsWith("/")
  ) {
    const directLocalApi = `${window.location.protocol}//${window.location.hostname}:8084/api`;
    if (!bases.includes(directLocalApi)) bases.push(directLocalApi);
  }

  return bases;
}

export const fetchApi = async (endpoint, options = {}) => {
  const bases = buildApiBases();
  const method = String(options.method || "GET").toUpperCase();
  const canTryFallback = method === "GET" || method === "HEAD" || method === "OPTIONS";

  let lastError = null;

  for (let i = 0; i < bases.length; i++) {
    const base = bases[i];
    try {
      const res = await fetch(`${base}${endpoint}`, options);

      if (res.status === 502 && canTryFallback && i < bases.length - 1) {
        continue;
      }

      return res;
    } catch (err) {
      lastError = err;
      if (!canTryFallback || i === bases.length - 1) {
        throw err;
      }
    }
  }

  if (lastError) throw lastError;
  throw new Error("No se pudo contactar con la API");
};

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

  const res = await fetchApi(endpoint, {
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