const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    stock: Number,
    barcode: String
});

const supermarketSchema = new mongoose.Schema({
    name: { type: String, required: true },
    qrCode: { type: String, required: true },
    products: [productSchema],
    orders: [
        {
            customerName: String,
            items: [
                {
                    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                    quantity: Number
                }
            ],
            totalPrice: Number,
            paymentStatus: { type: String, enum: ['paid', 'pending'] }
        }
    ],
    commercant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commercant',
        required: true
    },
    // Informations du commerçant
    commercantInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        motDePasse: { type: String, required: true },
        photoDeProfil: { type: String, default: "default-avatar.jpg" },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date }
    }
}, { timestamps: true });

const Supermarket = mongoose.model('Supermarket', supermarketSchema);
module.exports = Supermarket;
