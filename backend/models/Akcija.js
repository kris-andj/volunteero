const mongoose = require('mongoose');

const akcijaShema = new mongoose.Schema({
  organizacijaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organizacija', required: true },
  naziv: { type: String, required: true },
  opis: { type: String, required: true },
  lokacija: { type: String, required: true },
  zacetek: { type: Date, required: true },
  konec: { type: Date, required: true },
  steviloMest: { type: Number, required: true, min: 1 },
  status: {
    type: String,
    enum: ['OBJAVLJENA', 'PREKLICANA', 'ZAKLJUCENA'],
    default: 'OBJAVLJENA'
  }
});


akcijaShema.methods.sePrekriva = function (druga) {
  return this.zacetek < druga.konec && druga.zacetek < this.konec;
};


akcijaShema.methods.trajanjeUr = function () {
  return (this.konec - this.zacetek) / (1000 * 60 * 60);
};

module.exports = mongoose.model('Akcija', akcijaShema);