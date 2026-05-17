import { API_URL, fetchApi, fetchWithToken } from "./config";
import { handleResponse } from './errorHandler.js';

export const getAllEvents = async () => {
  const res = await fetchApi('/events');
  return handleResponse(res, 'Error al obtener los eventos');
};

export const getEventsByUser = async (userId) => {
  const res = await fetch(`${API_URL}/events/user/${userId}`);
  return handleResponse(res, 'Error al cargar eventos');
};

export const createEvent = async (data, imgFile) => {
  const formData = new FormData();
  formData.append("venueId",   data.venueId);
  formData.append("startDate", data.startDate);
  formData.append("endDate",   data.endDate);
  if (data.title)                        formData.append("title",        data.title);
  if (data.description)                  formData.append("description",  data.description);
  if (data.precio      !== undefined)    formData.append("precio",        data.precio);
  if (data.categoria)                    formData.append("categoria",    data.categoria);
  if (data.linkEntradas)                 formData.append("linkEntradas", data.linkEntradas);
  if (imgFile)                           formData.append("img",          imgFile);

  const res = await fetchWithToken(`/events`, {
    method: "POST",
    body: formData,
  });

  return handleResponse(res, 'Error al crear evento');
};

export const updateEvent = async (eventId, data, imgFile, removeImg = false) => {
  const formData = new FormData();

  if (data.title)       formData.append("title",       data.title);
  formData.append("description", data.description ?? "");
  if (data.startDate)   formData.append("startDate",   data.startDate);
  if (data.endDate)     formData.append("endDate",      data.endDate);

  if (data.precio !== undefined && data.precio !== null) {
    formData.append("precio", data.precio);
  } else {
    formData.append("removePrice", "true"); 
  }

  if (data.categoria)    formData.append("categoria",    data.categoria);
  if (data.linkEntradas) formData.append("linkEntradas", data.linkEntradas);

  if (imgFile) {
    formData.append("img", imgFile);
  } else if (removeImg) {
    formData.append("removeImg", "true");
  }

  const res = await fetchWithToken(`/events/${eventId}`, {
    method: "PUT",
    body: formData,
  });

  return handleResponse(res, 'Error al actualizar evento');
};

export const deleteEvent = async (eventId) => {
  const res = await fetchWithToken(`/events/${eventId}`, {
    method: "DELETE",
  });
  return handleResponse(res, 'Error al eliminar evento');
};

export const getEventById = async (eventId) => {
  const res = await fetchWithToken(`/events/${eventId}`);
  return handleResponse(res, 'Error al cargar el evento');
};