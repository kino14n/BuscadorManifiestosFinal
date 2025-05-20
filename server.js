// server.js

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from './db.js';

const app = express();

// __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// 1️⃣ Ruta probable de build cuando ejecutas postinstall en /src
const inSrcBuild  = path.join(__dirname, 'src', 'build');
// 2️⃣ Ruta de build si el build se genera al nivel raíz
const inRootBuild = path.join(__dirname, 'build');

// Elige el build que exista
let buildPath;
if (fs.existsSync(inSrcBuild)) {
  buildPath = inSrcBuild;
} else if (fs.existsSync(inRootBuild)) {
  buildPath = inRootBuild;
} else {
  console.error('❌ No se encontró carpeta build ni en src/build ni en /build');
  process.exit(1);
}

// Sirve React
app.use(express.static(buildPath));

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

// Fallback a index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Arranca el servidor
app.listen(PORT, () => {
  console.log(`🚀 Server escuchando en puerto ${PORT}`);
});
