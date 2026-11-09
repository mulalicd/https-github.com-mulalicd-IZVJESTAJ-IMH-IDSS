# IDSS & IMH: Strateški izvještaj o poslovanju i vizija razvoja 2027–2032

Interaktivni prikaz forenzičke dijagnoze poslovanja, programa stabilizacije i strategije održivog rasta za **Internationale Deutsche Schule Sarajevo (IDSS)** i **International Montessori House (IMH)**, obrazovnu grupu na lokaciji Buka 11 i 13 u Sarajevu. Grupa nudi neprekinut obrazovni put od jaslica do završetka osnovne škole.

> Stanje podataka: 31.08.2026. · Datum izvještaja: novembar 2026. · Svi iznosi su u KM.
> Lični identifikacioni brojevi, adrese, brojevi računa i podaci o vozilima uklonjeni su iz koda. Primjeri kartica partnera i portfelj naplate koriste pseudonime (P-101, P-201 …).

## Glavni zaključak

**Grupa ima zdrav obrazovni proizvod, ali neodrživu ekonomsku strukturu.** Prihodi rastu, ali troškovi rada rastu brže. Bez intervencije, konsolidovana EBITDA u školskoj godini 2026/27 pada na oko 9.000 KM (0,6%). Uz program stabilizacije i rasta, bazni scenarij dostiže **EBITDA od oko 296.000 KM i maržu od 12,6%** do 2031/32.

## Ključne brojke

| Pokazatelj | 2023. | 2024. | 2025. | ŠG 2026/27* |
|---|---:|---:|---:|---:|
| Konsolidovani prihod | 1.516.304 | 1.597.021 | 1.701.240 | 1.686.076 |
| EBITDA grupe | 337.306 | 192.051 | 143.310 | 9.334 |
| EBITDA marža | 22,2% | 12,0% | 8,4% | 0,6% |
| Troškovi rada / prihod | 55,6% | 63,8% | 71,9% | 79,0% |
| Neto rezultat grupe | 255.225 | 158.308 | 54.314 | – |

\* Bazna godina bez intervencije (status quo).

## Deset nalaza dijagnoze (sažeto)

1. **Rast prihoda uz eroziju marže:** prihod +12% (2023.–2025.), EBITDA marža s 22,2% na 8,4%.
2. **Troškovi rada su glavni pokretač pada:** prosječan broj zaposlenih porastao je s 32 na 49 (+53%), a udio troškova rada u prihodu na 79% u baznoj godini.
3. **IDSS ima strukturni manjak:** 83 ugovora i 779.476 KM ugovorene vrijednosti, uz godišnji trošak od oko 900.000 KM. Prelomna tačka je oko 98 učenika.
4. **Popusti su najveća neiskorištena poluga:** odstupanje od cjenovnika iznosi 108.324 KM (12,6%). Svođenje na 8% donosi oko 39.500 KM godišnje.
5. **Upis u IDSS oscilira:** 79 → 94 → 68 → 83 učenika; popunjenost je 61,5% od 135 mjesta.
6. **Vertikala IMH → IDSS je dokazana snaga:** 7 od 11 prvačića dolazi iz predškolske grupe. IMH radi s 90 od 95 mjesta.
7. **Pojedinačni rezultati ustanova nisu uporedivi** zbog promjenjivih međukompanijskih aranžmana. Pouzdan je samo konsolidovani pogled.
8. **Bilans zahtijeva čišćenje:** potraživanja od zaposlenih, uprave i fizičkih lica iznose 184.692 KM, a kapital grupe prije rezultata 2026. iznosi oko −37.300 KM.
9. **Likvidnost je tanka:** gotovina grupe iznosi 37.639 KM, što pokriva oko 8 dana troškova. Eksterni dug iznosi 188.063 KM, a uz leasing vozila (≈104.015 KM) i obavezu IMH-a prema osnivaču (93.485 KM) oko 385.600 KM.
10. **Prostor je strateška imovina i rizik:** 1.287,40 m² po zakupu od 5 KM/m² (Općina Centar). Ugovorni okvir mora jasno pokriti i IDSS.

## Strategija u tri faze

| Faza | Period | Ključni rezultat |
|---|---|---|
| I. Stabilizacija | 0–12 mjeseci | Javne obaveze izmirene, nova politika cijena, ugovor o podjeli troškova, sedmični plan likvidnosti |
| II. Konsolidacija | ŠG 2027/28–2028/29 | EBITDA marža ≥9%, upis u IDSS 92, troškovi rada ≤72% prihoda |
| III. Rast | ŠG 2029/30–2031/32 | EBITDA marža 12–17%, upis u IDSS 100+, diverzifikovani prihodi |

## Scenariji 2031/32

| Scenarij | Prihod | EBITDA | Marža | Kumulativna neto dobit 2027/28–2031/32 |
|---|---:|---:|---:|---:|
| Status quo | 1.861.564 | −198.065 | −10,6% | −728.377 |
| Konzervativni | 2.080.834 | 84.765 | 4,1% | 177.973 |
| **Bazni (preporučeni)** | **2.348.462** | **295.987** | **12,6%** | **784.570** |
| Rastući (uz drugu lokaciju IMH-a) | 3.108.298 | 539.166 | 17,3% | 1.341.700 |

## Puni izvještaj

- [Strateški izvještaj 2027–2032 (Word)](docs/IDSS_IMH_Strateski_izvjestaj_2027-2032_v2.docx)
- [Strateški izvještaj 2027–2032 (PDF)](docs/IDSS_IMH_Strateski_izvjestaj_2027-2032_v2.pdf)

Verzija 2 (09.11.2026.) sadrži ispravke forenzičke provjere i nova poglavlja o kreditu MF Banke (5.2) te vozilu u leasingu i obavezi prema osnivaču (6.5).

## Šta aplikacija sadrži

- Konsolidaciju finansijske historije 2022–2025 i tekuće 2026. godine
- Analizu upisa i cijena IDSS-a te kapaciteta IMH-a
- Matricu rizika i registar rizika (R1–R12)
- Projekciju novčanih tokova i scenarijski simulator
- Plan aktivnosti programa stabilizacije

## Pokretanje lokalno

Potrebni su Node.js 20+ i Gemini API ključ (samo za modul analize kartica partnera).

```bash
npm install
cp .env.example .env   # upisati GEMINI_API_KEY
npm run dev            # http://localhost:3000
```

## Metodologija i standard dokaza

Svaka brojka pripada jednoj od tri kategorije: **[V] verifikovano** (knjigovodstvena isprava, zvanični obrazac ili ugovor), **[U] podatak uprave** (u planu dokumentarne potvrde) i **[P] procjena ili projekcija** (eksplicitne pretpostavke i formule). EBITDA se računa kao neto rezultat + porez na dobit + finansijski rashodi + amortizacija. Konsolidovani prihod je zbir prihoda obje ustanove umanjen za međusobne prihode.

---
*Izvor: Strateški izvještaj o poslovanju i vizija razvoja 2027–2032 (novembar 2026.). Prikazane brojke usklađene su s forenzičkom provjerom od 09.11.2026.*
