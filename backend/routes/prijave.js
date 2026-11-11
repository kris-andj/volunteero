const express = require('express');
const Prijava = require('../models/Prijava');
const Akcija = require('../models/Akcija');
const Uporabnik = require('../models/Uporabnik');
const { preveriZeton, zahtevajVlogo } = require('../middleware/avtentikacija');
const { napredujCakalnoVrsto } = require('../services/cakalnaVrsta');

const router = express.Router();

async function jeOrganizatorAkcije(uporabnikId, akcija) {
  const organizator = await Uporabnik.findById(uporabnikId);
  return organizator && String(organizator.organizacijaId) === String(akcija.organizacijaId);
}

async function poisciPrekrivanja(studentId, akcija) {
  const potrjene = await Prijava.find({ studentId, status: 'POTRJENA' }).populate('akcijaId');
  return potrjene.filter((p) => p.akcijaId && akcija.sePrekriva(p.akcijaId));
}

router.get('/moje', preveriZeton, zahtevajVlogo('STUDENT'), async (req, res) => {
  const prijave = await Prijava.find({ studentId: req.uporabnik.id })
    .populate('akcijaId')
    .sort({ oddanaDne: -1 });
  res.json(prijave);
});

router.get('/akcija/:akcijaId', preveriZeton, zahtevajVlogo('ORGANIZATOR'), async (req, res) => {
  const akcija = await Akcija.findById(req.params.akcijaId);
  if (!akcija || !(await jeOrganizatorAkcije(req.uporabnik.id, akcija))) {
    return res.status(404).json({ napaka: 'Akcija ne obstaja' });
  }
  const prijave = await Prijava.find({ akcijaId: akcija._id })
    .populate('studentId', 'ime priimek eposta vpisnaStevilka')
    .sort({ status: 1, nastopVVrsto: 1 });
  res.json(prijave);
});

router.patch('/:id/sprejmi', preveriZeton, zahtevajVlogo('ORGANIZATOR'), async (req, res) => {
  const prijava = await Prijava.findById(req.params.id);
  const akcija = prijava ? await Akcija.findById(prijava.akcijaId) : null;

  if (!akcija || !(await jeOrganizatorAkcije(req.uporabnik.id, akcija))) {
    return res.status(404).json({ napaka: 'Prijava ne obstaja' });
  }
  if (prijava.status !== 'ODDANA') {
    return res.status(400).json({ napaka: 'Sprejeti je mogoče samo oddano prijavo' });
  }

  const zasedena = await Prijava.countDocuments({
    akcijaId: akcija._id,
    status: { $in: ['POTRJENA', 'KONFLIKT'] }
  });

  if (zasedena >= akcija.steviloMest) {
    prijava.status = 'CAKALNA_VRSTA';
    prijava.nastopVVrsto = new Date();
  } else if ((await poisciPrekrivanja(prijava.studentId, akcija)).length > 0) {
    prijava.status = 'KONFLIKT';
  } else {
    prijava.status = 'POTRJENA';
  }

  await prijava.save();
  res.json(prijava);
});

router.patch('/:id/zavrni', preveriZeton, zahtevajVlogo('ORGANIZATOR'), async (req, res) => {
  const prijava = await Prijava.findById(req.params.id);
  const akcija = prijava ? await Akcija.findById(prijava.akcijaId) : null;

  if (!akcija || !(await jeOrganizatorAkcije(req.uporabnik.id, akcija))) {
    return res.status(404).json({ napaka: 'Prijava ne obstaja' });
  }
  if (prijava.status !== 'ODDANA') {
    return res.status(400).json({ napaka: 'Zavrniti je mogoče samo oddano prijavo' });
  }

  prijava.status = 'ZAVRNJENA';
  await prijava.save();
  res.json(prijava);
});

router.patch('/:id/resi-konflikt', preveriZeton, zahtevajVlogo('STUDENT'), async (req, res) => {
  const prijava = await Prijava.findOne({ _id: req.params.id, studentId: req.uporabnik.id });
  if (!prijava || prijava.status !== 'KONFLIKT') {
    return res.status(400).json({ napaka: 'Prijava ni v konfliktu' });
  }

  const akcija = await Akcija.findById(prijava.akcijaId);

  if (req.body.obdrzi === true) {
    const druge = await poisciPrekrivanja(prijava.studentId, akcija);
    prijava.status = 'POTRJENA';
    await prijava.save();
    for (const druga of druge) {
      druga.status = 'PREKLICANA';
      await druga.save();
      await napredujCakalnoVrsto(druga.akcijaId._id);
    }
  } else {
    prijava.status = 'PREKLICANA';
    await prijava.save();
    await napredujCakalnoVrsto(akcija._id);
  }

  res.json({ sporocilo: 'Konflikt razrešen', status: prijava.status });
});

router.patch('/:id/preklici', preveriZeton, zahtevajVlogo('STUDENT'), async (req, res) => {
  const prijava = await Prijava.findOne({ _id: req.params.id, studentId: req.uporabnik.id });
  if (!prijava || !['ODDANA', 'POTRJENA', 'KONFLIKT', 'CAKALNA_VRSTA'].includes(prijava.status)) {
    return res.status(400).json({ napaka: 'Prijave ni mogoče preklicati' });
  }

  const akcija = await Akcija.findById(prijava.akcijaId);
  if (akcija.zacetek <= new Date()) {
    return res.status(400).json({ napaka: 'Preklic je mogoč le pred začetkom akcije' });
  }

  const sprostiMesto = ['POTRJENA', 'KONFLIKT'].includes(prijava.status);
  prijava.status = 'PREKLICANA';
  await prijava.save();

  if (sprostiMesto) {
    await napredujCakalnoVrsto(akcija._id);
  }

  res.json({ sporocilo: 'Prijava preklicana' });
});

router.patch('/:id/udelezba', preveriZeton, zahtevajVlogo('ORGANIZATOR'), async (req, res) => {
  const prijava = await Prijava.findById(req.params.id);
  const akcija = prijava ? await Akcija.findById(prijava.akcijaId) : null;

  if (!akcija || !(await jeOrganizatorAkcije(req.uporabnik.id, akcija))) {
    return res.status(404).json({ napaka: 'Prijava ne obstaja' });
  }
  if (akcija.konec > new Date()) {
    return res.status(400).json({ napaka: 'Udeležbo je mogoče označiti šele po koncu akcije' });
  }
  if (prijava.status !== 'POTRJENA') {
    return res.status(400).json({ napaka: 'Udeležbo je mogoče označiti samo pri potrjeni prijavi' });
  }

  prijava.status = 'UDELEZEN';
  prijava.ure = akcija.trajanjeUr();
  await prijava.save();

  akcija.status = 'ZAKLJUCENA';
  await akcija.save();

  res.json(prijava);
});

module.exports = router;