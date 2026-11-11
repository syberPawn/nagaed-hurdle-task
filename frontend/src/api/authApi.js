import { apiRequest } from './client.js';

// POST /api/register → { user }
export function register({ username, email, password, address }) {
  return apiRequest('/register', {
    method: 'POST',
    body: { username, email, password, address },
  });
}

// POST /api/login → { token, user }
export function login({ email, password }) {
  return apiRequest('/login', {
    method: 'POST',
    body: { email, password },
  });
}
