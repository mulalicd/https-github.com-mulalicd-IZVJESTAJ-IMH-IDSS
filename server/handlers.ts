import { GoogleGenAI } from '@google/genai';

// Zajednički API handleri: koristi ih lokalni Express server (server.ts)
// i Vercel serverless funkcije (api/**). Potpis je kompatibilan s oba.
type Req = { body?: any };
type Res = { status: (code: number) => Res; json: (body: any) => any };

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
Izvještaj mora biti pripremljen tako da ga direktor (Davor Mulalić) može ODMAH odštampati (print/PDF) ili kopirati i poslati e-mailom roditeljima i partnerima koji su POTPUNI FINANSIJSKI LAICI. Svaka stavka mora biti obrazložena do najsitnijeg detalja tako da svakom laiku bude kristalno jasno kako je tačno dug nastao ili kako je nastala pretplata!

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
   * Tretman kantonalnih subvencija (Ministarstvo za odgoj i obrazovanje KS - subvencije od 200 KM po djetetu) ili porodičnih popusta (npr. popust na dvoje djece) - jesu li odobrene, proknjižene ili se još čekaju.
   * Uočena odstupanja (npr. roditelj je uplatio manji iznos, uplata je preskočena u nekom mjesecu, ili je roditelj platio puni iznos prije nego što je Ministarstvo doznačilo subvenciju što je stvorilo pretplatu).

4. DETALJNA TABELA ANALITIČKOG PROMETA (SVE STAVKE SA KARTICE):
 - Formatirana HTML tabela sa svim knjiženjima, kolonama: R.br., Datum, Broj dokumenta, Opis knjiženja, Duguje (KM), Potražuje (KM), Saldo (KM).
 - Formatirani iznosi sa tačkom za hiljade i zarezom za decimale (npr. 4.700,00 KM).

5. MATEMATIČKA REKAPITULACIJA I FORMULA:
 - Početni saldo + Zaduženja - Uplate - Odobrenja/Subvencije = Konačni stvarni saldo.

6. SLUŽBENE INSTRUKCIJE ZA POSTUPANJE:
 - Jasne instrukcije za roditelja: broj transakcijskog računa (SPARKASSE BANK D.D. BIH), poziv na broj, svrha doznake i rok (ako je dug), ili procedura kompenzacije za naredni mjesec / povrata sredstava (ako je pretplata).

7. BLOK ZA OVJERU I POTPISE:
 - Uredno stilizovani blokovi sa linijama za potpis: Služba računovodstva i finansija & Direktor ustanove Davor Mulalić.
</div>

ULAZNI PODACI I DOKUMENTI KARTICE:
Entitet: ${entity || 'IMH / IDSS'}
Partner / Učenik: ${partnerName || 'Identifikovan iz kartice'}
Napomene uprave: ${contextNotes || 'Nema posebnih napomena'}

SIROVI TEKST KARTICE:
${rawCardText || '(Pogledaj priložene datoteke)'}
`;

    const contentsParts: any[] = [];

    // Add attached files if provided as base64
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

    // Call Gemini 3.8 Flash for forensic accounting synthesis
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: contentsParts },
      config: {
        systemInstruction:
          'Ti si ovlašteni finansijski revizor i forenzički vještak. Tvoj nalaz je matematički nepogrešiv, pravno i računovodstveno precizan, a napisan kristalno jasno za finansijske laike. Vraćaš ISKLJUČIVO čist, formatiran i stiliziran HTML kod bez ikakve Markdown sintakse (#, **, |---|) i bez obmotavanja u ```html ``` blokove.',
      },
    });

    let analysisReport = response.text || '<div style="padding:16px;color:#c0392b;">Nije moguće generisati nalaz iz dostavljenih podataka.</div>';

    // Clean up any accidental markdown code fences if present
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
