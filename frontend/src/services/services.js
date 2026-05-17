import { fetchApi, fetchWithToken } from './config.js';
import { handleResponse } from './errorHandler.js';

export const createService = async (data) => {
  const res = await fetchWithToken('/services', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return handleResponse(res, 'Error al crear el servicio');
};

export const updateService = async (id, data) => {
  const res = await fetchWithToken(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return handleResponse(res, 'Error al actualizar el servicio');
};

export const deleteService = async (id) => {
  const res = await fetchWithToken(`/services/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(res, 'Error al eliminar el servicio');
};

export const getMyServices = async () => {
  const res = await fetchWithToken('/services/me');
  return handleResponse(res, 'Error al obtener tus servicios');
};

export const getServiceById = async (id) => {
  const res = await fetchApi(`/services/${id}`);
  return handleResponse(res, 'Error al obtener el servicio');
};

export const getAllServices = async () => {
  const res = await fetchApi('/services');
  return handleResponse(res, 'Error al obtener los servicios');
};