const mongoose = require("mongoose");

const etablissementSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    type: { type: String, required: true, enum: ["HOTEL", "RESTAURANT", "SUPERMARCHE"] },
    idCommercant: { type: mongoose.Schema.Types.ObjectId, ref: "Commercant", required: true }
});

module.exports = mongoose.model("Etablissement", etablissementSchema);
