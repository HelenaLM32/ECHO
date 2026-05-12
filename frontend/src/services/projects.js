import { fetchApi, fetchWithToken } from "./config";
import { uploadFile } from './uploads'

async function createItem(itemPayload) {
  const res = await fetchWithToken('/items/register', {
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
  // Ensure any embedded base64 media are uploaded first and replaced with URLs.
  // Accept projectPayload.blocks/background as either JSON string or objects.
  const payload = await replaceEmbeddedMedia(projectPayload)

  // Backend expects blocks and background as JSON strings (stored in DB as text)
  if (payload.blocks && typeof payload.blocks !== 'string') payload.blocks = JSON.stringify(payload.blocks)
  if (payload.background && typeof payload.background !== 'string') payload.background = JSON.stringify(payload.background)

  const body = JSON.stringify(payload)
  const res = await fetchWithToken('/item-projects/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(text)
  try { return JSON.parse(text) } catch { return text }
}

async function replaceEmbeddedMedia(project) {
  const clone = JSON.parse(JSON.stringify(project))

  // Normalize blocks to array for processing
  let blocksArr = clone.blocks
  if (typeof blocksArr === 'string') {
    try { blocksArr = JSON.parse(blocksArr) } catch { blocksArr = [] }
  }
  if (!Array.isArray(blocksArr)) blocksArr = []

  for (let b of blocksArr) {
    // image block: b.src may be data URL
    if (b.type === 'IMAGE') {
      if (typeof b.src === 'string' && b.src.startsWith('data:')) {
        const file = dataURLtoFile(b.src)
        try { b.src = await uploadFile(file, 'images') } catch (e) { /* silent fail */ }
      }
    }
    if (b.type === 'GALLERY') {
      if (Array.isArray(b.images)) {
        for (let i = 0; i < b.images.length; i++) {
          const src = b.images[i]
          if (typeof src === 'string' && src.startsWith('data:')) {
            const file = dataURLtoFile(src)
            try { b.images[i] = await uploadFile(file, 'images') } catch (e) { /* silent fail */ }
          }
        }
      }
    }
    if (b.type === 'VIDEO') {
      if (typeof b.url === 'string' && b.url.startsWith('data:')) {
        const file = dataURLtoFile(b.url)
        try { b.url = await uploadFile(file, 'video') } catch (e) { /* silent fail */ }
      }
    }
    if (b.type === 'AUDIO') {
      if (typeof b.audioSrc === 'string' && b.audioSrc.startsWith('data:')) {
        const file = dataURLtoFile(b.audioSrc)
        try { b.audioSrc = await uploadFile(file, 'audio') } catch (e) { /* silent fail */ }
      }
    }
  }
  clone.blocks = blocksArr

  // background image
  let bg = clone.background
  if (bg && bg.mode === 'image' && typeof bg.value === 'string' && bg.value.startsWith('data:')) {
    const file = dataURLtoFile(bg.value)
    try { bg.value = await uploadFile(file, 'images') } catch (e) { /* silent fail */ }
    clone.background = bg
  }

  return clone
}

async function getCategories() {
  const res = await fetchApi('/categories')
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

async function getAllProjects() {
  const res = await fetchApi('/item-projects');
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  // Ensure we always return an array
  return Array.isArray(data) ? data : [];
}

async function getProjectsByUserId(userId) {
  const res = await fetchApi(`/item-projects/by-creator/${userId}`);
  if (!res.ok) {
    // fall back to full list when server endpoint not available
    const all = await getAllProjects();
    if (!Array.isArray(all)) return [];
    return all.filter(p => Number(p?.item?.creatorId) === Number(userId));
  }
  return res.json();
}

async function getProjectById(id) {
  const res = await fetchApi(`/item-projects/${id}`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

async function deleteProject(projectId) {
  const res = await fetchWithToken(`/item-projects/${projectId}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(await res.text())
  return true
}

async function deleteProjectComment(projectId, commentId) {
  const res = await fetchWithToken(`/item-projects/${projectId}/comments/${commentId}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export { createItem, createProject, getCategories, getAllProjects, getProjectsByUserId, getProjectById, deleteProject, deleteProjectComment }
