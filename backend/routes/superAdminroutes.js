const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SuperAdmin = require("../models/superAdmin"); // Corrigé ici

const router = express.Router();

// === Route d’inscription ===
router.post('/register', async (req, res) => {
  try {
    const { fullname, email, motDePasse, fonction, photoProfil } = req.body;

    const adminExistant = await SuperAdmin.findOne({ email });
    if (adminExistant) {
      return res.status(400).json({ message: 'Email déjà utilisé.' });
    }

    // Si photoProfil non défini, laisse la valeur par défaut du schema
    const nouveauAdmin = new SuperAdmin({
      fullname,
      email,
      motDePasse,
      fonction,
      photoProfil: photoProfil || undefined, // undefined déclenche valeur par défaut mongoose
    });

    await nouveauAdmin.save();

    res.status(201).json({ message: 'Super admin inscrit avec succès.' });
  } catch (error) {
    console.error('Erreur inscription :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});


// === Route de connexion ===
router.post('/login', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    const admin = await SuperAdmin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const motDePasseValide = await bcrypt.compare(motDePasse, admin.motDePasse);
    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    // Génération du token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      'SECRET_KEY', // ⚠️ Remplacer par process.env.JWT_SECRET en production
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Connexion réussie.',
      superAdmin: {
        id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        photoProfil: admin.photoProfil,
        fonction: admin.fonction || "Fonction non définie", // ✅ Ajout ici
      },
      token
    });
  } catch (error) {
    console.error('Erreur connexion :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});


module.exports = router;
