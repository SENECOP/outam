const mongoose = require('mongoose');

// 🔹 Modèle de Plat (Dish) (SUPPRESSION de `day`)
const dishSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: 'default-image.jpg' },
    category: { type: String, required: true } // Exemple: "Entrée", "Plat principal", "Dessert"
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
    }
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
