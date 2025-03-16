require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  const { shortUrl } = req.query;

  try {
    const result = await pool.query(
      "UPDATE links SET clicks = clicks + 1 WHERE short_url = $1 RETURNING original_url",
      [shortUrl]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.redirect(result.rows[0].original_url);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
