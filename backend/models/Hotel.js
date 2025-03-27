const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    qrCode: { type: String, required: true },
    services: [
        {
            name: String,
            description: String,
            price: Number
        }
    ],
    requests: [
        {
            customerName: String,
            roomNumber: String,
            serviceName: String,
            status: { type: String, enum: ['pending', 'confirmed', 'rejected'] },
            requestTime: Date
        }
    ],
    invoices: [
        {
            customerName: String,
            totalAmount: Number,
            paymentStatus: { type: String, enum: ['paid', 'unpaid'] }
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

const Hotel = mongoose.model('Hotel', hotelSchema);
module.exports = Hotel;
