import { apiRequest } from './client.js';

// POST /api/suggest-username (ai-service) → { suggestions: [3 usernames] }
export function suggestUsernames(interests) {
  return apiRequest('/suggest-username', {
    method: 'POST',
    body: { interests },
  });
}
