import mysql from 'mysql2/promise';

// A pool keeps a small set of open connections and reuses them across requests,
// instead of opening a new connection for every query.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// Called once at startup so the server fails fast if the database is unreachable.
export async function verifyDatabaseConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

export default pool;
