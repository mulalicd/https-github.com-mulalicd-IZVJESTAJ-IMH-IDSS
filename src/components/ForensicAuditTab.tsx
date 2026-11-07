import React, { useState } from 'react';
import { BASE_RED_FLAGS, RedFlag } from '../data/reportData';
import { ShieldAlert, AlertTriangle, ChevronDown, ChevronUp, FileWarning, Scale, Building2, Wallet, ArrowDownRight, CheckCircle2 } from 'lucide-react';

interface Props {
  auditMode: boolean;
  resolvedRiskIds: string[];
}

export const ForensicAuditTab: React.FC<Props> = ({ auditMode, resolvedRiskIds }) => {
  const [expandedId, setExpandedId] = useState<string | null>('RF-01');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'Svi Alarmi (7)' },
    { id: 'Porezni & Krivični Rizici', label: 'Porezi & Zakonska Odgovornost' },
    { id: 'Likvidnost & Trezor', label: 'Likvidnost & Depoziti' },
    { id: 'Imovinsko-Pravni Status', label: 'Imovina & Zakup Buka 11/13' },
    { id: 'Operativni & Troškovi Rada', label: 'Troškovi Rada & Norme' },
  ];

  const filteredFlags = filterCategory === 'ALL'
    ? BASE_RED_FLAGS
    : BASE_RED_FLAGS.filter(f => f.category === filterCategory);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Forensic Summary Hero */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border border-red-800/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              Objektivni Forenzički Dosije &middot; Analiza Poslovanja
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Presjek stanja: 31.08.2026. &middot; Institucionalna revizija
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
            Forenzička Dijagnostika: 7 Ključnih Ranjivosti i Rizika Grupacije
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
            Sveobuhvatna analiza poslovanja P.U. Internationale Deutsche Schule Sarajevo (IDSS) i 
            P.P.U. International Montessori House (IMH) ukazuje na visoku komercijalnu vrijednost pedagoške vertikale, 
            ali i na prisustvo <strong>sedam materijalnih sistemskih ranjivosti</strong> koje neposredno utiču na 
            likvidnost, poreznu usklađenost, pravnu sigurnost i bilansnu stabilnost ustanova.
          </p>

          {/* Forensic Diagnostic Metric Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
              <div className="text-slate-400 text-xs font-medium">Međufirmska Faktura (MF Banka)</div>
              <div className="text-xl sm:text-2xl font-black text-red-400 mt-1">100.000 KM</div>
              <div className="text-[11px] text-red-300/80 mt-0.5">12.9% osmomjesečnog prihoda IDSS</div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
              <div className="text-slate-400 text-xs font-medium">Potraživanja od Uprave / Osoblja</div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">184.692 KM</div>
              <div className="text-[11px] text-amber-300/80 mt-0.5">4.9x veće od gotovine na računima</div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
              <div className="text-slate-400 text-xs font-medium">Deficit Depozita Roditelja</div>
              <div className="text-xl sm:text-2xl font-black text-red-400 mt-1">-23.468 KM</div>
              <div className="text-[11px] text-red-300/80 mt-0.5">IMH depoziti (47.6k) vs Keš (24.1k)</div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60">
              <div className="text-slate-400 text-xs font-medium">Status Zakupa Buka 11/13</div>
              <div className="text-xl sm:text-2xl font-black text-red-500 mt-1">ISTEKAO</div>
              <div className="text-[11px] text-red-400 mt-0.5">31.08.2023. bez predočenog aneksa</div>
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Restatement Bridge Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Forenzički Most: Prijavljeni vs Normalizirani Operativni Rezultat (8 mjeseci 2026.)
              </h3>
              <p className="text-xs text-slate-400">
                Usklađivanje operativne uspješnosti prema međunarodnim računovodstvenim standardima (MSFI za MSP)
              </p>
            </div>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-mono">
            Presjek: 31.08.2026.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {/* Box 1: Prijavljeni */}
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60">
            <div className="text-xs text-slate-400 uppercase font-semibold">1. Zvanično Iskazani Rezultat</div>
            <div className="text-2xl font-black text-white mt-1">175.864 KM</div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              IDSS iskazuje 115.145 KM, IMH iskazuje 60.720 KM. Aritmetički zbir pojedinačnih rezultata iznosi 175.865 KM (razlika 1 KM u izvornom zbiru).
            </p>
            <div className="mt-3 text-[11px] text-amber-400 bg-amber-500/10 p-2 rounded border border-amber-500/20">
              ⚠️ Uključuje međufirmsku fakturu od 100.000 KM povezanu sa kreditom MF Banke.
            </div>
          </div>

          {/* Box 2: Korekcije */}
          <div className="bg-red-950/20 rounded-xl p-4 border border-red-800/40">
            <div className="text-xs text-red-400 uppercase font-semibold">2. Forenzička Eliminacija</div>
            <div className="text-2xl font-black text-red-400 mt-1">-100.000 KM</div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Isključenje interne fakture finansirane kreditom koja nema karakter redovnog operativnog prihoda od školarina.
            </p>
            <div className="mt-3 text-[11px] text-slate-300 bg-slate-800/80 p-2 rounded">
              Ljetni kvartal (juni&ndash;august 2026.) bez ove stavke bio je <strong>operativno negativan</strong>.
            </div>
          </div>

          {/* Box 3: Stvarni Operativni */}
          <div className="bg-blue-950/30 rounded-xl p-4 border border-blue-700/50">
            <div className="text-xs text-blue-400 uppercase font-semibold">3. Realni Operativni Rezultat</div>
            <div className="text-2xl font-black text-blue-300 mt-1">75.864 KM</div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              IDSS stvarni operativni rezultat: <strong>15.145 KM</strong>.<br />
              IMH stvarni operativni rezultat: <strong>60.720 KM</strong> (zahvaljujući kantonalnim subvencijama od 157.458 KM).
            </p>
            <div className="mt-3 text-[11px] text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
              ✓ Polazna osnova za održivo finansijsko planiranje i investicionu evaluaciju.
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterCategory === c.id
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Detailed Red Flags Accordion List */}
      <div className="space-y-4">
        {filteredFlags.map((flag) => {
          const isExpanded = expandedId === flag.id;
          const isResolved = resolvedRiskIds.includes(flag.id);

          return (
            <div
              key={flag.id}
              className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                isResolved
                  ? 'border-emerald-800/60 bg-emerald-950/10'
                  : flag.severity.includes('CRITICAL')
                  ? 'border-red-900/60 bg-slate-900/90 hover:border-red-700'
                  : flag.severity.includes('HIGH')
                  ? 'border-amber-900/50 bg-slate-900/80 hover:border-amber-700'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : flag.id)}
                className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isResolved
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : flag.severity.includes('CRITICAL')
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : flag.severity.includes('HIGH')
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {isResolved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <FileWarning className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        [{flag.id}]
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          isResolved
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : flag.severity.includes('CRITICAL')
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : flag.severity.includes('HIGH')
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        }`}
                      >
                        {isResolved ? 'HARMONIZOVANO' : flag.severity}
                      </span>
                      <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-md">
                        {flag.category}
                      </span>
                      {flag.amountKM && (
                        <span className="text-xs font-bold font-mono text-white bg-slate-800/90 px-2.5 py-0.5 rounded-md border border-slate-700">
                          {flag.amountKM.toLocaleString('bs-BA')} KM
                        </span>
                      )}
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {flag.title}
                    </h4>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <span className="hidden sm:inline-block text-xs font-medium text-slate-400">
                    {isResolved ? 'Rizik otklonjen' : flag.status}
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-4 text-sm text-slate-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        Forenzički Nalaz i Činjenično Stanje
                      </h5>
                      <p className="text-xs leading-relaxed text-slate-300 mb-2">
                        {flag.forensicFinding}
                      </p>
                      <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800">
                        <strong>Zakonski osnov:</strong> {flag.statutoryBasis}
                      </div>
                    </div>

                    <div className="bg-red-950/20 rounded-xl p-4 border border-red-900/40">
                      <h5 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                        Sistemski i Finansijski Uticaj
                      </h5>
                      <p className="text-xs leading-relaxed text-red-200">
                        {flag.systemicImpact}
                      </p>
                    </div>
                  </div>

                  {/* Harmonization Condition Box */}
                  <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Uslov za Harmonizaciju i Zatvaranje Rizika
                      </div>
                      <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                        {flag.harmonizationCondition}
                      </p>
                    </div>
                    <div className="shrink-0 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-emerald-300 text-xs font-bold">
                      {isResolved ? 'Status: Usaglašeno' : 'Status: Zahtijeva dokaz'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
