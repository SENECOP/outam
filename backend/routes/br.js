const express = require("express");
const bcrypt = require("bcryptjs");
const validator = require("validator"); // Pour valider l'email
const Commercant = require("../models/Commercant");
const authMiddleware = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Fonction pour valider le mot de passe
const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return "Le mot de passe doit contenir au moins 8 caractères.";
    }
    if (!hasUpperCase) {
        return "Le mot de passe doit contenir au moins une lettre majuscule.";
    }
    if (!hasLowerCase) {
        return "Le mot de passe doit contenir au moins une lettre minuscule.";
    }
    if (!hasNumber) {
        return "Le mot de passe doit contenir au moins un chiffre.";
    }
    if (!hasSpecialChar) {
        return "Le mot de passe doit contenir au moins un caractère spécial.";
    }
    return null; // Retourne null si le mot de passe est valide
};

// Route pour l'inscription
router.post("/register", async (req, res) => {
    try {
        const { nom, email, motDePasse, typeCommercant } = req.body;

        // Valider l'email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Veuillez fournir un email valide." });
        }

        // Valider le mot de passe
        const passwordError = validatePassword(motDePasse);
        if (passwordError) {
            return res.status(400).json({ message: passwordError });
        }

        // Vérifier si l'email existe déjà
        const existingCommercant = await Commercant.findOne({ email });
        if (existingCommercant) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        // Hacher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(motDePasse, salt);

        // Créer un nouveau commerçant
        const newCommercant = new Commercant({
            nom,
            email,
            motDePasse: hashedPassword,
            typeCommercant,
        });

        // Sauvegarder le commerçant dans la base de données
        await newCommercant.save();

        // Réponse réussie
        res.status(201).json({ message: "Commerçant inscrit avec succès !", commerçant: newCommercant });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur lors de l'inscription." });
    }
});

// Route pour la connexion
router.post("/login", async (req, res) => {
    try {
        const { email, motDePasse, rememberMe } = req.body;

        // Vérifier si l'email existe
        const commerçant = await Commercant.findOne({ email });
        if (!commerçant) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect." });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(motDePasse, commerçant.motDePasse);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect." });
        }

        // Créer le Refresh Token avec une durée longue
        const refreshToken = jwt.sign(
            { id: commerçant._id, email: commerçant.email },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }  // 30 jours
        );

        // Créer le Access Token avec une durée courte
        const accessToken = jwt.sign(
            { id: commerçant._id, email: commerçant.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }  // 1 heure
        );

        // Si "Se souvenir de moi" est coché, on stocke le Refresh Token dans un cookie persistant
        if (rememberMe) {
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",  // Utiliser secure si en production (HTTPS)
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
            });
        }

        // Réponse avec le Access Token et le Refresh Token
        res.status(200).json({ 
            message: "Connexion réussie !", 
            token: accessToken, 
            refreshToken: refreshToken 
        });

    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur lors de la connexion." });
    }
});

// Route pour récupérer le profil de l'utilisateur
router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "Profil de l'utilisateur", user: req.user });
});

// Route pour rafraîchir le token
router.post("/refresh-token", async (req, res) => {
    try {
        // Vérifier si cookie refreshToken est présent
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "Non autorisé : Refresh token manquant." });
        }

        // Vérifier la validité du Refresh Token
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Refresh token invalide" });
            }

            // Générer un nouveau Access Token
            const newAccessToken = jwt.sign(
                { id: decoded.id, email: decoded.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }  // 1 heure
            );

            return res.status(200).json({ token: newAccessToken });
        });
    } catch (error) {
        console.error("Erreur lors du rafraîchissement du token :", error);
        res.status(500).json({ message: "Erreur lors du rafraîchissement du token." });
    }
});


module.exports = router;
