import { useEffect, useState } from 'react';
import { LayoutGrid, Plus, X, Compass, CalendarDays, MapPin, Users, User, Inbox, CircleCheck, Hourglass, Ban, Send } from 'lucide-react';
import { klic, oblikujDatum, oblikujUro, STATUSI } from '../api';
import Naslovnica from '../components/Naslovnica';
import Statistika from '../components/Statistika';
import { useObvestilo } from '../components/Obvestilo';

const PRAZNA = { naziv: '', opis: '', lokacija: '', zacetek: '', konec: '', steviloMest: 1 };

function zdajLokalno() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

const ZAVIHKI = [
  { id: 'nove', naslov: 'Nove prijave', ikona: Send, statusi: ['ODDANA'] },
  { id: 'potrjeni', naslov: 'Potrjeni prostovoljci', ikona: CircleCheck, statusi: ['POTRJENA', 'KONFLIKT', 'UDELEZEN'] },
  { id: 'vrsta', naslov: 'Čakalna vrsta', ikona: Hourglass, statusi: ['CAKALNA_VRSTA'] },
  { id: 'ostalo', naslov: 'Zavrnjene in preklicane', ikona: Ban, statusi: ['ZAVRNJENA', 'PREKLICANA'] }
];

function TabelaPrijav({ prijave, ukrepi, stevilke }) {
  if (prijave.length === 0) {
    return <p className="prazno"><Inbox size={18} />Tukaj ni prijav.</p>;
  }
  return (
    <div className="tabela-ovoj">
      <table className="tabela">
        <thead>
          <tr>
            {stevilke && <th>#</th>}
            <th><User size={14} />Študent</th>
            <th>Vpisna št.</th>
            <th>E-naslov</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {prijave.map((p, i) => (
            <tr key={p._id}>
              {stevilke && <td>{i + 1}.</td>}
              <td><div className="ime-celica"><User size={15} />{p.studentId?.ime} {p.studentId?.priimek}</div></td>
              <td>{p.studentId?.vpisnaStevilka}</td>
              <td className="podatki">{p.studentId?.eposta}</td>
              <td><span className={'znacka ' + p.status}>{STATUSI[p.status]}</span></td>
              <td className="desno">{ukrepi(p)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Organizator() {
  const [akcije, setAkcije] = useState([]);
  const [nalaganje, setNalaganje] = useState(true);
  const [izbrana, setIzbrana] = useState(null);
  const [prijave, setPrijave] = useState([]);
  const [zavihek, setZavihek] = useState('nove');
  const [nova, setNova] = useState(PRAZNA);
  const [modal, setModal] = useState(false);
  const [toast, prikazi] = useObvestilo();

  async function izberi(akcija) {
    setIzbrana(akcija);
    try {
      setPrijave(await klic(`/prijave/akcija/${akcija._id}`));
    } catch (err) {
      prikazi(err.message, true);
    }
  }

  async function naloziAkcije(izberiId) {
    try {
      const seznam = await klic('/akcije/moje');
      setAkcije(seznam);
      const zaIzbiro = seznam.find((a) => a._id === izberiId) || seznam[0];
      if (zaIzbiro) {
        izberi(zaIzbiro);
      }
    } catch (err) {
      prikazi(err.message, true);
    } finally {
      setNalaganje(false);
    }
  }

  useEffect(() => {
    naloziAkcije();
  }, []);

  async function objavi(e) {
    e.preventDefault();
    try {
      const akcija = await klic('/akcije', 'POST', nova);
      prikazi('Akcija objavljena.');
      setNova(PRAZNA);
      setModal(false);
      naloziAkcije(akcija._id);
    } catch (err) {
      prikazi(err.message, true);
    }
  }

  async function ukrep(id, pot) {
    try {
      const rezultat = await klic(`/prijave/${id}/${pot}`, 'PATCH');
      prikazi('Status prijave: ' + STATUSI[rezultat.status]);
      naloziAkcije(izbrana._id);
    } catch (err) {
      prikazi(err.message, true);
    }
  }

  const spremeni = (polje) => (e) => setNova({ ...nova, [polje]: e.target.value });
  const zStatusi = (statusi) => prijave.filter((p) => statusi.includes(p.status));
  const aktiven = ZAVIHKI.find((z) => z.id === zavihek);
  let vrstice = zStatusi(aktiven.statusi);
  if (zavihek === 'vrsta') {
    vrstice = [...vrstice].sort((a, b) => new Date(a.nastopVVrsto) - new Date(b.nastopVVrsto));
  }
  const zasedenih = zStatusi(['POTRJENA', 'KONFLIKT']).length;
  const koncana = izbrana && new Date(izbrana.konec) < new Date();

  const ukrepi = (p) => {
    if (p.status === 'ODDANA') {
      return (
        <>
          <button className="gumb-mali" onClick={() => ukrep(p._id, 'sprejmi')}><CircleCheck size={14} />Sprejmi</button>
          <button className="gumb-mali" onClick={() => ukrep(p._id, 'zavrni')}><X size={14} />Zavrni</button>
        </>
      );
    }
    if (p.status === 'POTRJENA') {
      return (
        <button
          className="gumb-mali"
          disabled={!koncana}
          title={koncana ? '' : 'Udeležbo lahko označiš šele po koncu akcije'}
          onClick={() => ukrep(p._id, 'udelezba')}
        >
          Označi udeležbo
        </button>
      );
    }
    return null;
  };

  return (
    <>
      <Naslovnica ikona={LayoutGrid} naslov="Moje akcije" podnaslov="Objavljaj akcije in upravljaj prijave prostovoljcev.">
        <button className="gumb" onClick={() => setModal(true)}><Plus size={16} />Nova akcija</button>
      </Naslovnica>

      <div className="vsebina">
        <div className="statistike">
          <Statistika ikona={Compass} vrednost={akcije.length} opis="objavljenih akcij" />
          <Statistika ikona={Send} vrednost={akcije.reduce((v, a) => v + a.novihPrijav, 0)} opis="novih prijav" />
          <Statistika ikona={Users} vrednost={akcije.reduce((v, a) => v + a.zasedena, 0)} opis="potrjenih prostovoljcev" />
        </div>

        <h2 className="sekcija">Akcije</h2>
        {nalaganje ? (
          [1, 2, 3].map((i) => <div key={i} className="skelet" />)
        ) : akcije.length === 0 ? (
          <p className="prazno"><Inbox size={18} />Še nimaš akcij. Klikni »Nova akcija«.</p>
        ) : (
          <div className="tabela-ovoj">
            <table className="tabela">
              <thead>
                <tr>
                  <th><Compass size={14} />Akcija</th>
                  <th><CalendarDays size={14} />Termin</th>
                  <th><MapPin size={14} />Kraj</th>
                  <th><Users size={14} />Zasedenost</th>
                  <th>Nove prijave</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {akcije.map((a) => (
                  <tr key={a._id} className={'klikljiva' + (izbrana?._id === a._id ? ' izbrana' : '')} onClick={() => izberi(a)}>
                    <td><div className="ime-celica"><Compass size={15} />{a.naziv}</div></td>
                    <td>{oblikujDatum(a.zacetek)} – {oblikujUro(a.konec)}</td>
                    <td>{a.lokacija}</td>
                    <td>
                      <div className="zasedenost">
                        <div className="napredek"><div style={{ width: `${(a.zasedena / a.steviloMest) * 100}%` }} /></div>
                        {a.zasedena}/{a.steviloMest}
                      </div>
                    </td>
                    <td>{a.novihPrijav > 0 ? <span className="znacka ODDANA">{a.novihPrijav} novih</span> : <span className="podatki">–</span>}</td>
                    <td><span className={'znacka ' + a.status}>{STATUSI[a.status]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {izbrana && (
          <>
            <h2 className="sekcija">{izbrana.naziv}</h2>
            <p className="podatki" style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
              {oblikujDatum(izbrana.zacetek)} – {oblikujUro(izbrana.konec)} · {izbrana.lokacija} · Potrjenih: {zasedenih}/{izbrana.steviloMest}
            </p>
            <div className="zavihki">
              {ZAVIHKI.map((z) => {
                const Ikona = z.ikona;
                return (
                  <button key={z.id} className={'zavihek' + (zavihek === z.id ? ' aktiven' : '')} onClick={() => setZavihek(z.id)}>
                    <Ikona size={15} />{z.naslov}<span className="stevec">{zStatusi(z.statusi).length}</span>
                  </button>
                );
              })}
            </div>
            <TabelaPrijav prijave={vrstice} ukrepi={ukrepi} stevilke={zavihek === 'vrsta'} />
          </>
        )}
      </div>

      {modal && (
        <div className="modal-ozadje" onClick={() => setModal(false)}>
          <form className="kartica modal" onClick={(e) => e.stopPropagation()} onSubmit={objavi}>
            <div className="modal-glava">
              <h2>Nova akcija</h2>
              <button type="button" className="povezava" onClick={() => setModal(false)}><X size={18} /></button>
            </div>
            <label>Naziv<input value={nova.naziv} onChange={spremeni('naziv')} required /></label>
            <label>Opis<textarea rows={3} value={nova.opis} onChange={spremeni('opis')} required /></label>
            <div className="mreza-polj">
              <label>Kraj<input value={nova.lokacija} onChange={spremeni('lokacija')} required /></label>
              <label>Število mest<input type="number" min={1} value={nova.steviloMest} onChange={spremeni('steviloMest')} required /></label>
              <label>Začetek<input type="datetime-local" min={zdajLokalno()} value={nova.zacetek} onChange={spremeni('zacetek')} required /></label>
              <label>Konec<input type="datetime-local" min={nova.zacetek || zdajLokalno()} value={nova.konec} onChange={spremeni('konec')} required /></label>
            </div>
            <button className="gumb"><Plus size={16} />Objavi akcijo</button>
          </form>
        </div>
      )}
      {toast}
    </>
  );
}