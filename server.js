// server.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from './src/db.js'; // Ajusta la ruta si tu db.js está en otro sitio

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Servir archivos estáticos del build de React
let buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  buildPath = path.join(__dirname, 'src', 'build');
}
app.use(express.static(buildPath));

// Endpoint para obtener todos los manifiestos
app.get('/api/manifiestos', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        id,
        nombre,       -- Nombre del documento
        fecha,        -- Fecha
        archivo_url,  -- URL/path al PDF
        codigos       -- Array o JSON con los códigos
      FROM manifiestos
      ORDER BY fecha DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error consultando manifiestos:', err);
    res.status(500).json({ error: 'Error al consultar manifiestos' });
  }
});

// Aquí podrías añadir POST, PUT y DELETE según necesites:
// app.post('/api/manifiestos', …)
// app.put('/api/manifiestos/:id', …)
// app.delete('/api/manifiestos', …)

// Fallback a React App
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server en puerto ${PORT}`);
});
