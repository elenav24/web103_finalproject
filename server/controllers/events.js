import { pool } from "../config/database.js"

const getEvents = async (req, res) => {
  try {
    const query = `
      SELECT e.id, e.name, e.type_id, et.name AS event_type, e.description,
             e.date, e.budget, e.recurring, e.image_url
      FROM events AS e
      LEFT JOIN event_types AS et ON e.type_id = et.id
      WHERE e.user_id = $1
      ORDER BY e.date;`;
    const results = await pool.query(query, [req.user.uid]);
    res.status(200).json(results.rows);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: 'Failed to load events. Please try again.' });
  }
}

const getEventById = async (req, res) => {
  try {
    const query = `
    WITH gift_agg AS (
      SELECT contact_id, json_agg(
        json_build_object(
          'id', id, 'name', name, 'price', price,
          'status', status, 'description', description, 'url', url
        )
      ) AS gifts
      FROM gift_ideas
      GROUP BY contact_id
    )
    SELECT e.id, e.name, e.type_id, e.description, e.date, e.budget, e.recurring,
           e.image_url, et.name AS event_type,
      json_agg(
        json_build_object(
          'id', c.id, 'name', c.name, 'relationship', c.relationship,
          'email', c.email, 'phone_number', c.phone_number,
          'notes', c.notes, 'gifts', ga.gifts
        )
      ) AS contacts
    FROM events AS e
    JOIN event_types AS et ON e.type_id = et.id
    JOIN event_contacts AS ec ON e.id = ec.event_id
    JOIN contacts AS c ON ec.contact_id = c.id
    LEFT JOIN gift_agg ga ON c.id = ga.contact_id
    WHERE e.id = $1 AND e.user_id = $2
    GROUP BY e.id, e.name, e.type_id, e.description, e.date, e.budget, e.recurring, e.image_url, et.name;`
    const event_id = parseInt(req.params.id);
    const results = await pool.query(query, [event_id, req.user.uid]);
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: 'Failed to load event. Please try again.' });
  }
}

const createEvent = async (req, res) => {
  try {
    const { name, type_id, description, date, budget, recurring, image_url, contact_ids } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Event name is required.' });
    if (!date) return res.status(400).json({ error: 'Event date is required.' });
    if (!type_id) return res.status(400).json({ error: 'Event type is required.' });

    const query = `
    INSERT INTO events (user_id, name, type_id, description, date, budget, recurring, image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;`
    const result = await pool.query(query, [
      req.user.uid, name.trim(), type_id, description || null,
      date, budget ? Math.round(Number(budget) * 100) / 100 : null,
      recurring ?? false, image_url || null
    ]);
    const event = result.rows[0];

    if (Array.isArray(contact_ids) && contact_ids.length > 0) {
      await Promise.all(contact_ids.map(cid =>
        pool.query(
          'INSERT INTO event_contacts (event_id, contact_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [event.id, cid]
        )
      ));
    }
    res.status(201).json(event);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: 'Failed to create event. Please try again.' });
  }
}

const updateEvent = async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, type_id, description, date, budget, recurring, image_url, contact_ids } = req.body;
    const id = parseInt(req.params.id);
    if (!name?.trim()) return res.status(400).json({ error: 'Event name is required.' });
    if (!date) return res.status(400).json({ error: 'Event date is required.' });

    await client.query('BEGIN');

    const query = `
    UPDATE events
    SET name = $1, type_id = $2, description = $3, date = $4, budget = $5, recurring = $6, image_url = $7
    WHERE id = $8 AND user_id = $9
    RETURNING *`;
    const results = await client.query(query, [
      name.trim(), type_id, description || null,
      date, budget ? Math.round(Number(budget) * 100) / 100 : null,
      recurring ?? false, image_url || null, id, req.user.uid
    ]);
    if (results.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Event not found.' });
    }

    if (Array.isArray(contact_ids)) {
      await client.query('DELETE FROM event_contacts WHERE event_id = $1', [id]);
      if (contact_ids.length > 0) {
        await Promise.all(contact_ids.map(cid =>
          client.query(
            'INSERT INTO event_contacts (event_id, contact_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [id, cid]
          )
        ));
      }
    }

    await client.query('COMMIT');
    res.status(200).json(results.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error({ message: error });
    res.status(500).json({ error: 'Failed to update event. Please try again.' });
  } finally {
    client.release();
  }
}

const deleteEvent = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const results = await pool.query(
      "DELETE FROM events WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.uid]
    );
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: 'Failed to delete event. Please try again.' });
  }
}

export default {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
}
