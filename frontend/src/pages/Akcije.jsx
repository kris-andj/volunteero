import { useEffect, useState } from 'react';
import { klic, oblikujDatum, oblikujUro } from '../api';

export default function Akcije() {
  const [akcije, setAkcije] = useState([]);
  const [moje, setMoje] = useState([]);
  const [kraj, setKraj] = useState('');
  const [sporocilo, setSporocilo] = useState('');

  async function nalozi() {
    try {
      setAkcije(await klic('/akcije'));
      setMoje(await klic('/prijave/moje'));
    } catch (err) {
      setSporocilo(err.message);
    }
  }

  useEffect(() => {
    nalozi();
  }, []);

  async function prijavi(id) {
    try {
      await klic(`/akcije/${id}/prijave`, 'POST');
      setSporocilo('Prijava oddana.');
      nalozi();
    } catch (err) {
      setSporocilo(err.message);
    }
  }

  const potrjene = moje.filter((p) => p.status === 'POTRJENA' && p.akcijaId).map((p) => p.akcijaId);

  const sePrekriva = (a) =>
    potrjene.some((p) => p._id !== a._id && new Date(a.zacetek) < new Date(p.konec) && new Date(p.zacetek) < new Date(a.konec));

  const zePrijavljen = (a) => moje.some((p) => p.akcijaId && p.akcijaId._id === a._id);

  const prikazane = akcije.filter((a) => kraj.length < 3 || a.lokacija.toLowerCase().includes(kraj.toLowerCase()));

  return (
    <div>
      <p className="nadnaslov">Študent</p>
      <h1>Akcije</h1>
      <input className="iskanje" placeholder="Filtriraj po kraju" value={kraj} onChange={(e) => setKraj(e.target.value)} />
      {sporocilo && <p className="obvestilo">{sporocilo}</p>}
      {prikazane.length === 0 && <p className="prazno">Ni akcij za izbrane filtre.</p>}

      <div className="mreza">
        {prikazane.map((a) => {
          const prekriva = sePrekriva(a);
          const ze = zePrijavljen(a);
          return (
            <div key={a._id} className={'kartica' + (prekriva ? ' oznacena' : '')}>
              <p className="nadnaslov">{a.organizacijaId?.naziv}</p>
              <h3>{a.naziv}</h3>
              <p>{a.opis}</p>
              <p className="podatki">
                {oblikujDatum(a.zacetek)} – {oblikujUro(a.konec)} · {a.lokacija} · {a.steviloMest} mest
              </p>
              {prekriva && <p className="napaka">Prekriva se s tvojo potrjeno akcijo</p>}
              <button className="gumb" disabled={prekriva || ze} onClick={() => prijavi(a._id)}>
                {ze ? 'Prijavljen' : 'Prijavi se'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}