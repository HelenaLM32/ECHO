import { API_URL, fetchWithToken } from "./config";
import { handleResponse } from './errorHandler.js';

export const getReviewsByTarget = async (targetId, targetType) => {
  const res = await fetch(
    `${API_URL}/venue-event-reviews?targetId=${targetId}&targetType=${targetType}`
  );
  return handleResponse(res, 'Error al cargar reviews');
};

export const getAverageByTarget = async (targetId, targetType) => {
  const res = await fetch(
    `${API_URL}/venue-event-reviews/average?targetId=${targetId}&targetType=${targetType}`
  );
  return handleResponse(res, 'Error al cargar media');
};

export const createReview = async ({ targetId, targetType, score, comment }) => {
  const res = await fetchWithToken("/venue-event-reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetId, targetType, score, comment }),
  });
  return handleResponse(res, 'Error al crear review');
};

export const deleteReview = async (reviewId) => {
  const res = await fetchWithToken(`/venue-event-reviews/${reviewId}`, {
    method: "DELETE",
  });
  return handleResponse(res, 'Error al eliminar review');
};