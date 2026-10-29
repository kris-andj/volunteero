# Volunteero – Zasnova rešitve

## 1. Ime rešitve

**Volunteero** (izg. *volantiro*, iz angl. *volunteer* – prostovoljec) – spletna aplikacija, kjer organizacije objavljajo prostovoljske akcije, študenti pa se nanje prijavljajo.

## 2. Namen in problem

Študentske organizacije in fakultete pogosto potrebujejo prostovoljce (informativni dnevi, dobrodelne akcije, dogodki). Danes jih iščejo prek Facebooka, Instagrama in e-pošte. Zaradi tega:

- organizatorji težko spremljajo, kdo se je prijavil in kdo je res prišel,
- se študent lahko obveže za dve akciji ob istem času,
- študenti nimajo pregleda nad svojimi prijavami in opravljenimi urami.

Volunteero zbere vse na enem mestu: organizacije objavijo akcije, študenti se prijavijo, sistem pa **zazna prekrivanje terminov** in **šteje prostovoljske ure**.

## 3. Ciljni uporabniki

### Primarna ciljna skupina: študenti
Vpisani študenti Univerze v Mariboru (dodiplomski in magistrski študij), ki želijo ob študiju sodelovati pri prostovoljskih akcijah. Zanje je značilno:
- imajo **omejen in spremenljiv prosti čas** (predavanja, vaje, izpiti, študentsko delo), zato potrebujejo hiter pregled, katere akcije se ne prekrivajo z njihovimi obveznostmi,
- prostovoljstvo jim prinaša **izkušnje, poznanstva in reference za življenjepis**, zato želijo imeti zanesljivo evidenco opravljenih ur,
- se pogosto prijavijo na več akcij hkrati in potrebujejo jasno informacijo, kje so sprejeti in kje čakajo,
- aplikacijo uporabljajo predvsem na telefonu ali prenosniku, med odmori ali zvečer.

### Sekundarna ciljna skupina: organizacije
Organizacije, ki redno potrebujejo večje število prostovoljcev za enkratne dogodke:
- študentske organizacije in klubi (npr. Študentska organizacija Univerze v Mariboru, fakultetni študentski sveti),
- fakultete in univerza (informativni dnevi, sprejem brucev, konference),
- nevladne in humanitarne organizacije (zavetišča za živali, dobrodelni teki, zbiranje hrane).

Njihovi predstavniki (organizatorji) potrebujejo en pregled prijav, hitro izbiro prostovoljcev in zanesljivo informacijo, kdo je dejansko prišel. Danes to vodijo v Excelu, e-pošti ali skupinah na družbenih omrežjih.

### Kdo ni ciljna skupina
- dijaki in splošna javnost,
- plačano študentsko delo (to urejajo študentski servisi),
- dolgoročno prostovoljstvo z rednim tedenskim urnikom.

Skrbnik sistema ni ciljni uporabnik, temveč vloga, ki skrbi za delovanje platforme (opisana je v dokumentu `02-funkcionalnosti-in-obseg.md`).

## 4. Kratek opis delovanja

1. Študent se registrira z vpisno številko, organizator pa skupaj s svojo organizacijo. **Skrbnik** študenta potrdi in organizacijo odobri.
2. Organizator objavi akcijo (naziv, kraj, začetek, konec, število mest).
3. Študent se prijavi na eno ali več akcij.
4. Organizator prijavo sprejme ali zavrne:
   - če se akcija ne prekriva z drugo potrjeno akcijo študenta, je prijava **potrjena**,
   - če se prekriva, prijava dobi status **konflikt** in študent mora izbrati, katero akcijo obdrži.
5. Če je akcija že polna, sprejeta prijava pride na **čakalno vrsto**. Ko se mesto sprosti, sistem samodejno potrdi prvega študenta v vrsti, ki nima prekrivanja s svojimi potrjenimi akcijami.
6. Po koncu akcije organizator označi, kdo je prišel, sistem pa študentu prišteje ure.

## 5. Primer

> Ana se prijavi na »Informativni dan« (sobota 9:00–13:00) in »Dobrodelni tek« (sobota 12:00–16:00). Fakulteta jo sprejme prva, zato je Informativni dan *potrjen*. Ko jo sprejme še organizator teka, sistem zazna prekrivanje in prijavo označi kot *konflikt*. Ana na svojem profilu izbere Informativni dan, prijava na tek se prekliče. Po informativnem dnevu dobi 4 ure.
