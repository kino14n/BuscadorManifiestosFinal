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

let buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  buildPath = path.join(__dirname, 'src', 'build');
}
app.use(express.static(buildPath));

// GET todos
app.get('/api/manifiestos', async (_, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM manifiestos ORDER BY fecha DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener manifiestos' });
  }
});

// GET uno
app.get('/api/manifiestos/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM manifiestos WHERE id = $1', [req.params.id]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el manifiesto' });
  }
});

// POST crear
app.post('/api/manifiestos', async (req, res) => {
  const { name, date, codes, fileName, fileData } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO manifiestos(name, fecha, codes, filename, filedata)
       VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [name, date, codes, fileName, fileData]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear manifiesto' });
  }
});

// PUT actualizar
app.put('/api/manifiestos/:id', async (req, res) => {
  const { name, date, codes, fileName, fileData } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE manifiestos SET name=$1, fecha=$2, codes=$3, filename=$4, filedata=$5
       WHERE id=$6 RETURNING *`,
      [name, date, codes, fileName, fileData, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar manifiesto' });
  }
});

// DELETE
app.delete('/api/manifiestos', async (req, res) => {
  const { ids } = req.body;
  try {
    await pool.query(`DELETE FROM manifiestos WHERE id = ANY($1)`, [ids]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

// Fallback React
app.get('*', (_, res) =>
  res.sendFile(path.join(buildPath, 'index.html'))
);

app.listen(PORT, () => console.log(`🚀 Server en puerto ${PORT}`));
