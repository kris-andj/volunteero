export default function Statistika({ ikona: Ikona, vrednost, opis, razred = '' }) {
  return (
    <div className={'statistika ' + razred}>
      <div className="statistika-ikona"><Ikona size={20} /></div>
      <div>
        <strong>{vrednost}</strong>
        <span>{opis}</span>
      </div>
    </div>
  );
}