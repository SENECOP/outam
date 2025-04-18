const mongoose = require('mongoose');
const QRCode = require('qrcode');


// 🔹 Modèle de Plat (Dish) (SUPPRESSION de `day`)
const dishSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: 'default-image.jpg' },
    category: { type: String, required: true } 
}, { timestamps: true });

// 🔹 Modèle de Menu (Menu) (avec `day` ici UNIQUEMENT)
const menuSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Exemple: "Menu du jour", "Menu enfant"
    dishes: [dishSchema], // Liste des plats associés à ce menu
    day: { type: String, required: true }, // Jour de la semaine : "Lundi", "Mardi", etc.
    numberOfDishes: { type: Number, default: 1 },
    isActive: { type: Boolean, default: false }, // Désactivé par défaut
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// 🔹 Modèle de Restaurant (Restaurant)
const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    menus: [menuSchema], // Liste des menus associés au restaurant
    commercantInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        motDePasse: { type: String, required: true },
        photoDeProfil: { type: String, default: 'default-avatar.jpg' },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date }
    },
    qrCode: { type: String },
    qrCodeEnabled: {
        type: Boolean,
        default: true // par défaut, les QR codes sont actifs
      },
    isMenuActive: { type: Boolean, default: true },
    logo: { type: String, default: 'default-logo.jpg' },


}, { timestamps: true });
restaurantSchema.pre('save', async function (next) {
    if (this.isNew) { // Générer un QR Code uniquement à la création
        try {
            const qrData = `https://mon-site.com/restaurant/${this._id}`;
            const qrCodeUrl = await QRCode.toDataURL(qrData);
            this.qrCode = qrCodeUrl;
        } catch (error) {
            console.error("❌ Erreur lors de la génération du QR Code :", error);
        }
    }
    next();
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;