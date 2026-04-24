import { API_URL } from "./config";

export const getFollowStats = async (userId) => {
  const response = await fetch(`${API_URL}/follows/stats/${userId}`);
  if (!response.ok) throw new Error("Error al obtener estadísticas");
  return response.json();
};

export const checkIsFollowing = async (targetId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/follows/check/${targetId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return { following: false };
  return response.json();
};

export const followUser = async (targetId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/follows/${targetId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Error al seguir");
  return response.json();
};

export const unfollowUser = async (targetId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/follows/${targetId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Error al dejar de seguir");
  return response.json();
};