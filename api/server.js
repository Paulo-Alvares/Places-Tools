const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.post("/shorten", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL é obrigatória" });
    }

    const shortUrl = Math.random().toString(36).substring(2, 8);

    console.log(`Inserindo no banco: ${url} -> ${shortUrl}`);

    await db.query(
      "INSERT INTO links (original_url, short_url) VALUES ($1, $2)",
      [url, shortUrl]
    );

    return res.json({ shortUrl: `${process.env.BASE_URL}/${shortUrl}` });
  } catch (error) {
    console.error("Erro ao encurtar URL:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;

  const result = await db.query(
    "UPDATE links SET clicks = clicks + 1 WHERE short_url = $1 RETURNING original_url",
    [shortUrl]
  );

  if (result.rows.length > 0) {
    res.redirect(result.rows[0].original_url);
  } else {
    res.status(404).send("Link não encontrado!");
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

module.exports = (req, res) => {
  return app(req, res);
};
