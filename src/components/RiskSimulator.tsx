import React, { useState } from 'react';
import { Sliders, RotateCcw, AlertTriangle, TrendingUp, Users, Award, ShieldAlert, Baby } from 'lucide-react';
import { useFinancials, km } from '../lib/bilans/store';

interface RiskSimulatorProps {
  className?: string;
}

// Bazna godina 2026/27 iz izvještaja (poglavlja 8 i 17):
// IDSS: 83 ugovora, ugovorena vrijednost 779.476 KM (školarina 749.976 KM + upisnine i ostalo 29.500 KM) + 30.000 KM ostalih prihoda
// Cjenovnik za postojeću strukturu razreda: 858.300 KM (prosjek 10.341 KM po učeniku), odstupanje 12,6%
// IMH: 90 djece × 9.740 KM; troškovi rada 1.332.742 KM; ostali troškovi 344.000 KM; direktni trošak dodatnog učenika ≈1.200 KM
const BASE = {
  students: 83,
  listPerStudent: 858300 / 83,
  discountPct: (108324 / 858300) * 100,
  idssOtherContract: 29500,
  idssOtherRevenue: 30000,
  children: 90,
  imhPerChild: 9740,
  imhDirectPerChild: 1271, // [P] hrana i namirnice IMH 2025 (114.363 KM) / 90 djece
  labor: 1332742,
  other: 344000,
  directPerStudent: 1200,
  teacherCost: 35479, // [P] dodatni nastavnik na svakih +10 učenika (izvedeno iz tabele 17.2)
  amortization: 22000,
  interest: 30000,
};

export const RiskSimulator: React.FC<RiskSimulatorProps> = ({ className = '' }) => {
  const fin = useFinancials();
  const [students, setStudents] = useState<number>(BASE.students);
  const [discountPct, setDiscountPct] = useState<number>(BASE.discountPct);
  const [children, setChildren] = useState<number>(BASE.children);
  const [laborAdj, setLaborAdj] = useState<number>(0);

  const idssTuition = students * BASE.listPerStudent * (1 - discountPct / 100);
  const idssRevenue = idssTuition + BASE.idssOtherContract * (students / BASE.students) + BASE.idssOtherRevenue;
  const imhRevenue = children * BASE.imhPerChild;
  const revenue = idssRevenue + imhRevenue;
  const extraTeachers = Math.max(0, Math.floor((students - BASE.students) / 10));
  const labor = BASE.labor * (1 + laborAdj / 100) + extraTeachers * BASE.teacherCost;
  const other = BASE.other + (students - BASE.students) * BASE.directPerStudent + (children - BASE.children) * BASE.imhDirectPerChild;
  const ebitda = revenue - labor - other;
  const margin = (ebitda / revenue) * 100;
  const laborShare = (labor / revenue) * 100;
  const preTax = ebitda - BASE.amortization - BASE.interest;
  const net = preTax > 0 ? preTax * 0.9 : preTax;
  const equity = fin.group?.equity ?? -37328;
  const yearsToEquity = net > 0 && equity < 0 ? Math.abs(equity) / net : null;

  const reset = () => {
    setStudents(BASE.students);
    setDiscountPct(BASE.discountPct);
    setChildren(BASE.children);
    setLaborAdj(0);
  };

  const state = ebitda < 0 ? 'deficit' : margin < 5 ? 'ranjivo' : margin < 9 ? 'stabilno' : 'snažno';

  const Slider = (p: { id: string; label: string; icon: React.ReactNode; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string; marks: [string, string, string] }) => (
    <div className="p-4 rounded-xl bg-[var(--surface-alt)] border border-[var(--line)]">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={p.id} className="text-xs font-bold text-[var(--ink)] flex items-center gap-1.5">
          {p.icon}
          {p.label}
        </label>
        <span className="text-sm font-black text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]">{p.display}</span>
      </div>
      <input id={p.id} type="range" min={p.min} max={p.max} step={p.step} value={p.value} onChange={(e) => p.onChange(Number(e.target.value))} className="w-full cursor-pointer" />
      <div className="flex justify-between text-[10px] text-[var(--muted)] mt-1.5">
        <span>{p.marks[0]}</span>
        <span>{p.marks[1]}</span>
        <span>{p.marks[2]}</span>
      </div>
    </div>
  );

  return (
    <div className={`p-5 md:p-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-lg my-8 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--line)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--idss-blue)]/10 text-[var(--idss-blue)] dark:text-[var(--idss-cyan)] flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <span className="eyebrow text-[var(--idss-blue)] dark:text-[var(--idss-cyan)] block">MODEL BAZNE GODINE 2026/27 · FORMULE IZ IZVJEŠTAJA</span>
            <h3 className="text-lg font-black text-[var(--ink)] m-0">Simulator EBITDA grupe i osjetljivosti</h3>
          </div>
        </div>
        <button onClick={reset} className="px-3 py-1.5 rounded-lg border border-[var(--line)] hover:bg-[var(--surface-alt)] text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] flex items-center gap-1.5 transition">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Vrati na baznu godinu</span>
        </button>
      </div>

      <p className="text-xs text-[var(--muted)] mt-3 mb-5 leading-relaxed">
        Godišnji model grupe po pretpostavkama iz izvještaja: pri 83 učenika, 12,6% odstupanja od cjenovnika i 90 djece bazna EBITDA iznosi 9.334 KM (0,6%).
        Kantonalne subvencije nisu uključene, jer su prolazna stavka. Na svakih 10 dodatnih učenika uračunat je jedan nastavnik. Rezultat se računa formulama, bez ikakve ručne korekcije.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 my-6">
        <Slider id="sim-students" label="Upis IDSS" icon={<Users className="w-4 h-4" />} value={students} min={60} max={135} step={1} onChange={setStudents} display={`${students} učenika`} marks={['60', '83 (2026/27) · 98 prelomna', '135 kapacitet']} />
        <Slider id="sim-discount" label="Odstupanje od cjenovnika" icon={<Award className="w-4 h-4 text-amber-500" />} value={discountPct} min={0} max={25} step={0.01} onChange={setDiscountPct} display={`${discountPct.toFixed(1).replace('.', ',')}%`} marks={['0%', '12,6% danas · cilj 8%', '25%']} />
        <Slider id="sim-children" label="Djeca IMH" icon={<Baby className="w-4 h-4 text-[var(--imh-green)]" />} value={children} min={70} max={95} step={1} onChange={setChildren} display={`${children} djece`} marks={['70', '90 (danas)', '95 kapacitet']} />
        <Slider id="sim-labor" label="Troškovi rada" icon={<TrendingUp className="w-4 h-4 text-[var(--idss-red)]" />} value={laborAdj} min={-10} max={10} step={0.5} onChange={setLaborAdj} display={`${laborAdj > 0 ? '+' : ''}${laborAdj.toFixed(1).replace('.', ',')}%`} marks={['−10%', '0% (1.332.742 KM)', '+10%']} />
      </div>

      <div className={`p-5 rounded-xl border ${state === 'deficit' ? 'bg-red-50/50 dark:bg-red-950/30 border-red-400 dark:border-red-800' : state === 'ranjivo' ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-400 dark:border-amber-800' : 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-800'}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-1">
              {state === 'deficit' ? <ShieldAlert className="w-5 h-5 text-red-600" /> : state === 'ranjivo' ? <AlertTriangle className="w-5 h-5 text-amber-600" /> : <TrendingUp className="w-5 h-5 text-emerald-600" />}
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">EBITDA grupe (godišnje):</span>
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl md:text-4xl font-black text-[var(--ink)]">{km(ebitda)}</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--line)]">
                marža {margin.toFixed(1).replace('.', ',')}% · {state === 'deficit' ? 'GUBITAK' : state === 'ranjivo' ? 'RANJIVO' : state === 'stabilno' ? 'STABILNO' : 'CILJNA ZONA (≥9%)'}
              </span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-xs">
            <span className="text-[var(--muted)] block">Prihod grupe:</span>
            <b className="text-sm text-[var(--ink)]">{km(revenue)}</b>
            <span className="text-[10px] text-[var(--muted)] block mt-1">IDSS {km(idssRevenue)} · IMH {km(imhRevenue)}</span>
          </div>
          <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-xs">
            <span className="text-[var(--muted)] block">Troškovi rada / prihod:</span>
            <b className={`text-sm ${laborShare > 75 ? 'text-[var(--idss-red)]' : laborShare > 72 ? 'text-amber-600' : 'text-[var(--imh-green)]'}`}>{laborShare.toFixed(1).replace('.', ',')}%</b>
            <span className="text-[10px] text-[var(--muted)] block mt-1">Cilj ≤72% (2028/29), 65–70% (2031/32){extraTeachers ? ` · +${extraTeachers} nastavnik` : ''}</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[var(--line)] text-xs leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <b>Neto rezultat (procjena):</b> {km(net)} nakon amortizacije (22.000 KM), kamata (30.000 KM) i poreza na dobit 10%.
          </div>
          <div>
            <b>Kapital grupe ({fin.group?.periodTo ?? '31.10.2026.'}):</b> {km(equity)}.{' '}
            {yearsToEquity !== null ? `Uz ovaj rezultat kapital postaje pozitivan za oko ${yearsToEquity.toFixed(1).replace('.', ',')} godina.` : equity < 0 ? 'Uz ovaj rezultat kapital se ne vraća u pozitivnu zonu.' : ''}
          </div>
        </div>
      </div>
    </div>
  );
};
