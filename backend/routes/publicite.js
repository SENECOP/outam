const express = require("express");
const router = express.Router();
const Publicite = require("../models/Publicite");

// ➕ Route pour créer une nouvelle publicité
router.post("/", async (req, res) => {
  try {
    const { titre, imageUrl, cible, dateExpiration } = req.body;

    if (!titre || !cible || !dateExpiration) {
      return res.status(400).json({ message: "Champs requis manquants." });
    }

    const nouvellePub = new Publicite({
      titre,
      imageUrl,
      cible,
      dateExpiration: new Date(dateExpiration),
    });

    const savedPub = await nouvellePub.save();
    res.status(201).json(savedPub);
  } catch (err) {
    console.error("Erreur création publicité :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});
router.get("/", async (req, res) => {
    try {
      const now = new Date();
      const pubs = await Publicite.find({ dateExpiration: { $gt: now } });
      res.json(pubs);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur." });
    }
  });

module.exports = router;
