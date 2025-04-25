require("dotenv").config();
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const QRCodeModel = require("../models/QRCode");
const Etablissement = require("../models/Etablissement");

async function generateQRCode(idEtablissement) {
    try {
        const qrCodeId = uuidv4(); // Génère un identifiant unique
        const url = `${apiUrl}/api/scan/${qrCodeId}`; // URL locale

        // Génération de l’image QR Code
        const qrCodeImage = await QRCode.toDataURL(url);

        // Sauvegarde du QR Code dans la base de données
        const newQRCode = new QRCodeModel({
            idEtablissement,
            urlUnique: qrCodeId, // On stocke uniquement l'UUID
        });
        await newQRCode.save();

        // Mise à jour de l’établissement avec le lien du QR Code
        await Etablissement.findByIdAndUpdate(idEtablissement, { qr_code_url: url });

        return { url, qrCodeImage };
    } catch (error) {
        throw new Error("Erreur lors de la génération du QR Code");
    }
}

module.exports = { generateQRCode };
