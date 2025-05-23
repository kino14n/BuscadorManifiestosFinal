// server.js
import express from 'express';
import path from 'path';
import pool from './db.js';

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Obtener todos los manifiestos
app.get('/api/manifestos', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, titulo, contenido, fecha, codigos
      FROM manifestos
      ORDER BY fecha DESC
    `);

    // Asegurar que codigos sea un arreglo
    const docs = rows.map(r => ({
      ...r,
      codigos: typeof r.codigos === 'string'
        ? JSON.parse(r.codigos)
        : Array.isArray(r.codigos)
          ? r.codigos
          : []
    }));

    res.json(docs);
  } catch (err) {
    console.error('Error consultando manifestos:', err);
    res.status(500).json([]);
  }
});

// Crear un manifiesto
app.post('/api/manifestos', async (req, res) => {
  const { titulo, contenido, fecha, codigos } = req.body;
  try {
    const jsCodigos = JSON.stringify(codigos || []);
    const { rows } = await pool.query(`
      INSERT INTO manifestos (titulo, contenido, fecha, codigos)
      VALUES ($1, $2, $3, $4)
      RETURNING id, titulo, contenido, fecha, codigos
    `, [titulo, contenido, fecha, jsCodigos]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creando manifiesto:', err);
    res.status(500).json({ error: 'no pudo crear' });
  }
});

// Servir React en producción
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Puerto y arranque
const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`🚀 Server en puerto ${port}`));
