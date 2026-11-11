import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Vpis from './pages/Vpis';
import Akcije from './pages/Akcije';
import Profil from './pages/Profil';
import Organizator from './pages/Organizator';
import Skrbnik from './pages/Skrbnik';

const ZACETNE_STRANI = { STUDENT: '/akcije', ORGANIZATOR: '/organizator', SKRBNIK: '/skrbnik' };

export default function App() {
  const [uporabnik, setUporabnik] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('uporabnik'));
    } catch {
      return null;
    }
  });

  function prijava(podatki) {
    const nov = { ime: podatki.ime, vloga: podatki.vloga };
    localStorage.setItem('zeton', podatki.zeton);
    localStorage.setItem('uporabnik', JSON.stringify(nov));
    setUporabnik(nov);
  }

  function odjava() {
    localStorage.removeItem('zeton');
    localStorage.removeItem('uporabnik');
    setUporabnik(null);
  }

  const domov = uporabnik ? ZACETNE_STRANI[uporabnik.vloga] : '/vpis';
  const zaVlogo = (vloga, stran) => (uporabnik?.vloga === vloga ? stran : <Navigate to={domov} />);

  return (
    <BrowserRouter>
      <header className="glava">
        <span className="logo">VOLUNTEERO</span>
        {uporabnik && (
          <nav>
            {uporabnik.vloga === 'STUDENT' && (
              <>
                <Link to="/akcije">Akcije</Link>
                <Link to="/profil">Profil</Link>
              </>
            )}
            {uporabnik.vloga === 'ORGANIZATOR' && <Link to="/organizator">Moje akcije</Link>}
            {uporabnik.vloga === 'SKRBNIK' && <Link to="/skrbnik">Potrditve</Link>}
            <span className="podatki">{uporabnik.ime}</span>
            <button className="gumb-mali" onClick={odjava}>Odjava</button>
          </nav>
        )}
      </header>

      <main>
        <Routes>
          <Route path="/vpis" element={uporabnik ? <Navigate to={domov} /> : <Vpis onPrijava={prijava} />} />
          <Route path="/akcije" element={zaVlogo('STUDENT', <Akcije />)} />
          <Route path="/profil" element={zaVlogo('STUDENT', <Profil />)} />
          <Route path="/organizator" element={zaVlogo('ORGANIZATOR', <Organizator />)} />
          <Route path="/skrbnik" element={zaVlogo('SKRBNIK', <Skrbnik />)} />
          <Route path="*" element={<Navigate to={domov} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}