import * as userModel from '../models/userModel.js';
import HttpError from '../utils/HttpError.js';

// Returns a user's public record. Users may only read their own record:
// the id in the URL must match the id in their token (prevents IDOR).
export async function getUserById(requesterId, userId) {
  if (requesterId !== userId) {
    throw new HttpError(403, 'You can only access your own user record');
  }

  const user = await userModel.findById(userId);
  if (!user) {
    // Possible if the account was deleted after the token was issued.
    throw new HttpError(404, 'User not found');
  }
  return user;
}
