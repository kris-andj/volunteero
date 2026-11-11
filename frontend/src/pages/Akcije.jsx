import { useEffect, useMemo, useState } from 'react';
import { Compass, MapPin, CalendarDays, Users, Building2, Navigation, Search, X, Inbox, TriangleAlert } from 'lucide-react';
import { klic, oblikujDatum, oblikujUro, STATUSI } from '../api';
import Naslovnica from '../components/Naslovnica';
import { useObvestilo } from '../components/Obvestilo';

export default function Akcije() {
  const [akcije, setAkcije] = useState([]);
  const [moje, setMoje] = useState([]);
  const [nalaganje, setNalaganje] = useState(true);
  const [pogled, setPogled] = useState('vse');
  const [mojKraj, setMojKraj] = useState(() => localStorage.getItem('mojKraj') || '');
  const [iskanje, setIskanje] = useState('');
  const [datum, setDatum] = useState('');
  const [organizacija, setOrganizacija] = useState(null);
  const [toast, prikazi] = useObvestilo();

  async function nalozi() {
    try {
      const [vse, mojePrijave] = await Promise.all([klic('/akcije'), klic('/prijave/moje')]);
      setAkcije(vse);
      setMoje(mojePrijave);
    } catch (err) {
      prikazi(err.message, true);
    } finally {
      setNalaganje(false);
    }
  }

  useEffect(() => {
    nalozi();
  }, []);

  function izberiKraj(kraj) {
    setMojKraj(kraj);
    localStorage.setItem('mojKraj', kraj);
    if (kraj) {
      setPogled('blizina');
    }
  }

  async function prijavi(akcija) {
    try {
      await klic(`/akcije/${akcija._id}/prijave`, 'POST');
      prikazi(akcija.prostaMesta === 0
        ? 'Prijava oddana. Ob sprejemu boš na čakalni vrsti.'
        : 'Prijava oddana. Organizator jo bo pregledal.');
      nalozi();
    } catch (err) {
      prikazi(err.message, true);
    }
  }

  const kraji = useMemo(() => [...new Set(akcije.map((a) => a.lokacija))].sort(), [akcije]);

  const organizacije = useMemo(() => {
    const mapa = new Map();
    akcije.forEach((a) => {
      const o = a.organizacijaId;
      if (!o) return;
      const zapis = mapa.get(o._id) || { _id: o._id, naziv: o.naziv, akcij: 0, kraji: new Set() };
      zapis.akcij += 1;
      zapis.kraji.add(a.lokacija);
      mapa.set(o._id, zapis);
    });
    return [...mapa.values()];
  }, [akcije]);

  const potrjene = moje.filter((p) => p.status === 'POTRJENA' && p.akcijaId).map((p) => p.akcijaId);
  const sePrekriva = (a) =>
    potrjene.some((p) => p._id !== a._id && new Date(a.zacetek) < new Date(p.konec) && new Date(p.zacetek) < new Date(a.konec));
  const mojaPrijava = (a) => moje.find((p) => p.akcijaId && p.akcijaId._id === a._id);

  const vBlizini = akcije.filter((a) => mojKraj && a.lokacija === mojKraj);
  const osnova = pogled === 'blizina' ? vBlizini : akcije;
  const prikazane = osnova.filter(
    (a) =>
      (!organizacija || a.organizacijaId?._id === organizacija._id) &&
      (!datum || new Date(a.zacetek).toLocaleDateString('sv-SE') === datum) &&
      (!iskanje || `${a.naziv} ${a.lokacija} ${a.organizacijaId?.naziv || ''}`.toLowerCase().includes(iskanje.toLowerCase()))
  );

  const kategorije = [
    { id: 'vse', naslov: 'Vse akcije', slika: 'slika-2', ikona: Compass, opis: `${akcije.length} odprtih akcij` },
    { id: 'blizina', naslov: 'V bližini', slika: 'slika-1', ikona: Navigation, opis: mojKraj ? `${vBlizini.length} akcij v kraju ${mojKraj}` : 'Izberi svoj kraj' },
    { id: 'organizacije', naslov: 'Organizacije', slika: 'slika-3', ikona: Building2, opis: `${organizacije.length} organizacij` }
  ];

  return (
    <>
      <Naslovnica ikona={Compass} naslov="Prostovoljske akcije" podnaslov="Vse odprte akcije na enem mestu. Poišči tiste v svoji bližini in se prijavi z enim klikom.">
        <div className="polje-ikona">
          <MapPin size={16} />
          <select value={mojKraj} onChange={(e) => izberiKraj(e.target.value)}>
            <option value="">Moj kraj …</option>
            {kraji.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </Naslovnica>

      <div className="vsebina">
        <div className="kategorije">
          {kategorije.map((k) => {
            const Ikona = k.ikona;
            return (
              <button key={k.id} className={'kategorija' + (pogled === k.id ? ' aktivna' : '')} onClick={() => setPogled(k.id)}>
                <div className={'kategorija-slika ' + k.slika}>{k.naslov}</div>
                <div className="kategorija-podatki"><Ikona size={15} />{k.opis}</div>
              </button>
            );
          })}
        </div>

        <h2 className="sekcija">
          {pogled === 'organizacije' ? 'Organizacije z odprtimi akcijami' : pogled === 'blizina' ? 'Akcije v bližini' : 'Vse odprte akcije'}
        </h2>

        {pogled === 'organizacije' ? (
          organizacije.length === 0 ? (
            <p className="prazno"><Inbox size={18} />Trenutno ni organizacij z odprtimi akcijami.</p>
          ) : (
            <div className="mreza">
              {organizacije.map((o) => (
                <button key={o._id} className="kartica org-kartica" onClick={() => { setOrganizacija(o); setPogled('vse'); }}>
                  <div className="org-znak">{o.naziv.charAt(0)}</div>
                  <h3>{o.naziv}</h3>
                  <span className="podatki"><MapPin size={13} /> {[...o.kraji].join(', ')}</span>
                  <span className="znacka ORG">{o.akcij} odprtih akcij</span>
                </button>
              ))}
            </div>
          )
        ) : (
          <>
            <div className="orodja">
              <div className="polje-ikona">
                <Search size={16} />
                <input placeholder="Išči po nazivu, kraju, organizaciji" value={iskanje} onChange={(e) => setIskanje(e.target.value)} />
              </div>
              <div className="polje-ikona">
                <CalendarDays size={16} />
                <input type="date" value={datum} onChange={(e) => setDatum(e.target.value)} />
              </div>
              {organizacija && (
                <span className="cip">
                  <Building2 size={13} />{organizacija.naziv}
                  <button onClick={() => setOrganizacija(null)}><X size={13} /></button>
                </span>
              )}
            </div>

            {nalaganje ? (
              [1, 2, 3, 4].map((i) => <div key={i} className="skelet" />)
            ) : pogled === 'blizina' && !mojKraj ? (
              <p className="prazno"><MapPin size={18} />Zgoraj desno izberi svoj kraj, da vidiš akcije v bližini.</p>
            ) : prikazane.length === 0 ? (
              <p className="prazno"><Inbox size={18} />Ni akcij za izbrane filtre.</p>
            ) : (
              <div className="tabela-ovoj">
                <table className="tabela">
                  <thead>
                    <tr>
                      <th><Compass size={14} />Akcija</th>
                      <th><CalendarDays size={14} />Termin</th>
                      <th><MapPin size={14} />Kraj</th>
                      <th><Users size={14} />Prosta mesta</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {prikazane.map((a) => {
                      const moja = mojaPrijava(a);
                      const prekriva = sePrekriva(a);
                      const polna = a.prostaMesta === 0;
                      return (
                        <tr key={a._id} title={a.opis}>
                          <td>
                            <div className="ime-celica"><Compass size={15} />{a.naziv}</div>
                            <div className="podatki">{a.organizacijaId?.naziv}</div>
                          </td>
                          <td>{oblikujDatum(a.zacetek)} – {oblikujUro(a.konec)}</td>
                          <td>{a.lokacija}</td>
                          <td>
                            <div className="zasedenost">
                              <div className="napredek"><div style={{ width: `${(a.zasedena / a.steviloMest) * 100}%` }} /></div>
                              {a.prostaMesta}/{a.steviloMest}
                            </div>
                          </td>
                          <td className="desno">
                            {moja ? (
                              <span className={'znacka ' + moja.status}>{STATUSI[moja.status]}</span>
                            ) : prekriva ? (
                              <span className="znacka PREKRIVANJE"><TriangleAlert size={12} />Prekrivanje</span>
                            ) : (
                              <button className={polna ? 'gumb-obroba' : 'gumb'} onClick={() => prijavi(a)}>
                                {polna ? 'Na čakalno vrsto' : 'Prijavi se'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
      {toast}
    </>
  );
}