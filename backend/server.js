require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/avtentikacija'));
app.use('/api/skrbnik', require('./routes/skrbnik'));
app.use('/api/akcije', require('./routes/akcije'));
app.use('/api/prijave', require('./routes/prijave'));
app.get('/api', (req, res) => {
  res.json({ sporocilo: 'Volunteero API deluje' });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Povezava z MongoDB uspešna');
    app.listen(PORT, () => {
      console.log(`Strežnik teče na http://localhost:${PORT}`);
    });
  })
  .catch((napaka) => {
    console.error('Napaka pri povezavi z MongoDB:', napaka.message);
  });