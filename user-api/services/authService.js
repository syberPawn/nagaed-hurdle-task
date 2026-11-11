import bcrypt from 'bcrypt';
import * as userModel from '../models/userModel.js';
import HttpError from '../utils/HttpError.js';
import { signAccessToken } from '../utils/jwt.js';

// Cost factor for bcrypt: each +1 doubles the hashing time. 12 is a common balance
// between security and speed (~250ms per hash).
const SALT_ROUNDS = 12;

// Used when the email doesn't exist, so login takes the same time either way and
// response timing can't reveal which emails are registered.
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', SALT_ROUNDS);

const DUPLICATE_MESSAGES = {
  email: 'Email already in use',
  username: 'Username already taken',
};

// Creates a new user and returns it (without the password hash).
export async function register({ username, email, password, address }) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const id = await userModel.createUser({ username, email, passwordHash, address });
    return await userModel.findById(id);
  } catch (err) {
    if (err.code === 'DUPLICATE') {
      throw new HttpError(409, DUPLICATE_MESSAGES[err.field]);
    }
    throw err;
  }
}

// Checks the credentials and returns { token, user }.
// Wrong email and wrong password give the same error, so attackers can't
// use login to discover which emails are registered.
export async function login({ email, password }) {
  const user = await userModel.findByEmailWithPassword(email);
  const passwordMatches = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);

  if (!user || !passwordMatches) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const { passwordHash, ...publicUser } = user;
  return { token: signAccessToken(publicUser), user: publicUser };
}
