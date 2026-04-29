import { API_URL } from './config'

const API = API_URL || import.meta.env.VITE_API_URL || 'http://localhost:8082/api'

export async function uploadFile(file, subDir = 'images') {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('subDir', subDir)
  const res = await fetch(`${API}/uploads`, { method: 'POST', body: fd })
  const text = await res.text()
  if (!res.ok) throw new Error(text)
  return text
}

export default { uploadFile }
