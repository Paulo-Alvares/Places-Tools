const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  const { shortUrl } = req.query;

  try {
    const result = await pool.query(
      "SELECT original_url FROM links WHERE short_url = $1",
      [shortUrl]
    );

    if (result.rowCount === 0) {
      return res.redirect("/404.html");
    }

    const originalUrl = result.rows[0].original_url;

    await pool.query(
      "UPDATE links SET clicks = clicks + 1 WHERE short_url = $1",
      [shortUrl]
    );

    res.redirect(originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
