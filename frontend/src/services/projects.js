import { fetchApi, fetchWithToken } from "./config";
import { uploadFile } from './uploads'
import { handleResponse } from './errorHandler.js';

function dataURLtoFile(dataUrl, filename = 'file') {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

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
        try { b.src = await uploadFile(file, 'images') } catch (e) { console.error('Failed to upload image block:', e) }
      }
    }
    if (b.type === 'GALLERY') {
      if (Array.isArray(b.images)) {
        for (let i = 0; i < b.images.length; i++) {
          const src = b.images[i]
          if (typeof src === 'string' && src.startsWith('data:')) {
            const file = dataURLtoFile(src)
             try { b.images[i] = await uploadFile(file, 'images') } catch (e) { console.error('Failed to upload gallery image:', e) }
          }
        }
      }
    }
    if (b.type === 'VIDEO') {
      if (typeof b.url === 'string' && b.url.startsWith('data:')) {
        const file = dataURLtoFile(b.url)
        try { b.url = await uploadFile(file, 'video') } catch (e) { console.error('Failed to upload video block:', e) }
      }
    }
    if (b.type === 'AUDIO') {
      if (typeof b.audioSrc === 'string' && b.audioSrc.startsWith('data:')) {
        const file = dataURLtoFile(b.audioSrc)
        try { b.audioSrc = await uploadFile(file, 'audio') } catch (e) { console.error('Failed to upload audio block:', e) }
      }
    }
  }
  clone.blocks = blocksArr

  // background image
  let bg = clone.background
  if (bg && bg.mode === 'image' && typeof bg.value === 'string' && bg.value.startsWith('data:')) {
    const file = dataURLtoFile(bg.value)
    try { bg.value = await uploadFile(file, 'images') } catch (e) { console.error('Failed to upload background image:', e) }
    clone.background = bg
  }

  return clone
}

async function getCategories() {
  const res = await fetchApi('/categories')
  return handleResponse(res, 'Error al obtener las categorías')
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
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || `Error ${res.status}: No se pudo cargar el proyecto`)
  }
  return res.json()
}

async function deleteProject(projectId) {
  const res = await fetchWithToken(`/item-projects/${projectId}`, {
    method: 'DELETE',
  })
  return handleResponse(res, 'Error al eliminar el proyecto')
}

async function deleteProjectComment(projectId, commentId) {
  const res = await fetchWithToken(`/item-projects/${projectId}/comments/${commentId}`, {
    method: 'DELETE',
  })
  return handleResponse(res, 'Error al eliminar el comentario')
}

async function updateProject(id, projectPayload) {
  // Ensure any embedded base64 media are uploaded first and replaced with URLs.
  const payload = await replaceEmbeddedMedia(projectPayload)

  // Backend expects blocks and background as JSON strings
  if (payload.blocks && typeof payload.blocks !== 'string') payload.blocks = JSON.stringify(payload.blocks)
  if (payload.background && typeof payload.background !== 'string') payload.background = JSON.stringify(payload.background)

  const res = await fetchWithToken(`/item-projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(text)
  try { return JSON.parse(text) } catch { return text }
}

async function checkUserLiked(projectId) {
  const res = await fetchWithToken(`/item-projects/${projectId}/likes/status`)
  if (!res.ok) return { liked: false }
  return handleResponse(res, 'Error al verificar like')
}

export { createItem, createProject, getCategories, getAllProjects, getProjectsByUserId, getProjectById, deleteProject, deleteProjectComment, updateProject, checkUserLiked }