const express = require("express");

const jwt = require("jsonwebtoken");
const Commercant = require('../models/Commercant');
const Restaurant = require('../models/Restaurant');

const cookieParser = require("cookie-parser");
const app = express();

// Middleware pour parser les cookies
app.use(cookieParser());


const authMiddleware = (req, res, next) => {
    // Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Accès refusé. Token manquant ou mal formaté." });
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Token manquant." });
    }

    try {
        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Ajouter les informations de l'utilisateur à la requête
        next();
    } catch (error) {
        res.status(400).json({ message: "Token invalide." });
    }
};

module.exports = authMiddleware;