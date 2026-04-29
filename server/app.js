import express from 'express'
import cors from 'cors'
import eventsRouter from './routes/events.js'
import contactsRouter from './routes/contacts.js'
import usersRouter from './routes/users.js'
import giftsRouter from './routes/gifts.js'
import { pool } from './config/database.js'
import { verifyToken } from './middleware/auth.js'

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/events', eventsRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);
app.use('/api/gifts', giftsRouter);

app.get('/api/event-types', async (_req, res) => {
  try {
    const results = await pool.query('SELECT * FROM event_types ORDER BY id');
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/event-types', verifyToken, async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });
    const result = await pool.query(
      `INSERT INTO event_types (name, color)
       VALUES ($1, $2)
       ON CONFLICT (name) DO UPDATE SET color = EXCLUDED.color
       RETURNING *`,
      [name.trim(), color ?? '#94a3b8']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (_req, res) => {
  res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">GiftGiver API');
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

export default app;
