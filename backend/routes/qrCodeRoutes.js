const express = require("express");
const { createQRCode, redirectToEtablissement } = require("../controllers/qrCodeController");

const router = express.Router();

router.post("/generate-qr", createQRCode); // Route pour générer un QR Code
router.get("/scan/:qr_code", redirectToEtablissement); // Route pour scanner un QR Code

module.exports = router;
