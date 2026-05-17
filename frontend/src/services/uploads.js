import { fetchWithToken } from './config'
import { handleResponse } from './errorHandler.js';

export async function uploadFile(file, subDir = 'images') {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('subDir', subDir)
  const res = await fetchWithToken('/uploads', { method: 'POST', body: fd })
  return handleResponse(res, 'Error al subir el archivo')
}

export default { uploadFile }