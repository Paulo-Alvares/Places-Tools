const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const crypto = require("crypto");

const app = express();
const port = 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/shorten", async (req, res) => {
  const { originalLink } = req.body;
  const shortId = crypto.randomBytes(4).toString("hex");
  const shortLink = `https://placestools.com/${shortId}`;

  await pool.query(
    "INSERT INTO links (original_url, short_url, clicks) VALUES ($1, $2, $3)",
    [originalLink, shortLink, 0]
  );

  res.json({ shortLink });
});

app.get("api/:shortId", async (req, res) => {
  const { shortId } = req.params;
  const result = await pool.query(
    "SELECT * FROM links WHERE short_link LIKE $1",
    [`%${shortId}`]
  );

  if (result.rows.length) {
    const link = result.rows[0];
    await pool.query("UPDATE links SET clicks = clicks + 1 WHERE id = $1", [
      link.id,
    ]);
    res.redirect(link.original_link);
  } else {
    res.status(404).send("Link não encontrado");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
