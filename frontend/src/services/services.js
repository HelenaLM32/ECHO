import { fetchApi, fetchWithToken } from './config.js';

export const createService = (data) => {
  return fetchWithToken('/services', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const updateService = (id, data) => {
  return fetchWithToken(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

export const deleteService = (id) => {
  return fetchWithToken(`/services/${id}`, {
    method: 'DELETE'
  });
};

export const getMyServices = () => {
  return fetchWithToken('/services/me');
};

export const getServiceById = (id) => {
  return fetchApi(`/services/${id}`);
};

export const getAllServices = async () => {
  const res = await fetchApi('/services');
  if (!res.ok) throw new Error('Error al obtener los servicios');
  return res.json();
};