import express from 'express';
import path from 'path';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(process.cwd(), 'build')));

app.get('/api/manifiestos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM manifiestos');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en la consulta');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'build', 'index.html'));
});

app.listen(PORT, () => console.log(\`🚀 Server en puerto \${PORT}\`));
