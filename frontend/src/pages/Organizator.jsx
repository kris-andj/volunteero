import { useEffect, useState } from 'react';
import { klic, oblikujDatum, STATUSI } from '../api';

const PRAZNA = { naziv: '', opis: '', lokacija: '', zacetek: '', konec: '', steviloMest: 1 };

export default function Organizator() {
  const [akcije, setAkcije] = useState([]);
  const [izbrana, setIzbrana] = useState(null);
  const [prijave, setPrijave] = useState([]);
  const [nova, setNova] = useState(PRAZNA);
  const [sporocilo, setSporocilo] = useState('');

  async function naloziAkcije() {
    try {
      setAkcije(await klic('/akcije/moje'));
    } catch (err) {
      setSporocilo(err.message);
    }
  }

  useEffect(() => {
    naloziAkcije();
  }, []);

  async function izberi(akcija) {
    setIzbrana(akcija);
    try {
      setPrijave(await klic(`/prijave/akcija/${akcija._id}`));
    } catch (err) {
      setSporocilo(err.message);
    }
  }

  async function objavi(e) {
    e.preventDefault();
    try {
      await klic('/akcije', 'POST', nova);
      setSporocilo('Akcija objavljena.');
      setNova(PRAZNA);
      naloziAkcije();
    } catch (err) {
      setSporocilo(err.message);
    }
  }

  async function ukrep(id, pot) {
    try {
      await klic(`/prijave/${id}/${pot}`, 'PATCH');
      izberi(izbrana);
    } catch (err) {
      setSporocilo(err.message);
    }
  }

  const spremeni = (polje) => (e) => setNova({ ...nova, [polje]: e.target.value });
  const potrjenih = prijave.filter((p) => p.status === 'POTRJENA').length;

  return (
    <div>
      <p className="nadnaslov">Organizator</p>
      <h1>Moje akcije</h1>
      {sporocilo && <p className="obvestilo">{sporocilo}</p>}

      <div className="dva-stolpca">
        <form className="kartica" onSubmit={objavi}>
          <h2>Nova akcija</h2>
          <label>Naziv<input value={nova.naziv} onChange={spremeni('naziv')} required /></label>
          <label>Opis<textarea rows={2} value={nova.opis} onChange={spremeni('opis')} required /></label>
          <label>Lokacija<input value={nova.lokacija} onChange={spremeni('lokacija')} required /></label>
          <div className="vrstica">
            <label>Začetek<input type="datetime-local" value={nova.zacetek} onChange={spremeni('zacetek')} required /></label>
            <label>Konec<input type="datetime-local" value={nova.konec} onChange={spremeni('konec')} required /></label>
          </div>
          <label>Število mest<input type="number" min={1} value={nova.steviloMest} onChange={spremeni('steviloMest')} required /></label>
          <button className="gumb">Objavi akcijo</button>
        </form>

        <div>
          {akcije.length === 0 && <p className="prazno">Še nimate objavljenih akcij.</p>}
          {akcije.map((a) => (
            <button
              key={a._id}
              className={'kartica izbira-akcije' + (izbrana?._id === a._id ? ' izbrana' : '')}
              onClick={() => izberi(a)}
            >
              <h3>{a.naziv}</h3>
              <p className="podatki">{oblikujDatum(a.zacetek)} · {a.lokacija}</p>
              <span className={'znacka ' + a.status}>{STATUSI[a.status]}</span>
            </button>
          ))}
        </div>
      </div>

      {izbrana && (
        <section>
          <h2>Prijave: {izbrana.naziv} ({potrjenih}/{izbrana.steviloMest} potrjenih)</h2>
          {prijave.length === 0 ? (
            <p className="prazno">Ni prijav.</p>
          ) : (
            <table className="tabela">
              <thead>
                <tr><th>Študent</th><th>Vpisna št.</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {prijave.map((p) => (
                  <tr key={p._id}>
                    <td>{p.studentId?.ime} {p.studentId?.priimek}</td>
                    <td>{p.studentId?.vpisnaStevilka}</td>
                    <td><span className={'znacka ' + p.status}>{STATUSI[p.status]}</span></td>
                    <td>
                      {p.status === 'ODDANA' && (
                        <>
                          <button className="gumb-mali" onClick={() => ukrep(p._id, 'sprejmi')}>Sprejmi</button>
                          <button className="gumb-mali" onClick={() => ukrep(p._id, 'zavrni')}>Zavrni</button>
                        </>
                      )}
                      {p.status === 'POTRJENA' && (
                        <button className="gumb-mali" onClick={() => ukrep(p._id, 'udelezba')}>Označi udeležbo</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
}