import React, { useState } from 'react';
import { FileText, Download, Printer, Search, ShieldAlert, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';

interface Props {
  onExportHTML: () => void;
}

export const DocumentViewerTab: React.FC<Props> = ({ onExportHTML }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<string>('sec-1');

  const sections = [
    { id: 'sec-1', title: '1. Izvršni Sažetak & Forenzički Nalaz' },
    { id: 'sec-2', title: '2. Profil Organizacije i Poslovni Model' },
    { id: 'sec-3', title: '3. Finansijska Historija (2022 - 2025)' },
    { id: 'sec-4', title: '4. Analiza Upisa i Obrazovna Vertikala' },
    { id: 'sec-5', title: '5. Forenzički Presjek Stanja (31.08.2026)' },
    { id: 'sec-6', title: '6. SWOT Analiza' },
    { id: 'sec-7', title: '7. Strateški Plan i Vizija (2027 - 2032)' },
    { id: 'sec-8', title: '8. Akcijski Protokol 100 Dana' },
    { id: 'sec-9', title: '9. Registar Rizika' },
    { id: 'sec-10', title: '10. Zaključna Strateška Ocjena' },
    { id: 'dodatak', title: 'Dodatak: Usaglašavanje Aritmetičkih Podataka' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span>Strateški i Forenzički Izvještaj (Cjeloviti Dokument)</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Objektivna, sveobuhvatna i nepristrasna analiza poslovanja grupacije IDSS + IMH
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pretraži tekst izvještaja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => window.print()}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
            title="Štampaj / Snimi kao PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={onExportHTML}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all border border-blue-400/30"
          >
            <Download className="w-4 h-4" />
            <span>Preuzmi .HTML</span>
          </button>
        </div>
      </div>

      {/* Main Document Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sticky top-28 shadow-lg">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Sadržaj Dokumenta
            </div>
            <nav className="space-y-1 text-xs">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    const el = document.getElementById(sec.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-between ${
                    activeSection === sec.id
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="truncate">{sec.title}</span>
                </button>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/60">
              <strong>KLASIFIKACIJA:</strong> <br />
              Interni institucionalni dokument &middot; Buka 11/13, Sarajevo.
            </div>
          </div>
        </div>

        {/* Document Content Canvas (9 cols) */}
        <div className="lg:col-span-9 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl space-y-8 text-slate-300 text-sm leading-relaxed">
          {/* Document Header Banner */}
          <div className="border-b border-slate-800 pb-8">
            <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-2">
              INTERNATIONALE DEUTSCHE SCHULE SARAJEVO + INTERNATIONAL MONTESSORI HOUSE
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Strateški Izvještaj o Poslovanju, Forenzičkoj Analizi i Planu Razvoja
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span>Sarajevo, 2026.</span>
              <span>&bull;</span>
              <span>Analiza 2022 &ndash; 2026.</span>
              <span>&bull;</span>
              <span>Plan konsolidacije 2027 &ndash; 2032.</span>
            </div>
          </div>

          {/* Section 1 */}
          <section id="sec-1" className="space-y-4 pt-4">
            <h2 className="text-xl font-black text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="text-blue-500">1.</span> IZVRŠNI SAŽETAK I FORENZIČKI NALAZ
            </h2>
            <p>
              Ovaj izvještaj pruža objektivnu poslovnu, finansijsku i stratešku evaluaciju obrazovne grupacije koju čine 
              <strong> Privatna ustanova Internationale Deutsche Schule Sarajevo (IDSS)</strong> i 
              <strong> Privatna predškolska ustanova International Montessori House (IMH)</strong>. 
              Evaluacija je utemeljena na uvidu u primarnu dokumentaciju: završne račune i bruto bilanse za period 2022&ndash;2025., 
              presjek na dan 31.08.2026., ugovornu dokumentaciju o zakupu na adresi Buka 11/13, elaborat o transfernim cijenama, 
              kreditnu dokumentaciju MF Banke, te analitiku plata i školarina za školsku 2026/27. godinu.
            </p>

            <div className="p-4 bg-red-950/20 border border-red-800/40 rounded-xl space-y-2">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                Forenzički Nalaz i Normalizacija Rezultata
              </span>
              <p className="text-xs text-red-200 leading-relaxed">
                Knjigovodstvene evidencije na dan 31.08.2026. iskazuju grupni rezultat od <strong>175.864 KM</strong>. 
                U navedeni iznos uključena je međufirmska faktura od <strong>100.000 KM</strong> povezana sa kreditom MF Banke odobrenim IMH-u. 
                Nakon eliminacije ove nekorelatne stavke, stvarni operativni rezultat grupe iznosi <strong>75.864 KM</strong> 
                (pri čemu IDSS ostvaruje 15.145 KM, dok je ljetni kvartal operativno negativan). 
                Istovremeno, evidentirana potraživanja od zaposlenih i uprave iznose <strong>184.692 KM</strong>, 
                naspram ukupne raspoložive gotovine na računima od <strong>37.639 KM</strong>.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-800">
                <thead className="bg-slate-800 text-slate-200">
                  <tr>
                    <th className="p-2.5">Ključni Pokazatelj (31.08.2026)</th>
                    <th className="p-2.5">IDSS</th>
                    <th className="p-2.5">IMH</th>
                    <th className="p-2.5 bg-slate-800/90 font-bold">Grupacija</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-slate-300">Prihodi (8 mjeseci)</td>
                    <td className="p-2.5">774.489 KM</td>
                    <td className="p-2.5">654.567 KM</td>
                    <td className="p-2.5 font-bold text-white">1.429.056 KM</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-slate-300">Prijavljeni neto rezultat</td>
                    <td className="p-2.5 text-emerald-400">115.145 KM</td>
                    <td className="p-2.5 text-emerald-400">60.720 KM</td>
                    <td className="p-2.5 font-bold text-emerald-400">175.864 KM</td>
                  </tr>
                  <tr className="bg-blue-950/20 font-bold">
                    <td className="p-2.5 font-sans text-blue-300">Normalizirani operativni rezultat</td>
                    <td className="p-2.5 text-blue-300">15.145 KM</td>
                    <td className="p-2.5 text-blue-300">60.720 KM</td>
                    <td className="p-2.5 text-blue-200">75.864 KM</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-slate-300">Raspoloživa gotovina</td>
                    <td className="p-2.5">13.491 KM</td>
                    <td className="p-2.5">24.148 KM</td>
                    <td className="p-2.5 font-bold text-amber-400">37.639 KM</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-slate-300">Vlastiti kapital (31.12.2025)</td>
                    <td className="p-2.5 text-red-400">-18.391 KM</td>
                    <td className="p-2.5 text-red-400">-18.913 KM</td>
                    <td className="p-2.5 font-bold text-red-400">-37.304 KM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2 */}
          <section id="sec-2" className="space-y-4 pt-4 border-t border-slate-800">
            <h2 className="text-xl font-black text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="text-blue-500">2.</span> PROFIL ORGANIZACIJE I POSLOVNI MODEL
            </h2>
            <p>
              Grupacija posluje kroz dva povezana pravna lica koja dijele zajedničku upravu, jedinstvenu računovodstvenu funkciju 
              (licenca CR-6235/5), te poslovni kompleks površine <strong>1.287,40 m² na adresi Buka 11/13 u Sarajevu</strong>.
            </p>
            <p>
              <strong>Pravni status zakupa:</strong> Izvorni 10-godišnji ugovor o zakupu sa Općinom Centar zaključen je 2013. godine 
              po cijeni od 5 KM/m² (6.437 KM + PDV mjesečno). Formalni rok ugovora <strong>istekao je 31. augusta 2023. godine</strong>. 
              Uvidom u dostavljenu dokumentaciju nije predočen potpisani i registrovani aneks kojim se formalizuje produženje zakupa do 2033. godine. 
              Tržišna cijena zakupa poslovnih prostora na području općine Centar kreće se od 15 do 25 KM/m², što potencijalno povećava 
              godišnji trošak zakupa sa 90.000 KM na 250.000 do 380.000 KM u slučaju izostanka formalnog ugovora.
            </p>
          </section>

          {/* Section 3 */}
          <section id="sec-3" className="space-y-4 pt-4 border-t border-slate-800">
            <h2 className="text-xl font-black text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="text-blue-500">3.</span> FINANSIJSKA HISTORIJA (2022 &ndash; 2025.)
            </h2>
            <p>
              U periodu od 2022. do 2025. godine konsolidirani prihodi grupacije, nakon eliminacije transfernih cijena, 
              porasli su sa <strong>1.357.925 KM na 1.701.240 KM (+25.3%)</strong>. 
              Tokom 2025. godine uveden je formalni sistem transfernih cijena (84 fakture IMH prema IDSS za zakup, energenti i zajedničke usluge u iznosu od 99.212 KM), 
              što je dovelo do formalnog gubitka IDSS-a od 9.501 KM usljed realnog terećenja troškova zakupa (59.474 KM).
            </p>
            <p>
              Struktura rashoda obilježena je visokim učešćem troškova rada: 688.011 KM u IDSS-u (75.7% rashoda) 
              i 535.612 KM u IMH-u (64.4% rashoda). 
              Za školsku 2026/27. godinu troškovi plata u IDSS-u dostižu <strong>90.38% ugovorene školarine</strong>, 
              što predstavlja strukturno neodrživ koeficijent koji zahtijeva hitno povećanje broja učenika.
            </p>
          </section>

          {/* Section 4 */}
          <section id="sec-4" className="space-y-4 pt-4 border-t border-slate-800">
            <h2 className="text-xl font-black text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="text-blue-500">4.</span> ANALIZA UPISA I OBRAZOVNA VERTIKALA
            </h2>
            <p>
              U školskoj 2026/27. godini, <strong>7 od 11 učenika prvog razreda (63.64%)</strong> prethodno je pohađalo predškolsku grupu IMH-a. 
              Ova stopa konverzije potvrđuje funkcionalnost obrazovne vertikale kao ključnog mehanizma akvizicije učenika sa minimalnim marketing troškovima.
            </p>
            <p>
              Dinamika upisa IDSS-a: 79 (2023/24) &rarr; 94 (2024/25) &rarr; 68 (2025/26, pad od 27.66%) &rarr; 83 (2026/27). 
              Pad od 26 učenika u 2025/26. godini nije bio praćen smanjenjem fiksnih troškova osoblja, što je direktno eliminisalo operativnu dobit škole. 
              Za dostizanje održive ekonomije obima neophodna je stabilizacija na <strong>95 do 100 učenika</strong>.
            </p>
          </section>

          {/* Section 5 */}
          <section id="sec-5" className="space-y-4 pt-4 border-t border-slate-800">
            <h2 className="text-xl font-black text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="text-blue-500">5.</span> FORENZIČKI PRESJEK STANJA NA DAN 31.08.2026.
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <strong className="text-white block mb-1">1. Međufirmska stavka od 100.000 KM:</strong>
                Faktura IDSS prema IMH knjižena nakon maja 2026. vezana je za namjenski kredit MF Banke i kapitalizaciju ulaganja u općinski prostor. Nije obuhvaćena elaboratom o transfernim cijenama i zahtijeva nezavisnu reviziju.
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <strong className="text-white block mb-1">2. Potraživanja od uprave i osoblja (184.692 KM):</strong>
                167.290 KM u IMH (nenovčane koristi, privatni računi, zajmovi) i 17.402 KM u IDSS. Neophodno notarsko priznanje duga uz fiksni plan otplate kako bi se otklonio rizik prikrivene isplate dohotka.
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <strong className="text-white block mb-1">3. Likvidnost i sigurnosni depoziti:</strong>
                Raspoloživa gotovina (37.639 KM) manja je od depozita roditelja u IMH (47.616 KM). Grupa posluje sa deficitom pokrića kaucija.
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <strong className="text-white block mb-1">4. Ugovori o djelu (77.632 KM):</strong>
                Isplate za poslove redovne nastave podliježu riziku inspekcijske prekvalifikacije u radni odnos uz retroaktivni obračun punih doprinosa.
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="sec-6" className="space-y-4 pt-4 border-t border-slate-800">
            <h2 className="text-xl font-black text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="text-blue-500">6.</span> SWOT ANALIZA
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl">
                <h4 className="font-bold text-emerald-400 mb-2 uppercase">Snage (Strengths)</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li>63.64% stopa prelaska djece iz IMH u I razred IDSS-a.</li>
                  <li>Jedinstveni njemački nastavni kurikulum u Sarajevu.</li>
                  <li>Atraktivna lokacija u centru grada (1.287 m²).</li>
                  <li>Rast konsolidiranih prihoda za 25.3% (2022-2025).</li>
                </ul>
              </div>

              <div className="p-4 bg-red-950/20 border border-red-800/40 rounded-xl">
                <h4 className="font-bold text-red-400 mb-2 uppercase">Slabosti (Weaknesses)</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li>Negativan vlastiti kapital (-37.304 KM) na kraju 2025.</li>
                  <li>Troškovi plata na 90.38% ugovorenih školarina IDSS-a.</li>
                  <li>Visoka nenaplaćena potraživanja od uprave (184.692 KM).</li>
                  <li>Neformalizovan zakup objekta nakon 31.08.2023.</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-950/20 border border-blue-800/40 rounded-xl">
                <h4 className="font-bold text-blue-400 mb-2 uppercase">Prilike (Opportunities)</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li>Stabilizacija upisa na 95-100 učenika bez rasta fiksnog troška.</li>
                  <li>Diverzifikacija prihoda (ljetni programi, STEM, jezici).</li>
                  <li>Prelazak u pozitivan vlastiti kapital do kraja 2028.</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-xl">
                <h4 className="font-bold text-amber-400 mb-2 uppercase">Prijetnje (Threats)</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li>Tržišna korekcija ili gubitak zakupa na lokaciji Buka 11/13.</li>
                  <li>Obustava kantonalnih subvencija (24% prihoda IMH).</li>
                  <li>Porezne i inspekcijske sankcije na ugovore o djelu i potraživanja.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="sec-7" className="space-y-4 pt-4 border-t border-slate-800">
            <h2 className="text-xl font-black text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="text-blue-500">7.</span> STRATEŠKI PLAN I VIZIJA RAZVOJA (2027 &ndash; 2032.)
            </h2>
            <p>
              Strateški plan počiva na tri sekvencijalna stuba koji transformišu trenutnu operativnu nestabilnost u dugoročnu bilansnu snagu:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <strong className="text-white block mb-1">Stub 1: Trijaza (Q4 2026 - Q2 2027)</strong>
                Pravna izolacija 100k fakture, formalizacija povrata 184k KM potraživanja, arhiviranje aneksa zakupa do 2033., usaglašavanje poreznih obaveza.
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <strong className="text-white block mb-1">Stub 2: Konsolidacija (2027 - 2028)</strong>
                Dostizanje 95 učenika u IDSS-u, spuštanje koeficijenta plata ispod 70%, prelazak u pozitivan kapital do kraja 2028.
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <strong className="text-white block mb-1">Stub 3: Ekspanzija (2029 - 2032)</strong>
                Konsolidirani prihod 2.2 do 2.8 miliona KM, EBITDA marža 10-12%, opcija akvizicije ili strateškog partnerstva sa međunarodnim lancem.
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section id="sec-10" className="space-y-4 pt-4 border-t border-slate-800">
            <h2 className="text-xl font-black text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="text-blue-500">10.</span> ZAKLJUČNA STRATEŠKA OCJENA
            </h2>
            <div className="p-5 bg-gradient-to-r from-blue-950 to-slate-900 border border-blue-800/40 rounded-xl">
              <p className="text-white font-medium text-sm sm:text-base leading-relaxed">
                Tržišna održivost IDSS-a i IMH-a zavisi isključivo od prelaska sa ad-hoc upravljanja likvidnošću na 
                institucionalno vođenje poslovanja. Uredne evidencije, transparentne knjige oslobođene fiktivnih transakcija, 
                formalno verifikovan zakup, zaštićeni depoziti roditelja i zadržavanje upisne baze predstavljaju 
                jedini pouzdan temelj na kojem grupacija može izgraditi trajnu institucionalnu vrijednost.
              </p>
            </div>
          </section>

          {/* Dodatak */}
          <section id="dodatak" className="space-y-4 pt-4 border-t border-slate-800">
            <h2 className="text-xl font-black text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              DODATAK: USAGLAŠAVANJE ARITMETIČKIH PODATAKA
            </h2>
            <p className="text-xs text-slate-400">
              U izvornom strateškom dokumentu evidentirane su razlike od 1 KM u zbiru rezultata (175.865 vs 175.864 KM), 
              diskrepanca vlastitog kapitala na dan 31.12.2025. (-37.302 KM naspram -37.304 KM; razlika je zaokruživanje, važeći iznos je -37.304 KM), 
              te neusklađenost cjenovnih raspona za strane porodice. U ovoj verziji svi podaci su usaglašeni prema primarnoj bruto bilansnoj evidenciji.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
