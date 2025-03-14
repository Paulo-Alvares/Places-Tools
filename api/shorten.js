import { nanoid } from "nanoid";
import pool from "../db.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL é obrigatória!" });
    }

    try {
      const shortUrl = nanoid(8);
      const result = await pool.query(
        "INSERT INTO links (original_url, short_url) VALUES ($1, $2) RETURNING *",
        [url, shortUrl]
      );

      return res
        .status(201)
        .json({ shortUrl: `${process.env.BASE_URL}/${shortUrl}` });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  } else {
    return res.status(405).json({ error: "Método não permitido" });
  }
}
