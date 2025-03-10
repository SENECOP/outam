const mongoose = require("mongoose");

const commandeDetailsSchema = new mongoose.Schema({
    idCommande: { type: mongoose.Schema.Types.ObjectId, ref: "Commande", required: true },
    typeItem: { type: String, required: true, enum: ["MENU", "PRODUIT", "SERVICE"] },
    idItem: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantite: { type: Number, required: true },
    prixUnitaire: { type: Number, required: true }
});

module.exports = mongoose.model("CommandeDetails", commandeDetailsSchema);
