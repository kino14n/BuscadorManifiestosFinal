// server.js
import express from 'express';
import cors from 'cors';
import pool from './db.js';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 10000;

// Listar todos
app.get('/api/manifestos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, titulo, contenido, fecha, codigos
      FROM manifiestos ORDER BY fecha DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error consultando manifiestos:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

// Crear uno nuevo
app.post('/api/manifestos', async (req, res) => {
  const { titulo, contenido, fecha, codigos } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO manifiestos (titulo, contenido, fecha, codigos)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [titulo, contenido, fecha, JSON.stringify(codigos)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creando manifiesto:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

// Servir el build de React
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'src', 'build')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server en puerto ${port}`);
});
