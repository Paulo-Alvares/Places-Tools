require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  const { shortUrl } = req.query;

  if (!shortUrl) {
    return res.status(400).json({ error: "URL encurtada não fornecida." });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM links WHERE short_url = $1",
      [shortUrl]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "URL encurtada não encontrada." });
    }

    await pool.query(
      "UPDATE links SET clicks = clicks + 1 WHERE short_url = $1",
      [shortUrl]
    );

    res.writeHead(301, { Location: result.rows[0].original_url });
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
