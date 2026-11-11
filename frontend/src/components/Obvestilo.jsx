import { useEffect, useState } from 'react';

export function useObvestilo() {
  const [obvestilo, setObvestilo] = useState(null);

  useEffect(() => {
    if (!obvestilo) {
      return;
    }
    const casovnik = setTimeout(() => setObvestilo(null), 3500);
    return () => clearTimeout(casovnik);
  }, [obvestilo]);

  const prikazi = (besedilo, napaka = false) => setObvestilo({ besedilo, napaka, id: Date.now() });

  const element = obvestilo && (
    <div key={obvestilo.id} className={'toast' + (obvestilo.napaka ? ' napaka-toast' : '')}>
      {obvestilo.besedilo}
    </div>
  );

  return [element, prikazi];
}