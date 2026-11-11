import { useEffect, useState } from 'react';
import { klic, oblikujDatum } from '../api';

const SKUPINE = [
  ['Potrjene akcije', 'POTRJENA'],
  ['Na čakalni vrsti', 'CAKALNA_VRSTA'],
  ['Oddane prijave', 'ODDANA'],
  ['Pretekle akcije', 'UDELEZEN']
];

export default function Profil() {
  const [prijave, setPrijave] = useState([]);
  const [sporocilo, setSporocilo] = useState('');

  async function nalozi() {
    try {
      setPrijave(await klic('/prijave/moje'));
    } catch (err) {
      setSporocilo(err.message);
    }
  }

  useEffect(() => {
    nalozi();
  }, []);

  async function ukrep(pot, telo) {
    try {
      await klic(pot, 'PATCH', telo);
      nalozi();
    } catch (err) {
      setSporocilo(err.message);
    }
  }

  const veljavne = prijave.filter((p) => p.akcijaId);
  const skupneUre = veljavne.filter((p) => p.status === 'UDELEZEN').reduce((vsota, p) => vsota + p.ure, 0);
  const konflikti = veljavne.filter((p) => p.status === 'KONFLIKT');

  return (
    <div>
      <p className="nadnaslov">Študent</p>
      <h1>Moj profil</h1>

      <div className="kartica ure">
        <span className="nadnaslov">Skupne ure</span>
        <strong>{skupneUre}</strong>
      </div>

      {sporocilo && <p className="obvestilo">{sporocilo}</p>}

      {konflikti.map((k) => (
        <div key={k._id} className="kartica oznacena" style={{ marginTop: '2rem' }}>
          <h3>Konflikt terminov</h3>
          <p>
            Akcija »{k.akcijaId.naziv}« ({oblikujDatum(k.akcijaId.zacetek)}) se prekriva s tvojo potrjeno akcijo. Katero obdržiš?
          </p>
          <div>
            <button className="gumb-mali" onClick={() => ukrep(`/prijave/${k._id}/resi-konflikt`, { obdrzi: true })}>
              Obdrži to akcijo
            </button>
            <button className="gumb-mali" onClick={() => ukrep(`/prijave/${k._id}/resi-konflikt`, { obdrzi: false })}>
              Obdrži drugo
            </button>
          </div>
        </div>
      ))}

      {SKUPINE.map(([naslov, status]) => {
        const seznam = veljavne.filter((p) => p.status === status);
        return (
          <section key={status}>
            <h2>{naslov}</h2>
            {seznam.length === 0 ? (
              <p className="prazno">Ni prijav.</p>
            ) : (
              seznam.map((p) => (
                <div key={p._id} className="vrstica-seznam">
                  <span>{p.akcijaId.naziv}</span>
                  <span className="podatki">{oblikujDatum(p.akcijaId.zacetek)}</span>
                  {status === 'UDELEZEN' ? (
                    <span>{p.ure} ur</span>
                  ) : (
                    <button className="gumb-mali" onClick={() => ukrep(`/prijave/${p._id}/preklici`)}>Prekliči</button>
                  )}
                </div>
              ))
            )}
          </section>
        );
      })}
    </div>
  );
}