require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cookieParser = require('cookie-parser');

// Import des modèles et routes
const Commercant = require("./models/Commercant");
const Etablissement = require("./models/Etablissement");
// ... autres imports

const commercantRoutes = require("./routes/commercantRoutes");
const etablissementRoutes = require("./routes/etablissement");
const qrCodeRoutes = require("./routes/qrCodeRoutes");
const restaurantRoutes = require('./routes/restaurantRoutes');

const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Middlewares standard
app.use(express.json());
app.use(cors({
  origin: [
    'https://outam.netlify.app', 
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexion MongoDB
const mongoURI = process.env.MONGODB_URL;
if (!mongoURI) {
  console.error("❌ Erreur : MONGODB_URL manquante");
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => {
    console.error("❌ Erreur MongoDB:", err.message);
    process.exit(1);
  });

// Routes
app.use("/api/commercant", commercantRoutes);
app.use("/api/etablissements", etablissementRoutes);
app.use("/api", qrCodeRoutes);
app.use('/api/restaurant', restaurantRoutes);

// Gestion des erreurs
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ 
    success: false,
    message: err.message || 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => 
  console.log(`✅ Serveur en écoute sur le port ${PORT}`)
);