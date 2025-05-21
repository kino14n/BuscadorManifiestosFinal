// server.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from './db.js';  // Asegúrate de que este archivo exporta correctamente tu pool de PG

const app = express();

// __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Puerto desde env o 3000 por defecto
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Detecta carpeta build en la raíz o dentro de src
let buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  buildPath = path.join(__dirname, 'src', 'build');
}
app.use(express.static(buildPath));

// Endpoint GET /api/manifiestos
app.get('/api/manifiestos', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM manifiestos ORDER BY fecha DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error consultando manifiestos:', err);
    res.status(500).json({ error: 'Consulta fallida' });
  }
});

// Endpoint POST /api/manifiestos
app.post('/api/manifiestos', async (req, res) => {
  const { titulo, contenido } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO manifiestos (titulo, contenido) VALUES ($1, $2) RETURNING *',
      [titulo, contenido]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error insertando manifiesto:', err);
    res.status(500).json({ error: 'Inserción fallida' });
  }
});

// Endpoint PUT /api/manifiestos/:id
app.put('/api/manifiestos/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, contenido } = req.body;
  try {
    const result = await pool.query(
      'UPDATE manifiestos SET titulo = $1, contenido = $2 WHERE id = $3 RETURNING *',
      [titulo, contenido, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error actualizando manifiesto:', err);
    res.status(500).json({ error: 'Actualización fallida' });
  }
});

// Endpoint DELETE /api/manifiestos/:id
app.delete('/api/manifiestos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM manifiestos WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error('Error eliminando manifiesto:', err);
    res.status(500).json({ error: 'Eliminación fallida' });
  }
});

// Fallback: sirve index.html para todas las rutas que no coincidan
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Arranca el servidor sin barras invertidas en los backticks
app.listen(PORT, () => {
  console.log(`🚀 Server en puerto ${PORT}`);
});
