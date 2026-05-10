import { API_URL, fetchWithToken } from "./config";

export const getReviewsByTarget = async (targetId, targetType) => {
  const res = await fetch(
    `${API_URL}/venue-event-reviews?targetId=${targetId}&targetType=${targetType}`
  );
  if (!res.ok) throw new Error("Error al cargar reviews");
  return res.json();
};

export const getAverageByTarget = async (targetId, targetType) => {
  const res = await fetch(
    `${API_URL}/venue-event-reviews/average?targetId=${targetId}&targetType=${targetType}`
  );
  if (!res.ok) throw new Error("Error al cargar media");
  return res.json();
};

export const createReview = async ({ targetId, targetType, score, comment }) => {
  const res = await fetchWithToken("/venue-event-reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetId, targetType, score, comment }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error al crear review");
  }
  return res.json();
};

export const deleteReview = async (reviewId) => {
  const res = await fetchWithToken(`/venue-event-reviews/${reviewId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar review");
  return res.json();
};