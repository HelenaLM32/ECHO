import { API_URL, fetchWithToken } from "./config";

export const createVenue = async (formData) => {
  const res = await fetchWithToken(`${API_URL}/venues`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error al crear el local");
  }

  return await res.json();
};

export const getVenuesByUser = async (userId) => {
  const res = await fetchWithToken(`${API_URL}/venues/user/${userId}`);

  if (!res.ok) {
    throw new Error("Error al obtener los locales");
  }

  return await res.json();
};

export const getVenueById = async (venueId) => {
  const res = await fetchWithToken(`${API_URL}/venues/${venueId}`);

  if (!res.ok) {
    throw new Error("Error al obtener el local");
  }

  return await res.json();
};

export const updateVenue = async (venueId, formData) => {
  const res = await fetchWithToken(`${API_URL}/venues/${venueId}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error al actualizar el local");
  }

  return await res.json();
};

export const deleteVenue = async (venueId) => {
  const res = await fetchWithToken(`${API_URL}/venues/${venueId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error al eliminar el local");
  }

  return res.ok;
};
