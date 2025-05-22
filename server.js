// server.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from './src/db.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Sirve la carpeta build de React
let buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  buildPath = path.join(__dirname, 'src', 'build');
}
app.use(express.static(buildPath));

// --- API REST para CRUD de manifiestos ---

// Listar todos
app.get('/api/manifiestos', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM manifiestos ORDER BY fecha DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Consulta fallida' });
  }
});

// Crear nuevo
app.post('/api/manifiestos', async (req, res) => {
  const { name, date, codes, fileName, fileData } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO manifiestos (name, fecha, codes, filename, filedata)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, date, codes, fileName, fileData]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Creación fallida' });
  }
});

// Actualizar existente
app.put('/api/manifiestos/:id', async (req, res) => {
  const id = req.params.id;
  const { name, date, codes, fileName, fileData } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE manifiestos
       SET name=$1, fecha=$2, codes=$3, filename=$4, filedata=$5
       WHERE id=$6 RETURNING *`,
      [name, date, codes, fileName, fileData, id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Actualización fallida' });
  }
});

// Borrar uno o varios
app.delete('/api/manifiestos', async (req, res) => {
  const { ids } = req.body; // { ids: [1,2,3] }
  try {
    await pool.query(
      `DELETE FROM manifiestos WHERE id = ANY($1::int[])`,
      [ids]
    );
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Eliminación fallida' });
  }
});

// Fallback a React
app.get('*', (_req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server corriendo en puerto ${PORT}`);
});
