// server.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from './db.js';

const app = express();

// __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Puerto de Render o fallback a 3000
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Detecta carpeta build de React
let buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  buildPath = path.join(__dirname, 'src', 'build');
}
app.use(express.static(buildPath));

// --- Endpoint GET /api/manifiestos ---
// Mapea columnas de Postgres a los nombres que usa el front
app.get('/api/manifiestos', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        titulo   AS name,
        fecha    AS date,
        archivo  AS fileName,
        codigos  AS codes
      FROM manifiestos
      ORDER BY fecha DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error consultando manifiestos:', err);
    res.status(500).json({ error: 'Consulta fallida' });
  }
});

// Aquí agregarás POST, PUT y DELETE cuando sustituyas el localStorage

// Fallback: cualquier otra ruta la atiende React
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Arranca el servidor
app.listen(PORT, () => {
  console.log(`🚀 Server en puerto ${PORT}`);
});
