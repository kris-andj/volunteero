const mongoose = require('mongoose');

const uporabnikShema = new mongoose.Schema({
  ime: { type: String, required: true },
  priimek: { type: String, required: true },
  eposta: { type: String, required: true, unique: true, lowercase: true },
  gesloHash: { type: String, required: true },
  vloga: {
    type: String,
    enum: ['STUDENT', 'ORGANIZATOR', 'SKRBNIK'],
    required: true
  },
  vpisnaStevilka: { type: String },
  potrjen: { type: Boolean, default: false },
  organizacijaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organizacija' }
});

module.exports = mongoose.model('Uporabnik', uporabnikShema);