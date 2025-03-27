const express = require("express");
const mongoose = require("mongoose");
const Etablissement = require("../models/Etablissement");
const Hotel = require("../models/Hotel");
const Restaurant = require("../models/Restaurant");
const Supermarche = require("../models/Supermarche");
const Commercant = require("../models/Commercant");

const router = express.Router();

// 📌 Route pour créer un établissement
router.post("/", async (req, res) => {
    try {
        const { nom, type, idCommercant, details } = req.body;

        // Convertir en minuscule pour éviter les erreurs de casse
        const typeLower = type.toLowerCase();

        // Vérification des données
        if (!nom || !typeLower || !["hotel", "restaurant", "supermarche"].includes(typeLower)) {
            return res.status(400).json({ message: "Données invalides" });
        }

        // Création de l'établissement
        const etablissement = new Etablissement({ nom, type: typeLower, idCommercant });
        await etablissement.save();

        // Création de l'entité spécifique (Hôtel, Restaurant, Supermarché)
        let typeEtablissement;
        if (typeLower === "hotel") {
            if (!details || details.nombreEtoiles == null) {
                return res.status(400).json({ message: "Nombre d'étoiles requis pour un hôtel" });
            }
            typeEtablissement = new Hotel({ idEtablissement: etablissement._id, nombreEtoiles: details.nombreEtoiles });
        } else if (typeLower === "restaurant") {
            if (!details || !details.cuisineType) {
                return res.status(400).json({ message: "Type de cuisine requis pour un restaurant" });
            }
            typeEtablissement = new Restaurant({ idEtablissement: etablissement._id, cuisineType: details.cuisineType });
        } else if (typeLower === "supermarche") {
            if (!details || details.nombreRayons == null) {
                return res.status(400).json({ message: "Nombre de rayons requis pour un supermarché" });
            }
            typeEtablissement = new Supermarche({ idEtablissement: etablissement._id, nombreRayons: details.nombreRayons });
        }

        // Sauvegarde de l'entité spécifique
        await typeEtablissement.save();

        // Mise à jour de l'établissement avec l'ID du type spécifique
        etablissement.idTypeEtablissement = typeEtablissement._id;
        await etablissement.save();

        return res.status(201).json({ message: "Établissement créé avec succès", etablissement });
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});
// 📌 Route pour afficher tous les établissements avec leurs détails
router.get("/showetab", async (req, res) => {
    try {
        // Récupérer tous les établissements
        const etablissements = await Etablissement.find();

        // Parcourir chaque établissement pour récupérer ses détails spécifiques
        const result = await Promise.all(etablissements.map(async (etablissement) => {
            let details;

            switch (etablissement.type) {
                case "hotel":
                    details = await Hotel.findOne({ idEtablissement: etablissement._id });
                    break;
                case "restaurant":
                    details = await Restaurant.findOne({ idEtablissement: etablissement._id });
                    break;
                case "supermarche":
                    details = await Supermarche.findOne({ idEtablissement: etablissement._id });
                    break;
                default:
                    details = null;
            }

            return {
                ...etablissement._doc,
                details
            };
        }));

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});
router.get("/:commercantId", async (req, res) => {
    const commercantId = req.params.commercantId;

    try {
        // Vérifier si le commerçant existe
        const commercant = await Commercant.findById(commercantId);
        if (!commercant) {
            return res.status(404).json({ message: "Commerçant non trouvé" });
        }

        // Récupérer tous les établissements associés au commerçant
        const etablissements = await Etablissement.find({ idCommercant: commercantId })
            .populate("idCommercant", "nom email typeCommercant") // Facultatif, si vous voulez aussi récupérer les détails du commerçant
            .exec();

        if (etablissements.length === 0) {
            return res.status(404).json({ message: "Aucun établissement trouvé pour ce commerçant" });
        }

        // Retourner les établissements associés au commerçant
        return res.status(200).json({ etablissements });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
});
router.get("/restaurant/:commercantId", async (req, res) => {
    const commercantId = req.params.commercantId;

    try {
        // Vérifier si le commerçant existe
        const commercant = await Commercant.findById(commercantId);
        if (!commercant) {
            return res.status(404).json({ message: "Commerçant non trouvé" });
        }

        // Récupérer le restaurant associé au commerçant
        const restaurant = await Etablissement.findOne({ idCommercant: commercantId, type: "restaurant" })
            .populate("idCommercant", "nom email typeCommercant") // Facultatif: récupérer les infos du commerçant
            .exec();

        if (!restaurant) {
            return res.status(404).json({ message: "Aucun restaurant trouvé pour ce commerçant" });
        }

        // Retourner les détails du restaurant
        return res.status(200).json({ restaurant });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
});

router.get("/restaurant-details/:commercantId", async (req, res) => {
    const commercantId = req.params.commercantId;

    try {
        const commercant = await Commercant.findById(commercantId);
        if (!commercant) {
            return res.status(404).json({ message: "Commerçant non trouvé" });
        }

        const restaurant = await Etablissement.findOne({ idCommercant: commercantId, type: 'restaurant' })
            .populate('idCommercant', 'nom email typeCommercant')
            .exec();

        if (!restaurant) {
            return res.status(404).json({ message: "Aucun restaurant trouvé pour ce commerçant" });
        }

        res.json({ restaurant });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];  // Récupère le token depuis le header Authorization
  
    if (!token) {
      return res.status(403).json({ message: "Token manquant, veuillez vous connecter" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token invalide" });
      }
      req.userId = decoded.commercantId;  // Sauvegarde l'ID du commerçant dans la requête
      next();
    });
  };
  
  // Route pour obtenir les détails d'un restaurant
  router.get("/restaurant-details/:etablissementId", verifyToken, async (req, res) => {
    const { etablissementId } = req.params;
  
    try {
      // Vérifier si l'établissement appartient au commerçant connecté
      const etablissement = await Etablissement.findOne({ _id: etablissementId, idCommercant: req.userId });
  
      if (!etablissement) {
        return res.status(404).json({ message: "Restaurant non trouvé ou vous n'avez pas accès à cet établissement" });
      }
  
      // Renvoyer les détails de l'établissement (restaurant)
      res.json({ restaurant: etablissement });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la récupération des détails de l'établissement" });
    }
  });
  
  
module.exports = router;
