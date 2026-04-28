import { API_URL } from "./config";

export const createVenue = async (formData) => {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${API_URL}/venues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error al crear el local");
  }

  return await res.json();
};

export const getVenuesByUser = async (userId) => {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${API_URL}/venues/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener los locales");
  }

  return await res.json();
};

export const getVenueById = async (venueId) => {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${API_URL}/venues/${venueId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener el local");
  }

  return await res.json();
};

export const updateVenue = async (venueId, formData) => {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${API_URL}/venues/${venueId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error al actualizar el local");
  }

  return await res.json();
};

export const deleteVenue = async (venueId) => {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${API_URL}/venues/${venueId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al eliminar el local");
  }

  return res.ok;
};