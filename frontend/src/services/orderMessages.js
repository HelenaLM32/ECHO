import { fetchWithToken } from "./config.js";

export async function getOrderMessages(orderId) {
  const res = await fetchWithToken(`/orders/${orderId}/messages`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function sendOrderMessage(orderId, content) {
  const res = await fetchWithToken(`/orders/${orderId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
