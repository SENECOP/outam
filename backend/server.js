require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Commercant = require("./models/Commercant");
const Etablissement = require("./models/Etablissement");
const Hotel = require("./models/Hotel");
const Service = require("./models/Service");
const Restaurant = require("./models/Restaurant");
const Menu = require("./models/Menu");
const Supermarche = require("./models/Supermarche");
const Produit = require("./models/Produit");
const Extras = require("./models/Extras");

const Commande = require("./models/Commande");
const Publicite = require("./models/Publicite");
const commercantRoutes = require("./routes/commercantRoutes"); // Importer les routes
const cookieParser = require('cookie-parser');
const etablissementRoutes = require("./routes/etablissement");
const qrCodeRoutes = require("./routes/qrCodeRoutes");
const restaurantRoutes = require('./routes/restaurantRoutes');
const extrasRoutes = require('./routes/extrasRoutes');
const publicite = require('./routes/publicite');
const superAdminRoutes = require('./routes/superAdminroutes');


const path = require('path');


const app = express();

// Middlewares
app.use(express.json());

app.use(cors({
  origin: ['https://outam.netlify.app', 'http://localhost:3000'],
  credentials: true
}));

app.use(cookieParser());
app.use('/assets', express.static('assets'));
app.use(express.static(path.join(__filename,"frontend/build")))

app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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

app.get('/', (req, res) => {
res.send('Backend is working!');
});
// Utiliser les routes des commerçants
app.use("/api/commercant", commercantRoutes);
app.use("/api/etablissements", etablissementRoutes);
app.use("/api", qrCodeRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/extras', extrasRoutes);
app.use("/api/publicites", require("./routes/publicite"));
app.use('/api/superadmins', superAdminRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Erreur serveur',
    error: err.message 
  });
});
// Démarrage du serveur

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => 
  console.log(`✅ Serveur en écoute sur le port ${PORT}`)
);