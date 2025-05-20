// db.js
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  console.error('❌ No se encontró DATABASE_URL en el entorno');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default pool;
