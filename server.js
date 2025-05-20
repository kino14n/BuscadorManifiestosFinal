// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const app = express();

// __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Puerto
const PORT = process.env.PORT || 3000;

// Sirve el build de React
app.use(express.static(path.join(__dirname, 'build')));

// Endpoint API
app.get('/api/manifiestos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM manifiestos');
    res.json(rows);
  } catch (err) {
    console.error('Error consultando manifiestos:', err);
    res.status(500).send('Error en la consulta de manifiestos');
  }
});

// Cualquier otra ruta devuelve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Arranca el servidor
app.listen(PORT, () => {
  console.log(`🚀 Server en puerto ${PORT}`);
});
