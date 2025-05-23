// server.js
import express from 'express';
import path from 'path';
import pool from './db.js';

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Listar
app.get('/api/manifestos', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, titulo, contenido, fecha FROM manifiestos`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error consultando manifestos:', err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Crear
app.post('/api/manifestos', async (req, res) => {
  const { titulo, contenido, fecha } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO manifiestos(titulo, contenido, fecha)
       VALUES($1, $2, $3) RETURNING *`,
      [titulo, contenido, fecha]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('Error insertando manifiesto:', err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Actualizar
app.put('/api/manifestos/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, contenido, fecha } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE manifiestos
       SET titulo=$1, contenido=$2, fecha=$3
       WHERE id=$4 RETURNING *`,
      [titulo, contenido, fecha, id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('Error actualizando:', err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Borrar
app.delete('/api/manifestos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM manifiestos WHERE id=$1`, [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('Error borrando:', err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Siempre al final: entrega React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log('🚀 Server en puerto', port));
