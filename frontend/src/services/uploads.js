import { fetchWithToken } from './config'

export async function uploadFile(file, subDir = 'images') {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('subDir', subDir)
  const res = await fetchWithToken('/uploads', { method: 'POST', body: fd })
  const text = await res.text()
  if (!res.ok) throw new Error(text)
  return text
}

export default { uploadFile }
