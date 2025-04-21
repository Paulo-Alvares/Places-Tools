require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      let userId = null;

      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      }

      let query = "SELECT * FROM links";
      let params = [];

      if (userId) {
        query += " WHERE user_id = $1";
        params.push(userId);
      } else {
        query += " WHERE user_id IS NULL";
      }

      query += " ORDER BY created_at DESC";

      const result = await pool.query(query, params);
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
