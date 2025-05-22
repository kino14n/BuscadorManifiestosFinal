// server.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from './db.js'; // db.js en la raíz

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
app.use(express.json());

// Detecta carpeta build
let buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  buildPath = path.join(__dirname, 'src', 'build');
}
app.use(express.static(buildPath));

// API Endpoints
app.get('/api/manifiestos', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        titulo,
        contenido,
        fecha
      FROM manifiestos
      ORDER BY fecha DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error consultando manifiestos:', err.message);
    res.status(500).json({ error: 'Consulta fallida' });
  }
});

// ...otros endpoints POST, PUT, DELETE que uses...

// Fallback React
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server en puerto ${PORT}`);
});
