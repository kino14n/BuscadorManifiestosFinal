// src/db.js
import pkg from 'pg';
const { Pool } = pkg;

// Usa la URL de entorno que definiste en Render
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('ERROR: no hay DATABASE_URL en variables de entorno.');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
