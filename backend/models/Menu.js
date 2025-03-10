const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    description: { type: String, required: true },
    prix: { type: Number, required: true },
    typePlat: { type: String, required: true },
    idEtablissement: { type: mongoose.Schema.Types.ObjectId, ref: "Etablissement", required: true },
    imageUrl: { type: String }
});

module.exports = mongoose.model("Menu", menuSchema);
