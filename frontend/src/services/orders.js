import { fetchWithToken } from "./config.js";


export async function getMyOrders() {
  const res = await fetchWithToken("/orders");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getOrderById(orderId) {
  const res = await fetchWithToken(`/orders/${orderId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createOrder(itemId, finalPrice) {
  const res = await fetchWithToken("/orders", {
    method: "POST",
    body: JSON.stringify({ itemId, finalPrice: finalPrice ?? null }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateOrderStatus(orderId, status) {
  const res = await fetchWithToken(`/orders/${orderId}/status?status=${encodeURIComponent(status)}`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
