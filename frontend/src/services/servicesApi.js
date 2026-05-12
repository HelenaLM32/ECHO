import { fetchApi, fetchWithToken } from './config.js';

export const createService = (data, token) => {
  return fetchWithToken('/services', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

export const updateService = (id, data, token) => {
  return fetchWithToken(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

export const deleteService = (id, token) => {
  return fetchWithToken(`/services/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

export const getMyServices = (token) => {
  return fetchWithToken('/services/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

export const getServiceById = (id) => {
  return fetchApi(`/services/${id}`);
};

export const getAllServices = async () => {
  const res = await fetchApi('/services');
  if (!res.ok) throw new Error('Error al obtener los servicios');
  return res.json();
};