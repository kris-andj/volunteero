const express = require('express');
const Uporabnik = require('../models/Uporabnik');
const Organizacija = require('../models/Organizacija');
const { preveriZeton, zahtevajVlogo } = require('../middleware/avtentikacija');

const router = express.Router();

router.use(preveriZeton, zahtevajVlogo('SKRBNIK'));

router.get('/uporabniki', async (req, res) => {
  const studenti = await Uporabnik.find({ vloga: 'STUDENT', potrjen: false, aktiven: { $ne: false } }).select('-gesloHash');
  res.json(studenti);
});

router.patch('/uporabniki/:id/potrdi', async (req, res) => {
  const student = await Uporabnik.findOne({ _id: req.params.id, vloga: 'STUDENT' });
  if (!student) {
    return res.status(404).json({ napaka: 'Študent ne obstaja' });
  }
  student.potrjen = true;
  await student.save();
  res.json({ sporocilo: 'Študent potrjen' });
});

router.patch('/uporabniki/:id/zavrni', async (req, res) => {
  const student = await Uporabnik.findOne({ _id: req.params.id, vloga: 'STUDENT' });
  if (!student) {
    return res.status(404).json({ napaka: 'Študent ne obstaja' });
  }
  student.aktiven = false;
  await student.save();
  res.json({ sporocilo: 'Študent zavrnjen, račun deaktiviran' });
});

router.get('/organizacije', async (req, res) => {
  const organizacije = await Organizacija.find({ odobrena: false, aktivna: { $ne: false } });
  res.json(organizacije);
});

router.patch('/organizacije/:id/odobri', async (req, res) => {
  const organizacija = await Organizacija.findById(req.params.id);
  if (!organizacija) {
    return res.status(404).json({ napaka: 'Organizacija ne obstaja' });
  }
  organizacija.odobrena = true;
  await organizacija.save();
  res.json({ sporocilo: 'Organizacija odobrena' });
});

router.patch('/organizacije/:id/zavrni', async (req, res) => {
  const organizacija = await Organizacija.findById(req.params.id);
  if (!organizacija) {
    return res.status(404).json({ napaka: 'Organizacija ne obstaja' });
  }
  organizacija.aktivna = false;
  await organizacija.save();
  await Uporabnik.updateMany({ organizacijaId: organizacija._id }, { aktiven: false });
  res.json({ sporocilo: 'Organizacija zavrnjena, organizatorji deaktivirani' });
});

module.exports = router;