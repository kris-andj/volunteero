const jwt = require('jsonwebtoken');

function preveriZeton(req, res, next) {
  const glava = req.headers.authorization || '';
  const zeton = glava.startsWith('Bearer ') ? glava.slice(7) : null;

  if (!zeton) {
    return res.status(401).json({ napaka: 'Manjka žeton' });
  }
  try {
    req.uporabnik = jwt.verify(zeton, process.env.JWT_SKRIVNOST);
    next();
  } catch {
    res.status(401).json({ napaka: 'Neveljaven žeton' });
  }
}

function zahtevajVlogo(...vloge) {
  return (req, res, next) => {
    if (!vloge.includes(req.uporabnik.vloga)) {
      return res.status(403).json({ napaka: 'Nimate dovoljenja' });
    }
    next();
  };
}

module.exports = { preveriZeton, zahtevajVlogo };