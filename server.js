// server.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from './db.js';

const app = express();

// __dirname para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// Antes de arrancar, crea la tabla si no existe
async function ensureTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS manifiestos (
      id SERIAL PRIMARY KEY,
      titulo TEXT NOT NULL,
      contenido TEXT NOT NULL,
      fecha TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `;
  try {
    await pool.query(sql);
    console.log('✅ Tabla "manifiestos" verificada/creada.');
  } catch (err) {
    console.error('❌ Error creando tabla manifiestos:', err);
    process.exit(1);
  }
}

// Detecta buildPath (tanto si está en /build como en /src/build)
const inHereBuild  = path.join(__dirname, 'build');
const inSrcBuild   = path.join(__dirname, 'src', 'build');
let buildPath;
if (fs.existsSync(inHereBuild)) {
  buildPath = inHereBuild;
} else if (fs.existsSync(inSrcBuild)) {
  buildPath = inSrcBuild;
} else {
  console.error('❌ No se encontró carpeta build.');
  process.exit(1);
}

app.use(express.json());
app.use(express.static(buildPath));

// CRUD endpoints
app.get('/api/manifiestos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM manifiestos ORDER BY fecha DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error consultando manifiestos:', err);
    res.status(500).json({ error: 'Consulta fallida' });
  }
});

app.post('/api/manifiestos', async (req, res) => {
  const { titulo, contenido } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO manifiestos(titulo, contenido) VALUES($1,$2) RETURNING *',
      [titulo, contenido]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error insertando manifiesto:', err);
    res.status(500).json({ error: 'Inserción fallida' });
  }
});

app.put('/api/manifiestos/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, contenido } = req.body;
  try {
    const result = await pool.query(
      'UPDATE manifiestos SET titulo=$1, contenido=$2 WHERE id=$3 RETURNING *',
      [titulo, contenido, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error actualizando manifiesto:', err);
    res.status(500).json({ error: 'Actualización fallida' });
  }
});

app.delete('/api/manifiestos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM manifiestos WHERE id=$1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error('Error eliminando manifiesto:', err);
    res.status(500).json({ error: 'Eliminación fallida' });
  }
});

// Fallback a React
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Lógica de arranque
(async () => {
  await ensureTable();
  app.listen(PORT, () => console.log(`🚀 Server escuchando en puerto ${PORT}`));
})();
