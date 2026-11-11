import jwt from 'jsonwebtoken';
import HttpError from '../utils/HttpError.js';
import { verifyAccessToken } from '../utils/jwt.js';

// Protects a route: requires "Authorization: Bearer <token>".
// On success sets req.user = { id, username } and continues; otherwise responds 401.
export function authenticate(req, res, next) {
  // The standard response header telling clients which auth scheme to use.
  res.set('WWW-Authenticate', 'Bearer');

  const header = req.get('Authorization');
  if (!header) {
    throw new HttpError(401, 'Authentication required');
  }

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw new HttpError(401, 'Authorization header must be: Bearer <token>');
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new HttpError(401, 'Token expired');
    }
    throw new HttpError(401, 'Invalid token');
  }

  req.user = { id: Number(payload.sub), username: payload.username };
  next();
}
