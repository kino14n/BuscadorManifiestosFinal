// server.js

import express from 'express';
import path from 'path';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Sirve el build de React (la carpeta build se crea en postinstall)
app.use(express.static(path.join(process.cwd(), 'build')));

// Ejemplo de endpoint para tu base de datos
app.get('/api/manifiestos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM manifiestos');
    res.json(rows);
  } catch (err) {
    console.error('Error consultando manifiestos:', err);
    res.status(500).send('Error en la consulta de manifiestos');
  }
});

// Cualquier otra ruta, devuelve el index.html de React
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'build', 'index.html'));
});

// Arranca el servidor en el puerto configurado
app.listen(PORT, () => console.log(`🚀 Server en puerto ${PORT}`));
