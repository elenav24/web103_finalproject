import { pool } from "../config/database.js"

const getEvents = async (req, res) => {

  try {
    const query = `
      SELECT e.name, et.name AS event_type, e.description, e.date, e.budget, e.recurring
      FROM events AS e
      LEFT JOIN event_types AS et
        ON e.type_id = et.id
      WHERE user_id = $1
      ORDER BY e.date;`;

    const results = await pool.query(query, [req.user.uid]);

    res.status(200).json(results.rows);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: error.message });
  }
}

const getEventById = async (req, res) => {
  try {
    const query = `
    WITH gift_agg AS (
      SELECT contact_id, json_agg(
        json_build_object(
          'id', id,
          'name', name,
          'price', price,
          'status', status,
          'description', description,
          'url', url
        )
      ) AS gifts
      FROM gift_ideas
      GROUP BY contact_id
    )
    SELECT e.name, e.description, e.date, e.budget, e.recurring, et.name AS event_type,
      json_agg(
        json_build_object(
          'id', c.id,
          'name', c.name,
          'relationship', c.relationship,
          'email', c.email,
          'phone_number', c.phone_number,
          'notes', c.notes,
          'gifts', ga.gifts
        )
      )
    FROM events AS e
    JOIN event_types AS et
    ON e.type_id = et.id
    JOIN event_contacts AS ec
    ON e.id = event_id
    JOIN contacts AS c
    ON ec.contact_id = c.id
    LEFT JOIN gift_agg ga
    ON c.id = ga.contact_id
    WHERE e.id = $1 AND e.user_id = $2
    GROUP BY e.id, e.name, e.description, e.date, e.budget, e.recurring, et.name
    ;`

    const event_id = parseInt(req.params.id);
    const user_id = req.user.uid;

    const results = await pool.query(query, [event_id, user_id]);
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(results.rows[0]);

  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: error.message });
  }
}

const createEvent = async (req, res) => {

  try {
    const { name, type_id, description, date, budget, recurring } = req.body;

    const query = `
    INSERT INTO events (user_id, name, type_id, description, date, budget, recurring)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;`

    const results = await pool.query(query, [req.user.uid, name, type_id, description, date, budget, recurring])
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
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
}
