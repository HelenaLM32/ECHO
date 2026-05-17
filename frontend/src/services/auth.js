import { API_URL } from "./config";
import { handleResponse } from './errorHandler.js';

export const loginService = async (email, password) => {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(res, 'Error al iniciar sesión');
};

export const registerService = async (email, username, password) => {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username, password }),
  });

  return handleResponse(res, 'Error al registrar');
};