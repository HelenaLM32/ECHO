import { API_URL } from "./config";

export const loginService = async (email, password) => {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error al iniciar sesión");
  }

  return await res.json();
};

export const registerService = async (email, username, password) => {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username, password }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error al registrar");
  }

  return await res.json();
};