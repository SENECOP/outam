const { generateQRCode } = require("../services/qrCodeService");
const QRCodeModel = require("../models/QRCode");
const Etablissement = require("../models/Etablissement");

// Générer un QR Code pour un établissement
async function createQRCode(req, res) {
    try {
        const { idEtablissement } = req.body;
        if (!idEtablissement) return res.status(400).json({ message: "ID établissement requis" });

        const result = await generateQRCode(idEtablissement);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Rediriger vers un établissement via son QR Code
async function redirectToEtablissement(req, res) {
    try {
        const { qr_code } = req.params;
        console.log("🔹 QR Code reçu :", qr_code);

        // Vérifier si le QR Code existe
        const qrCode = await QRCodeModel.findOne({ urlUnique: qr_code });
        if (!qrCode) {
            console.log("❌ QR Code non trouvé dans la BDD");
            return res.status(404).json({ message: "QR Code non trouvé" });
        }
        console.log("✅ QR Code trouvé :", qrCode);

        // Vérifier si l'établissement existe
        const etablissement = await Etablissement.findById(qrCode.idEtablissement);
        if (!etablissement) {
            console.log("❌ Établissement non trouvé avec ID :", qrCode.idEtablissement);
            return res.status(404).json({ message: "Établissement non trouvé" });
        }
        console.log("✅ Établissement trouvé :", etablissement);

        return res.json({ message: "Redirection réussie", etablissement });
    } catch (error) {
        console.error("Erreur serveur :", error);
        return res.status(500).json({ message: "Erreur serveur", error });
    }
}


module.exports = { createQRCode, redirectToEtablissement };
