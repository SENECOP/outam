const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    idEtablissement: { type: mongoose.Schema.Types.ObjectId, ref: "Etablissement", required: true }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
