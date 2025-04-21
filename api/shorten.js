require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const { url } = req.body;
    let userId = null;

    // Verifica se há token para associar o link ao usuário
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    }

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const crypto = require("crypto");
    const shortUrl = crypto.randomBytes(4).toString("hex");

    try {
      const result = await pool.query(
        "INSERT INTO links (original_url, short_url, user_id) VALUES ($1, $2, $3) RETURNING *",
        [url, shortUrl, userId]
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
