const express = require("express");
const mongoose = require("mongoose");
const Etablissement = require("../models/Etablissement");
const Hotel = require("../models/Hotel");
const Restaurant = require("../models/Restaurant");
const Supermarche = require("../models/Supermarche");

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


module.exports = router;
