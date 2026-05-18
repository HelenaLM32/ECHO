export async function handleResponse(res, defaultMessage = 'Error en la operación') {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || defaultMessage);
  }
  
  const contentType = res.headers.get('content-type');
  const contentLength = res.headers.get('content-length');
  
  if (contentLength === '0' || res.status === 204) {
    return null;
  }
  
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  
  return res.text();
}

export const handleApiResponse = handleResponse;

export async function handleApiError(error, defaultMessage = 'Error en la operación') {
  console.error(defaultMessage, error);
  throw error;
}