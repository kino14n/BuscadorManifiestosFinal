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

// Sirve tu build de CRA
let buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  buildPath = path.join(__dirname, 'src', 'build');
}
app.use(express.static(buildPath));

// —————————————————————————————
// API REST para CRUD manifiestos
// —————————————————————————————

// Listar todos
app.get('/api/manifiestos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM manifiestos ORDER BY fecha DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error listando manifiestos' });
  }
});

// Obtener 1 por id
app.get('/api/manifiestos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM manifiestos WHERE id = $1', [id]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo manifiesto' });
  }
});

// Crear
app.post('/api/manifiestos', async (req, res) => {
  try {
    const { name, date, codes, fileName, fileData } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO manifiestos(name, fecha, codes, file_name, file_data)
       VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [name, date, codes, fileName, fileData]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creando manifiesto' });
  }
});

// Actualizar
app.put('/api/manifiestos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, codes, fileName, fileData } = req.body;
    const { rows } = await pool.query(
      `UPDATE manifiestos
       SET name=$1, fecha=$2, codes=$3, file_name=$4, file_data=$5
       WHERE id=$6 RETURNING *`,
      [name, date, codes, fileName, fileData, id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error actualizando manifiesto' });
  }
});

// Borrar varios
app.delete('/api/manifiestos', async (req, res) => {
  try {
    const { ids } = req.body; // { ids: [1,2,3] }
    await pool.query(
      `DELETE FROM manifiestos WHERE id = ANY($1::int[])`,
      [ids]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error borrando manifiestos' });
  }
});

// Fallback a React
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server en puerto ${PORT}`);
});
