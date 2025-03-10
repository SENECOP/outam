const mongoose = require("mongoose");

const produitSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prix: { type: Number, required: true },
    stock: { type: Number, required: true },
    idSupermarche: { type: mongoose.Schema.Types.ObjectId, ref: "Supermarche", required: true },
    imageUrl: { type: String }
});

module.exports = mongoose.model("Produit", produitSchema);
