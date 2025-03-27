const mongoose = require("mongoose");

const commercantSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
   
    photoDeProfil: { type: String, default: "default-avatar.jpg" },
    resetPasswordToken: { type: String }, // Champ pour stocker le token de réinitialisation
    resetPasswordExpires: { type: Date }  // Champ pour stocker la date d'expiration du token
}, { timestamps: true });


module.exports = mongoose.model("Commercant", commercantSchema);