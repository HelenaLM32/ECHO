import { API_URL, fetchWithToken } from "./config";

export const getProfileByUserId = async (userId) => {
  const response = await fetch(`${API_URL}/profiles/${userId}`);
  if (!response.ok) throw new Error("Error al obtener el perfil");
  return response.json();
};

export const getProfileProducts = async (userId) => {
  const response = await fetch(`${API_URL}/profiles/${userId}/products`);
  if (!response.ok) throw new Error("Error al obtener los productos");
  return response.json();
};

export const getProfileServices = async (userId) => {
  const response = await fetch(`${API_URL}/profiles/${userId}/services`);
  if (!response.ok) throw new Error("Error al obtener los servicios");
  return response.json();
};

export const updateProfile = async (userId, profileData) => {
  const response = await fetchWithToken(`/profiles/${userId}`, {
    method: "PUT",
    body: JSON.stringify(profileData),
  });

  if (!response.ok) throw new Error("Error al actualizar el perfil");
  return response.json();
};

export const updateCredentials = async (userId, credentialsData) => {
  const response = await fetchWithToken(`/users/${userId}/credentials`, {
    method: "PATCH",
    body: JSON.stringify(credentialsData),
  });

  if (!response.ok) throw new Error("Error al actualizar las credenciales");
  return response.json();
};

export const updateAvatar = async (userId, file) => {
  const formData = new FormData();
  formData.append("avatarUrl", file);

  const response = await fetchWithToken(`/profiles/${userId}/avatar`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) throw new Error("Error al actualizar el avatar");
  return response.json();
};

export const updateBanner = async (userId, file) => {
  const formData = new FormData();
  formData.append("bannerUrl", file);

  const response = await fetchWithToken(`/profiles/${userId}/banner`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) throw new Error("Error al actualizar la portada");
  return response.json();
};

export const deleteAccount = async (userId) => {
  const response = await fetchWithToken(`/users/${userId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar la cuenta");
  return response.json();
};