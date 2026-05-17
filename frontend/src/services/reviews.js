import { fetchWithToken } from "./config.js";
import { API_URL } from "./config.js";
import { handleResponse } from './errorHandler.js';

export async function createReview(orderId, score, comment) {
  const res = await fetchWithToken("/reviews", {
    method: "POST",
    body: JSON.stringify({ orderId, score, comment }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Error al enviar la review");
  }
  return res.json();
}

export async function getReviewByOrder(orderId) {
  const res = await fetchWithToken(`/reviews/order/${orderId}`);
  if (!res.ok) throw new Error("Error al obtener la review");
  const text = await res.text();
  return text === "null" ? null : JSON.parse(text);
}

export async function getReviewsByUser(userId) {
  const res = await fetch(`${API_URL}/reviews/user/${userId}`);
  return handleResponse(res, 'Error al obtener reviews');
}

export async function getAverageByUser(userId) {
  const res = await fetch(`${API_URL}/reviews/user/${userId}/average`);
  return handleResponse(res, 'Error al obtener media');
}

export async function getAllReviews() {
  const res = await fetchWithToken("/reviews");
  return handleResponse(res, 'Error al obtener reviews');
}

export async function deleteReview(reviewId) {
  const res = await fetchWithToken(`/reviews/${reviewId}`, { method: "DELETE" });
  return handleResponse(res, 'Error al eliminar la review');
}