import { API_URL } from "./config";

export const getEventsByUser = async (userId) => {
  const res = await fetch(`${API_URL}/events/user/${userId}`);
  if (!res.ok) throw new Error("Error al cargar eventos");
  return res.json();
};

export const createEvent = async (data, imgFile) => {
  const token = sessionStorage.getItem("token");

  const formData = new FormData();
  formData.append("venueId", data.venueId);
  formData.append("startDate", data.startDate);
  formData.append("endDate", data.endDate);
  if (data.title) formData.append("title", data.title);
  if (data.description) formData.append("description", data.description);
  if (imgFile) formData.append("img", imgFile);

  const res = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
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

export const updateEvent = async (eventId, data, imgFile) => {
  const token = sessionStorage.getItem("token");
  const formData = new FormData();
  if (data.title) formData.append("title", data.title);
  if (data.description !== undefined) formData.append("description", data.description);
  if (data.startDate) formData.append("startDate", data.startDate);
  if (data.endDate) formData.append("endDate", data.endDate);
  if (imgFile) formData.append("img", imgFile);

  const res = await fetch(`${API_URL}/events/${eventId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error al actualizar evento");
  }
  return res.json();
};