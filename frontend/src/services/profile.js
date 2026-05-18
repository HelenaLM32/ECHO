import { API_URL, fetchWithToken, fetchApi } from "./config";
import { handleResponse } from './errorHandler.js';

export const getAllProfiles = async () => {
  const response = await fetchApi('/profiles');
  return handleResponse(response, 'Error al obtener los perfiles');
};

export const getProfileByUserId = async (userId) => {
  const response = await fetch(`${API_URL}/profiles/${userId}`);
  return handleResponse(response, 'Error al obtener el perfil');
};

export const getProfileProducts = async (userId) => {
  const response = await fetch(`${API_URL}/profiles/${userId}/products`);
  return handleResponse(response, 'Error al obtener los productos');
};

export const getProfileServices = async (userId) => {
  const response = await fetch(`${API_URL}/services/user/${userId}`);
  return handleResponse(response, 'Error al obtener los servicios');
};

export const updateProfile = async (userId, profileData) => {
  const response = await fetchWithToken(`/profiles/${userId}`, {
    method: "PUT",
    body: JSON.stringify(profileData),
  });

  return handleResponse(response, 'Error al actualizar el perfil');
};

export const updateCredentials = async (userId, credentialsData) => {
  const response = await fetchWithToken(`/users/${userId}/credentials`, {
    method: "PATCH",
    body: JSON.stringify(credentialsData),
  });

  return handleResponse(response, 'Error al actualizar las credenciales');
};

export const updateAvatar = async (userId, file) => {
  const formData = new FormData();
  formData.append("avatarUrl", file);

  const response = await fetchWithToken(`/profiles/${userId}/avatar`, {
    method: "PUT",
    body: formData,
  });

  return handleResponse(response, 'Error al actualizar el avatar');
};

export const updateBanner = async (userId, file) => {
  const formData = new FormData();
  formData.append("bannerUrl", file);

  const response = await fetchWithToken(`/profiles/${userId}/banner`, {
    method: "PUT",
    body: formData,
  });

  return handleResponse(response, 'Error al actualizar la portada');
};

export const deleteAccount = async (userId) => {
  const response = await fetchWithToken(`/users/${userId}`, {
    method: "DELETE",
  });
  
  return handleResponse(response, 'Error al eliminar la cuenta');
};