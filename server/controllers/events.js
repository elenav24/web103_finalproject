import { pool } from "../config/database.js"

const getEvents = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM events ORDER BY date;");
    res.status(200).json(results.rows);
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ error: error.message });
  }
}

export default {
  getEvents
}
