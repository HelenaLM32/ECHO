import { API_URL, fetchWithToken } from "./config";

export const getEventsByUser = async (userId) => {
  const res = await fetch(`${API_URL}/events/user/${userId}`);
  if (!res.ok) throw new Error("Error al cargar eventos");
  return res.json();
};

export const createEvent = async (data, imgFile) => {
  const formData = new FormData();
  formData.append("venueId",   data.venueId);
  formData.append("startDate", data.startDate);
  formData.append("endDate",   data.endDate);
  if (data.title)                        formData.append("title",        data.title);
  if (data.description)                  formData.append("description",  data.description);
  if (data.precio      !== undefined)    formData.append("precio",        data.precio);
  if (data.categoria)                    formData.append("categoria",    data.categoria);
  if (data.linkEntradas)                 formData.append("linkEntradas", data.linkEntradas);
  if (imgFile)                           formData.append("img",          imgFile);

  const res = await fetchWithToken(`/events`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error al crear evento");
  }
  return res.json();
};

export const updateEvent = async (eventId, data, imgFile) => {
  const formData = new FormData();
  if (data.title)                        formData.append("title",        data.title);
  if (data.description !== undefined)    formData.append("description",  data.description);
  if (data.startDate)                    formData.append("startDate",    data.startDate);
  if (data.endDate)                      formData.append("endDate",      data.endDate);
  if (data.precio      !== undefined)    formData.append("precio",        data.precio);
  if (data.categoria)                    formData.append("categoria",    data.categoria);
  if (data.linkEntradas)                 formData.append("linkEntradas", data.linkEntradas);
  if (imgFile)                           formData.append("img",          imgFile);

  const res = await fetchWithToken(`/events/${eventId}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error al actualizar evento");
  }
  return res.json();
};

export const deleteEvent = async (eventId) => {
  const res = await fetchWithToken(`/events/${eventId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar evento");
  return res.json();
};

export const getEventById = async (eventId) => {
  const res = await fetchWithToken(`/events/${eventId}`);
  if (!res.ok) throw new Error("Error al cargar el evento");
  return res.json();
};
