import { pool } from "../config/database.js"

const getContacts = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM contacts WHERE user_id = $1", [req.user.uid]);
    res.status(200).json(results.rows);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: error.message });
  }
}

const createContact = async (req, res) => {
  try {
    const { name, relationship, email, phone_number, notes } = req.body;
    const query = `
      INSERT INTO contacts (user_id, name, relationship, email, phone_number, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;`
    const results = await pool.query(query, [req.user.uid, name, relationship, email, phone_number, notes]);
    res.status(201).json(results.rows[0]);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: error.message });
  }
}

const updateContact = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, relationship, email, phone_number, notes } = req.body;
    const query = `
      UPDATE contacts
      SET name = $1, relationship = $2, email = $3, phone_number = $4, notes = $5
      WHERE id = $6 AND user_id = $7
      RETURNING *;`
    const results = await pool.query(query, [name, relationship, email, phone_number, notes, id, req.user.uid]);
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: error.message });
  }
}

const deleteContact = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const results = await pool.query(
      "DELETE FROM contacts WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.uid]
    );
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: error.message });
  }
}

const getContactEvents = async (req, res) => {
  try {
    const query = `
    SELECT e.*
    FROM contacts AS c
    LEFT JOIN event_contacts AS ec
      ON c.id = ec.contact_id
    LEFT JOIN events AS e
      ON ec.event_id = e.id
    WHERE c.id = $1 AND c.user_id = $2;`

    const contact_id = req.params.id;
    const user_id = req.user.uid;

    const results = await pool.query(query, [contact_id, user_id]);
    res.status(200).json(results.rows);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: error.message });
  }
}

export default {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  getContactEvents
}
