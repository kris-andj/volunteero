const mongoose = require('mongoose');

const prijavaShema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Uporabnik', required: true },
  akcijaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Akcija', required: true },
  status: {
    type: String,
    enum: ['ODDANA', 'POTRJENA', 'KONFLIKT', 'CAKALNA_VRSTA', 'ZAVRNJENA', 'PREKLICANA', 'UDELEZEN'],
    default: 'ODDANA'
  },
  ure: { type: Number, default: 0 },
  oddanaDne: { type: Date, default: Date.now },
  nastopVVrsto: { type: Date }
});


prijavaShema.index({ studentId: 1, akcijaId: 1 }, { unique: true });

module.exports = mongoose.model('Prijava', prijavaShema);