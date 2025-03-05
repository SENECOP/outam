require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

require('dotenv').config();

const mongoURI = process.env.MONGODB_URL;

if (!mongoURI) {
  console.error("❌ Erreur : La variable d'environnement MONGODB_URL est introuvable.");
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    
  })
  .then(() => console.log("✅ Connexion réussie à MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ Erreur de connexion MongoDB :", err.message);
    process.exit(1);
  });

// Démarrage du serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Serveur en écoute sur http://localhost:${PORT}`));
