const mongoose = require("mongoose");

const commercantSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    typeCommercant: { type: String, required: true }
});

module.exports = mongoose.model("Commercant", commercantSchema);
