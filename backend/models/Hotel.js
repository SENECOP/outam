const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
    idEtablissement: { type: mongoose.Schema.Types.ObjectId, ref: "Etablissement", required: true }
});

module.exports = mongoose.model("Hotel", hotelSchema);
