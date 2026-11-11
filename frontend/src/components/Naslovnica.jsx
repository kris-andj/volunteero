export default function Naslovnica({ ikona: Ikona, naslov, podnaslov, children }) {
  return (
    <>
      <div className="naslovnica" />
      <div className="vsebina">
        <div className="ikona-strani">{Ikona && <Ikona size={32} />}</div>
        <div className="vrstica-naslova">
          <div>
            <h1>{naslov}</h1>
            {podnaslov && <p className="podnaslov">{podnaslov}</p>}
          </div>
          {children}
        </div>
      </div>
    </>
  );
}