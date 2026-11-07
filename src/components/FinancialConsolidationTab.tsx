import React, { useState } from 'react';
import { HISTORICAL_FINANCIALS } from '../data/reportData';
import { BarChart3, TrendingUp, DollarSign, ArrowRightLeft, AlertCircle, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

interface Props {
  auditMode: boolean;
}

export const FinancialConsolidationTab: React.FC<Props> = ({ auditMode }) => {
  const [selectedEntity, setSelectedEntity] = useState<'ALL' | 'IDSS' | 'IMH'>('ALL');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Konsolidirani Prihod (2025)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">1.701.240 KM</div>
          <div className="text-xs text-emerald-400 font-medium mt-1">
            +25.3% rast od 2022. (1.357.925 KM)
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Nakon eliminacije 99.212 KM transfernih cijena (bruto 1.800.452 KM).
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Neto Rezultat 8 mj. 2026</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2">
            {auditMode ? (
              <span className="text-amber-400">75.864 KM</span>
            ) : (
              <span className="text-white">175.864 KM</span>
            )}
          </div>
          <div className="text-xs font-medium mt-1">
            {auditMode ? (
              <span className="text-amber-300">Forenzički normaliziran (bez 100k)</span>
            ) : (
              <span className="text-slate-400">Prijavljen sa 100k međufirmske fakture</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            IDSS: {auditMode ? '15.145 KM' : '115.145 KM'} | IMH: 60.720 KM
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Raspoloživa Gotovina</span>
            <ArrowRightLeft className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">37.639 KM</div>
          <div className="text-xs text-red-400 font-medium mt-1">
            Ekstremno napeta likvidnost
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            IDSS: 13.491 KM | IMH: 24.148 KM (pokriva &lt; 50% depozita roditelja)
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Konsolidirani Vlastiti Kapital</span>
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-400 mt-2">-37.328 KM</div>
          <div className="text-xs text-red-300/80 font-medium mt-1">
            Negativan kapital oba subjekta
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            IDSS: -18.391 KM | IMH: -18.936 KM (stanje kraj 2025)
          </p>
        </div>
      </div>

      {/* Historical Performance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-400" />
              Historijski Pregled Finansijskog Poslovanja (2022 &ndash; 2026.)
            </h3>
            <p className="text-xs text-slate-400">
              Prikaz prihoda, eliminacija transfernih cijena i neto rezultata po godinama
            </p>
          </div>

          <div className="flex items-center bg-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setSelectedEntity('ALL')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                selectedEntity === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Konsolidovano
            </button>
            <button
              onClick={() => setSelectedEntity('IDSS')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                selectedEntity === 'IDSS' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Samo IDSS
            </button>
            <button
              onClick={() => setSelectedEntity('IMH')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                selectedEntity === 'IMH' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Samo IMH
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Godina</th>
                {(selectedEntity === 'ALL' || selectedEntity === 'IDSS') && (
                  <th className="py-3 px-4">Prihod IDSS</th>
                )}
                {(selectedEntity === 'ALL' || selectedEntity === 'IMH') && (
                  <th className="py-3 px-4">Prihod IMH</th>
                )}
                {selectedEntity === 'ALL' && (
                  <>
                    <th className="py-3 px-4">Eliminacije TP</th>
                    <th className="py-3 px-4">Konsolidirani Prihod</th>
                  </>
                )}
                {(selectedEntity === 'ALL' || selectedEntity === 'IDSS') && (
                  <th className="py-3 px-4">Neto IDSS</th>
                )}
                {(selectedEntity === 'ALL' || selectedEntity === 'IMH') && (
                  <th className="py-3 px-4">Neto IMH</th>
                )}
                {selectedEntity === 'ALL' && (
                  <th className="py-3 px-4 bg-slate-800 font-bold">Konsolidirani Neto</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {HISTORICAL_FINANCIALS.map((row) => {
                const is2026 = row.year.includes('2026');
                const idssNet = is2026 && auditMode ? 15145 : row.idssNet;
                const groupNet = is2026 && auditMode ? 75864 : row.consolidatedNet;

                return (
                  <tr key={row.year} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-bold text-white flex items-center gap-1.5">
                      {row.year}
                      {is2026 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                          8 mj.
                        </span>
                      )}
                    </td>
                    {(selectedEntity === 'ALL' || selectedEntity === 'IDSS') && (
                      <td className="py-3.5 px-4 text-slate-300">
                        {row.idssRev.toLocaleString('bs-BA')} KM
                      </td>
                    )}
                    {(selectedEntity === 'ALL' || selectedEntity === 'IMH') && (
                      <td className="py-3.5 px-4 text-slate-300">
                        {row.imhRev.toLocaleString('bs-BA')} KM
                      </td>
                    )}
                    {selectedEntity === 'ALL' && (
                      <>
                        <td className="py-3.5 px-4 text-amber-400">
                          {row.eliminations > 0
                            ? `-${row.eliminations.toLocaleString('bs-BA')} KM`
                            : '0 KM'}
                        </td>
                        <td className="py-3.5 px-4 text-white font-bold">
                          {row.consolidatedRev.toLocaleString('bs-BA')} KM
                        </td>
                      </>
                    )}
                    {(selectedEntity === 'ALL' || selectedEntity === 'IDSS') && (
                      <td
                        className={`py-3.5 px-4 font-bold ${
                          idssNet < 0 ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {idssNet > 0 ? '+' : ''}
                        {idssNet.toLocaleString('bs-BA')} KM
                      </td>
                    )}
                    {(selectedEntity === 'ALL' || selectedEntity === 'IMH') && (
                      <td
                        className={`py-3.5 px-4 font-bold ${
                          row.imhNet < 0 ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {row.imhNet > 0 ? '+' : ''}
                        {row.imhNet.toLocaleString('bs-BA')} KM
                      </td>
                    )}
                    {selectedEntity === 'ALL' && (
                      <td
                        className={`py-3.5 px-4 font-bold bg-slate-800/60 ${
                          groupNet < 0 ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {groupNet > 0 ? '+' : ''}
                        {groupNet.toLocaleString('bs-BA')} KM
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl text-xs text-slate-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <span>
            <strong>Forenzička napomena o transfernim cijenama:</strong> U 2025. godini uvedene su 84 međufazne fakture IMH prema IDSS za zakup prostora (47.778 KM), obroke, energiju i zajedničku upravu (ukupno 99.212 KM). Zato je IDSS u 2025. formalno iskazao gubitak od 9.501 KM umjesto dobiti od ~90.000 KM, jer je tek tada počeo nositi stvarnu cijenu zajedničkih troškova.
          </span>
        </div>
      </div>

      {/* Forensic Audit Discrepancies Reconciliation Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          Registar Aritmetičkih i Dokumentacijskih Neusaglašenosti (Izvorni Dokument)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Ove tačke su forenzički detektovane u izvornom strateškom dokumentu i moraju se revidirati prije vanjske distribucije bankama i investitorima:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <div className="font-bold text-amber-300 flex items-center justify-between">
              <span>1. Aritmetička razlika u rezultatu (1 KM)</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                Razlika 1 KM
              </span>
            </div>
            <p className="text-slate-300 mt-2 leading-relaxed">
              Zbir rezultata IDSS (115.145 KM) + IMH (60.720 KM) iznosi tačno <strong>175.865 KM</strong>, dok je u izvornom dokumentu navedeno <strong>175.864 KM</strong>. Isto se ponavlja kod prilagođenog prikaza (15.145 + 60.720 = 75.865 vs 75.864 KM).
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <div className="font-bold text-amber-300 flex items-center justify-between">
              <span>2. Neslaganje vlastitog kapitala u bilansu (25 KM)</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                Tekst vs Tabela
              </span>
            </div>
            <p className="text-slate-300 mt-2 leading-relaxed">
              Tekst izvještaja navodi kapital: IDSS -18.389 KM i IMH -18.913 KM (zbir -37.302 KM). Tabela ključnih pokazatelja navodi: IDSS -18.391 KM i IMH -18.936 KM (zbir -37.328 KM).
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <div className="font-bold text-amber-300 flex items-center justify-between">
              <span>3. Raspon cijena školarina (Domaći vs Strani)</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                Cjenovnik 2026/27
              </span>
            </div>
            <p className="text-slate-300 mt-2 leading-relaxed">
              U odjeljku 2.2 naveden je raspon školarina od 9.700 do 11.030 KM, dok pregled cjenovnika za 2026/27 navodi: I-IV razred (9.700 KM domaći / 11.970 KM strani) i V-IX razred (11.030 KM domaći / 13.700 KM strani).
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <div className="font-bold text-amber-300 flex items-center justify-between">
              <span>4. Zaokruživanje postotaka i upisnih stopa</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                Potvrđeno
              </span>
            </div>
            <p className="text-slate-300 mt-2 leading-relaxed">
              Pad upisa u 2025/26 sa 94 na 68 učenika iznosi <strong>27.66%</strong> (zaokruženo na 28%). Oporavak na 83 učenika je <strong>11.70%</strong> ispod vrha (zaokruženo na 12%). Tranzicija 7/11 je <strong>63.64%</strong> (zaokruženo na 64%).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
