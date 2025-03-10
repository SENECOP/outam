const mongoose = require("mongoose");

const commercantSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    typeCommercant: { 
        type: String, 
        required: true,
        enum: ["hotel", "restaurant", "supermarche"], // Restriction des valeurs possibles
        lowercase: true // Convertit en minuscule pour éviter les erreurs de casse
    }
}, { timestamps: true });

module.exports = mongoose.model("Commercant", commercantSchema);
