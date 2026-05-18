/**
 * Standardized error handler for API responses
 * @param {Response} res - Fetch Response object
 * @param {string} defaultMessage - Default error message if response has no text
 * @returns {Promise<any>} - Parsed JSON or text response
 * @throws {Error} - Throws error with message from response or default
 */
export async function handleResponse(res, defaultMessage = 'Error en la operación') {
  if (!res.ok) {
    const errorText = await res.text();
    if (!errorText) {
      throw new Error(defaultMessage);
    }

    try {
      const parsedError = JSON.parse(errorText);
      const message =
        parsedError?.error ||
        parsedError?.message ||
        parsedError?.details ||
        errorText;
      throw new Error(String(message));
    } catch {
      throw new Error(errorText || defaultMessage);
    }
  }

  // Check if response has content
  const contentType = res.headers.get('content-type');
  const contentLength = res.headers.get('content-length');

  // Return null for empty responses (204 No Content, etc.)
  if (contentLength === '0' || res.status === 204) {
    return null;
  }

  const rawText = await res.text();
  if (!rawText) {
    return null;
  }

  // Parse JSON if content-type is application/json
  if (contentType && contentType.includes('application/json')) {
    return JSON.parse(rawText);
  }

  // Some backend endpoints return JSON with text/plain content-type.
  const trimmed = rawText.trim();
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      return JSON.parse(trimmed);
    } catch {
      // Fall through to raw text when payload is not valid JSON.
    }
  }

  // Otherwise return text
  return rawText;
}

/**
 * Legacy alias for backward compatibility
 * @deprecated Use handleResponse instead
 */
export const handleApiResponse = handleResponse;

/**
 * Legacy error handler alias
 * @deprecated Use handleResponse instead  
 */
export async function handleApiError(error, defaultMessage = 'Error en la operación') {
  console.error(defaultMessage, error);
  throw error;
}