// server.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from './db.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve React build
let buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  buildPath = path.join(__dirname, 'build');
}
app.use(express.static(buildPath));

// --- API routes ---

// listado
app.get('/api/manifiestos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM manifiestos ORDER BY fecha DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar' });
  }
});

// detalle
app.get('/api/manifiestos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM manifiestos WHERE id = $1', [id]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener' });
  }
});

// crear
app.post('/api/manifiestos', async (req, res) => {
  try {
    const { name, date, codes, fileName, fileData } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO manifiestos (nombre, fecha, codigos, archivo_nombre, archivo_datos)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, date, codes, fileName, fileData]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear' });
  }
});

// actualizar
app.put('/api/manifiestos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, codes, fileName, fileData } = req.body;
    const { rows } = await pool.query(
      `UPDATE manifiestos SET nombre=$1, fecha=$2, codigos=$3, archivo_nombre=$4, archivo_datos=$5
       WHERE id=$6 RETURNING *`,
      [name, date, codes, fileName, fileData, id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// borrar
app.delete('/api/manifiestos', async (req, res) => {
  try {
    const { ids } = req.body; // espera { ids: [1,2,3] }
    await pool.query('DELETE FROM manifiestos WHERE id = ANY($1)', [ids]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

// React fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server en puerto ${PORT}`);
});
