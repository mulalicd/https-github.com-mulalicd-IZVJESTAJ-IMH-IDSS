import React, { useState } from 'react';
import { Sliders, TrendingUp, AlertTriangle, CheckCircle2, RotateCcw, DollarSign, Users, ShieldAlert, Sparkles } from 'lucide-react';

interface Props {
  injectedCash?: number;
  injectedEbitda?: number;
}

export const ScenarioSimulatorTab: React.FC<Props> = ({
  injectedCash = 0,
  injectedEbitda = 0,
}) => {
  // Simulator State
  const [studentsIDSS, setStudentsIDSS] = useState<number>(83);
  const [tuitionPerStudent, setTuitionPerStudent] = useState<number>(9391);
  const [subsidyRetention, setSubsidyRetention] = useState<number>(100);
  const [staffCostAdjust, setStaffCostAdjust] = useState<number>(0);
  const [monthlyOwnerPayback, setMonthlyOwnerPayback] = useState<number>(10000);
  const [excludePhantom100k, setExcludePhantom100k] = useState<boolean>(true);

  // Baseline Constants
  const baseIMHCommercialRev = 650000;
  const baseAnnualSubsidies = 236000;
  const baseIDSSStaffCost = 704500;
  const baseIMHStaffCost = 540000;
  const baseGroupOpexAndRent = 380000;
  const currentCash = 37639 + injectedCash;
  const currentEquity = -37304;

  // Calculations
  const calculatedIDSSRev = studentsIDSS * tuitionPerStudent;
  const calculatedSubsidies = (baseAnnualSubsidies * subsidyRetention) / 100;
  const totalIMHRev = baseIMHCommercialRev + calculatedSubsidies;
  const phantomAddon = excludePhantom100k ? 0 : 100000;
  
  const totalConsolidatedRev = calculatedIDSSRev + totalIMHRev + phantomAddon;
  
  const adjustedIDSSStaff = baseIDSSStaffCost * (1 + staffCostAdjust / 100);
  const adjustedIMHStaff = baseIMHStaffCost * (1 + staffCostAdjust / 100);
  const totalStaffCost = adjustedIDSSStaff + adjustedIMHStaff;
  const totalOpex = totalStaffCost + baseGroupOpexAndRent;

  const annualEbitda = totalConsolidatedRev - totalOpex + injectedEbitda;
  const ebitdaMargin = (annualEbitda / totalConsolidatedRev) * 100;

  const annualOwnerPayback = monthlyOwnerPayback * 12;
  const netAnnualCashGeneration = annualEbitda + annualOwnerPayback;
  const monthlyCashGeneration = netAnnualCashGeneration / 12;

  const cashRunwayMonths = monthlyCashGeneration < 0
    ? Math.max(0.1, Number((currentCash / Math.abs(monthlyCashGeneration)).toFixed(1)))
    : 99;

  const yearsToPositiveEquity = annualEbitda > 0
    ? Math.max(0.5, Number((Math.abs(currentEquity) / annualEbitda).toFixed(1)))
    : 99;

  const applyPreset = (preset: 'shock' | 'statusQuo' | 'turnaround') => {
    if (preset === 'shock') {
      setStudentsIDSS(68);
      setTuitionPerStudent(9200);
      setSubsidyRetention(50);
      setStaffCostAdjust(0);
      setMonthlyOwnerPayback(0);
      setExcludePhantom100k(true);
    } else if (preset === 'statusQuo') {
      setStudentsIDSS(83);
      setTuitionPerStudent(9391);
      setSubsidyRetention(100);
      setStaffCostAdjust(0);
      setMonthlyOwnerPayback(0);
      setExcludePhantom100k(true);
    } else {
      setStudentsIDSS(98);
      setTuitionPerStudent(10500);
      setSubsidyRetention(100);
      setStaffCostAdjust(-5);
      setMonthlyOwnerPayback(15000);
      setExcludePhantom100k(true);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Preset Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <Sliders className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Strateški Stress-Test &amp; Simulacija Poslovanja (2027 &ndash; 2029)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Kvantitativni model za procjenu osjetljivosti poslovanja na promjene upisa, subvencija, troškova i povrata potraživanja.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1">Predefinisani Scenariji:</span>
          <button
            onClick={() => applyPreset('shock')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-950/60 text-red-300 border border-red-800/60 hover:bg-red-900/60 transition-all"
          >
            Pesimistični Šok
          </button>
          <button
            onClick={() => applyPreset('statusQuo')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all"
          >
            Status Quo (Danas)
          </button>
          <button
            onClick={() => applyPreset('turnaround')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/60 transition-all flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Strateška Konsolidacija
          </button>
        </div>
      </div>

      {/* Simulator Inputs & Dynamic Outputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Ključne Operativne Poluge</span>
            <button
              onClick={() => applyPreset('statusQuo')}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded"
              title="Resetuj na status quo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </h3>

          {/* Slider 1: IDSS Enrollment */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Broj upisanih učenika IDSS (I-IX):
              </span>
              <span className="font-mono font-bold text-blue-400 text-sm">{studentsIDSS} učenika</span>
            </div>
            <input
              type="range"
              min="60"
              max="115"
              step="1"
              value={studentsIDSS}
              onChange={(e) => setStudentsIDSS(Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>60 (Kriza)</span>
              <span>83 (Danas)</span>
              <span>115 (Maks. kapacitet)</span>
            </div>
          </div>

          {/* Slider 2: Tuition Realization */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Realizovana prosječna školarina:
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {tuitionPerStudent.toLocaleString('bs-BA')} KM
              </span>
            </div>
            <input
              type="range"
              min="8500"
              max="13500"
              step="100"
              value={tuitionPerStudent}
              onChange={(e) => setTuitionPerStudent(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>8.500 KM (Visoki popusti)</span>
              <span>9.391 KM (Trenutno)</span>
              <span>13.500 KM (Cjenovnik)</span>
            </div>
          </div>

          {/* Slider 3: Subsidy Retention */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Stopa kantonalnih subvencija (IMH):
              </span>
              <span className="font-mono font-bold text-amber-400 text-sm">{subsidyRetention}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={subsidyRetention}
              onChange={(e) => setSubsidyRetention(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (Obustava)</span>
              <span>50% (Djelimično)</span>
              <span>100% (236.000 KM god.)</span>
            </div>
          </div>

          {/* Slider 4: Staff Cost Optimization */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Prilagodba troškova osoblja:</span>
              <span className="font-mono font-bold text-slate-200 text-sm">
                {staffCostAdjust > 0 ? `+${staffCostAdjust}%` : `${staffCostAdjust}%`}
              </span>
            </div>
            <input
              type="range"
              min="-15"
              max="15"
              step="1"
              value={staffCostAdjust}
              onChange={(e) => setStaffCostAdjust(Number(e.target.value))}
              className="w-full accent-blue-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-15% (Racionalizacija)</span>
              <span>0% (Bazno)</span>
              <span>+15% (Inflatorni rast)</span>
            </div>
          </div>

          {/* Slider 5: Monthly Owner Debt Payback */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Mjesečni priliv iz povrata potraživanja (184k KM):
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {monthlyOwnerPayback.toLocaleString('bs-BA')} KM / mj.
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20000"
              step="1000"
              value={monthlyOwnerPayback}
              onChange={(e) => setMonthlyOwnerPayback(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 KM (Bez naplate)</span>
              <span>10.000 KM (Plan)</span>
              <span>20.000 KM (Ubrzana sanacija)</span>
            </div>
          </div>

          {/* Checkbox: Phantom 100k */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300">Faktura od 100.000 KM iz kredita MF Banke:</span>
            <button
              onClick={() => setExcludePhantom100k(!excludePhantom100k)}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                excludePhantom100k
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {excludePhantom100k ? 'ISKLJUČENO (Normalizovano)' : 'UKLJUČENO (Iskazano)'}
            </button>
          </div>
        </div>

        {/* Dynamic Simulation Results (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Forenzički Rezultat Simulacije (Godišnji Nivo)</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  annualEbitda >= 150000
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : annualEbitda >= 0
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {annualEbitda >= 150000
                  ? 'OPERATIVNO STABILNO'
                  : annualEbitda >= 0
                  ? 'GRANIČNA LIKVIDNOST'
                  : 'STRUKTURNI DEFICIT'}
              </span>
            </h3>

            {/* Main KPI Result Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                <div className="text-xs text-slate-400 font-medium">Konsolidirani Prihod</div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1">
                  {Math.round(totalConsolidatedRev).toLocaleString('bs-BA')} KM
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  IDSS: {Math.round(calculatedIDSSRev).toLocaleString('bs-BA')} | IMH: {Math.round(totalIMHRev).toLocaleString('bs-BA')}
                </div>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                <div className="text-xs text-slate-400 font-medium">Operativni EBITDA</div>
                <div
                  className={`text-xl sm:text-2xl font-black mt-1 ${
                    annualEbitda < 0 ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {annualEbitda > 0 ? '+' : ''}
                  {Math.round(annualEbitda).toLocaleString('bs-BA')} KM
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Marža: {ebitdaMargin.toFixed(1)}% (Ciljni rang: 10&ndash;12%)
                </div>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 col-span-2 sm:col-span-1">
                <div className="text-xs text-slate-400 font-medium">Godišnji Priliv Potraživanja</div>
                <div className="text-xl sm:text-2xl font-black text-blue-400 mt-1">
                  +{annualOwnerPayback.toLocaleString('bs-BA')} KM
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {monthlyOwnerPayback.toLocaleString('bs-BA')} KM / mjesečno
                </div>
              </div>
            </div>

            {/* Diagnostic Gauges */}
            <div className="space-y-4 mt-6">
              {/* Ratio: Staff Cost % */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Koeficijent troškova plata u prihodima:</span>
                  <span
                    className={`font-mono font-bold ${
                      totalStaffCost / totalConsolidatedRev > 0.75
                        ? 'text-red-400'
                        : totalStaffCost / totalConsolidatedRev > 0.68
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {((totalStaffCost / totalConsolidatedRev) * 100).toFixed(1)}% (Benchmark &lt; 68%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      totalStaffCost / totalConsolidatedRev > 0.75
                        ? 'bg-red-500'
                        : totalStaffCost / totalConsolidatedRev > 0.68
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (totalStaffCost / totalConsolidatedRev) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Time to Positive Equity */}
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-300 font-semibold">Sanacija Negativnog Kapitala (-37.3k KM):</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Procijenjeno vrijeme zadržavanja dobiti do pozitivnog bilansa
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black font-mono text-white">
                    {annualEbitda > 0 ? `${yearsToPositiveEquity} god.` : 'NEODRŽIVO'}
                  </span>
                  <div className="text-[10px] text-emerald-400 font-medium">
                    {annualEbitda > 0 && yearsToPositiveEquity <= 2 ? 'Ostvarivo do kraja 2028.' : ''}
                  </div>
                </div>
              </div>

              {/* Cash Runway Alert */}
              {annualEbitda < 0 && (
                <div className="bg-red-950/40 border border-red-800 p-4 rounded-xl text-xs text-red-200 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-red-300 block mb-0.5">Deficitarna Operativna Pozicija</strong>
                    U ovom scenariju preduzeće generiše mjesečni operativni manjak od {Math.abs(Math.round(monthlyCashGeneration)).toLocaleString('bs-BA')} KM. 
                    Uz raspoloživu gotovinu od {currentCash.toLocaleString('bs-BA')} KM, <strong>likvidnosna rezerva iznosi svega {cashRunwayMonths} mjeseci</strong>.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Strategic Sensitivity Conclusion */}
          <div className="p-4 bg-blue-950/30 border border-blue-800/40 rounded-xl text-xs text-slate-300">
            <span className="font-bold text-blue-300 block mb-1">
              Strateški Zaključak Modeliranja:
            </span>
            {studentsIDSS >= 95 ? (
              <p className="text-slate-300 leading-relaxed">
                Pri upisu od <strong>{studentsIDSS} učenika</strong> i normalizovanim cijenama, fiksna infrastruktura kampusa Buka 11/13 ostvaruje ekonomiju obima. 
                Grupacija generiše preko <strong>150.000 KM godišnjeg EBITDA-a</strong>, omogućavajući uredno servisiranje dugova, puno pokriće sigurnosnih depozita roditelja i prelazak u pozitivan vlastiti kapital do kraja 2028. godine.
              </p>
            ) : (
              <p className="text-slate-300 leading-relaxed">
                Pri trenutnom nivou od <strong>{studentsIDSS} učenika</strong>, operativni model je visoko osjetljiv na eksterne šokove. 
                Gubitak kantonalnih subvencija ili korekcija zakupnine Općine Centar na tržišni nivo momentalno eliminira cjelokupnu operativnu marginu. 
                Prioritet ostaje zaštita upisne vertikale IMH &rarr; IDSS.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
