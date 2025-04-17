require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  if (req.method === "POST") {
    const { url, userId } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const crypto = require("crypto");
    const shortUrl = crypto.randomBytes(4).toString("hex");

    try {
      const result = await pool.query(
        "INSERT INTO links (original_url, short_url, user_id) VALUES ($1, $2, $3) RETURNING *",
        [url, shortUrl, userId || null]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
