import { API_URL, fetchApi, fetchWithToken } from "./config";
import { handleResponse } from './errorHandler.js';

export const getAllVenues = async () => {
  const res = await fetchApi('/venues');
  return handleResponse(res, 'Error al obtener los locales');
};

export const createVenue = async (formData) => {
  const res = await fetchWithToken(`/venues`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res, 'Error al crear el local');
};

export const getVenuesByUser = async (userId) => {
  const res = await fetchWithToken(`/venues/user/${userId}`);
  return handleResponse(res, 'Error al obtener los locales');
};

export const getVenueById = async (venueId) => {
  const res = await fetchWithToken(`/venues/${venueId}`);
  return handleResponse(res, 'Error al obtener el local');
};

export const updateVenue = async (venueId, formData) => {
  const res = await fetchWithToken(`/venues/${venueId}`, {
    method: "PUT",
    body: formData,
  });
  return handleResponse(res, 'Error al actualizar el local');
};

export const deleteVenue = async (venueId) => {
  const res = await fetchWithToken(`/venues/${venueId}`, {
    method: "DELETE",
  });
  return handleResponse(res, 'Error al eliminar el local');
};