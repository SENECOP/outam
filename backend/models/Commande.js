const mongoose = require("mongoose");

const commandeSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  dish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant.menus.dishes', // Référence à un plat dans un menu du restaurant
    required: true
  },
  extras: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Extra",
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["en attente", "en cuisine", "Prête"],
    default: "en attente",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Commande", commandeSchema);
