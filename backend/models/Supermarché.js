const mongoose = require("mongoose");

const supermarcheSchema = new mongoose.Schema({
    idEtablissement: { type: mongoose.Schema.Types.ObjectId, ref: "Etablissement", required: true }
});

module.exports = mongoose.model("Supermarche", supermarcheSchema);
