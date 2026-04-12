import { fetchWithToken } from "./config";

export async function getDevOrders() {
  const res = await fetchWithToken("/admin/dev/orders");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createDevOrder(payload) {
  const res = await fetchWithToken("/admin/dev/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateDevOrderStatus(orderId, status) {
  const res = await fetchWithToken(`/admin/dev/orders/${orderId}/status?status=${encodeURIComponent(status)}`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getDevOrderMessages(orderId) {
  const res = await fetchWithToken(`/admin/dev/orders/${orderId}/messages`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createDevOrderMessage(orderId, senderId, content) {
  const res = await fetchWithToken(`/admin/dev/orders/${orderId}/messages`, {
    method: "POST",
    body: JSON.stringify({ senderId, content }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createDevUser(payload) {
  const res = await fetchWithToken("/users/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createDevItem(payload) {
  const res = await fetchWithToken("/items/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
