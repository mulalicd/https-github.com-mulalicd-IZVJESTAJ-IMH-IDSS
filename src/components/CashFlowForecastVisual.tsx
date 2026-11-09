import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { useFinancials, km } from '../lib/bilans/store';

const MONTHS = ['Nov 26', 'Dec 26', 'Jan 27', 'Feb 27', 'Mar 27', 'Apr 27', 'Maj 27', 'Jun 27', 'Jul 27', 'Aug 27', 'Sep 27', 'Okt 27'];
const SUMMER = new Set(['Jul 27', 'Aug 27']);
// [P] Ljetni faktor prihoda: prosjek jun–avg 2026. / prosjek jan–maj 2026. (bez 100.000 KM) = 142.369 / 180.390
const SUMMER_FACTOR = 0.789;
const RENT = 7531.29;
const MF_IMH = 4661;
const LEASING = 2010;
const FOUNDER_RATE = 7790.4;

export const CashFlowForecastVisual: React.FC = () => {
  const fin = useFinancials();
  const [founderMode, setFounderMode] = useState<'ugovor' | 'prebijanje'>('ugovor');

  const base = useMemo(() => {
    const idss = fin.idss;
    const imh = fin.imh;
    const g = fin.group;
    if (!idss || !imh || !g || idss.revenue === null || imh.revenue === null || idss.expenses === null || imh.expenses === null) return null;
    const months = idss.months || 10;
    const icShared = fin.recon.find((r) => r.label.startsWith('Fakture IMH → IDSS (zajednički'))?.idss ?? 0;
    const revenue = (g.revenueExternal ?? 0) / months;
    const labor = (g.labor ?? 0) / months;
    const other =
      (idss.expenses + imh.expenses - (g.labor ?? 0) - (imh.rent ?? 0) - (idss.interest ?? 0) - (imh.interest ?? 0) - icShared) / months;
    return { revenue, labor, other, months, from: g.periodTo };
  }, [fin]);

  if (!base) {
    return (
      <div className="my-6 p-5 rounded-2xl border border-[var(--line)] text-xs">
        Za projekciju novčanih tokova potrebni su bruto bilansi obje ustanove (klase 5 i 6).
      </div>
    );
  }

  let founderLeft = 93484.84;
  const data = MONTHS.map((m, i) => {
    const inflow = base.revenue * (SUMMER.has(m) ? SUMMER_FACTOR : 1);
    let founder = 0;
    if (founderMode === 'ugovor' && founderLeft > 0) {
      founder = i === 0 ? 4400 : Math.min(FOUNDER_RATE, founderLeft);
      founderLeft -= founder;
    }
    const debt = MF_IMH + LEASING + founder;
    const outflow = base.labor + base.other + RENT + debt;
    return {
      month: m,
      inflow: Math.round(inflow),
      labor: Math.round(base.labor),
      other: Math.round(base.other),
      rent: Math.round(RENT),
      debt: Math.round(debt),
      outflow: Math.round(outflow),
      net: Math.round(inflow - outflow),
    };
  });
  let cum = (fin.group?.bankCash ?? 0);
  const withCum = data.map((d) => {
    cum += d.net;
    return { ...d, cum: Math.round(cum) };
  });
  const totalNet = data.reduce((s, d) => s + d.net, 0);
  const summerNet = data.filter((d) => SUMMER.has(d.month)).reduce((s, d) => s + d.net, 0);
  const minCum = Math.min(...withCum.map((d) => d.cum));

  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-[var(--surface)] shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            Projekcija iz bruto bilansa · 12 mjeseci (nov 2026 – okt 2027)
          </span>
          <h3 className="text-lg sm:text-xl font-black text-[var(--ink)] mt-1">Prilivi naspram odliva grupe</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Mjesečni prosjek iz knjiga do {base.from} ({base.months} mj.), bez međusobnih faktura i subvencija. Zakup po ugovoru, dug servis po ugovorima.
          </p>
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-[var(--surface-alt)] rounded-xl border border-[var(--line)] text-xs self-start md:self-auto">
          <span className="px-2 text-[var(--muted)]">Osnivač:</span>
          {(['ugovor', 'prebijanje'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFounderMode(mode)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${founderMode === mode ? 'bg-blue-600 text-white' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}
            >
              {mode === 'ugovor' ? 'Isplata rata' : 'Prebijanje (preporuka)'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-xl border border-[var(--line)]">
          <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Prosječni mjesečni prihod</span>
          <div className="text-base font-black text-emerald-600 font-mono">{km(base.revenue)}</div>
        </div>
        <div className="p-3 rounded-xl border border-[var(--line)]">
          <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Mjesečni troškovi rada</span>
          <div className="text-base font-black text-rose-600 font-mono">{km(base.labor)}</div>
        </div>
        <div className="p-3 rounded-xl border border-[var(--line)]">
          <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Neto 12 mjeseci</span>
          <div className={`text-base font-black font-mono ${totalNet >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>{km(totalNet)}</div>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
          <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Ljeto (jul–avg)
          </span>
          <div className="text-base font-black text-amber-900 dark:text-amber-200 font-mono">{km(summerNet)}</div>
        </div>
      </div>

      <div className="w-full h-[380px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={withCum} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => km(Number(v))} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <ReferenceLine y={0} stroke="#475569" />
            <Bar name="Troškovi rada" dataKey="labor" stackId="o" fill="#f43f5e" opacity={0.85} />
            <Bar name="Ostali operativni troškovi" dataKey="other" stackId="o" fill="#fb7185" opacity={0.85} />
            <Bar name="Zakup (7.531 KM)" dataKey="rent" stackId="o" fill="#fda4af" opacity={0.85} />
            <Bar name="Dug servis (MF, leasing, osnivač)" dataKey="debt" stackId="o" fill="#be123c" opacity={0.85} />
            <Line type="monotone" name="Prilivi (prihodi)" dataKey="inflow" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
            <Line type="monotone" name="Kumulativna gotovina (od stvarne gotovine na računima)" dataKey="cum" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-[var(--surface-alt)] border border-[var(--line)] text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-[var(--ink)]">
          <Info className="w-4 h-4" /> Tumačenje
        </div>
        <p className="m-0">
          Početna gotovina je stvarno stanje na računima ({km(fin.group?.bankCash)}), bez iznosa na prelaznim kontima. Najniže kumulativno stanje u
          projekciji iznosi <b>{km(minCum)}</b>. {founderMode === 'ugovor' ? 'Isplata rata osnivaču odnosi do 93.485 KM gotovine u 12 mjeseci.' : 'Prebijanjem s potraživanjima od osnivača nema gotovinskog odliva prema osnivaču.'}
        </p>
        <p className="m-0 text-[var(--muted)]">
          [P] Projekcija koristi obračunske prosjeke iz knjiga, a ne stvarne datume naplate. Ljetni prihod je umanjen faktorom 0,789 iz sezonalnosti 2026. godine.
          Nisu uključeni: prekoračenja, izmirenje sporazuma s Poreznom upravom, anuiteti manjih kredita IDSS-a.
        </p>
      </div>
    </div>
  );
};
