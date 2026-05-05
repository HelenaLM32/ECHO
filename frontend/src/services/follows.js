import { API_URL, fetchWithToken } from "./config";

export const getFollowStats = async (userId) => {
 const response = await fetch(`${API_URL}/follows/stats/${userId}`);
 if (!response.ok) throw new Error("Error al obtener estadisticas");
 return response.json();
};

export const checkIsFollowing = async (targetId) => {
 const response = await fetchWithToken(`/follows/check/${targetId}`);
 if (!response.ok) return { following: false };
 return response.json();
};

const parseResponse = async (res) => {
 const text = await res.text();
 if (!text) return {};
 try {
 return JSON.parse(text);
 } catch {
 return { message: text };
 }
};

export const followUser = async (targetId) => {
 const response = await fetchWithToken(`/follows/${targetId}`, {
 method: "POST",
 });
 if (!response.ok) {
 const text = await response.text();
 throw new Error(text || "Error al seguir");
 }
 return parseResponse(response);
};

export const unfollowUser = async (targetId) => {
 const response = await fetchWithToken(`/follows/${targetId}`, {
 method: "DELETE",
 });
 if (!response.ok) {
 const text = await response.text();
 throw new Error(text || "Error al dejar de seguir");
 }
 return parseResponse(response);
};