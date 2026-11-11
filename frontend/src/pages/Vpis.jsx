import { useState } from 'react';
import { klic } from '../api';

export default function Vpis({ onPrijava }) {
  const [eposta, setEposta] = useState('');
  const [geslo, setGeslo] = useState('');
  const [napaka, setNapaka] = useState('');
  const [sporocilo, setSporocilo] = useState('');
  const [reg, setReg] = useState({
    vloga: 'STUDENT', ime: '', priimek: '', eposta: '', geslo: '',
    vpisnaStevilka: '', naziv: '', maticnaStevilka: '', kontaktnaEposta: ''
  });

  const spremeni = (polje) => (e) => setReg({ ...reg, [polje]: e.target.value });

  async function prijavi(e) {
    e.preventDefault();
    setNapaka('');
    try {
      const podatki = await klic('/vpis', 'POST', { eposta, geslo });
      onPrijava(podatki);
    } catch (err) {
      setNapaka(err.message);
    }
  }

  async function registriraj(e) {
    e.preventDefault();
    setSporocilo('');
    const telo = { ime: reg.ime, priimek: reg.priimek, eposta: reg.eposta, geslo: reg.geslo, vloga: reg.vloga };
    if (reg.vloga === 'STUDENT') {
      telo.vpisnaStevilka = reg.vpisnaStevilka;
    } else {
      telo.organizacija = { naziv: reg.naziv, maticnaStevilka: reg.maticnaStevilka, kontaktnaEposta: reg.kontaktnaEposta };
    }
    try {
      await klic('/registracija', 'POST', telo);
      setSporocilo('Registracija uspešna. Počakajte, da vas potrdi skrbnik.');
    } catch (err) {
      setSporocilo(err.message);
    }
  }

  return (
    <div>
      <section className="uvod">
        <p className="nadnaslov">Prostovoljstvo za študente</p>
        <h1>VOLUNTEERO</h1>
        <p>Prijavi se na prostovoljske akcije. Sistem poskrbi za prekrivanja terminov, čakalno vrsto in tvoje ure.</p>
      </section>

      <div className="dva-stolpca">
        <form className="kartica" onSubmit={prijavi}>
          <h2>Prijava</h2>
          <label>E-naslov<input type="email" value={eposta} onChange={(e) => setEposta(e.target.value)} required /></label>
          <label>Geslo<input type="password" value={geslo} onChange={(e) => setGeslo(e.target.value)} required /></label>
          {napaka && <p className="napaka">{napaka}</p>}
          <button className="gumb">Prijava</button>
        </form>

        <form className="kartica" onSubmit={registriraj}>
          <h2>Registracija</h2>
          <div className="izbira">
            <label><input type="radio" checked={reg.vloga === 'STUDENT'} onChange={() => setReg({ ...reg, vloga: 'STUDENT' })} /> Študent</label>
            <label><input type="radio" checked={reg.vloga === 'ORGANIZATOR'} onChange={() => setReg({ ...reg, vloga: 'ORGANIZATOR' })} /> Organizator</label>
          </div>
          <div className="vrstica">
            <label>Ime<input value={reg.ime} onChange={spremeni('ime')} required /></label>
            <label>Priimek<input value={reg.priimek} onChange={spremeni('priimek')} required /></label>
          </div>
          <label>E-naslov<input type="email" value={reg.eposta} onChange={spremeni('eposta')} required /></label>
          <label>Geslo (vsaj 8 znakov)<input type="password" minLength={8} value={reg.geslo} onChange={spremeni('geslo')} required /></label>
          {reg.vloga === 'STUDENT' ? (
            <label>Vpisna številka<input value={reg.vpisnaStevilka} onChange={spremeni('vpisnaStevilka')} required /></label>
          ) : (
            <>
              <label>Naziv organizacije<input value={reg.naziv} onChange={spremeni('naziv')} required /></label>
              <label>Matična številka<input value={reg.maticnaStevilka} onChange={spremeni('maticnaStevilka')} required /></label>
              <label>E-naslov organizacije<input type="email" value={reg.kontaktnaEposta} onChange={spremeni('kontaktnaEposta')} required /></label>
            </>
          )}
          {sporocilo && <p className="obvestilo">{sporocilo}</p>}
          <button className="gumb-obroba">Ustvari račun</button>
        </form>
      </div>
    </div>
  );
}