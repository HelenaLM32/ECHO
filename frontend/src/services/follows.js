import { API_URL } from "./config";

export const getFollowStats = async (userId) => {
 const response = await fetch(`${API_URL}/follows/stats/${userId}`);
 if (!response.ok) throw new Error("Error al obtener estadisticas");
 return response.json();
};

export const checkIsFollowing = async (targetId) => {
 const token = sessionStorage.getItem("token");
 const response = await fetch(`${API_URL}/follows/check/${targetId}`, {
 headers: { Authorization: `Bearer ${token}` },
 });
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
 const token = sessionStorage.getItem("token");
 const response = await fetch(`${API_URL}/follows/${targetId}`, {
 method: "POST",
 headers: {
 Authorization: `Bearer ${token}`,
 "Content-Type": "application/json",
 },
 });
 if (!response.ok) {
 const text = await response.text();
 throw new Error(text || "Error al seguir");
 }
 return parseResponse(response);
};

export const unfollowUser = async (targetId) => {
 const token = sessionStorage.getItem("token");
 const response = await fetch(`${API_URL}/follows/${targetId}`, {
 method: "DELETE",
 headers: {
 Authorization: `Bearer ${token}`,
 "Content-Type": "application/json",
 },
 });
 if (!response.ok) {
 const text = await response.text();
 throw new Error(text || "Error al dejar de seguir");
 }
 return parseResponse(response);
};