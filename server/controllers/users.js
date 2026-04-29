import { pool } from "../config/database.js";

const createUser = async (req, res) => {

  try {
    const query = `
    INSERT INTO users(id, name)
    VALUES ($1, $2)
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    RETURNING *;`

    const id = req.user.uid;
    const { name } = req.body;

    const results = await pool.query(query, [id, name]);
    res.status(201).json(results.rows[0]);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: 'Failed to create user account. Please try again.' })
  }
}

const deleteUser = async (req, res) => {

  try {
    const query = `
    DELETE FROM users
    WHERE id = $1
    RETURNING *;`

    const id = req.user.uid;

    const results = await pool.query(query, [id]);
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: 'Failed to delete account. Please try again.' })
  }
}

export default {
  createUser,
  deleteUser
}
