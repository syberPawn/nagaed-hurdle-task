// Shared HTTP client for the backend services. All requests go to /api/..., which
// the Vite dev server (and Nginx in Docker) forwards to user-api or ai-service.

// Error thrown for any failed request. `message` is safe to show to the user;
// `details` holds per-field validation messages, e.g. { email: 'Email is invalid' }.
export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Network failure: server down, no connection, etc.
    throw new ApiError('Cannot reach the server. Please try again.', 0);
  }

  // Error responses from the API are JSON; anything else (e.g. a proxy error page) is not.
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error?.message ??
      (response.status >= 500
        ? 'The server is unavailable. Please try again later.'
        : `Request failed (${response.status})`);
    throw new ApiError(message, response.status, data?.error?.details);
  }

  return data;
}
