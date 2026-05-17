import { fetchWithToken } from "./config.js";
import { handleResponse } from './errorHandler.js';

export async function getOrderMessages(orderId) {
  const res = await fetchWithToken(`/orders/${orderId}/messages`);
  return handleResponse(res, 'Error al obtener los mensajes del pedido');
}

export async function sendOrderMessage(orderId, content) {
  const res = await fetchWithToken(`/orders/${orderId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  return handleResponse(res, 'Error al enviar el mensaje');
}