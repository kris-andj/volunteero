import { useEffect, useState } from 'react';
import { klic } from '../api';

export default function Skrbnik() {
  const [studenti, setStudenti] = useState([]);
  const [organizacije, setOrganizacije] = useState([]);
  const [sporocilo, setSporocilo] = useState('');

  async function nalozi() {
    try {
      setStudenti(await klic('/skrbnik/uporabniki'));
      setOrganizacije(await klic('/skrbnik/organizacije'));
    } catch (err) {
      setSporocilo(err.message);
    }
  }

  useEffect(() => {
    nalozi();
  }, []);

  async function ukrep(pot) {
    try {
      await klic(pot, 'PATCH');
      nalozi();
    } catch (err) {
      setSporocilo(err.message);
    }
  }

  return (
    <div>
      <p className="nadnaslov">Skrbnik</p>
      <h1>Potrditve</h1>
      {sporocilo && <p className="obvestilo">{sporocilo}</p>}

      <h2>Študenti, ki čakajo na potrditev</h2>
      {studenti.length === 0 ? (
        <p className="prazno">Ni novih študentov.</p>
      ) : (
        <table className="tabela">
          <thead>
            <tr><th>Ime in priimek</th><th>E-naslov</th><th>Vpisna št.</th><th></th></tr>
          </thead>
          <tbody>
            {studenti.map((s) => (
              <tr key={s._id}>
                <td>{s.ime} {s.priimek}</td>
                <td>{s.eposta}</td>
                <td>{s.vpisnaStevilka}</td>
                <td>
                  <button className="gumb-mali" onClick={() => ukrep(`/skrbnik/uporabniki/${s._id}/potrdi`)}>Potrdi</button>
                  <button className="gumb-mali" onClick={() => ukrep(`/skrbnik/uporabniki/${s._id}/zavrni`)}>Zavrni</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Organizacije, ki čakajo na odobritev</h2>
      {organizacije.length === 0 ? (
        <p className="prazno">Ni novih organizacij.</p>
      ) : (
        <table className="tabela">
          <thead>
            <tr><th>Naziv</th><th>Matična št.</th><th>E-naslov</th><th></th></tr>
          </thead>
          <tbody>
            {organizacije.map((o) => (
              <tr key={o._id}>
                <td>{o.naziv}</td>
                <td>{o.maticnaStevilka}</td>
                <td>{o.kontaktnaEposta}</td>
                <td>
                  <button className="gumb-mali" onClick={() => ukrep(`/skrbnik/organizacije/${o._id}/odobri`)}>Odobri</button>
                  <button className="gumb-mali" onClick={() => ukrep(`/skrbnik/organizacije/${o._id}/zavrni`)}>Zavrni</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}