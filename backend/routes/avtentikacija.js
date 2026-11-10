const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Uporabnik = require('../models/Uporabnik');
const Organizacija = require('../models/Organizacija');

const router = express.Router();

router.post('/registracija', async (req, res) => {
  try {
    const { ime, priimek, eposta, geslo, vloga, vpisnaStevilka, organizacija } = req.body;

    if (!ime || !priimek || !eposta || !geslo || !vloga) {
      return res.status(400).json({ napaka: 'Manjkajo obvezni podatki' });
    }
    if (geslo.length < 8) {
      return res.status(400).json({ napaka: 'Geslo mora imeti vsaj 8 znakov' });
    }
    if (!['STUDENT', 'ORGANIZATOR'].includes(vloga)) {
      return res.status(400).json({ napaka: 'Neveljavna vloga' });
    }

    const obstaja = await Uporabnik.findOne({ eposta: String(eposta).toLowerCase() });
    if (obstaja) {
      return res.status(409).json({ napaka: 'Uporabnik s tem e-naslovom že obstaja' });
    }

    const podatki = {
      ime,
      priimek,
      eposta,
      gesloHash: await bcrypt.hash(geslo, 10),
      vloga
    };

    if (vloga === 'STUDENT') {
      if (!vpisnaStevilka) {
        return res.status(400).json({ napaka: 'Vpisna številka je obvezna' });
      }
      podatki.vpisnaStevilka = vpisnaStevilka;
    }

    if (vloga === 'ORGANIZATOR') {
      if (!organizacija || !organizacija.naziv || !organizacija.maticnaStevilka || !organizacija.kontaktnaEposta) {
        return res.status(400).json({ napaka: 'Manjkajo podatki organizacije' });
      }
      const obstajaOrg = await Organizacija.findOne({ maticnaStevilka: String(organizacija.maticnaStevilka) });
      if (obstajaOrg) {
        return res.status(409).json({ napaka: 'Organizacija s to matično številko že obstaja' });
      }
      const novaOrganizacija = await Organizacija.create({
        naziv: organizacija.naziv,
        maticnaStevilka: organizacija.maticnaStevilka,
        kontaktnaEposta: organizacija.kontaktnaEposta
      });
      podatki.organizacijaId = novaOrganizacija._id;
    }

    const uporabnik = await Uporabnik.create(podatki);
    res.status(201).json({ sporocilo: 'Registracija uspešna', id: uporabnik._id });
  } catch (napaka) {
    res.status(500).json({ napaka: napaka.message });
  }
});

router.post('/vpis', async (req, res) => {
  try {
    const { eposta, geslo } = req.body;
    const uporabnik = await Uporabnik.findOne({ eposta: String(eposta || '').toLowerCase() });

    if (!uporabnik || !(await bcrypt.compare(String(geslo || ''), uporabnik.gesloHash))) {
      return res.status(401).json({ napaka: 'Napačen e-naslov ali geslo' });
    }

    const zeton = jwt.sign(
      { id: uporabnik._id, vloga: uporabnik.vloga },
      process.env.JWT_SKRIVNOST,
      { expiresIn: '1d' }
    );

    res.json({ zeton, vloga: uporabnik.vloga, ime: uporabnik.ime });
  } catch (napaka) {
    res.status(500).json({ napaka: napaka.message });
  }
});

module.exports = router;