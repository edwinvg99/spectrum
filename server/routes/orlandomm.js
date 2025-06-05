const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

// Proxy para eventos
router.get("/v1/events", async (req, res) => {
  try {
    // Reenvía query strings
    const search = req.url.replace("/v1/events", "");
    const url = `https://vlr.orlandomm.net/api/v1/events${search}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
