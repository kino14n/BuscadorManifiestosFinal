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

// Servir estáticos de React
let buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  buildPath = path.join(__dirname, 'src', 'build');
}
app.use(express.static(buildPath));

// GET /api/manifiestos → lista
app.get('/api/manifiestos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM manifiestos ORDER BY fecha DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error consultando manifiestos:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/manifiestos → crea o actualiza
app.post('/api/manifiestos', async (req, res) => {
  const { id, titulo, contenido, fecha } = req.body;
  try {
    let row;
    if (id) {
      const q = `
        UPDATE manifiestos
        SET titulo=$1, contenido=$2, fecha=$3
        WHERE id=$4
        RETURNING *`;
      ({ rows: [row] } = await pool.query(q, [titulo, contenido, fecha, id]));
    } else {
      const q = `
        INSERT INTO manifiestos (titulo, contenido, fecha)
        VALUES ($1,$2,$3)
        RETURNING *`;
      ({ rows: [row] } = await pool.query(q, [titulo, contenido, fecha]));
    }
    res.json(row);
  } catch (err) {
    console.error('Error guardando manifiesto:', err);
    res.status(500).json({ error: err.message });
  }
});

// Fallback React
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server en puerto ${PORT}`);
});
