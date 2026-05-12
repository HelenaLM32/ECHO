export async function handleApiResponse(response) {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Error desconocido');
    throw new Error(errorText || `Error ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return await response.text();
}

export function handleApiError(error, defaultMessage = 'Error en la operación') {
  console.error('API Error:', error);
  return error instanceof Error ? error.message : defaultMessage;
}
