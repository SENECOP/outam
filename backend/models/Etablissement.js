const mongoose = require("mongoose");

const etablissementSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    type: { type: String, required: true, enum: ["hotel", "restaurant", "supermarche"] },
    idCommercant: { type: mongoose.Schema.Types.ObjectId, ref: "Commercant", required: false },
    idTypeEtablissement: { type: mongoose.Schema.Types.ObjectId, required: false, refPath: "type" },
    qr_code_url: { type: String, required: false } // URL du QR Code
});

module.exports = mongoose.model("Etablissement", etablissementSchema);
