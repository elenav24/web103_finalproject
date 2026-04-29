import { pool } from "../config/database.js";

const getGiftIdeas = async (req, res) => {
  try {
    const query = `
      SELECT gi.*
      FROM gift_ideas gi
      JOIN contacts c ON gi.contact_id = c.id
      WHERE c.user_id = $1
      ORDER BY gi.id;`
    const result = await pool.query(query, [req.user.uid]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: 'Failed to load gift ideas. Please try again.' });
  }
}

const addGiftIdea = async (req, res) => {
  try {
    const { contact_id, event_id, name, description, url, price, status } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Gift name is required.' });
    if (!contact_id) return res.status(400).json({ error: 'A contact is required for a gift idea.' });

    const ownerCheck = await pool.query(
      'SELECT id FROM contacts WHERE id = $1 AND user_id = $2',
      [contact_id, req.user.uid]
    );
    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Contact not found.' });
    }

    const query = `
    INSERT INTO gift_ideas (contact_id, event_id, name, description, url, price, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;`;
    const result = await pool.query(query, [
      contact_id, event_id || null, name.trim(),
      description || null, url || null,
      price != null ? Math.round(Number(price) * 100) / 100 : null,
      (status || 'idea').toLowerCase()
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: 'Failed to add gift idea. Please try again.' });
  }
}

const updateGiftIdea = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, url, price, status } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Gift name is required.' });

    const ownerCheck = await pool.query(
      `SELECT gi.id FROM gift_ideas gi
       JOIN contacts c ON gi.contact_id = c.id
       WHERE gi.id = $1 AND c.user_id = $2`,
      [id, req.user.uid]
    );
    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Gift idea not found.' });
    }

    const query = `
      UPDATE gift_ideas
      SET name = $1, description = $2, url = $3, price = $4, status = $5
      WHERE id = $6
      RETURNING *;`
    const result = await pool.query(query, [
      name.trim(), description || null, url || null,
      price != null ? Math.round(Number(price) * 100) / 100 : null,
      (status || 'idea').toLowerCase(), id
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gift idea not found.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: 'Failed to update gift idea. Please try again.' });
  }
}

const deleteGiftIdea = async (req, res) => {
  try {
    const id = req.params.id;

    const ownerCheck = await pool.query(
      `SELECT gi.id FROM gift_ideas gi
       JOIN contacts c ON gi.contact_id = c.id
       WHERE gi.id = $1 AND c.user_id = $2`,
      [id, req.user.uid]
    );
    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Gift idea not found.' });
    }

    const result = await pool.query(
      'DELETE FROM gift_ideas WHERE id = $1 RETURNING *;',
      [id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: 'Failed to delete gift idea. Please try again.' });
  }
}

export default {
  getGiftIdeas,
  addGiftIdea,
  updateGiftIdea,
  deleteGiftIdea
}
