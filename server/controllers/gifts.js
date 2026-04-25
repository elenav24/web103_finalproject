import { pool } from "../config/database.js";

const addGiftIdea = async (req, res) => {

  try {
    const query = `
    INSERT INTO gift_ideas (contact_id, event_id, name, description, url, price, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;`;

    const { contact_id, event_id, name, description, url, price, status } = req.body;
    const result = await pool.query(query, [contact_id, event_id, name, description, url, price, status]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updateGiftIdea = async (req, res) => {
  try {
    const query = `
      UPDATE gift_ideas 
      SET name = $1, description = $2, url = $3, price = $4, status = $5
      WHERE id = $6
      RETURNING *;`

    const id = req.params.id;
    const { name, description, url, price, status } = req.body;
    const result = await pool.query(query, [name, description, url, price, status, id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gift idea not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteGiftIdea = async (req, res) => {
  try {
    const query = `
    DELETE FROM gift_ideas
    WHERE id = $1
    RETURNING *;`

    const id = req.params.id;

    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gift idea not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default {
  addGiftIdea,
  updateGiftIdea,
  deleteGiftIdea
}
