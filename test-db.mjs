// test-db.mjs (en la raíz)
import pool from './db.js';   // ← antes tenías './src/db.js'

(async () => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    console.log('✔️ Conectado OK — time:', rows[0].now);
  } catch (err) {
    console.error('❌ Falló conexión:', err.code, err.message);
  } finally {
    await pool.end();
  }
})();
