const mongoose = require("mongoose");

const commandeSchema = new mongoose.Schema({
    idEtablissement: { type: mongoose.Schema.Types.ObjectId, ref: "Etablissement", required: true },
    dateCommande: { type: Date, default: Date.now },
    statut: { type: String, enum: ["En attente", "En cours", "Livrée", "Annulée"], required: true },
    total: { type: Number, required: true }
});

module.exports = mongoose.model("Commande", commandeSchema);
