import { fetchWithToken } from "./config.js";
import { handleResponse } from './errorHandler.js';

export async function getMyOrders() {
  const res = await fetchWithToken("/orders");
  return handleResponse(res, 'Error al obtener tus pedidos');
}

export async function getOrderById(orderId) {
  const res = await fetchWithToken(`/orders/${orderId}`);
  return handleResponse(res, 'Error al obtener el pedido');
}

export async function createOrder(itemId, finalPrice) {
  const res = await fetchWithToken("/orders", {
    method: "POST",
    body: JSON.stringify({ itemId, finalPrice: finalPrice ?? null }),
  });
  return handleResponse(res, 'Error al crear el pedido');
}

export async function updateOrderStatus(orderId, status) {
  const res = await fetchWithToken(`/orders/${orderId}/status?status=${encodeURIComponent(status)}`, {
    method: "PATCH",
  });
  return handleResponse(res, 'Error al actualizar el estado del pedido');
}