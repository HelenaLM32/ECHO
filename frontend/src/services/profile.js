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


const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); 
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const updateAvatar = async (userId, file) => {
  const base64 = await fileToBase64(file);
  const res = await fetchWithToken(`/profiles/${userId}/avatar`, {
    method: "PUT",
    body: JSON.stringify({ avatarUrl: base64 }),
  });
  if (!res.ok) throw new Error("Error al actualizar el avatar");
  return await res.json();
};

export const updateBanner = async (userId, file) => {
  const base64 = await fileToBase64(file);
  const res = await fetchWithToken(`/profiles/${userId}/banner`, {
    method: "PUT",
    body: JSON.stringify({ bannerUrl: base64 }),
  });
  if (!res.ok) throw new Error("Error al actualizar el banner");
  return await res.json();
};