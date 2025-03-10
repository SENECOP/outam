const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    description: { type: String, required: true },
    prix: { type: Number, required: true },
    idHotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    imageUrl: { type: String }
});

module.exports = mongoose.model("Service", serviceSchema);
