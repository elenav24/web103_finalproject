import { pool } from "../config/database.js"

const getEvents = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM events WHERE user_id = $1 ORDER BY date;", [req.user.uid]);
    res.status(200).json(results.rows);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: error.message });
  }
}

const createEvent = async (req, res) => {

  try {
    const { user_id, name, type_id, description, date, budget, recurring } = req.body;

    const query = `
    INSERT INTO events (user_id, name, type_id, description, date, budget, recurring)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;`

    const results = await pool.query(query, [user_id, name, type_id, description, date, budget, recurring])
    res.status(201).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateEvent = async (req, res) => {

  try {
    const { name, type_id, description, date, budget, recurring } = req.body;
    const id = parseInt(req.params.id);

    const query = `
    UPDATE events
    SET name = $1, type_id = $2, description = $3, date = $4, budget = $5, recurring = $6
    WHERE id = $7 and user_id = $8
    RETURNING *`;

    const results = await pool.query(query, [name, type_id, description, date, budget, recurring, id, req.user.uid]);
    res.status(200).json(results.rows[0]);
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteEvent = async (req, res) => {

  try {
    const id = parseInt(req.params.id);
    const results = await pool.query("DELETE FROM events WHERE id = $1 AND user_id = $2 RETURNING *", [id, req.user.uid]);
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
}
