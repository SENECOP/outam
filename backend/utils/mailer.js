const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER, // Ton email Gmail
        pass: process.env.EMAIL_PASS, // Mot de passe d'application
    },
});


const sendEmail = async (to, subject, html) => {
    try {
        if (!to) {
            throw new Error("L'adresse email du destinataire est manquante !");
        }

        let mailOptions = {
            from: `"Outam" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        console.log("Envoi de l'email à :", to);
        
        await transporter.sendMail(mailOptions);
        console.log("Email envoyé avec succès !");
    } catch (error) {
        console.error("Erreur d'envoi d'email :", error);
    }
};

module.exports = sendEmail;
