import { fetchWithToken } from "./config.js";
import { API_URL } from "./config.js";

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
  if (!res.ok) throw new Error("Error al obtener reviews");
  return res.json();
}

export async function getAverageByUser(userId) {
  const res = await fetch(`${API_URL}/reviews/user/${userId}/average`);
  if (!res.ok) throw new Error("Error al obtener media");
  return res.json();
}

export async function getAllReviews() {
  const res = await fetchWithToken("/reviews");
  if (!res.ok) throw new Error("Error al obtener reviews");
  return res.json();
}

export async function deleteReview(reviewId) {
  const res = await fetchWithToken(`/reviews/${reviewId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar la review");
  return res.json();
}
