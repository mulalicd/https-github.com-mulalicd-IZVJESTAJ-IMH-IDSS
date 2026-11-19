import type { AdvisorFocus } from '../components/WorldCeoAdvisor';

export interface CeoAdvisorContext {
  harmonizedCash: number;
  harmonizedNetResult: number;
  currentStudents: number;
  resolvedRisksCount: number;
  totalRisksCount: number;
}

const fmt = (n: number) => Math.round(n).toLocaleString('bs-BA');

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((t) => text.includes(t));
}

/**
 * Lokalni izvršni savjetnički mehanizam zasnovan na 100% verifikovanim podacima iz
 * USTAVNOG / Legal DD VDR repozitorija (92 dokumenta) i bruto bilansa na 31.10.2026.
 * Aktivira se automatski na statičkom hostingu (GitHub Pages, HTTP 404/405) ili pri
 * nedostupnosti backend API rute.
 */
export function generateLocalCeoReply(
  rawMessage: string,
  focus: AdvisorFocus,
  ctx: CeoAdvisorContext
): string {
  const q = rawMessage.toLowerCase();

  // 1. Specifičan zahtjev za službeni dopis roditeljima/upravi o kantonalnim subvencijama
  if (
    includesAny(q, ['subvencij', 'ministarstv', 'prolazn']) &&
    includesAny(q, ['dopis', 'pismo', 'obavijest', 'napiši', 'napisi', 'tekst', 'roditelj'])
  ) {
    return (
      '**NACRT SLUŽBENOG OBAVJEŠTENJA — KANTONALNE SUBVENCIJE (IMH)**\n\n' +
      'Poštovani roditelji,\n' +
      'radi potpune transparentnosti finansijskih odnosa, podsjećamo na jedino važeće pravilo obračuna školarine i kantonalnih subvencija u PPU International Montessori House:\n\n' +
      '- **Plaćanje školarine:** Roditelj ugovoreni iznos školarine (puni iznos po cjenovniku ili umanjen za popust koji je odobrio Upravni odbor IMH) uplaćuje direktno ustanovi u ugovorenim rokovima.\n' +
      '- **Izvještavanje Ministarstva KS:** Po završetku svakog mjeseca, IMH dostavlja službeni izvještaj Ministarstvu za odgoj i obrazovanje Kantona Sarajevo za svu djecu koja ostvaruju pravo na subvenciju.\n' +
      '- **Prosljeđivanje subvencije (100% prolazna stavka):** Odmah po prijemu doznake od Ministarstva na račun ustanove, IMH cjelokupan iznos subvencije prebacuje pojedinačno roditeljima na njihove račune.\n' +
      '- **Finansijska neutralnost:** IMH od kantonalnih subvencija nema nikakvu finansijsku korist niti poslovanje vrtića zavisi od njih. U slučaju da Ministarstvo kasni s isplatom, IMH objektivno nema sredstava koja bi prebacio roditeljima sve do dana stvarne uplate Ministarstva, dok obaveza plaćanja redovne školarine prema cjenovniku ostaje nepromijenjena.\n\n' +
      '**Izvršna napomena za upravu:** U knjigama IMH-a (konto `238800`) subvencije se nikada ne knjiže kao prihod, nego isključivo kao prolazna obaveza prema roditeljima.'
    );
  }

  const sections: string[] = [];

  // 2. Zakup Buka 11/13 (OPU-IP-850/2023)
  if (includesAny(q, ['zakup', 'općin', 'opcin', 'opu', '850', 'buka', 'podzakup', 'član 9', 'clan 9', 'čl. 9', '6.5'])) {
    sections.push(
      '**Notarski zakup Buka 11/13 — OPU-IP-850/2023 [V] (Općina Centar):**\n' +
      '- **Verifikovano trajanje i cijena:** Notarski ugovor od 27.09.2023. (Notar Nedžada Kapidžić) važi **01.09.2023. – 31.08.2033.** za **1.287,40 m²** po zaštićenoj cijeni **5,00 KM/m² neto** (**7.531,29 KM/mj. bruto** s PDV-om; godišnja ušteda > **150.000 KM**). Zaključkom Općinske komisije `16-45-sl.-60/23` (08.08.2023.) potvrđeno je **0,00 KM duga** na dan obnove.\n' +
      '- **Promijenjen rok plaćanja (`Član 3`):** Dospijeće je pomjereno na **10. u mjesecu unaprijed** (ranije 15.) na račun Općine kod **UniCredit Bank `3386902296575219`**.\n' +
      '- **`Član 9` (IZVRŠNA ISPRAVA):** Kašnjenje 2 dospjele zakupnine + 15 dana od preporučene opomene daje Općini pravo na jednostrani raskid i **neposredno prinudno izvršenje bez parnice protiv imovine IMH-a I lične pokretne/nepokretne imovine Lamie Kacile**.\n' +
      '- **`Član 6.5` & `11.3.e` (IDSS na Buka 13):** Zabrana podzakupa i ustupanja prostora trećim licima (osnov za raskid). IDSS posluje na Buka 13 (`68.419,89 KM` podjele troškova u 10 mj. 2026.). Iako je Rješenje Ministarstva KS za IDSS (`19.02.2016.`) dostavljeno Općini, nužan je **pisani aneks saglasnosti Općine**.\n' +
      '- **Hitni koraci (0–14 dana):** 1) Zatražiti IOS od Općine i proknjižiti 2 nedostajuće fakture (kartica pokazuje pretplatu `22.469 KM`); 2) Postaviti trajni nalog najkasnije do **8. u mjesecu**; 3) Podnijeti zahtjev Općini za pisani aneks za IDSS.'
    );
  }

  // 3. KUIP 04.11.2026., Anes Memić & IDSS Član 30
  if (includesAny(q, ['kuip', 'inspekcij', 'memić', 'memic', 'anes', 'razrješ', 'razrjes', 'konkurs', 'član 30', 'clan 30', 'njemačk', 'njemack', 'c1', 'sveta obitelj'])) {
    sections.push(
      '**KUIP KS inspekcija (04.11.2026.), tranzicija IMH & latentni IDSS Član 30:**\n' +
      '- **IMH status (verifikovano [V]):** Po Rješenju KUIP KS `UP-1-14-12-34-15117/26-12/07` (30.09.2026., čl. 48 Zakona o predškolskom odgoju), UO IMH je Odlukom `179-1/26` od **04.11.2026.** razriješio Davora Mulalića dužnosti direktora IMH, imenovao **Anesa Memića** za `v.d. direktora` i 06.11.2026. raspisao javni konkurs (8 dana).\n' +
      '- **Latentni domino-rizik IDSS (`Član 30.` Osnivačkog akta `OPU-IP: 217/2016`):** Propisuje da direktor IDSS mora imati uslove nastavnika/pedagoga, 3 god. iskustva u nastavi, **njemački jezik C1**, VII/II Bolonja + zvanje mentora — identična inspekcijska ranjivost kao u IMH!\n' +
      '- **Tehnička greška Ministarstva KS:** Rješenje `11-06/01-34-42039-1/26` (14.10.2026.) potvrđuje sjedište IMH na Buka 11, ali u preambuli pogrešno navodi *„Dječiji vrtić Sveta obitelj“* — odmah podnijeti zahtjev za zaključak o ispravci.\n' +
      '- **Akcija:** Okončati konkurs IMH i izvršiti sudski upis novog direktora; pokrenuti izmjenu Pravila IDSS (`Član 30.`) prije narednog inspekcijskog nadzora.'
    );
  }

  // 4. Bankovni kartoni potpisa (4/4) vs Sudski registar (2.000 KM)
  if (includesAny(q, ['karton', 'potpis', '2.000', '2000', 'registar', 'ovlaštenj', 'ovlastenj', 'račun', 'racun'])) {
    sections.push(
      '**Kritična neusklađenost: 4/4 Bankovni kartoni potpisa vs Sudski registar (2.000 KM):**\n' +
      '- **Sudski registri (`IMH 065-0-RegZ-26-008337`; `IDSS 065-0-RegZ-23-008444`):** Izričito ograničavaju ovlaštenje Davora Mulalića — sva plaćanja i ugovori **`> 2.000,00 KM`** zahtijevaju saglasnost osnivača.\n' +
      '- **Stvarno stanje u bankama (VDR `1.13`):** **Sva 4 kartona** (`IMH Sparkasse 1990490058487943`, `IMH MF 5724560000027469`, `IDSS Sparkasse 1994990021809884`, `IDSS MF 5724560000042638`) daju Davoru Mulaliću **`Samostalno / Neograničeno`** raspolaganje! Na kartonu **IDSS MF Banka (13.06.2025.) Lamia Kacila uopće nije deponovana**, a IMH kartoni su dodatno zastarjeli nakon razrješenja `04.11.2026.`.\n' +
      '- **Akcija (48–72 sata):** Odmah deponovati nove kartone u MF i Sparkasse banci: uvesti dvostruki potpis/limit `2.000 KM`, upisati Lamiu Kacilu na IDSS MF račun, te uskladiti IMH potpisnike sa `v.d. direktorom Anesom Memićem`.'
    );
  }

  // 5. Pozajmica 93.484,84 KM & Prebijanje sa 184.692 KM
  if (includesAny(q, ['prebij', 'pozajmic', '93.48', '184.69', '7.790', 'osnivač', 'osnivac', 'lamia', 'kacila', 'član 24', 'clan 24'])) {
    sections.push(
      '**Osnivač Lamia Kacila — Prebijanje 93.484,84 KM & Puna lična izloženost:**\n' +
      '- **Prebijanje (kompenzacija):** Osnivač duguje grupi **184.692 KM** (IMH `167.290 KM` + IDSS `17.402 KM`), dok IMH duguje osnivaču **93.484,84 KM** (trade-in Porsche 9YA Cayenne). Zakonskim prebijanjem neto dug osnivača pada na **91.207 KM** uz **0 KM gotovinskog odliva**, a mjesečni dug servis pada sa **≈14.460 KM** na **≈6.670 KM**!\n' +
      '- **Pravni alarm na potpisu (07.11.2026.):** Ugovor o pozajmici nosi datum `14.07.2026.`, ali je stvarno potpisan **07.11.2026.** — **3 dana NAKON razrješenja Davora Mulalića odlukom UO IMH (04.11.2026.)**. Hitno ga zamijeniti izjavom o prebijanju uz potpis ovlaštenog `v.d. direktora IMH Anesa Memića`.\n' +
      '- **Lična imovinska izloženost osnivača iz VDR-a:** (1) **IDSS `Član 24.`** — supsidijarna lična odgovornost za obaveze IDSS-a; (2) **Zakup `OPU-IP-850/2023 Član 9.`** — direktna notarska izvršnost na cjelokupnoj ličnoj imovini; (3) **MF Banka** — solidarni jemac (`8+` mjenica, Sud Banja Luka); (4) **Sparkasse Leasing** — mjenični dužnik.\n' +
      '- **Ugovor o radu IMH `112/26` (12.06.2026.):** `Savjetnik za poslovanje` (`3.000 KM` neto / `4.782,61 KM` bruto mjesečno) ne postoji u Pravilniku IMH iz 2015. — ažurirati sistematizaciju i sjedište (ukloniti staru adresu Avde Smajlovića 9).'
    );
  }

  // 6. Sparkasse Leasing, Zalog BiH & Porsche Cayenne
  if (includesAny(q, ['leasing', 'lizing', 'porsche', 'cayenne', 'sparkasse', 'zalog', 'change', '12546', 'tačka ix', 'tacka ix'])) {
    sections.push(
      '**Sparkasse Leasing 12546/26, BiH Zalog & Change-of-Control (Porsche Cayenne 2025):**\n' +
      '- **Finansijski parametri (14.07.2026.):** Nabavna `100.980,15 EUR` neto (`197.500,01 KM`), učešće `47.798,04 EUR` (`93.484,84 KM`), finansirano `53.182,11 EUR`, **60 rata × `1.027,91 EUR`** (`EKS 8,02%` s PDV) + **`46.371 KM`** 5-godišnjih troškova (kasko `33.930 KM`, registracija `7.358 KM`, AO `5.083 KM`).\n' +
      '- **Zalog i raskidna klauzula:** Zalog upisan u **Registar zaloga Ministarstva pravde BiH** (`197.500,01 KM`). **`Tačka IX` (alineja 8)** predviđa **trenutni raskid ugovora pri promjeni vlasništva (Change-of-Control)** bez prethodne pisane saglasnosti Sparkasse Leasinga!\n' +
      '- **Preporuka:** Zbog privatne upotrebe (korist u naravi + poreski nepriznat rashod + M&A prepreka), izvršiti **carve-out / prijenos leasinga na osnivača** i ispraviti knjiženje učešća i amortizacije.'
    );
  }

  // 7. MF Banka krediti, 100.000 KM & istekli IDSS overdraft
  if (includesAny(q, ['kredit', 'mf bank', 'overdraft', 'prekoračenj', 'prekoracenj', '100.000', '100k', '6217', 'mjenic', 'banja luk'])) {
    sections.push(
      '**MF Banka krediti, stavka 100.000 KM (konto 6217) & istekli IDSS Overdraft:**\n' +
      '- **Aktivna zaduženja (`31.10.2026.`):** IMH dugoročni kredit `100.000 KM` (`30.07.2026.`, rata `4.660,68 KM`, `10,99%` / EKS `12,63%`, saldo `92.481,66 KM`); IDSS kredit `20.000 KM` (`457-0249/2025`, saldo `8.447,36 KM`); IDSS overdraft `15.000 KM` (`437-0154/2025`, saldo `5.554,04 KM`).\n' +
      '- **Kritični VDR nalazi:** (1) **IDSS overdraft istekao je `12.06.2026.`** — aneks produženja nedostaje u VDR-u iako je konto `4240` aktivan; (2) Unakrsna jemstva (`IDSS ↔ IMH ↔ Lamia Kacila`), **`8+` bjanko mjenica bez protesta**, ugovorena nadležnost **Suda u Banjoj Luci**; (3) Fakture IDSS → IMH od **100.000 KM** (konto `6217`) nose neslaganje plaćanja od **12.200 KM** (IDSS vodi `100k`, IMH `87.800 KM`) i zahtijevaju ugovor + dokaze o radovima za banku i poresku reviziju.'
    );
  }

  // 8. Cash-flow, ljetna rupa 2027, bruto bilans 31.10.2026. & neravnoteža -812,54 KM
  if (includesAny(q, ['cash', 'likvidn', 'gotovin', 'ljet', 'rezerv', 'bilans', '812', 'depozit', 'kapital', 'rezultat', 'dug servis'])) {
    sections.push(
      '**Likvidnost (31.10.2026.), servis duga & premošćavanje ljeta 2027.:**\n' +
      `- **Stvarno stanje knjiga:** Gotovina grupe **${fmt(ctx.harmonizedCash)} KM** (stvarno na računima ~81.771 KM) naspram **65.091 KM depozita roditelja** (tuđi novac). Normalizovani operativni rezultat 10 mj. 2026. iznosi **+${fmt(ctx.harmonizedNetResult)} KM** (iskazano +177.490 KM minus 100.000 KM međufirmskih faktura). Kapital grupe je negativan (**−37.328 KM**).\n` +
      '- **Integritet bilansa:** Bruto bilans IDSS na 31.10.2026. nije u ravnoteži za **−812,54 KM** (5.300.494,50 vs 5.301.307,04 KM), a međufirmske fakture IMH→IDSS imaju razliku **6.297,05 KM** — računovođa mora otkloniti obje razlike prije eksternog izvještavanja.\n' +
      '- **Premošćavanje ljeta 2027. (faktor sezonalnosti 0,789):** (1) Odmah provesti **prebijanje 93.484,84 KM** s osnivačem čime mjesečni servis duga pada sa **≈14.460 KM** na **≈6.670 KM** (+7.790 KM/mj. ušteđene gotovine); (2) Od novembra 2026. do maja 2027. izdvajati min. 8.000–10.000 KM/mj. na namjensku rezervu za jul/avgust 2027. i pokriće depozita roditelja; (3) Uvesti ritam 5. u mjesecu zatvaranje + 8.–10. plaćanje zakupa i rolling forecast.'
    );
  }

  // 9. Upis IDSS, vertikala IMH -> IDSS, prelomna tačka
  if (includesAny(q, ['upis', 'učenik', 'ucenik', 'vertikal', 'prelom', '95', '98', '83', '64%', 'konverzij', 'rast', 'arpu', 'cjenovnik'])) {
    sections.push(
      '**Rast upisa IDSS (83 → 95–98 učenika) & Vertikala IMH → IDSS (64% → 80%):**\n' +
      `- **Jedinična ekonomika:** Pri trenutnih **${ctx.currentStudents} učenika** i realizovanom ARPU od **9.391 KM** (87,4% cjenovnika), troškovi rada IDSS-a (704.517 KM) jedu **90,4% školarine**. Prelomna tačka škole bez dodatnih fiksnih troškova je **98 učenika**.\n` +
      '- **Poluga vertikale (glavni hedge protiv odlaska stranih porodica):** Trenutno **64% (`7/11`)** prvačića dolazi iz IMH-a. Podizanjem konverzije na **75–80%** (rani porodični ugovori u martu/aprilu, zajednički dani otvorenih vrata, zagarantovan porodični popust za prelazak + njemački pripremni modul u završnoj godini IMH) dodajete `+8 do +12` domaćih učenika sa višegodišnjim LTV-om.\n' +
      '- **Finansijski efekt:** Svaki novi učenik donosi **~8.191 KM** čiste kontribucije (`9.391 − 1.200 KM` direktnog troška). Prelazak sa 83 na 95 učenika diže godišnji rezultat za **~98.300 KM** i spušta udio plata ispod **72%**, vodeći grupu u pozitivan kapital do kraja 2028.'
    );
  }

  // 10. HR, Menadžerski ugovor Davor Mulalić & UOD 93.117 KM
  if (includesAny(q, ['hr', 'zaposlen', 'menadžer', 'menadzer', 'padobran', 'otpremnin', 'uod', 'ugovor o djelu', '93.117', 'pravilnik', 'plate'])) {
    sections.push(
      '**HR struktura (44 pozicije / 43 osobe), Menadžerski ugovor & UOD (93.117 KM):**\n' +
      '- **Struktura kadra (VDR):** Ukupno `44` pozicije (`20` IMH + `24` IDSS), odnosno `43` jedinstvene osobe.\n' +
      '- **Menadžerski ugovor IDSS (Davor Mulalić, `01.10.2024.–01.10.2028.`):** `2.800 KM` neto + god. rast min `3%` + bonus min `5%` neto dobiti + `5.000 KM/god.` edukacija + auto 24/7 + privatno zdravstveno; automatsko produženje 4 god. bez otkaza 6 mj. unaprijed. **Zlatni padobran:** `6 mj.` otkazni rok + `6 mj.` otpremnina + `12 mj.` non-compete na `50%` = **`12–18` mjesečnih naknada izlaznog troška**.\n' +
      '- **Ugovori o djelu IDSS (`93.117 KM` u 10 mj. 2026.):** Visok rizik inspekcijske preklasifikacije u radni odnos — pribaviti saglasnosti matičnih škola i prevesti redovnu nastavu u dopunski rad.'
    );
  }

  // 11. VDR Due Diligence spremnost i prazni folderi
  if (includesAny(q, ['vdr', 'due diligence', 'dd', 'folder', 'prazn', 'bloker', 'pu fbih', 'porez', 'uio', 'sporov'])) {
    sections.push(
      '**Legal & Financial DD Spremnost (`2-GOOGLE_DISK_VDR`, 92 dokumenta) — Kritični blokeri:**\n' +
      '- **Prazni VDR folderi:** `G_Ugovori` (**0 fajlova**) i `H_Sudski_sporovi` (**0 fajlova** — nema potvrde o nevođenju sporova).\n' +
      '- **Nedostajuće potvrde i akti:** Uvjerenja **PU FBiH (`4.6`)** i **UIO BiH (`4.7`)**, Registar izdatih mjenica (`4.3.d`), Pravilnik o radu (`5.6`), tekst KUIP rješenja (`5.15`), aneks produženja IDSS overdrafta nakon `12.06.2026.` i ažuriran sudski izvod IDSS za `2026.` (VDR sadrži izvod iz `2023.`).\n' +
      '- **Redoslijed zatvaranja (0–30 dana):** 1) Bankovni kartoni `4/4`; 2) Potvrde PU FBiH & UIO; 3) Popuna foldera `G` i `H`; 4) IOS Općine Centar + zahtjev za aneks IDSS Buka 13; 5) Ispravka IDSS bilansa (`−812,54 KM`).'
    );
  }

  // 12. Kantonalne subvencije (opći upit bez traženja dopisa)
  if (includesAny(q, ['subvencij', 'ministarstv', 'prolazn'])) {
    sections.push(
      '**Kantonalne subvencije KS — Jedina finansijska istina (100% prolazna stavka):**\n' +
      '- Roditelj uvijek plaća puni iznos školarine IMH-u (po cjenovniku ili s odobrenim popustom UO IMH).\n' +
      '- IMH šalje mjesečni izvještaj Ministarstvu KS, prima subvenciju i **100% sredstava prebacuje pojedinačno roditeljima na njihove račune**.\n' +
      '- IMH od subvencija nema nikakve finansijske koristi i **ne zavisi od njih** (konto `238800`). Ako Ministarstvo kasni, IMH nema šta prebaciti roditeljima, ali prihod i likvidnost vrtića ostaju potpuno stabilni.'
    );
  }

  if (sections.length > 0) {
    return sections.join('\n\n');
  }

  // Default fokusirani izvršni brifing za opća pitanja
  const focusSummaries: Record<AdvisorFocus, string> = {
    strategy:
      '**Izvršni CEO brifing IDSS + IMH (Verifikovano: 31.10.2026. + USTAVNI VDR 92 dok.):**\n\n' +
      `- **Finansijska realnost:** Gotovina **${fmt(ctx.harmonizedCash)} KM** (vs **65.091 KM** depozita roditelja), normalizovani operativni rezultat **+${fmt(ctx.harmonizedNetResult)} KM**, vlastiti kapital **−37.328 KM**, aktivni rizici **${ctx.totalRisksCount - ctx.resolvedRisksCount}/${ctx.totalRisksCount}**.\n` +
      '- **Top 3 strateška prioriteta (0–14 dana):** 1) **Prebijanje `93.484,84 KM`** s osnivačem (uz potpis ovlaštenog `v.d. Anesa Memića`) čime mjesečni dug servis pada sa `≈14.460 KM` na `≈6.670 KM`; 2) **Usklađivanje 4/4 bankovnih kartona potpisa** s limitom `2.000 KM`; 3) **IOS s Općinom Centar**, trajni nalog za zakup **do 10. u mjesecu** (`OPU-IP-850/2023 Čl. 9`) i pisani aneks za IDSS na Buka 13 (`Čl. 6.5`).\n' +
      '- Postavite konkretno pitanje o bilo kojem ugovoru, riziku, bilansu, KUIP-u, zakupu ili upisu za dublju analizu.',
    cashflow:
      '**Cash-Flow & Dug Brifing (31.10.2026.):**\n\n' +
      `- **Pozicija gotovine:** **${fmt(ctx.harmonizedCash)} KM** ukupno (~81.771 KM na računima) naspram **65.091 KM** depozita roditelja.\n` +
      '- **Mjesečni fiksni pritisak:** Kredit MF IMH (`4.661 KM`) + Sparkasse Porsche (`~2.010 KM`) + pozajmica osnivaču (`7.790 KM`) = **≈14.460 KM/mj.** + zakup **7.531,29 KM** (rok **10. u mjesecu**).\n' +
      '- **Najbrža finansijska poluga:** Prebijanje `93.484,84 KM` sa `184.692 KM` potraživanja od osnivača trenutno oslobađa **7.790 KM/mj.** gotovine za izgradnju ljetne rezerve 2027.',
    legal:
      '**Pravni & USTAVNI VDR Brifing (92 dokumenta):**\n\n' +
      '- **Zakup `OPU-IP-850/2023` (do 31.08.2033.):** Rok **10. u mjesecu**, `Član 9` direktna izvršnost protiv IMH i Lamie Kacile lično, `Član 6.5` zabrana podzakupa za IDSS Buka 13.\n' +
      '- **Upravljanje i kontrola:** KUIP IMH razrješenje (`04.11.2026.`, `v.d. Anes Memić`), latentni **IDSS `Član 30.` (C1 njemački)**, **IDSS `Član 24.` (supsidijarna odgovornost osnivača)** i **4/4 neograničeni bankovni kartoni** vs limit `2.000 KM`.\n' +
      '- **DD blokeri:** Prazni VDR folderi `G_Ugovori` i `H_Sudski_sporovi`, nedostaju potvrde PU FBiH (`4.6`), UIO (`4.7`) i aneks IDSS overdrafta (`12.06.2026.`).',
    growth:
      '**Upis & Vertikala Brifing (IDSS + IMH):**\n\n' +
      `- **Trenutno stanje:** **${ctx.currentStudents} učenika IDSS**, ARPU **9.391 KM**, udio plata **90,4%** školarine, prelomna tačka **98 učenika**.\n` +
      '- **Poluga rasta:** Podizanje konverzije vertikale IMH → IDSS sa **64% (`7/11`) na 75–80%** + ciljani upis `90–95` učenika u 2027/28. donosi `+98.300 KM` godišnje kontribucije i prelazi u pozitivan kapital do kraja 2028.',
  };

  return focusSummaries[focus] || focusSummaries.strategy;
}
