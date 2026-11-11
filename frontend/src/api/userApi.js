import { apiRequest } from './client.js';

// GET /api/users/:id (protected) → { user }
export function getUser(id, token) {
  return apiRequest(`/users/${encodeURIComponent(id)}`, { token });
}
