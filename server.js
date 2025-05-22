// server.js (raíz del proyecto)

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

// Servir los assets de React
let buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  buildPath = path.join(__dirname, 'src', 'build');
}
app.use(express.static(buildPath));

// API: obtener manifiestos de la BD
app.get('/api/manifiestos', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        id,
        titulo,
        fecha,
        archivo_url,
        codigos
      FROM manifiestos
      ORDER BY fecha DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error consultando manifiestos:', err);
    res.status(500).json({ error: 'Error al consultar manifiestos' });
  }
});

// Fallback: React
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server en puerto ${PORT}`);
});

