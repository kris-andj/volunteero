import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Compass, User, LayoutGrid, ShieldCheck, LogOut, HandHeart } from 'lucide-react';
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
        <div className="logo">
          <span className="logo-znak"><HandHeart size={16} /></span>
          Volunteero
        </div>
        {uporabnik && (
          <nav>
            {uporabnik.vloga === 'STUDENT' && (
              <>
                <NavLink to="/akcije"><Compass size={16} /><span className="besedilo-povezave">Akcije</span></NavLink>
                <NavLink to="/profil"><User size={16} /><span className="besedilo-povezave">Moj profil</span></NavLink>
              </>
            )}
            {uporabnik.vloga === 'ORGANIZATOR' && (
              <NavLink to="/organizator"><LayoutGrid size={16} /><span className="besedilo-povezave">Moje akcije</span></NavLink>
            )}
            {uporabnik.vloga === 'SKRBNIK' && (
              <NavLink to="/skrbnik"><ShieldCheck size={16} /><span className="besedilo-povezave">Potrditve</span></NavLink>
            )}
            <span className="uporabnik">{uporabnik.ime}</span>
            <button className="povezava" onClick={odjava}><LogOut size={16} /><span className="besedilo-povezave">Odjava</span></button>
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