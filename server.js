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

// Servir React build
let buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  buildPath = path.join(__dirname, 'src', 'build');
}
app.use(express.static(buildPath));

// GET all
app.get('/api/manifiestos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM manifiestos ORDER BY fecha DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'consulta fallida' });
  }
});

// POST new
app.post('/api/manifiestos', async (req, res) => {
  const { name, date, codes, fileName, fileData } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO manifiestos (nombre, fecha, codigos, archivo_nombre, archivo_url)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, date, codes, fileName, fileData]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'inserción fallida' });
  }
});

// PUT update
app.put('/api/manifiestos/:id', async (req, res) => {
  const id = req.params.id;
  const { name, date, codes, fileName, fileData } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE manifiestos SET nombre=$1, fecha=$2, codigos=$3, archivo_nombre=$4, archivo_url=$5
       WHERE id=$6 RETURNING *`,
      [name, date, codes, fileName, fileData, id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'actualización fallida' });
  }
});

// DELETE batch
app.delete('/api/manifiestos', async (req, res) => {
  const { ids } = req.body; // [1,2,3]
  try {
    await pool.query(
      `DELETE FROM manifiestos WHERE id = ANY($1::int[])`,
      [ids]
    );
    res.json({ deleted: ids.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'borrado fallido' });
  }
});

// Fallback React
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 Server en puerto ${PORT}`));
