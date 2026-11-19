import { GoogleGenAI } from '@google/genai';

// Zajednički API handleri: koristi ih lokalni Express server (server.ts)
// i Vercel serverless funkcije (api/**). Potpis je kompatibilan s oba.
type Req = { body?: any };
type Res = { status: (code: number) => Res; json: (body: any) => any };

const MODEL_NAME = 'gemini-2.5-flash';
const UPSTREAM_TIMEOUT_MS = 20000;

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });
  }
  return aiClient;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('UPSTREAM_TIMEOUT'));
    }, ms);
    promise.then(
      (val) => {
        clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

function buildCeoSystemInstruction(context: {
  harmonizedCash?: number;
  harmonizedNetResult?: number;
  currentStudents?: number;
  resolvedRisksCount?: number;
  totalRisksCount?: number;
  focus?: string;
}): string {
  const focusMap: Record<string, string> = {
    strategy: 'CEO Strategija, upravljanje, prioriteti Osnivača i Upravnog odbora, M&A/DD spremnost.',
    cashflow: 'Cash-flow, likvidnost, servis duga, prebijanje pozajmice osnivača i ljetna rezerva.',
    legal: 'Ustavni VDR, notarski zakup OPU-IP-850/2023, KUIP inspekcija, bankovni potpisi, krediti i zalog.',
    growth: 'Rast upisa IDSS sa 83 na 95–98 učenika, konverzija vertikale IMH → IDSS (64% → 80%) i ARPU.',
  };
  const focusDirective = focusMap[context.focus || 'strategy'] || focusMap.strategy;

  return `Ti si "Svjetski CEO & Strateški Specijalista" — vrhunski izvršni savjetnik (razina McKinsey Senior Partner + turnaround CEO + forenzički revizor + korporativni pravnik za BiH/FBiH) dodijeljen upravi i osnivaču grupacije IDSS (Internationale Deutsche Schule Sarajevo) i PPU IMH (International Montessori House), Buka 11/13, Sarajevo.

AKTIVNI FOKUS KONZULTACIJE: ${focusDirective}

VERIFIKOVANO FINANSIJSKO STANJE (BRUTO BILANSI NA 31.10.2026.):
- Aktivni UI kontekst: Gotovina ${context.harmonizedCash ?? 89712} KM | Normalizovani operativni rezultat ${context.harmonizedNetResult ?? 77490} KM | Aktivni učenici IDSS: ${context.currentStudents ?? 83} | Sanirani rizici: ${context.resolvedRisksCount ?? 0}/${context.totalRisksCount ?? 11}.
- Gotovina na računima i blagajni grupe (31.10.2026.): 89.712 KM (od toga bankovni računi ~81.771 KM + novac u prenosu), ali naspram toga stoje 65.091 KM depozita roditelja (tuđi novac).
- Iskazani rezultat 10 mj. 2026.: +177.490 KM; nakon eliminacije jednokratnih faktura IDSS → IMH od 100.000 KM (konto 6217, kredit MF Banke za dobavljače), stvarni normalizovani operativni rezultat je +77.490 KM (IDSS na nuli -225 KM, IMH nosilac dobiti).
- Negativan vlastiti kapital oba entiteta: -37.328 KM zbirno (IDSS -18.391 KM, IMH -18.936 KM).
- Neravnoteža bruto bilansa IDSS (31.10.2026.): Duguje 5.300.494,50 KM vs Potražuje 5.301.307,04 KM (razlika -812,54 KM — mora se otkloniti prije bilo kakvog eksternog izvještaja).
- Međufirmska neslaganja: IMH→IDSS fakture razlika 6.297,05 KM; plaćanje 100.000 KM kredita IDSS vodi 100k, IMH 87.800 KM (razlika 12.200 KM).
- Potraživanja od osnivača (zaposleni/uprava/fizička lica): 184.692 KM (IMH 167.290 KM + IDSS 17.402 KM) naspram obaveze IMH prema osnivaču Lamiji Kacili od 93.484,84 KM (trade-in Porsche 9YA Cayenne; ugovor datiran 14.07.2026., ali potpisan 07.11.2026. — 3 dana NAKON razrješenja Davora Mulalića odlukom UO IMH 04.11.2026., pa ga obavezno zamijeniti potpisom ovlaštenog v.d. direktora Anesa Memića). Preporuka: zakonsko prebijanje (neto dug osnivača 91.207 KM, 0 KM gotovinskog odliva, čime mjesečni servis duga pada sa ~14.460 KM na ~6.670 KM!).
- Ugovori o djelu IDSS (10 mj. 2026.): 93.117 KM — visok poreski/inspekcijski rizik preklasifikacije.
- Prelomna tačka IDSS-a: ~98 učenika pri ARPU 9.391 KM i trošku rada 704.517 KM (90,4% školarine). Vertikala IMH → IDSS trenutno 64% (7 od 11 prvačića).

APSULUTNO PRAVILO ZA KANTONALNE SUBVENCIJE (JEDINA ISTINA):
- Roditelj UVJEK plaća puni iznos školarine IMH-u (po cjenovniku ili uz odobren popust UO IMH).
- IMH zatim šalje mjesečni izvještaj Ministarstvu za odgoj i obrazovanje KS.
- Ministarstvo prebacuje novac subvencije na račun IMH, a IMH 100% tih sredstava prosljeđuje pojedinačno roditeljima na njihove račune.
- IMH NEMA NIKAKVE FINANSIJSKE KORISTI niti zavisi od subvencija. Subvencije su isključivo 100% prolazna (neutralna) stavka. Ako Ministarstvo kasni, IMH nema šta proslijediti roditeljima, a likvidnost i prihod IMH ostaju potpuno nepromijenjeni. NIKADA ne prikazuj subvencije kao prihod IMH-a niti kao likvidnosni rizik za IMH!

VERIFIKOVANI NALAZI IZ USTAVNOG I LEGAL DD VDR REPOZITORIJA (2-GOOGLE_DISK_VDR — 92 DOKUMENTA):
1. NOTARSKI UGOVOR O ZAKUPU OPU-IP-850/2023 (27.09.2023., Notar Nedžada Kapidžić):
   - Verifikovan na 10 godina: 01.09.2023. – 31.08.2033., 1.287,40 m² u ul. Buka 11/13, fiksno 5,00 KM/m² neto = 6.437 KM + PDV = 7.531,29 KM/mj. (tržišna ušteda >150.000 KM/god.). Zaključak Komisije Općine 16-45-sl.-60/23 (08.08.2023.) potvrdio 0,00 KM duga pri obnovi.
   - ROK DOSPIJEĆA PROMIJENJEN: Do 10. u mjesecu unaprijed (ranije 15.) na UniCredit račun Općine 3386902296575219.
   - ČLAN 9 (IZVRŠNA ISPRAVA): Ako se ne plate 2 dospjele zakupnine u roku 15 dana od preporučene opomene, Općina ima pravo jednostranog raskida I DIREKTNE PRINUDNE NAPLATE BEZ PARNICE protiv imovine IMH-a I lične pokretne/nepokretne imovine Lamie Kacile!
   - ČLAN 6.5 i 11.3.e (Zabrana podzakupa): Zabrana ustupanja prostora trećim licima (osnov za raskid) vs IDSS posluje na Buka 13 (68.419,89 KM podjele troškova u 10 mj. 2026.). Olakšavajuće: Rješenje Ministarstva KS za IDSS (UP-11-01-38-2587/16 od 19.02.2016.) dostavljeno je Općini Centar, ali je nužan pisani aneks saglasnosti.
2. KUIP KS INSPEKCIJA & UPRAVLJAČKA TRANZICIJA (04.11.2026.) + IDSS ČLAN 30:
   - Rješenje KUIP KS UP-1-14-12-34-15117/26-12/07 (30.09.2026., primljeno 23.10.2026., rok 30 dana) po čl. 48 Zakona o predškolskom odgoju KS: UO IMH je Odlukom 179-1/26 od 04.11.2026. razriješio Davora Mulalića dužnosti direktora IMH, imenovao Anesa Memića za v.d. direktora i 06.11.2026. raspisao javni konkurs (8 dana).
   - LATENTNI RIZIK IDSS (Član 30 Osnivačkog akta OPU-IP 217/2016 od 10.02.2016.): Za direktora IDSS traži uslove nastavnika/pedagoga, 3 god. iskustva, njemački jezik C1, VII/II Bolonja + zvanje mentora — IDENTIČAN inspekcijski rizik kao u IMH!
   - IDSS Član 24 (SUPSIDIJARNA ODGOVORNOST): Osnivač (Lamia Kacila, 100% od 19.06.2019., Odluka 044/2019-1) supsidijarno lično odgovara za obaveze IDSS-a!
   - IDSS Član 22 & 43: Statusne promjene (spajanje/pripajanje) moraju biti donesene min. 3 mjeseca unaprijed i stupaju na snagu tek od naredne školske godine.
3. BANKOVNI KARTONI POTPISA (4/4 KRITIČNA NEUSKLAĐENOST S REGISTROM):
   - Sudski registri oba entiteta (IMH 065-0-RegZ-26-008337; IDSS 065-0-RegZ-23-008444) ograničavaju ovlaštenje Davora Mulalića: za sva plaćanja i ugovore >2.000,00 KM potrebna je saglasnost Osnivača.
   - SVA 4 BANKOVNA KARTONA (IMH Sparkasse 1990490058487943, IMH MF 5724560000027469, IDSS Sparkasse 1994990021809884, IDSS MF 5724574555355002 / 5724560000042638) daju Davoru Mulaliću "Samostalno / Neograničeno" ovlaštenje! Na IDSS MF Banka kartonu (13.06.2025.) Lamia Kacila uopće nije navedena! IMH kartoni su dodatno zastarjeli nakon 04.11.2026.
4. MENADŽERSKI UGOVORI, LEASING ZALOG & KREDITI:
   - Davor Mulalić Menadžerski ugovor (IDSS, 01.10.2024., do 01.10.2028., auto-produženje 4 god. bez otkaza 6 mj. ranije): 2.800 KM neto + god. rast min 3% + bonus min 5% neto dobiti + 5.000 KM/god. edukacija + službeni/privatni auto + privatno zdravstveno. Zlatni padobran: 6 mj. otkazni rok + 6 mj. otpremnina + 12 mj. non-compete po 50% plate (= 12–18 mj. izlazni trošak).
   - Lamia Kacila Ugovor o radu (IMH, br. 112/26 od 12.06.2026.): neodređeno, Savjetnik za poslovanje, 3.000 KM neto / 4.782,61 KM bruto/mj. (57.391 KM/god.) — radno mjesto ne postoji u Pravilniku IMH iz 2015. (koji još navodi staro sjedište Avde Smajlovića 9!).
   - Sparkasse Leasing 12546/26 + Zalog (14.07.2026.): Porsche Cayenne 2025 (100.980,15 EUR neto = 197.500,01 KM; učešće 47.798,04 EUR = 93.484,84 KM; finansirano 53.182,11 EUR; 60 x 1.027,91 EUR; EKS 8,02% s PDV). Upisan zalog u Registar zaloga Ministarstva pravde BiH. Tačka IX (alineja 8): promjena vlasništva (Change-of-Control) bez pisane saglasnosti je osnov za trenutni raskid! Ukupni 5-god. troškovi kaska/registracije/AO: 46.371 KM.
   - MF Banka (457-0249/2025, 437-0154/2025, 5724574555355002): unakrsno jemstvo (IDSS ↔ IMH ↔ Lamia Kacila lično), 8+ bjanko mjenica bez protesta, nadležnost Suda u Banjoj Luci, zabrana otuđenja imovine i obaveza najave promjene vlasništva. IDSS overdraft 15.000 KM istekao 12.06.2026. (nedostaje aneks produženja u VDR-u!).
   - Rješenje Ministarstva KS za IMH (11-06/01-34-42039-1/26 od 14.10.2026.): ažurira sjedište na Buka 11, ali ima štamparsku grešku Ministarstva "Dječiji vrtić Sveta obitelj" u preambuli — tražiti zaključak o ispravci.
   - HR struktura (44 pozicije / 43 jedinstvene osobe: 20 IMH + 24 IDSS).
   - VDR DD BLOKERI: Prazni folderi G_Ugovori (0) i H_Sudski_sporovi (0); nedostaju potvrde PU FBiH (4.6) i UIO (4.7), Registar mjenica (4.3.d), Pravilnik o radu (5.6), tekst KUIP rješenja (5.15) i svježi izvod IDSS iz 2026. (u VDR je iz 2023.).

STIL ODGOVORA:
- Piši na besprijekornom, jasnom poslovnom bosanskom jeziku.
- Budi konkretan, direktan i izvršan (acta non verba): daj jasnu dijagnozu, tačne brojke/članove ugovora i konkretne korake s rokovima i nosiocima.
- Koristi kratke pasuse i bullet liste s podebljanim ključnim pojmovima (**...**). Ne koristi markdown zaglavlja (#, ##) niti tabele.
- Nikada ne izmišljaj brojke ili lične podatke (JMBG, brojeve ličnih računa ili imena roditelja/djece).`;
}

function buildDeterministicFallback(message: string, focus: string): string {
  const q = message.toLowerCase();

  if (q.includes('općin') || q.includes('zakup') || q.includes('opu') || q.includes('buka')) {
    return (
      '**Izvršni sažetak — Notarski zakup Buka 11/13 (OPU-IP-850/2023 [V]):**\n\n' +
      '- **Verifikovani status:** Ugovor s Općinom Centar (Notar Nedžada Kapidžić, 27.09.2023.) važi do **31.08.2033.** po cijeni **5,00 KM/m²** (**7.531,29 KM/mj. bruto** za 1.287,40 m²), što štedi >150.000 KM godišnje. Pri obnovi (08.08.2023.) dug je bio **0,00 KM**.\n' +
      '- **Rok dospijeća i Član 9 (Izvršna isprava):** Zakupnina dospijeva **do 10. u mjesecu unaprijed** (UniCredit 3386902296575219). Kašnjenje 2 rate + 15 dana od opomene daje Općini pravo na raskid i **direktno izvršenje bez parnice protiv imovine IMH-a i lične imovine Lamie Kacile**.\n' +
      '- **Član 6.5 & 11.3.e (IDSS na Buka 13):** Zabrana podzakupa bez saglasnosti. Iako je Rješenje Ministarstva KS za IDSS (19.02.2016.) dostavljeno Općini, odmah pokrenuti pisani zahtjev za aneks saglasnosti.\n' +
      '- **Sljedeća 3 koraka (0–14 dana):** 1) Zatražiti službeni IOS od Općine Centar i proknjižiti 2 nedostajuće fakture (kartica pokazuje pretplatu 22.469 KM); 2) Uvesti automatski trajni nalog najkasnije do 8. u mjesecu; 3) Podnijeti zahtjev za pisanu saglasnost za korištenje Buka 13 od strane IDSS-a.'
    );
  }

  if (q.includes('kuip') || q.includes('karton') || q.includes('potpis') || q.includes('2.000') || q.includes('2000') || q.includes('član 30')) {
    return (
      '**Izvršni sažetak — Upravljački rizici, KUIP (04.11.2026.) & Bankovni potpisi:**\n\n' +
      '- **KUIP IMH tranzicija:** Po rješenju KUIP KS (UP-1-14-12-34-15117/26-12/07 od 30.09.2026.), UO IMH je 04.11.2026. razriješio Davora Mulalića, imenovao **Anesa Memića** za v.d. direktora i raspisao konkurs 06.11.2026. Prioritet je okončanje konkursa i upis u sudski registar.\n' +
      '- **Latentni IDSS rizik (Član 30 Osnivačkog akta OPU-IP 217/2016):** Za direktora IDSS propisuje uslove nastavnika/pedagoga, 3 god. iskustva, **njemački C1** i zvanje mentora — identična inspekcijska ranjivost kao u IMH. Potrebna hitna izmjena Pravila IDSS.\n' +
      '- **4/4 Bankovni kartoni vs Registar (2.000 KM):** Sudski registri ograničavaju ovlaštenje na **2.000 KM** bez saglasnosti osnivača, dok svi bankovni kartoni (MF & Sparkasse za IMH i IDSS) daju neograničeno samostalno potpisivanje (na IDSS MF kartonu Lamia Kacila uopće nije upisana). Hitno izdati nove kartone sa dvostrukim potpisom iznad 2.000 KM.'
    );
  }

  if (q.includes('subvencij') || q.includes('ministarstv') || q.includes('prolazn')) {
    return (
      '**Službeni stav — Kantonalne subvencije (100% prolazna stavka):**\n\n' +
      '- **Jedina finansijska istina:** Roditelj plaća puni iznos školarine IMH-u (po cjenovniku ili uz odobren popust UO IMH). IMH zatim dostavlja mjesečni izvještaj Ministarstvu za odgoj i obrazovanje KS.\n' +
      '- **Mehanizam prenosa:** Po prijemu sredstava od Ministarstva, IMH cjelokupan iznos subvencije prosljeđuje pojedinačno roditeljima na njihove račune.\n' +
      '- **Uticaj na IMH:** IMH nema nikakvu finansijsku korist niti zavisi od subvencija. Ako Ministarstvo kasni s uplatom, IMH jednostavno nema sredstva da proslijedi roditeljima, dok redovni prihodi, gotovina i plate IMH-a ostaju potpuno stabilni.'
    );
  }

  return (
    `**Izvršni strateški pregled IDSS + IMH (${focus.toUpperCase()} — verifikovani podaci 31.10.2026. & VDR 92 dok.):**\n\n` +
    '- **Likvidnost i prebijanje duga:** Gotovina grupe iznosi **89.712 KM** (naspram **65.091 KM** depozita roditelja), a normalizovani operativni rezultat 10 mj. 2026. je **+77.490 KM**. Hitnim prebijanjem obaveze IMH prema osnivaču (**93.484,84 KM**) s potraživanjima od osnivača (**184.692 KM**), mjesečni servis duga pada sa **≈14.460 KM** na **≈6.670 KM** bez ikakvog odliva gotovine.\n' +
    '- **Kritične pravne akcije (0–14 dana):** 1) Ažurirati sva 4 bankovna kartona potpisa (limit **2.000 KM** + upis v.d. Anesa Memića i Lamie Kacile); 2) IOS s Općinom Centar i trajni nalog za zakup **do 10. u mjesecu** (OPU-IP-850/2023, Čl. 9 direktna izvršnost); 3) Ispraviti neravnotežu IDSS bilansa (**−812,54 KM**) i pribaviti potvrde PU FBiH (4.6) i UIO (4.7).\n' +
    '- **Rast i prelomna tačka:** Podići upis IDSS sa **83 na 95–98 učenika** podizanjem konverzije vertikale IMH → IDSS sa **64% na 75–80%**.'
  );
}

export async function ceoAdvisorChat(req: Req, res: Res) {
  try {
    const body = req.body || {};
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const focus = typeof body.focus === 'string' ? body.focus : 'strategy';
    const history = Array.isArray(body.history) ? body.history : [];
    const context = body.context && typeof body.context === 'object' ? body.context : {};

    if (!message) {
      return res.status(400).json({ error: 'Molimo unesite konkretno pitanje za CEO savjetnika.' });
    }
    if (message.length > 3000) {
      return res.status(400).json({ error: 'Pitanje je predugo (maksimalno 3.000 znakova).' });
    }

    const ai = getAi();
    if (!ai) {
      return res.json({
        success: true,
        fallback: true,
        reply: buildDeterministicFallback(message, focus),
        timestamp: new Date().toISOString(),
      });
    }

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    for (const item of history.slice(-10)) {
      if (
        item &&
        (item.role === 'user' || item.role === 'model') &&
        typeof item.text === 'string' &&
        item.text.trim()
      ) {
        contents.push({
          role: item.role,
          parts: [{ text: item.text.slice(0, 2000) }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: MODEL_NAME,
          contents,
          config: {
            systemInstruction: buildCeoSystemInstruction({ ...context, focus }),
            temperature: 0.35,
            maxOutputTokens: 1200,
          },
        }),
        UPSTREAM_TIMEOUT_MS
      );

      const replyText = (response.text || '').trim();
      if (!replyText) {
        return res.json({
          success: true,
          fallback: true,
          reply: buildDeterministicFallback(message, focus),
          timestamp: new Date().toISOString(),
        });
      }

      return res.json({
        success: true,
        fallback: false,
        reply: replyText,
        timestamp: new Date().toISOString(),
      });
    } catch (upstreamErr: any) {
      console.warn('CEO Advisor upstream error, serving verified local synthesis:', upstreamErr?.message || upstreamErr);
      return res.json({
        success: true,
        fallback: true,
        reply: buildDeterministicFallback(message, focus),
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err: any) {
    console.error('CEO Advisor fatal error:', err);
    return res.status(500).json({
      error: 'Došlo je do neočekivane greške pri obradi upita CEO savjetnika.',
    });
  }
}

export async function analyzePartnerCard(req: Req, res: Res) {
  const ai = getAi();
  if (!ai) {
    return res.status(503).json({
      error: 'AI analiza kartica nije aktivirana na ovoj instalaciji (nedostaje GEMINI_API_KEY).',
    });
  }
  try {
    const { entity, partnerName, rawCardText, files, contextNotes } = req.body;

    if (!rawCardText && (!files || files.length === 0)) {
      return res.status(400).json({
        error: 'Molimo unesite tekst analitičke kartice ili priložite dokument (PDF/sliku/TXT).',
      });
    }

    const prompt = `
Ti si ovlašteni nezavisni forenzički računovođa i stalni sudski vještak finansijske struke za poslovanje obrazovnih ustanova u Bosni i Hercegovini (specijaliziran za predškolske ustanove poput PPU International Montessori House - IMH i osnovne/srednje škole poput Internationale Deutsche Schule Sarajevo - IDSS, sa sjedištem u ul. Buka 11/13, 71000 Sarajevo).

ZADATAK:
Izvedi veoma detaljnu, ozbiljnu i matematički rigoroznu forenzičku analizu priložene analitičke kartice partnera/kupca/roditelja/dobavljača i sastavi SLUŽBENI FORENZIČKI NALAZ I MIŠLJENJE.
Izvještaj mora biti pripremljen tako da ga uprava može ODMAH odštampati (print/PDF) ili kopirati i poslati e-mailom roditeljima i partnerima koji su POTPUNI FINANSIJSKI LAICI. Svaka stavka mora biti obrazložena do najsitnijeg detalja tako da svakom laiku bude kristalno jasno kako je tačno dug nastao ili kako je nastala pretplata!

KRITIČNO PRAVILO ZA FORMATIRANJE ODGOVORA:
1. Odgovor mora biti ISKLJUČIVO ČISTI, PRE-FORMATIRANI I STILIZIRANI HTML (bez Markdown sintakse poput #, ##, ###, **, *, _ ili markdown tabela sa crticama |---|).
2. NEMOJ obmotavati odgovor u markdown code block oznake poput \`\`\`html ... \`\`\`. Vrati direktan, čisti HTML spreman za neposredno ubacivanje u DOM i e-mail klijente.
3. Koristi inline CSS stilove unutar HTML tagova kako bi formatiranje (tabele, zaglavlja, kartice, boje) ostalo 100% postojano pri štampi i pri slanju kroz bilo koji e-mail klijent (Outlook, Gmail, Apple Mail):
 - Glavna boja IDSS: #035EA1 (tamnoplava), IMH: #2C5E3B (šumska zelena)
 - Status duga: crvena boja (#C0392B, pozadina #FDF2F2, border #F5C6CB)
 - Status pretplate: smaragdna zelena (#1E7E34, pozadina #F0FDF4, border #BBF7D0)
 - Tabele: width:100%; border-collapse:collapse; margin:16px 0; font-size:12px; font-family:Arial,Helvetica,sans-serif;
 - Zaglavlja tabele (th): background-color:#035EA1; color:#ffffff; padding:10px 12px; text-align:left; border:1px solid #CBD5E1; font-weight:bold;
 - Ćelije tabele (td): padding:8px 12px; border:1px solid #E2E8F0; text-align:left;
 - Sumarni redovi: background-color:#F8FAFC; font-weight:bold;

OBAVEZNA STRUKTURA I SADRŽAJ FORENZIČKOG IZVJEŠTAJA:
<div style="font-family: Arial, Helvetica, sans-serif; color: #1E293B; line-height: 1.6; max-width: 900px; margin: 0 auto; background: #ffffff; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px;">

1. SLUŽBENO ZAGLAVLJE DOKUMENTA:
 - Logotip / puni naziv ustanove: ${entity === 'IDSS' ? 'INTERNATIONALE DEUTSCHE SCHULE SARAJEVO (IDSS)' : entity === 'IMH' ? 'PPU INTERNATIONAL MONTESSORI HOUSE (IMH)' : 'IDSS & PPU IMH OBRAZOVNI SISTEM'}
 - Adresa: Buka broj ${entity === 'IDSS' ? '13' : '11'}, 71000 Sarajevo · ID broj: ${entity === 'IDSS' ? '4202220420007' : '4201731140006'}
 - Naziv dokumenta: FORENZIČKI RAČUNOVODSTVENI NALAZ I FINANSIJSKO OBRAZLOŽENJE
 - Predmetni partner/učenik: ${partnerName || 'Partner iz kartice'}
 - Datum analize: ${new Date().toLocaleDateString('bs-BA')} · Referentni konto: 2110 (Kupci u zemlji)

2. VIZUELNI IZVRŠNI SAŽETAK (EXECUTIVE SUMMARY CARD):
 - Istaknuti blok u boji sa statusom (DUG ili PRETPLATA).
 - Tri ključne metrike: Ukupno zaduženo (Duguje), Ukupno uplaćeno/odobreno (Potražuje), Konačni saldo na dan.
 - Kratak i jasan zaključak u jednoj rečenici za roditelja.

3. KAKO JE NASTAO SALDO - DETALJNO OBRAZLOŽENJE ZA FINANSIJSKE LAIKE:
 - Hronološko pojašnjenje svake stavke:
   * Koje su fakture izdate (datum, period boravka/školarine, ishrana, izlet, iznos).
   * Koje su uplate primljene (datum izvoda, uplaćeni iznos, ko je uplatio).
   * Tretman porodičnih popusta (odobreni od strane UO IMH) i kantonalnih subvencija: VAŽNO PRAVILO — roditelj uvijek plaća puni iznos školarine IMH-u (ili s odobrenim popustom UO), a subvencija Ministarstva KS je 100% prolazna stavka koju IMH nakon prijema od Ministarstva prosljeđuje direktno na račun roditelja (IMH nema nikakve koristi niti zavisi od subvencija, niti umanjuje svoju školarinu za subvenciju koja nije uplaćena od Ministarstva).
   * Uočena odstupanja (npr. roditelj je uplatio manji iznos, uplata je preskočena u nekom mjesecu ili je nastala pretplata po osnovu uplate unaprijed).

4. DETALJNA TABELA ANALITIČKOG PROMETA (SVE STAVKE SA KARTICE):
 - Formatirana HTML tabela sa svim knjiženjima, kolonama: R.br., Datum, Broj dokumenta, Opis knjiženja, Duguje (KM), Potražuje (KM), Saldo (KM).
 - Formatirani iznosi sa tačkom za hiljade i zarezom za decimale (npr. 4.700,00 KM).

5. MATEMATIČKA REKAPITULACIJA I FORMULA:
 - Početni saldo + Zaduženja - Uplate - Odobrenja = Konačni stvarni saldo.

6. SLUŽBENE INSTRUKCIJE ZA POSTUPANJE:
 - Jasne instrukcije za roditelja: broj transakcijskog računa ustanove (SPARKASSE BANK D.D. BIH: IMH 1990490058487943 / IDSS 1994990021809884), poziv na broj, svrha doznake i rok (ako je dug), ili procedura kompenzacije za naredni mjesec / povrata sredstava (ako je pretplata).

7. BLOK ZA OVJERU I POTPISE:
 - Uredno stilizovani blokovi sa linijama za potpis: Služba računovodstva i finansija & Uprava ustanove.
</div>

ULAZNI PODACI I DOKUMENTI KARTICE:
Entitet: ${entity || 'IMH / IDSS'}
Partner / Učenik: ${partnerName || 'Identifikovan iz kartice'}
Napomene uprave: ${contextNotes || 'Nema posebnih napomena'}

SIROVI TEKST KARTICE:
${rawCardText || '(Pogledaj priložene datoteke)'}
`;

    const contentsParts: any[] = [];

    if (files && Array.isArray(files)) {
      for (const f of files) {
        if (f.base64 && f.mimeType) {
          contentsParts.push({
            inlineData: {
              mimeType: f.mimeType,
              data: f.base64,
            },
          });
        }
      }
    }

    contentsParts.push({ text: prompt });

    const response = await withTimeout(
      ai.models.generateContent({
        model: MODEL_NAME,
        contents: { parts: contentsParts },
        config: {
          systemInstruction:
            'Ti si ovlašteni finansijski revizor i forenzički vještak. Tvoj nalaz je matematički nepogrešiv, pravno i računovodstveno precizan, a napisan kristalno jasno za finansijske laike. Vraćaš ISKLJUČIVO čist, formatiran i stiliziran HTML kod bez ikakve Markdown sintakse (#, **, |---|) i bez obmotavanja u ```html ``` blokove.',
        },
      }),
      UPSTREAM_TIMEOUT_MS
    );

    let analysisReport =
      response.text ||
      '<div style="padding:16px;color:#c0392b;">Nije moguće generisati nalaz iz dostavljenih podataka.</div>';

    analysisReport = analysisReport
      .replace(/^```html\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    return res.json({
      success: true,
      entity,
      partnerName,
      analysisReport,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Forensic analysis error:', err);
    return res.status(500).json({
      error: err.message || 'Došlo je do greške prilikom analize kartice partnera.',
    });
  }
}
