import { API_URL } from "./config";

const API = API_URL || import.meta.env.VITE_API_URL || 'http://localhost:8082/api'

async function createItem(itemPayload) {
  const res = await fetch(`${API}/items/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemPayload),
  })
  if (!res.ok) throw new Error(await res.text())
  const text = await res.text()
  // Robust parse: server sometimes returns JSON string; handle nested string
  try {
    const parsed = JSON.parse(text)
    if (typeof parsed === 'string') return JSON.parse(parsed)
    return parsed
  } catch (e) {
    // Fallback: return raw text
    try { return JSON.parse(text) } catch { return text }
  }
}

async function createProject(projectPayload) {
  const body = JSON.stringify(projectPayload)
  console.debug('createProject - request body:', projectPayload)
  const res = await fetch(`${API}/item-projects/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
  const text = await res.text()
  console.debug('createProject - response status:', res.status, 'body:', text)
  if (!res.ok) throw new Error(text)
  try { return JSON.parse(text) } catch { return text }
}

async function getCategories() {
  const res = await fetch(`${API}/categories`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

async function getAllProjects() {
  const res = await fetch(`${API}/item-projects`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function getProjectsByUserId(userId) {
  const res = await fetch(`${API}/item-projects/by-creator/${userId}`);
  if (!res.ok) {
    // fall back to full list when server endpoint not available
    const all = await getAllProjects();
    if (!Array.isArray(all)) return [];
    return all.filter(p => Number(p?.item?.creatorId) === Number(userId));
  }
  return res.json();
}

async function getProjectById(id) {
  const res = await fetch(`${API}/item-projects/${id}`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export { createItem, createProject, getCategories, getAllProjects, getProjectsByUserId, getProjectById }
