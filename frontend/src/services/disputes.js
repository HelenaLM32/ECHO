import { fetchWithToken } from "./config.js";
import { handleResponse } from './errorHandler.js';

export async function createDispute(orderId, reason) {
  const res = await fetchWithToken("/disputes", {
    method: "POST",
    body: JSON.stringify({ orderId, reason }),
  });
  return handleResponse(res, 'Error al crear la disputa');
}

export async function getDisputeById(disputeId) {
  const res = await fetchWithToken(`/disputes/${disputeId}`);
  return handleResponse(res, 'Error al obtener la disputa');
}

export async function getDisputeByOrderId(orderId) {
  const res = await fetchWithToken(`/disputes/order/${orderId}`);
  return handleResponse(res, 'Error al obtener la disputa del pedido');
}

export async function getUserDisputes() {
  const res = await fetchWithToken("/disputes/user/my-disputes");
  return handleResponse(res, 'Error al obtener tus disputas');
}

export async function getOpenDisputes() {
  const res = await fetchWithToken("/disputes/open");
  return handleResponse(res, 'Error al obtener disputas abiertas');
}

export async function getAllDisputes() {
  const res = await fetchWithToken("/disputes");
  return handleResponse(res, 'Error al obtener disputas');
}

export async function addMessageToDispute(disputeId, message) {
  const res = await fetchWithToken(`/disputes/${disputeId}/messages`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
  return handleResponse(res, 'Error al añadir mensaje a la disputa');
}

export async function closeDispute(disputeId, resolution) {
  const res = await fetchWithToken(`/disputes/${disputeId}/close`, {
    method: "PATCH",
    body: JSON.stringify({ resolution }),
  });
  return handleResponse(res, 'Error al cerrar la disputa');
}