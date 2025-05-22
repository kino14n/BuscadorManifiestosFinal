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

// servir build de React
let buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  buildPath = path.join(__dirname, 'src', 'build');
}
app.use(express.static(buildPath));

// --- API REST para documentos ---

// Listar
app.get('/api/manifiestos', async (_, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, nombre AS name, fecha AS date, archivosrc AS fileData, codigos AS codes FROM manifiestos ORDER BY fecha DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar manifiestos' });
  }
});

// Crear
app.post('/api/manifiestos', async (req, res) => {
  const { name, date, fileData, codes } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO manifiestos (nombre, fecha, archivosrc, codigos)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre AS name, fecha AS date, archivosrc AS fileData, codigos AS codes`,
      [name, date, fileData, codes]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear manifiesto' });
  }
});

// Actualizar (códigos)
app.put('/api/manifiestos/:id/codigos', async (req, res) => {
  const { id } = req.params;
  const { codes } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE manifiestos SET codigos = $1 WHERE id = $2
       RETURNING id, nombre AS name, fecha AS date, archivosrc AS fileData, codigos AS codes`,
      [codes, id]
    );
    if (!rows.length) return res.status(404).end();
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar códigos' });
  }
});

// Eliminar
app.delete('/api/manifiestos', async (req, res) => {
  const { ids } = req.body; // [1,2,3]
  try {
    await pool.query(
      `DELETE FROM manifiestos WHERE id = ANY($1::int[])`,
      [ids]
    );
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar manifiestos' });
  }
});

// Fallback React
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server en puerto ${PORT}`);
});
