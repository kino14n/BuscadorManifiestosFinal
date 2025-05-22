// src/server.js
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

// servir la carpeta build de React
let buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  buildPath = path.join(__dirname, 'src', 'build');
}
app.use(express.static(buildPath));

/**
 * GET /api/manifiestos
 * Devuelve todos los manifiestos ordenados por fecha desc.
 */
app.get('/api/manifiestos', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        id,
        titulo  AS nombre,
        fecha   AS fecha,
        archivo_url AS archivo,
        codigos
      FROM manifiestos
      ORDER BY fecha DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error consultando manifiestos:', err);
    res.status(500).json({ error: 'Consulta fallida' });
  }
});

/**
 * POST /api/manifiestos
 * Crea un nuevo manifiesto.
 */
app.post('/api/manifiestos', async (req, res) => {
  const { titulo, fecha, archivo_url, codigos } = req.body;
  try {
    const { rows } = await pool.query(`
      INSERT INTO manifiestos (titulo, fecha, archivo_url, codigos)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [titulo, fecha, archivo_url, codigos]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error insertando manifiesto:', err);
    res.status(500).json({ error: 'Inserción fallida' });
  }
});

/**
 * PUT /api/manifiestos/:id
 * Actualiza un manifiesto existente.
 */
app.put('/api/manifiestos/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, fecha, archivo_url, codigos } = req.body;
  try {
    const { rowCount, rows } = await pool.query(`
      UPDATE manifiestos
      SET titulo = $1, fecha = $2, archivo_url = $3, codigos = $4
      WHERE id = $5
      RETURNING *
    `, [titulo, fecha, archivo_url, codigos, id]);
    if (!rowCount) return res.status(404).json({ error: 'No existe el manifiesto' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error actualizando manifiesto:', err);
    res.status(500).json({ error: 'Actualización fallida' });
  }
});

/**
 * DELETE /api/manifiestos/:id
 * Elimina un manifiesto.
 */
app.delete('/api/manifiestos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query(`
      DELETE FROM manifiestos
      WHERE id = $1
    `, [id]);
    if (!rowCount) return res.status(404).json({ error: 'No existe el manifiesto' });
    res.status(204).send();
  } catch (err) {
    console.error('Error eliminando manifiesto:', err);
    res.status(500).json({ error: 'Eliminación fallida' });
  }
});

// fallback: servir index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server en puerto ${PORT}`);
});
