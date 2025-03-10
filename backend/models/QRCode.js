const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema({
    idEtablissement: { type: mongoose.Schema.Types.ObjectId, ref: "Etablissement", required: true },
    urlUnique: { type: String, required: true }
});

module.exports = mongoose.model("QRCode", qrCodeSchema);
