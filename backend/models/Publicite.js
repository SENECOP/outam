const mongoose = require("mongoose");

const publiciteSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    imageUrl: { type: String },
    cible: { type: String, required: true },
    dateExpiration: { type: Date, required: true }
});

module.exports = mongoose.model("Publicite", publiciteSchema);
