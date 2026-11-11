import jwt from 'jsonwebtoken';

// Pin the algorithm on both sign and verify so a token can't be accepted
// with a different (weaker) algorithm than the one we issued it with.
const ALGORITHM = 'HS256';

// Creates a signed token identifying the user. `sub` (subject) is the standard
// JWT claim for "who this token is about".
export function signAccessToken(user) {
  return jwt.sign({ sub: String(user.id), username: user.username }, process.env.JWT_SECRET, {
    algorithm: ALGORITHM,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
}

// Returns the decoded payload if the token is valid and not expired; throws otherwise.
export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET, { algorithms: [ALGORITHM] });
}
