const Prijava = require('../models/Prijava');
const Akcija = require('../models/Akcija');

async function napredujCakalnoVrsto(akcijaId) {
  const akcija = await Akcija.findById(akcijaId);
  if (!akcija || akcija.status !== 'OBJAVLJENA' || akcija.zacetek <= new Date()) {
    return;
  }

  const kandidati = await Prijava.find({ akcijaId, status: 'CAKALNA_VRSTA' }).sort({ nastopVVrsto: 1 });

  for (const kandidat of kandidati) {
    const zasedena = await Prijava.countDocuments({
      akcijaId,
      status: { $in: ['POTRJENA', 'KONFLIKT'] }
    });
    if (zasedena >= akcija.steviloMest) {
      return;
    }

    const potrjene = await Prijava.find({ studentId: kandidat.studentId, status: 'POTRJENA' }).populate('akcijaId');
    const prekrivanje = potrjene.some((p) => p.akcijaId && akcija.sePrekriva(p.akcijaId));
    if (prekrivanje) {
      continue;
    }

    await Prijava.findOneAndUpdate(
      { _id: kandidat._id, status: 'CAKALNA_VRSTA' },
      { status: 'POTRJENA' }
    );
  }
}

module.exports = { napredujCakalnoVrsto };