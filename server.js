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

// Si sirves front desde build/ (crear un único build en la raíz)
let buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  buildPath = path.join(__dirname, 'src', 'build');
}
app.use(express.static(buildPath));

// ←–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––→
//    1) LISTAR MANIFIESTOS
app.get('/api/manifiestos', async (_, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         id,
         nombre  AS name,
         fecha   AS date,
         archivo AS fileData,
         codes   AS codes
       FROM manifiestos
       ORDER BY fecha DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al listar manifiestos:', err);
    res.status(500).json({ error: 'Error al listar manifiestos' });
  }
});

// ← aquí irían tus endpoints de CREATE, UPDATE, DELETE si los necesitas…
//       POST /api/manifiestos
//       PUT  /api/manifiestos/:id
//       DELETE /api/manifiestos/:id

// Fallback para React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server en puerto ${PORT}`);
});
