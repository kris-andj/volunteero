const API = 'http://localhost:5050/api';

export const STATUSI = {
  ODDANA: 'Oddana',
  POTRJENA: 'Potrjena',
  KONFLIKT: 'Konflikt',
  CAKALNA_VRSTA: 'Čakalna vrsta',
  ZAVRNJENA: 'Zavrnjena',
  PREKLICANA: 'Preklicana',
  UDELEZEN: 'Udeležen',
  OBJAVLJENA: 'Objavljena',
  ZAKLJUCENA: 'Zaključena'
};

export async function klic(pot, metoda = 'GET', telo) {
  const zeton = localStorage.getItem('zeton');
  const odgovor = await fetch(API + pot, {
    method: metoda,
    headers: {
      'Content-Type': 'application/json',
      ...(zeton ? { Authorization: 'Bearer ' + zeton } : {})
    },
    body: telo ? JSON.stringify(telo) : undefined
  });
  const podatki = await odgovor.json().catch(() => ({}));
  if (!odgovor.ok) {
    throw new Error(podatki.napaka || 'Napaka pri zahtevku');
  }
  return podatki;
}

export function oblikujDatum(datum) {
  return new Date(datum).toLocaleString('sl-SI', {
    weekday: 'short', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export function oblikujUro(datum) {
  return new Date(datum).toLocaleTimeString('sl-SI', { hour: '2-digit', minute: '2-digit' });
}