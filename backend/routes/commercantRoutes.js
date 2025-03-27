const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const cookieParser = require("cookie-parser"); // Assurez-vous que le cookie-parser est utilisé
const Commercant = require("../models/Commercant");
const authMiddleware = require("../middlewares/authMiddleware");
const sendEmail = require("../utils/mailer");
const Etablissement = require("../models/Etablissement");  // Chemin correct vers votre modèle Etablissement
const Restaurant = require("../models/Restaurant");

const router = express.Router();
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Récupérer le token depuis le header Authorization
    if (!token) return res.status(401).json({ message: 'Accès refusé' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Token invalide' });
      req.user = user; // Stocker les informations de l'utilisateur dans la requête
      next();
    });
  };
  const verifyToken = (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).send({ message: "Accès non autorisé" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.commercantId = decoded.commercantId;
      next();
    } catch (err) {
      return res.status(400).send({ message: "Token invalide" });
    }
  };
// Définir la destination et le nom du fichier téléchargé
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où les images seront stockées
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Renommer l'image avec un timestamp pour éviter les doublons
  }
});

const upload = multer({ storage });

// Exemple d'API pour mettre à jour la photo de profil du commerçant
router.post('/update-profile-picture', upload.single('photoDeProfil'), (req, res) => {
  const { commercantId } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`; // URL de l'image téléchargée

  Commercant.findByIdAndUpdate(commercantId, { photoDeProfil: imageUrl }, { new: true }, (err, commercant) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la mise à jour de la photo de profil' });
    }
    res.json({ message: 'Photo de profil mise à jour', commercant });
  });
});

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

router.post("/loginr", async (req, res) => {
    const { email, motDePasse } = req.body;

    try {
        // Chercher le commerçant par son email
        const commercant = await Commercant.findOne({ email });

        if (!commercant) {
            return res.status(400).json({ message: "Identifiants incorrects" });
        }

        // Comparer le mot de passe envoyé avec celui stocké (en utilisant bcrypt)
        const match = await bcrypt.compare(motDePasse, commercant.motDePasse);

        if (!match) {
            return res.status(400).json({ message: "Identifiants incorrects" });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { commercantId: commercant._id, typeCommercant: commercant.typeCommercant },
            process.env.JWT_SECRET, // Utilisez une clé secrète pour signer le token
            { expiresIn: "1h" }
        );

        // Trouver les informations de l'établissement associé au commerçant
        const etablissement = await Etablissement.findOne({ idCommercant: commercant._id });
        
        res.json({
            message: "Connexion réussie",
            token,
            commercantId: commercant._id,
            typeEtablissement: commercant.typeCommercant, // Type d'établissement
            etablissementId: etablissement ? etablissement._id : null, // ID de l'établissement
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur du serveur" });
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
            return res.status(400).json({ message: "Mot de passe incorrect." });
        }

        // Création du Refresh Token (30 jours)
        const refreshToken = jwt.sign(
            { id: commerçant._id, email: commerçant.email, typeCommercant: commerçant.typeCommercant },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        // Création de l'Access Token (1 heure)
        const accessToken = jwt.sign(
            { id: commerçant._id, email: commerçant.email, typeCommercant: commerçant.typeCommercant },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Stocker le Access Token dans un cookie HTTP-only
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // 30 jours si rememberMe, sinon 1 heure
            sameSite: "Strict",
        });

        // Stocker le Refresh Token aussi si rememberMe est activé
        if (rememberMe) {
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 30 * 24 * 60 * 60 * 1000, 
                sameSite: "Strict",
            });
        }

        // Retourne le type de commerçant pour le frontend
        res.status(200).json({ message: "Connexion réussie !", typeCommercant: commerçant.typeCommercant });

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
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

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
router.get('/commercant', authenticateToken, async (req, res) => {
    try {
      const commercant = await Commercant.findById(req.user.commercantId); // Utiliser l'ID du commerçant stocké dans le token
      if (!commercant) return res.status(404).json({ message: 'Commerçant non trouvé' });
  
      res.json(commercant); // Retourner les informations du commerçant
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  router.get("/me", verifyToken, async (req, res) => {
    try {
      const commercant = await Commercant.findById(req.commercantId);
      if (!commercant) {
        return res.status(404).send({ message: "Commerçant non trouvé" });
      }
      res.send(commercant); // Renvoie les informations du commerçant
    } catch (err) {
      res.status(500).send({ message: "Erreur serveur" });
    }
  });

  
  
  router.post("/registeresto", async (req, res) => {
    const { email, motDePasse, nomRestaurant } = req.body;
  
    // Vérification des champs obligatoires
    if (!email || !motDePasse || !nomRestaurant) {
      return res.status(400).json({ message: "Tous les champs doivent être remplis" });
    }
  
    try {
      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(motDePasse, 10); // 10 est le nombre de "salts" pour bcrypt
  
      const newCommercant = new Commercant({
        email,
        motDePasse: hashedPassword, // Sauvegarde du mot de passe haché
        typeCommercant: "restaurant", // Ajouter le typeCommercant ici
        restaurant: {
          nom: nomRestaurant,
        },
      });
  
      await newCommercant.save();
      res.status(201).json({ message: "Inscription réussie !" });
    } catch (err) {
      console.error(err); // Pour un débogage plus facile
      res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
  });
  
  
module.exports = router;
