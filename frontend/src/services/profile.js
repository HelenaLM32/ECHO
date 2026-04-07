import { API_URL, fetchWithToken } from "./config";

export const getProfileByUserId = async (userId) => {
  const res = await fetch(`${API_URL}/profiles/${userId}`);
  if (!res.ok) throw new Error("Perfil no encontrado");
  return await res.json();
};

export const updateProfile = async (userId, profileData) => {
  const res = await fetchWithToken(`/profiles/${userId}`, {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
  if (!res.ok) throw new Error("Error al actualizar el perfil");
  return await res.json();
};