const express = require('express');
const Akcija = require('../models/Akcija');
const Uporabnik = require('../models/Uporabnik');
const Organizacija = require('../models/Organizacija');
const { preveriZeton, zahtevajVlogo } = require('../middleware/avtentikacija');

const router = express.Router();

router.get('/', async (req, res) => {
  const akcije = await Akcija.find({ status: 'OBJAVLJENA', zacetek: { $gt: new Date() } })
    .populate('organizacijaId', 'naziv')
    .sort({ zacetek: 1 });
  res.json(akcije);
});

router.post('/', preveriZeton, zahtevajVlogo('ORGANIZATOR'), async (req, res) => {
  const organizator = await Uporabnik.findById(req.uporabnik.id);
  const organizacija = organizator ? await Organizacija.findById(organizator.organizacijaId) : null;

  if (!organizacija || !organizacija.odobrena) {
    return res.status(403).json({ napaka: 'Organizacija še ni odobrena' });
  }

  const { naziv, opis, lokacija, zacetek, konec, steviloMest } = req.body;

  if (!naziv || !opis || !lokacija || !zacetek || !konec || !steviloMest) {
    return res.status(400).json({ napaka: 'Manjkajo obvezni podatki' });
  }

  const zacetekDatum = new Date(zacetek);
  const konecDatum = new Date(konec);

  if (isNaN(zacetekDatum) || isNaN(konecDatum)) {
    return res.status(400).json({ napaka: 'Neveljaven datum' });
  }
  if (zacetekDatum <= new Date()) {
    return res.status(400).json({ napaka: 'Začetek mora biti v prihodnosti' });
  }
  if (konecDatum <= zacetekDatum) {
    return res.status(400).json({ napaka: 'Konec mora biti po začetku' });
  }
  if (Number(steviloMest) < 1) {
    return res.status(400).json({ napaka: 'Število mest mora biti vsaj 1' });
  }

  const akcija = await Akcija.create({
    organizacijaId: organizacija._id,
    naziv,
    opis,
    lokacija,
    zacetek: zacetekDatum,
    konec: konecDatum,
    steviloMest: Number(steviloMest)
  });

  res.status(201).json(akcija);
});

module.exports = router;