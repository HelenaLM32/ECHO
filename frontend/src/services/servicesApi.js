import { API_URL, fetchWithToken } from './config.js';

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
  return fetch(`${API_URL}/services/${id}`);
};