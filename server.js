// server.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from './db.js';

const app = express();

// __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// Detecta dónde está tu carpeta build
const inHereBuild  = path.join(__dirname, 'build');
const inSrcBuild   = path.join(__dirname, 'src', 'build');
let buildPath;

if (fs.existsSync(inHereBuild)) {
  buildPath = inHereBuild;
} else if (fs.existsSync(inSrcBuild)) {
  buildPath = inSrcBuild;
} else {
  console.error('❌ No se encontró carpeta build ni en /build ni en /src/build');
  process.exit(1);
}

// Middlewares
app.use(express.json());
app.use(express.static(buildPath));

// CRUD sobre manifiestos

// GET all
app.get('/api/manifiestos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM manifiestos ORDER BY fecha DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Consulta fallida' });
  }
});

// POST create
app.post('/api/manifiestos', async (req, res) => {
  const { titulo, contenido } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO manifiestos(titulo, contenido) VALUES($1,$2) RETURNING *',
      [titulo, contenido]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Inserción fallida' });
  }
});

// PUT update
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
    console.error(err);
    res.status(500).json({ error: 'Actualización fallida' });
  }
});

// DELETE
app.delete('/api/manifiestos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM manifiestos WHERE id=$1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Eliminación fallida' });
  }
});

// Fallback a React
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Arranca el servidor
app.listen(PORT, () => {
  console.log(`🚀 Server escuchando en puerto ${PORT}`);
});
