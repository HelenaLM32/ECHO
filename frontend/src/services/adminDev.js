import { fetchWithToken } from "./config";
import { handleResponse } from './errorHandler.js';

export async function getDevOrders() {
  const res = await fetchWithToken("/admin/dev/orders");
  return handleResponse(res, 'Error al obtener los pedidos de desarrollo');
}

export async function createDevOrder(payload) {
  const res = await fetchWithToken("/admin/dev/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return handleResponse(res, 'Error al crear el pedido de desarrollo');
}

export async function updateDevOrderStatus(orderId, status) {
  const res = await fetchWithToken(`/admin/dev/orders/${orderId}/status?status=${encodeURIComponent(status)}`, {
    method: "PATCH",
  });
  return handleResponse(res, 'Error al actualizar el estado del pedido');
}

export async function getDevOrderMessages(orderId) {
  const res = await fetchWithToken(`/admin/dev/orders/${orderId}/messages`);
  return handleResponse(res, 'Error al obtener los mensajes del pedido');
}

export async function createDevOrderMessage(orderId, senderId, content) {
  const res = await fetchWithToken(`/admin/dev/orders/${orderId}/messages`, {
    method: "POST",
    body: JSON.stringify({ senderId, content }),
  });
  return handleResponse(res, 'Error al crear el mensaje del pedido');
}

export async function createDevUser(payload) {
  const res = await fetchWithToken("/users/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return handleResponse(res, 'Error al crear el usuario de desarrollo');
}

export async function createDevItem(payload) {
  const res = await fetchWithToken("/items/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createDevProject(payload) {
  const res = await fetchWithToken("/admin/dev/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createDevService(payload) {
  const res = await fetchWithToken("/admin/dev/services", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createDevVenue(payload) {
  const res = await fetchWithToken("/admin/dev/venues", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createDevEvent(payload) {
  const res = await fetchWithToken("/admin/dev/events", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteDevContent(type, id) {
  const res = await fetchWithToken(`/admin/dev/content/${encodeURIComponent(type)}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}
