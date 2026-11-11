import * as authService from '../services/authService.js';

// POST /api/register
export async function register(req, res) {
  const { username, email, password, address } = req.body;
  const user = await authService.register({ username, email, password, address });
  res.status(201).json({ user });
}
