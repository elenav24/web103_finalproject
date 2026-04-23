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

export default {
  getContacts
}
