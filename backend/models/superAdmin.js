const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const superAdminSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  motDePasse: {
    type: String,
    required: true
  },
  fonction: {
    type: String,
    required: true,
    trim: true
  },
  photoProfil: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png' 
  }
}, {
  timestamps: true
});

// Hachage du mot de passe avant sauvegarde
superAdminSchema.pre('save', async function (next) {
  if (!this.isModified('motDePasse')) return next();
  this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
  next();
});

module.exports = mongoose.model('SuperAdmin', superAdminSchema);
