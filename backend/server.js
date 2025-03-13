require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Commercant = require("./models/Commercant");
const Etablissement = require("./models/Etablissement");
const QRCode = require("./models/QRCode");
const Hotel = require("./models/Hotel");
const Service = require("./models/Service");
const Restaurant = require("./models/Restaurant");
const Menu = require("./models/Menu");
const Supermarche = require("./models/Supermarche");
const Produit = require("./models/Produit");
const Commande = require("./models/Commande");
const CommandeDetails = require("./models/CommandeDetails");
const Publicite = require("./models/Publicite");
const commercantRoutes = require("./routes/commercantRoutes"); // Importer les routes
const cookieParser = require('cookie-parser');
const etablissementRoutes = require("./routes/etablissement");



const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());



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
// Utiliser les routes des commerçants
app.use("/api/commercant", commercantRoutes);
app.use("/api/etablissements", etablissementRoutes);
// Démarrage du serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Serveur en écoute sur http://localhost:${PORT}`));
