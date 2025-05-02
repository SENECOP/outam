// routes/extras.js
const express = require('express');
const router = express.Router();
const Extra = require('../models/Extras');

// 🔹 Ajouter une liste d'extras
router.post('/create', async (req, res) => {
  const extras = req.body.extras;

  if (!Array.isArray(extras) || extras.length === 0) {
    return res.status(400).json({ message: 'La liste des extras est vide ou invalide.' });
  }

  try {
    // Validation simple de chaque extra
    for (const extra of extras) {
      if (!extra.name || typeof extra.price !== 'number') {
        return res.status(400).json({ message: 'Chaque extra doit avoir un nom et un prix.' });
      }
    }

    const createdExtras = await Extra.insertMany(extras);
    res.status(201).json(createdExtras);
  } catch (error) {
    console.error('Erreur lors de l’ajout des extras :', error);
    res.status(500).json({ message: 'Erreur serveur lors de l’ajout des extras.' });
  }
});

router.get('/showextras', async (req, res) => {
  try {
    const extras = await Extra.find();
    res.json(extras);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement des extras' });
  }
});

module.exports = router;
