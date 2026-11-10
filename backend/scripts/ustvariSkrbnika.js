require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Uporabnik = require('../models/Uporabnik');

async function ustvari() {
  await mongoose.connect(process.env.MONGODB_URI);
  const eposta = 'skrbnik@volunteero.si';
  const obstaja = await Uporabnik.findOne({ eposta });

  if (obstaja) {
    console.log('Skrbnik že obstaja');
  } else {
    await Uporabnik.create({
      ime: 'Skrbnik',
      priimek: 'Volunteero',
      eposta,
      gesloHash: await bcrypt.hash('skrbnik123', 10),
      vloga: 'SKRBNIK',
      potrjen: true
    });
    console.log('Skrbnik ustvarjen: skrbnik@volunteero.si / skrbnik123');
  }

  await mongoose.disconnect();
}

ustvari();