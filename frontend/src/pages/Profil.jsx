import { useEffect, useState } from 'react';
import { User, Clock, CircleCheck, Hourglass, Send, History, Ban, TriangleAlert, CalendarDays, MapPin, Compass, Inbox } from 'lucide-react';
import { klic, oblikujDatum, oblikujUro, STATUSI } from '../api';
import Naslovnica from '../components/Naslovnica';
import Statistika from '../components/Statistika';
import { useObvestilo } from '../components/Obvestilo';

const prekrivata = (a, b) => new Date(a.zacetek) < new Date(b.konec) && new Date(b.zacetek) < new Date(a.konec);

const ZAVIHKI = [
  { id: 'POTRJENA', naslov: 'Potrjene', ikona: CircleCheck },
  { id: 'CAKALNA_VRSTA', naslov: 'Čakalna vrsta', ikona: Hourglass },
  { id: 'ODDANA', naslov: 'Oddane', ikona: Send },
  { id: 'UDELEZEN', naslov: 'Pretekle', ikona: History },
  { id: 'OSTALO', naslov: 'Zavrnjene in preklicane', ikona: Ban }
];

export default function Profil() {
  const [prijave, setPrijave] = useState([]);
  const [nalaganje, setNalaganje] = useState(true);
  const [zavihek, setZavihek] = useState('POTRJENA');
  const [toast, prikazi] = useObvestilo();
  const uporabnik = JSON.parse(localStorage.getItem('uporabnik') || '{}');

  async function nalozi() {
    try {
      setPrijave(await klic('/prijave/moje'));
    } catch (err) {
      prikazi(err.message, true);
    } finally {
      setNalaganje(false);
    }
  }

  useEffect(() => {
    nalozi();
  }, []);

  async function ukrep(pot, telo, sporocilo) {
    try {
      await klic(pot, 'PATCH', telo);
      prikazi(sporocilo);
      nalozi();
    } catch (err) {
      prikazi(err.message, true);
    }
  }

  const veljavne = prijave.filter((p) => p.akcijaId);
  const poStatusu = (id) =>
    id === 'OSTALO'
      ? veljavne.filter((p) => ['ZAVRNJENA', 'PREKLICANA'].includes(p.status))
      : veljavne.filter((p) => p.status === id);

  const potrjene = poStatusu('POTRJENA');
  const skupneUre = poStatusu('UDELEZEN').reduce((vsota, p) => vsota + p.ure, 0);
  const konflikti = poStatusu('KONFLIKT');
  const seznam = poStatusu(zavihek);

  const oznaka = (p) => {
    if (p.status === 'CAKALNA_VRSTA') return `${p.mestoVVrsti}. v vrsti`;
    if (p.status === 'UDELEZEN') return `${p.ure} ur`;
    return STATUSI[p.status];
  };

  return (
    <>
      <Naslovnica ikona={User} naslov={uporabnik.ime || 'Moj profil'} podnaslov="Tvoje prijave, čakalne vrste in opravljene prostovoljske ure." />

      <div className="vsebina">
        <div className="statistike">
          <Statistika ikona={Clock} vrednost={skupneUre} opis="opravljenih ur" />
          <Statistika ikona={CircleCheck} vrednost={potrjene.length} opis="potrjenih akcij" />
          <Statistika ikona={Hourglass} vrednost={poStatusu('CAKALNA_VRSTA').length} opis="v čakalni vrsti" />
          <Statistika ikona={Send} vrednost={poStatusu('ODDANA').length} opis="oddanih prijav" />
        </div>

        {konflikti.map((k) => {
          const druga = potrjene.find((p) => prekrivata(p.akcijaId, k.akcijaId));
          return (
            <div key={k._id} className="opozorilo">
              <h3><TriangleAlert size={18} />Konflikt terminov</h3>
              <p className="podatki">Akciji se prekrivata. Izberi, katero obdržiš – druga bo preklicana.</p>
              <div className="primerjava">
                <div className="kartica">
                  <strong>{k.akcijaId.naziv}</strong>
                  <span className="podatki">{oblikujDatum(k.akcijaId.zacetek)} – {oblikujUro(k.akcijaId.konec)} · {k.akcijaId.lokacija}</span>
                  <button className="gumb" onClick={() => ukrep(`/prijave/${k._id}/resi-konflikt`, { obdrzi: true }, 'Konflikt razrešen.')}>Obdrži to akcijo</button>
                </div>
                {druga && (
                  <div className="kartica">
                    <strong>{druga.akcijaId.naziv}</strong>
                    <span className="podatki">{oblikujDatum(druga.akcijaId.zacetek)} – {oblikujUro(druga.akcijaId.konec)} · {druga.akcijaId.lokacija}</span>
                    <button className="gumb" onClick={() => ukrep(`/prijave/${k._id}/resi-konflikt`, { obdrzi: false }, 'Konflikt razrešen.')}>Obdrži to akcijo</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <h2 className="sekcija">Pregled</h2>
        <div className="zavihki">
          {ZAVIHKI.map((z) => {
            const Ikona = z.ikona;
            return (
              <button key={z.id} className={'zavihek' + (zavihek === z.id ? ' aktiven' : '')} onClick={() => setZavihek(z.id)}>
                <Ikona size={15} />{z.naslov}<span className="stevec">{poStatusu(z.id).length}</span>
              </button>
            );
          })}
        </div>

        {nalaganje ? (
          [1, 2, 3].map((i) => <div key={i} className="skelet" />)
        ) : seznam.length === 0 ? (
          <p className="prazno"><Inbox size={18} />Tukaj še ni ničesar.</p>
        ) : (
          <div className="tabela-ovoj">
            <table className="tabela">
              <thead>
                <tr>
                  <th><Compass size={14} />Akcija</th>
                  <th><CalendarDays size={14} />Termin</th>
                  <th><MapPin size={14} />Kraj</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {seznam.map((p) => (
                  <tr key={p._id}>
                    <td><div className="ime-celica"><Compass size={15} />{p.akcijaId.naziv}</div></td>
                    <td>{oblikujDatum(p.akcijaId.zacetek)} – {oblikujUro(p.akcijaId.konec)}</td>
                    <td>{p.akcijaId.lokacija}</td>
                    <td><span className={'znacka ' + p.status}>{oznaka(p)}</span></td>
                    <td className="desno">
                      {['ODDANA', 'POTRJENA', 'CAKALNA_VRSTA'].includes(p.status) && (
                        <button className="gumb-mali" onClick={() => ukrep(`/prijave/${p._id}/preklici`, undefined, 'Prijava preklicana.')}>Prekliči</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {toast}
    </>
  );
}