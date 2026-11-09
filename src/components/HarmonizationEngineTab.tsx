import React, { useState } from 'react';
import { IngestedDocument } from '../data/reportData';
import { FilePlus2, CheckCircle2, AlertTriangle, Layers, ArrowRight, ShieldCheck, RefreshCw, FileText, Database, Sparkles, Building, TrendingUp } from 'lucide-react';

interface Props {
  documents: IngestedDocument[];
  onToggleDoc: (id: string) => void;
  onAddCustomDoc: (doc: IngestedDocument) => void;
}

export const HarmonizationEngineTab: React.FC<Props> = ({
  documents,
  onToggleDoc,
  onAddCustomDoc,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customSource, setCustomSource] = useState('');
  const [customSummary, setCustomSummary] = useState('');
  const [customCashDelta, setCustomCashDelta] = useState<number>(0);
  const [customEbitdaDelta, setCustomEbitdaDelta] = useState<number>(0);

  const activeDocs = documents.filter((d) => d.isActive);
  const resolvedRisksCount = Array.from(
    new Set(activeDocs.flatMap((d) => d.effects.riskResolved || []))
  ).length;

  const totalCashInjection = activeDocs.reduce((acc, d) => acc + (d.effects.cashDeltaKM || 0), 0);
  const totalEbitdaBonus = activeDocs.reduce((acc, d) => acc + (d.effects.ebitdaDeltaKM || 0), 0);

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle) return;

    const newDoc: IngestedDocument = {
      id: `DOC-CUSTOM-${Date.now()}`,
      code: `DOK-${Math.floor(100 + Math.random() * 900)}`,
      title: customTitle,
      source: customSource || 'Interni unos korisnika',
      date: new Date().toLocaleDateString('bs-BA'),
      impactAreas: ['Korisnički dokument', 'Harmonizacija'],
      summary: customSummary || 'Dokument unesen kroz sistem za dinamičko usklađivanje.',
      effects: {
        cashDeltaKM: Number(customCashDelta) || 0,
        ebitdaDeltaKM: Number(customEbitdaDelta) || 0,
      },
      isActive: true,
    };

    onAddCustomDoc(newDoc);
    setShowAddModal(false);
    setCustomTitle('');
    setCustomSource('');
    setCustomSummary('');
    setCustomCashDelta(0);
    setCustomEbitdaDelta(0);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              Modularni Harmonizacijski Pogon &middot; Unos &amp; Usklađivanje
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Status sistema: Dinamički re-kalkulisano u realnom vremenu
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
            Autonomna Harmonizacija: Kako Novi Dokumenti Mijenjaju Cjelokupnu Poziciju
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
            Sistem funkcioniše kao relacioni forenzički model: <strong>svaki novi ulazni dokument </strong> 
            (npr. ovjereni aneks zakupa, porezno uvjerenje, notarsko priznanje duga, revizorski nalaz ili novi upisni spisak) 
            <strong> automatski se reflektuje kroz sve segmente</strong>: pravni rizik, likvidnost, realni EBITDA, 
            održivost plata i vlastiti kapital.
          </p>

          {/* Quick Dynamic Harmonization Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
              <div className="text-slate-400 text-xs font-medium">Aktivnih Dokumenata</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                {activeDocs.length} <span className="text-xs text-slate-400 font-normal">/ {documents.length}</span>
              </div>
              <div className="text-[11px] text-indigo-300/80 mt-0.5">Integrisano u bazu</div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
              <div className="text-slate-400 text-xs font-medium">Sanirani Ključni Rizici</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
                {resolvedRisksCount} <span className="text-xs text-slate-400 font-normal">/ 7 alarma</span>
              </div>
              <div className="text-[11px] text-emerald-300/80 mt-0.5">
                {7 - resolvedRisksCount} rizika ostalo otvoreno
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
              <div className="text-slate-400 text-xs font-medium">Injektirana Gotovina</div>
              <div className="text-xl sm:text-2xl font-black text-blue-400 mt-1">
                +{totalCashInjection.toLocaleString('bs-BA')} KM
              </div>
              <div className="text-[11px] text-blue-300/80 mt-0.5">Stvarni priliv u trezor</div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
              <div className="text-slate-400 text-xs font-medium">EBITDA Harmonizacija</div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
                +{totalEbitdaBonus.toLocaleString('bs-BA')} KM
              </div>
              <div className="text-[11px] text-amber-300/80 mt-0.5">Kroz rast upisa / uštede</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Strip: Ingest New Document */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <span>Registar Ulaznih Dokumenata &amp; Simulacija Usklađivanja</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Uključite ili isključite dokumente da vidite kako sistem rekalkuliše cjelokupni status ustanova.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all border border-indigo-400/30 shrink-0"
        >
          <FilePlus2 className="w-4 h-4" />
          <span>Ubaci Novi Dokument</span>
        </button>
      </div>

      {/* Modal for adding custom doc */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <FilePlus2 className="w-5 h-5 text-indigo-400" />
                Unos Novog Dokumenta u Sistem
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustom} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Naziv Dokumenta / Akta:
                </label>
                <input
                  type="text"
                  required
                  placeholder="npr. Potpisani aneks ugovora o zakupu..."
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Izdavalac / Izvor:
                </label>
                <input
                  type="text"
                  placeholder="npr. Općina Centar Sarajevo / Porezna uprava..."
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Kratak Sadržaj i Zaključak:
                </label>
                <textarea
                  rows={3}
                  placeholder="Šta ovaj dokument potvrđuje ili nalaže..."
                  value={customSummary}
                  onChange={(e) => setCustomSummary(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Priliv Gotovine (KM):
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={customCashDelta}
                    onChange={(e) => setCustomCashDelta(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    EBITDA Uticaj (KM):
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={customEbitdaDelta}
                    onChange={(e) => setCustomEbitdaDelta(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow"
                >
                  Harmoniziraj Sistem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Ingestion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => {
          const isBase = doc.id.startsWith('DOC-0');
          return (
            <div
              key={doc.id}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                doc.isActive
                  ? isBase
                    ? 'bg-slate-900 border-slate-700 shadow-md'
                    : 'bg-indigo-950/30 border-indigo-600/60 shadow-lg shadow-indigo-950/50'
                  : 'bg-slate-900/40 border-slate-800 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {doc.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      doc.isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {doc.isActive ? 'AKTIVAN U SISTEMU' : 'ISKLJUČEN'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">
                  {doc.title}
                </h4>

                <div className="text-[11px] text-slate-400 mb-2">
                  <strong>Izvor:</strong> {doc.source} ({doc.date})
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {doc.summary}
                </p>

                {/* Impact badges */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {doc.impactAreas.map((area) => (
                    <span
                      key={area}
                      className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded"
                    >
                      {area}
                    </span>
                  ))}
                  {doc.effects.cashDeltaKM ? (
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono font-bold">
                      +{doc.effects.cashDeltaKM.toLocaleString('bs-BA')} KM keš
                    </span>
                  ) : null}
                  {doc.effects.ebitdaDeltaKM ? (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                      +{doc.effects.ebitdaDeltaKM.toLocaleString('bs-BA')} KM EBITDA
                    </span>
                  ) : null}
                  {doc.effects.riskResolved ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                      Rješava: {doc.effects.riskResolved.join(', ')}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Toggle switch */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {isBase ? 'Izvorni primarni dokument' : 'Simulirani novi dokument'}
                </span>
                {!isBase && (
                  <button
                    onClick={() => onToggleDoc(doc.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      doc.isActive
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {doc.isActive ? 'Usklađeno (Isključi)' : 'Harmoniziraj (Uključi)'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Harmonization Impact Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Matrica Usklađenosti Poslovanja IDSS + IMH u Realnom Vremenu
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Pregled trenutnog stanja svih 6 institucionalnih stubova nakon uvažavanja svih aktivnih dokumenata:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Pillar 1 */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white uppercase">1. Pravno-Porezni Status</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  resolvedRisksCount >= 3
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {resolvedRisksCount >= 3 ? 'KONTROLISANO' : 'AKTIVNA OPASNOST'}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Otvoreno poreznih i krivičnih alarma: <strong>{7 - resolvedRisksCount} od 7</strong>. 
              {activeDocs.some(d => d.effects.riskResolved?.includes('RF-02')) ? (
                <span className="text-emerald-400 block mt-1">✓ Notarski uređen povrat 184.692 KM uklonio rizik prikrivenog dohotka.</span>
              ) : (
                <span className="text-red-400 block mt-1">⚠️ Rizik prikrivene isplate dohotka za 184.692 KM još nije pravno zatvoren.</span>
              )}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white uppercase">2. Trezor &amp; Depoziti</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  totalCashInjection > 0
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {totalCashInjection > 0 ? 'POKRIVENO' : 'DEFICIT'}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Tekući raspoloživi keš sa harmonizovanim uplatama: <strong>{(37639 + totalCashInjection).toLocaleString('bs-BA')} KM</strong>.
              Kaucije roditelja (47.616 KM) su {totalCashInjection > 10000 ? 'u cjelosti osigurane' : 'trenutno nepokrivene sa manjkavih 23.468 KM'}.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white uppercase">3. Operativni EBITDA</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                NORMALIZOVANO
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Realni godišnji EBITDA iznosi <strong>{(75864 + totalEbitdaBonus).toLocaleString('bs-BA')} KM</strong>. 
              {activeDocs.some(d => d.effects.riskResolved?.includes('RF-06')) ? (
                <span className="text-emerald-400 block mt-1">✓ Sa 95 učenika marža je dostigla 12.8%.</span>
              ) : (
                <span className="text-slate-400 block mt-1">Na bazi od 83 učenika marža je graničnih 5.3%.</span>
              )}
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white uppercase">4. Imovina &amp; Zakup</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeDocs.some(d => d.effects.riskResolved?.includes('RF-04'))
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {activeDocs.some(d => d.effects.riskResolved?.includes('RF-04'))
                  ? 'OSIGURANO DO 2033.'
                  : 'PRAVNI VAKUUM'}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Objekat Buka 11/13 (1.287,40 m²): {activeDocs.some(d => d.effects.riskResolved?.includes('RF-04')) ? (
                <span className="text-emerald-400">Aneks verificiran, cijena zaštićena na 5 KM/m².</span>
              ) : (
                <span className="text-red-400">Ugovor istekao 2023. godine, rizik deložacije aktivan.</span>
              )}
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white uppercase">5. Vlastiti Kapital</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                STANJE -37.304 KM
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Zadržavanjem normalizovanog dobitka, prelazak u pozitivan vlastiti kapital projektovan je za <strong>{totalEbitdaBonus > 50000 ? 'krajem 2027.' : 'kraj 2028. godine'}</strong>.
            </p>
          </div>

          {/* Pillar 6 */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white uppercase">6. Koeficijent Plata</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeDocs.some(d => d.effects.riskResolved?.includes('RF-06'))
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {activeDocs.some(d => d.effects.riskResolved?.includes('RF-06'))
                  ? '77.8% (PADA NA 68%)'
                  : '90.4% (KRITIČNO)'}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {activeDocs.some(d => d.effects.riskResolved?.includes('RF-06')) ? (
                <span className="text-emerald-400">Upis od 95 učenika obezbjeđuje pokriće fiksnih plata uz prostor za reinvesticije.</span>
              ) : (
                <span className="text-red-400">90.4% ugovorenih školarina odlazi na plate zaposlenih IDSS-a.</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
