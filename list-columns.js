// list-columns.js
import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ ERROR: no tienes DATABASE_URL en tu entorno');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function listCols() {
  try {
    // Reemplaza "manifiestos" por el nombre de tu tabla si es distinto
    const res = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name   = 'manifiestos'
      ORDER BY ordinal_position;
    `);

    console.log('\n🗄️  Columnas de public.manifiestos:\n');
    res.rows.forEach(r => {
      console.log(` • ${r.column_name} — ${r.data_type}`);
    });
  } catch (err) {
    console.error('❌ Error listando columnas:', err);
  } finally {
    await pool.end();
  }
}

listCols();
