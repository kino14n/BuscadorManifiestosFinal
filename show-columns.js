// show-columns.js
import pkg from 'pg';
const { Pool } = pkg;

// Toma la URL de la BD de la variable de entorno
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ ERROR: no hay DATABASE_URL en variables de entorno');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function listCols() {
  try {
    // Ajusta 'manifiestos' si tu tabla tiene otro nombre
    const { rows } = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name   = 'manifiestos';
    `);
    console.table(rows);
  } catch (err) {
    console.error('❌ Error listando columnas:', err.message);
  } finally {
    await pool.end();
  }
}

listCols();
