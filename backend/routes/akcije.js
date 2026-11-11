const express = require('express');
const Akcija = require('../models/Akcija');
const Uporabnik = require('../models/Uporabnik');
const Organizacija = require('../models/Organizacija');
const Prijava = require('../models/Prijava');
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

router.post('/:id/prijave', preveriZeton, zahtevajVlogo('STUDENT'), async (req, res) => {
  const student = await Uporabnik.findById(req.uporabnik.id);
  if (!student || !student.potrjen) {
    return res.status(403).json({ napaka: 'Študent še ni potrjen' });
  }

  const akcija = await Akcija.findById(req.params.id);
  if (!akcija || akcija.status !== 'OBJAVLJENA' || akcija.zacetek <= new Date()) {
    return res.status(400).json({ napaka: 'Prijava na to akcijo ni mogoča' });
  }

  const obstaja = await Prijava.findOne({ studentId: student._id, akcijaId: akcija._id });
  if (obstaja) {
    return res.status(409).json({ napaka: 'Na to akcijo ste že prijavljeni' });
  }

  const potrjene = await Prijava.find({ studentId: student._id, status: 'POTRJENA' }).populate('akcijaId');
  const prekrivanje = potrjene.find((p) => p.akcijaId && akcija.sePrekriva(p.akcijaId));
  if (prekrivanje) {
    return res.status(400).json({ napaka: `Akcija se prekriva s potrjeno akcijo »${prekrivanje.akcijaId.naziv}«` });
  }

  const prijava = await Prijava.create({ studentId: student._id, akcijaId: akcija._id });
  res.status(201).json(prijava);
});

module.exports = router;