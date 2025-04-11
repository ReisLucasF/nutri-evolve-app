
import pkg from 'pg';
const { Pool } = pkg;

// Database connection configuration
// This connection URI should be moved to environment variables in production
const connectionString = 'postgresql://nutriappdb_owner:npg_GSmYLI80pQMs@ep-green-fog-acl7wliu-pooler.sa-east-1.aws.neon.tech/nutriappdb?sslmode=require';

// Create a new connection pool
const pool = new Pool({
  connectionString,
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully:', res.rows[0].now);
  }
});

// Execute database queries
export const executeQuery = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Close the pool when the application is terminated
process.on('SIGINT', () => {
  pool.end().then(() => {
    console.log('Database pool has ended');
    process.exit(0);
  });
});
