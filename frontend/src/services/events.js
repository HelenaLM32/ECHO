import { API_URL } from "./config";

export const getEventsByUser = async (userId) => {
 const res = await fetch(`${API_URL}/events/user/${userId}`);
 if (!res.ok) throw new Error("Error al cargar eventos");
 return res.json();
};

export const createEvent = async (data) => {
 const token = sessionStorage.getItem("token");
 const res = await fetch(`${API_URL}/events`, {
 method: "POST",
 headers: {
 Authorization: `Bearer ${token}`,
 "Content-Type": "application/json",
 },
 body: JSON.stringify(data),
 });
 if (!res.ok) {
 const text = await res.text();
 throw new Error(text || "Error al crear evento");
 }
 return res.json();
};

export const deleteEvent = async (eventId) => {
 const token = sessionStorage.getItem("token");
 const res = await fetch(`${API_URL}/events/${eventId}`, {
 method: "DELETE",
 headers: { Authorization: `Bearer ${token}` },
 });
 if (!res.ok) throw new Error("Error al eliminar evento");
 return res.json();
};
