require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end("Método não permitido");
  }

  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword || password !== confirmPassword) {
    return res
      .status(400)
      .json({ error: "Dados inválidos ou senhas diferentes" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
