const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

// Proxy para noticias de Valorant
router.get("/news", async (req, res) => {
  try {
    const url = `https://vlrggapi.vercel.app/news`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
