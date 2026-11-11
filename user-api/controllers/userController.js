import * as userService from '../services/userService.js';

// GET /api/users/:id  (protected)
// req.user is set by the authenticate middleware; req.params.id is validated and numeric.
export async function getUserById(req, res) {
  const user = await userService.getUserById(req.user.id, req.params.id);
  res.status(200).json({ user });
}
