import bcrypt from 'bcrypt';
import * as userModel from '../models/userModel.js';
import HttpError from '../utils/HttpError.js';

// Cost factor for bcrypt: each +1 doubles the hashing time. 12 is a common balance
// between security and speed (~250ms per hash).
const SALT_ROUNDS = 12;

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
