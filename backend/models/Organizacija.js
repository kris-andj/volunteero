const mongoose = require('mongoose');

const organizacijaShema = new mongoose.Schema({
  naziv: { type: String, required: true },
  maticnaStevilka: { type: String, required: true, unique: true },
  kontaktnaEposta: { type: String, required: true },
  odobrena: { type: Boolean, default: false },
  aktivna: { type: Boolean, default: true }
});

module.exports = mongoose.model('Organizacija', organizacijaShema);