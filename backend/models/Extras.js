// models/Extra.js
const mongoose = require('mongoose');

const extraSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

module.exports = mongoose.model('Extras', extraSchema);
