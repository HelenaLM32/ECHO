import { API_URL, fetchWithToken } from "./config";
import { handleResponse } from './errorHandler.js';

export const getFollowStats = async (userId) => {
  const response = await fetch(`${API_URL}/follows/stats/${userId}`);
  return handleResponse(response, 'Error al obtener estadísticas');
};

export const checkIsFollowing = async (targetId) => {
  const response = await fetchWithToken(`/follows/check/${targetId}`);
  if (!response.ok) return { following: false };
  return handleResponse(response, 'Error al verificar seguimiento');
};

export const followUser = async (targetId) => {
  const response = await fetchWithToken(`/follows/${targetId}`, {
    method: "POST",
  });
  return handleResponse(response, 'Error al seguir');
};

export const unfollowUser = async (targetId) => {
  const response = await fetchWithToken(`/follows/${targetId}`, {
    method: "DELETE",
  });
  return handleResponse(response, 'Error al dejar de seguir');
};