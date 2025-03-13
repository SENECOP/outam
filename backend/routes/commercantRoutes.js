const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const cookieParser = require("cookie-parser"); // Assurez-vous que le cookie-parser est utilisé
const Commercant = require("../models/Commercant");
const authMiddleware = require("../middlewares/authMiddleware");
const sendEmail = require("../utils/mailer");

const router = express.Router();
const crypto = require("crypto");


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
    return null;
};
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
            return res.status(400).json({ message: "Email introuvable." });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(motDePasse, commerçant.motDePasse);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "incorrect." });
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
                httpOnly: true, // Empêche l'accès au cookie via JavaScript
                secure: process.env.NODE_ENV === "production", // Utiliser secure si en production (HTTPS)
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
                sameSite: "Strict", // Pour plus de sécurité
            });
        }

        // Réponse avec le Access Token pour cette session
        res.status(200).json({ message: "Connexion réussie !", token: accessToken });

    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur lors de la connexion." });
    }
});
// Route pour récupérer le profil de l'utilisateur
router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "Profil de l'utilisateur", user: req.user });
});
// Route pour le rafraîchissement du token
router.post("/refresh-token", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        // Vérifier si le Refresh Token est présent
        if (!refreshToken) {
            return res.status(401).json({ message: "Token manquant" });
        }

        // Vérifier si le Refresh Token est valide
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

            res.status(200).json({ token: newAccessToken });
        });
    } catch (error) {
        console.error("Erreur lors du rafraîchissement du token :", error);
        res.status(500).json({ message: "Erreur lors du rafraîchissement du token." });
    }
});

router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        // Vérifier si l'email est fourni
        if (!email) {
            return res.status(400).json({ message: "Veuillez fournir un email." });
        }

        // Vérifier si l'utilisateur existe
        const commerçant = await Commercant.findOne({ email });
        if (!commerçant) {
            return res.status(400).json({ message: "Email introuvable." });
        }

        // Générer un token sécurisé
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hasher le token et définir la date d'expiration
        commerçant.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        commerçant.resetPasswordExpires = Date.now() + 3600000; // 1 heure

        // Sauvegarder les modifications dans la base de données
        await commerçant.save();

        // Construire l'URL de réinitialisation
        const resetUrl = `http://localhost:5000/api/commercant/reset-password/${resetToken}`;

        // Envoyer l'email
        const htmlContent = `
            <h2>Réinitialisation de votre mot de passe</h2>
            <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
            <a href="${resetUrl}" target="_blank">Réinitialiser mon mot de passe</a>
            <p>Ce lien expire dans 1 heure.</p>
        `;

        await sendEmail(commerçant.email, "Réinitialisation de votre mot de passe", htmlContent);

        // Réponse réussie
        res.status(200).json({ message: "Email envoyé avec succès !" });

    } catch (error) {
        console.error("Erreur forgot-password:", error);
        res.status(500).json({ message: "Erreur lors de la demande de réinitialisation." });
    }
});

// 🔑 **Route pour réinitialiser le mot de passe**
router.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Vérifier si le nouveau mot de passe est fourni
        if (!newPassword) {
            return res.status(400).json({ message: "Veuillez fournir un nouveau mot de passe." });
        }

        // Hasher le token reçu
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // Trouver l'utilisateur avec le token valide et non expiré
        const commerçant = await Commercant.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        // Vérifier si l'utilisateur existe et si le token est valide
        if (!commerçant) {
            return res.status(400).json({ message: "Token invalide ou expiré." });
        }

        // Valider le nouveau mot de passe
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            return res.status(400).json({ message: passwordError });
        }

        // Hasher le nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        commerçant.motDePasse = await bcrypt.hash(newPassword, salt);

        // Supprimer le token et la date d'expiration
        commerçant.resetPasswordToken = undefined;
        commerçant.resetPasswordExpires = undefined;

        // Sauvegarder les modifications dans la base de données
        await commerçant.save();

        // Réponse réussie
        res.status(200).json({ message: "Mot de passe réinitialisé avec succès !" });

    } catch (error) {
        console.error("Erreur reset-password:", error);
        res.status(500).json({ message: "Erreur lors de la réinitialisation du mot de passe." });
    }
});

module.exports = router;
