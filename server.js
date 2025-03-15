const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const crypto = require("crypto");

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ error: "URL inválida" });
    }

    const shortId = crypto.randomBytes(4).toString("hex");
    const shortUrl = `https://placestools.vercel.app/${shortId}`;

    await pool.query(
      "INSERT INTO links (original_url, short_url, clicks) VALUES ($1, $2, $3)",
      [originalUrl, shortUrl, 0]
    );

    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ shortUrl });
  } catch (error) {
    console.error("Erro ao encurtar link:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.get("/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;
    const result = await pool.query(
      "SELECT * FROM links WHERE short_url LIKE $1",
      [`%${shortId}`]
    );

    if (result.rows.length) {
      const link = result.rows[0];
      await pool.query("UPDATE links SET clicks = clicks + 1 WHERE id = $1", [
        link.id,
      ]);
      res.redirect(link.original_url);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(404).json({ error: "Link não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar link:", error);
    res.setHeader("Content-Type", "application/json");
    res.status(500).send("Erro interno no servidor");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
