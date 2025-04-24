require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      if (email !== process.env.EMAIL) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const validPassword = bcrypt.compare(password, process.env.PASSWORD);
      if (!validPassword) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const token = jwt.sign(
        { email: process.env.EMAIL },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      res.status(200).json({ token, user: { email: process.env.EMAIL } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
