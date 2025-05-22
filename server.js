// server.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from './db.js';

const app     = express();
const __file  = fileURLToPath(import.meta.url);
const __dir   = path.dirname(__file);
const PORT    = process.env.PORT || 10000;

app.use(express.json());

// Servir build React
let buildPath = path.join(__dir, 'build');
if (!fs.existsSync(buildPath)) {
  buildPath = path.join(__dir, 'src', 'build');
}
app.use(express.static(buildPath));

// Listar
app.get('/api/manifiestos', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, titulo, contenido, fecha FROM manifiestos ORDER BY fecha DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error consultando manifiestos:', err);
    res.status(500).json({ error: 'Consulta fallida' });
  }
});

// Crear
app.post('/api/manifiestos', async (req, res) => {
  const { titulo, contenido, fecha } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO manifiestos (titulo, contenido, fecha)
       VALUES ($1,$2,$3) RETURNING id, titulo, contenido, fecha`,
      [titulo, contenido, fecha]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creando manifiesto:', err);
    res.status(500).json({ error: 'Inserción fallida' });
  }
});

// Actualizar
app.put('/api/manifiestos/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, contenido, fecha } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE manifiestos SET titulo=$1, contenido=$2, fecha=$3
       WHERE id=$4 RETURNING id, titulo, contenido, fecha`,
      [titulo, contenido, fecha, id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('Error actualizando manifiesto:', err);
    res.status(500).json({ error: 'Actualización fallida' });
  }
});

// Borrar
app.delete('/api/manifiestos/:id', async (req, res) => {
  try {
    await pool.query(`DELETE FROM manifiestos WHERE id=$1`, [req.params.id]);
    res.status(204).end();
  } catch (err) {
    console.error('Error borrando manifiesto:', err);
    res.status(500).json({ error: 'Eliminación fallida' });
  }
});

// React SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 Server en puerto ${PORT}`));
