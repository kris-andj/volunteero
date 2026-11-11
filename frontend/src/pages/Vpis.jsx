import { useState } from 'react';
import { HandHeart, MapPin, ShieldCheck, Hourglass } from 'lucide-react';
import { klic } from '../api';
import Naslovnica from '../components/Naslovnica';
import Statistika from '../components/Statistika';
import { useObvestilo } from '../components/Obvestilo';

const PRAZNA_REG = {
  vloga: 'STUDENT', ime: '', priimek: '', eposta: '', geslo: '',
  vpisnaStevilka: '', naziv: '', maticnaStevilka: '', kontaktnaEposta: ''
};

export default function Vpis({ onPrijava }) {
  const [eposta, setEposta] = useState('');
  const [geslo, setGeslo] = useState('');
  const [reg, setReg] = useState(PRAZNA_REG);
  const [toast, prikazi] = useObvestilo();

  const spremeni = (polje) => (e) => setReg({ ...reg, [polje]: e.target.value });

  async function prijavi(e) {
    e.preventDefault();
    try {
      onPrijava(await klic('/vpis', 'POST', { eposta, geslo }));
    } catch (err) {
      prikazi(err.message, true);
    }
  }

  async function registriraj(e) {
    e.preventDefault();
    const telo = { ime: reg.ime, priimek: reg.priimek, eposta: reg.eposta, geslo: reg.geslo, vloga: reg.vloga };
    if (reg.vloga === 'STUDENT') {
      telo.vpisnaStevilka = reg.vpisnaStevilka;
    } else {
      telo.organizacija = { naziv: reg.naziv, maticnaStevilka: reg.maticnaStevilka, kontaktnaEposta: reg.kontaktnaEposta };
    }
    try {
      await klic('/registracija', 'POST', telo);
      prikazi('Registracija uspešna. Počakaj, da te potrdi skrbnik.');
      setReg(PRAZNA_REG);
    } catch (err) {
      prikazi(err.message, true);
    }
  }

  return (
    <>
      <Naslovnica ikona={HandHeart} naslov="Volunteero" podnaslov="Vse prostovoljske akcije za študente na enem mestu." />

      <div className="vsebina">
        <div className="statistike">
          <Statistika razred="lastnost" ikona={MapPin} vrednost="Akcije v bližini" opis="Prijava z enim klikom" />
          <Statistika razred="lastnost" ikona={ShieldCheck} vrednost="Brez prekrivanj" opis="Sistem preveri tvoje termine" />
          <Statistika razred="lastnost" ikona={Hourglass} vrednost="Čakalna vrsta" opis="Samodejno dobiš prosto mesto" />
        </div>

        <h2 className="sekcija">Začni</h2>
        <div className="dva-stolpca">
          <form className="kartica" onSubmit={prijavi}>
            <h2>Prijava</h2>
            <label>E-naslov<input type="email" value={eposta} onChange={(e) => setEposta(e.target.value)} required /></label>
            <label>Geslo<input type="password" value={geslo} onChange={(e) => setGeslo(e.target.value)} required /></label>
            <button className="gumb">Prijava</button>
          </form>

          <form className="kartica" onSubmit={registriraj}>
            <h2>Registracija</h2>
            <div className="izbira">
              <label><input type="radio" checked={reg.vloga === 'STUDENT'} onChange={() => setReg({ ...reg, vloga: 'STUDENT' })} /> Študent</label>
              <label><input type="radio" checked={reg.vloga === 'ORGANIZATOR'} onChange={() => setReg({ ...reg, vloga: 'ORGANIZATOR' })} /> Organizacija</label>
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
                <div className="vrstica">
                  <label>Matična številka<input value={reg.maticnaStevilka} onChange={spremeni('maticnaStevilka')} required /></label>
                  <label>E-naslov organizacije<input type="email" value={reg.kontaktnaEposta} onChange={spremeni('kontaktnaEposta')} required /></label>
                </div>
              </>
            )}
            <button className="gumb-obroba">Ustvari račun</button>
          </form>
        </div>
      </div>
      {toast}
    </>
  );
}