import pool from '../db.js';

// Columns that are safe to send to clients. password_hash is deliberately excluded.
const PUBLIC_COLUMNS = 'id, username, email, address, created_at, updated_at';

function toPublicUser(row) {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    address: row.address,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Inserts a user and returns its new id.
// If the email or username is already taken, throws an Error with
// code 'DUPLICATE' and field 'email' | 'username'.
export async function createUser({ username, email, passwordHash, address }) {
  try {
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash, address) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, address],
    );
    return result.insertId;
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      const duplicate = new Error('Duplicate user');
      duplicate.code = 'DUPLICATE';
      duplicate.field = err.sqlMessage.includes('uq_users_username') ? 'username' : 'email';
      throw duplicate;
    }
    throw err;
  }
}

// Returns the public user (no password hash), or null if not found.
export async function findById(id) {
  const [rows] = await pool.execute(`SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = ?`, [id]);
  return rows.length ? toPublicUser(rows[0]) : null;
}

// For login only: returns the user including passwordHash, or null if not found.
export async function findByEmailWithPassword(email) {
  const [rows] = await pool.execute(
    `SELECT ${PUBLIC_COLUMNS}, password_hash FROM users WHERE email = ?`,
    [email],
  );
  if (!rows.length) return null;
  return { ...toPublicUser(rows[0]), passwordHash: rows[0].password_hash };
}
