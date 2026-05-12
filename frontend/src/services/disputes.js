import { fetchWithToken } from "./config.js";

export async function createDispute(orderId, reason) {
  const res = await fetchWithToken("/disputes", {
    method: "POST",
    body: JSON.stringify({ orderId, reason }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getDisputeById(disputeId) {
  const res = await fetchWithToken(`/disputes/${disputeId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getDisputeByOrderId(orderId) {
  const res = await fetchWithToken(`/disputes/order/${orderId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getUserDisputes() {
  const res = await fetchWithToken("/disputes/user/my-disputes");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getOpenDisputes() {
  const res = await fetchWithToken("/disputes/open");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getAllDisputes() {
  const res = await fetchWithToken("/disputes");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addMessageToDispute(disputeId, message) {
  const res = await fetchWithToken(`/disputes/${disputeId}/messages`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function closeDispute(disputeId, resolution) {
  const res = await fetchWithToken(`/disputes/${disputeId}/close`, {
    method: "PATCH",
    body: JSON.stringify({ resolution }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
