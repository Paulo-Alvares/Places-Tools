require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const { userId } = req.query;

module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const result = userId
        ? await pool.query(
            "SELECT * FROM links WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
          )
        : await pool.query("SELECT * FROM links ORDER BY created_at DESC");
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
