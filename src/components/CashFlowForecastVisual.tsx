import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  AlertTriangle,
  Calendar,
  Layers,
  Filter,
  Info,
} from 'lucide-react';

export interface MonthlyCashFlow {
  month: string;
  monthShort: string;
  period: string; // npr. 'Q4 2026', 'Q1 2027'
  tuitionInflow: number; // Prilivi školarina (IDSS + IMH komercijala)
  subsidyInflow: number; // Kantonalne subvencije
  salariesOutflow: number; // Plate i doprinosi zaposlenih (bruto)
  rentOutflow: number; // Zakup zgrade Buka 11/13 (Općina Centar 7.531,29 KM)
  loanDebtOutflow: number; // Krediti MF Banke (anuitet 4.661 KM + kamate)
  leasingOutflow: number; // Sparkasse Leasing Porsche Cayenne (2.010 KM / 1.027,91 EUR)
  ownerLoanRepayment: number; // Rata pozajmice Lamiji Kacili (7.790,40 KM po ugovoru od 14.07.2026.)
  overdraftRepayment: number; // Overdraft IDSS 15.000 KM dospijeva u Junu 2027.
  isSummerDeficitMonth?: boolean;
}

// Projektovanih 12 mjeseci počevši od Novembra 2026. do Oktobra 2027.
export const MONTHLY_CASH_FLOW_DATA: MonthlyCashFlow[] = [
  {
    month: 'Novembar 2026.',
    monthShort: 'Nov 26',
    period: 'Q4 2026',
    tuitionInflow: 118500,
    subsidyInflow: 13120,
    salariesOutflow: 86500,
    rentOutflow: 7531,
    loanDebtOutflow: 4661,
    leasingOutflow: 2010,
    ownerLoanRepayment: 7790, // 1. rata pozajmice (01.11.2026.)
    overdraftRepayment: 0,
  },
  {
    month: 'Decembar 2026.',
    monthShort: 'Dec 26',
    period: 'Q4 2026',
    tuitionInflow: 114000,
    subsidyInflow: 13120,
    salariesOutflow: 86500,
    rentOutflow: 7531,
    loanDebtOutflow: 4661,
    leasingOutflow: 2010,
    ownerLoanRepayment: 7790, // 2. rata
    overdraftRepayment: 0,
  },
  {
    month: 'Januar 2027.',
    monthShort: 'Jan 27',
    period: 'Q1 2027',
    tuitionInflow: 122000,
    subsidyInflow: 13120,
    salariesOutflow: 86500,
    rentOutflow: 7531,
    loanDebtOutflow: 4661,
    leasingOutflow: 2010,
    ownerLoanRepayment: 7790, // 3. rata
    overdraftRepayment: 0,
  },
  {
    month: 'Februar 2027.',
    monthShort: 'Feb 27',
    period: 'Q1 2027',
    tuitionInflow: 116500,
    subsidyInflow: 13120,
    salariesOutflow: 86500,
    rentOutflow: 7531,
    loanDebtOutflow: 4661,
    leasingOutflow: 2010,
    ownerLoanRepayment: 7790, // 4. rata
    overdraftRepayment: 0,
  },
  {
    month: 'Mart 2027.',
    monthShort: 'Mar 27',
    period: 'Q1 2027',
    tuitionInflow: 119000,
    subsidyInflow: 13120,
    salariesOutflow: 86500,
    rentOutflow: 7531,
    loanDebtOutflow: 4661,
    leasingOutflow: 2010,
    ownerLoanRepayment: 7790, // 5. rata
    overdraftRepayment: 0,
  },
  {
    month: 'April 2027.',
    monthShort: 'Apr 27',
    period: 'Q2 2027',
    tuitionInflow: 115000,
    subsidyInflow: 13120,
    salariesOutflow: 86500,
    rentOutflow: 7531,
    loanDebtOutflow: 4661,
    leasingOutflow: 2010,
    ownerLoanRepayment: 7790, // 6. rata
    overdraftRepayment: 0,
  },
  {
    month: 'Maj 2027.',
    monthShort: 'Maj 27',
    period: 'Q2 2027',
    tuitionInflow: 120000,
    subsidyInflow: 13120,
    salariesOutflow: 86500,
    rentOutflow: 7531,
    loanDebtOutflow: 4661,
    leasingOutflow: 2010,
    ownerLoanRepayment: 7790, // 7. rata
    overdraftRepayment: 0,
  },
  {
    month: 'Juni 2027.',
    monthShort: 'Jun 27',
    period: 'Q2 2027',
    tuitionInflow: 65000, // Pad zbog završetka školske godine
    subsidyInflow: 13120,
    salariesOutflow: 86500,
    rentOutflow: 7531,
    loanDebtOutflow: 4661,
    leasingOutflow: 2010,
    ownerLoanRepayment: 7790, // 8. rata
    overdraftRepayment: 15000, // Dospijeće overdraft limita 12.06.2027.
    isSummerDeficitMonth: true,
  },
  {
    month: 'Juli 2027.',
    monthShort: 'Jul 27',
    period: 'Q3 2027',
    tuitionInflow: 38000, // Ljetna sezona: samo vrtić i ljetna škola
    subsidyInflow: 6500, // Smanjene kantonalne subvencije
    salariesOutflow: 84000, // Godišnji odmori, fiksne plate
    rentOutflow: 7531,
    loanDebtOutflow: 4661,
    leasingOutflow: 2010,
    ownerLoanRepayment: 7790, // 9. rata
    overdraftRepayment: 0,
    isSummerDeficitMonth: true,
  },
  {
    month: 'August 2027.',
    monthShort: 'Aug 27',
    period: 'Q3 2027',
    tuitionInflow: 42000, // Avansne upisnine za novu školsku godinu
    subsidyInflow: 6500,
    salariesOutflow: 84000,
    rentOutflow: 7531,
    loanDebtOutflow: 4661,
    leasingOutflow: 2010,
    ownerLoanRepayment: 7790, // 10. rata
    overdraftRepayment: 0,
    isSummerDeficitMonth: true,
  },
  {
    month: 'Septembar 2027.',
    monthShort: 'Sep 27',
    period: 'Q3 2027',
    tuitionInflow: 148000, // Početak školske godine: 1. rata školarine + upisnine
    subsidyInflow: 13120,
    salariesOutflow: 88000,
    rentOutflow: 7531,
    loanDebtOutflow: 4661,
    leasingOutflow: 2010,
    ownerLoanRepayment: 7790, // 11. rata
    overdraftRepayment: 0,
  },
  {
    month: 'Oktobar 2027.',
    monthShort: 'Okt 27',
    period: 'Q4 2027',
    tuitionInflow: 125000,
    subsidyInflow: 13120,
    salariesOutflow: 88000,
    rentOutflow: 7531,
    loanDebtOutflow: 4661,
    leasingOutflow: 2010,
    ownerLoanRepayment: 7790, // 12. finalna rata pozajmice (zatvaranje 93.484,84 KM)
    overdraftRepayment: 0,
  },
];

export const CashFlowForecastVisual: React.FC = () => {
  const [viewMode, setViewMode] = useState<'stacked' | 'comparison' | 'net'>('stacked');
  const [activeLegend, setActiveLegend] = useState<string | null>(null);

  // Kalkulacija agregiranih podataka za grafikon
  const chartData = MONTHLY_CASH_FLOW_DATA.map((item) => {
    const totalInflow = item.tuitionInflow + item.subsidyInflow;
    const totalDebtOutflow =
      item.loanDebtOutflow +
      item.leasingOutflow +
      item.ownerLoanRepayment +
      item.overdraftRepayment;
    const totalFixedOutflow =
      item.salariesOutflow + item.rentOutflow + totalDebtOutflow;
    const netCashFlow = totalInflow - totalFixedOutflow;

    return {
      ...item,
      totalInflow,
      totalFixedOutflow,
      totalDebtOutflow,
      netCashFlow,
    };
  });

  // Ukupne sume za 12 mjeseci
  const totalAnnualInflow = chartData.reduce((acc, curr) => acc + curr.totalInflow, 0);
  const totalAnnualOutflow = chartData.reduce(
    (acc, curr) => acc + curr.totalFixedOutflow,
    0
  );
  const netAnnualBalance = totalAnnualInflow - totalAnnualOutflow;
  const summerDeficitSum = chartData
    .filter((d) => d.isSummerDeficitMonth)
    .reduce((acc, curr) => acc + curr.netCashFlow, 0);

  // Custom Tooltip za Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isDeficit = data.netCashFlow < 0;

      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xl text-xs max-w-sm">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {data.month}
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {data.period}
            </span>
          </div>

          <div className="space-y-1.5 mb-3">
            <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>Ukupni prilivi (Školarine + Subv.):</span>
              <span className="font-mono text-sm">
                +{data.totalInflow.toLocaleString('bs-BA')} KM
              </span>
            </div>
            <div className="text-[11px] text-slate-500 pl-2">
              • Školarine (IDSS + IMH): {data.tuitionInflow.toLocaleString('bs-BA')} KM
              <br />
              • Subvencije KS: {data.subsidyInflow.toLocaleString('bs-BA')} KM
            </div>

            <div className="flex justify-between items-center text-rose-600 dark:text-rose-400 font-semibold pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>Ukupni fiksni odlivi:</span>
              <span className="font-mono text-sm">
                -{data.totalFixedOutflow.toLocaleString('bs-BA')} KM
              </span>
            </div>
            <div className="text-[11px] text-slate-500 pl-2 space-y-0.5">
              <div>• Plate i doprinosi: -{data.salariesOutflow.toLocaleString('bs-BA')} KM</div>
              <div>• Zakup Buka 11/13: -{data.rentOutflow.toLocaleString('bs-BA')} KM</div>
              <div>• Servis duga i leasing: -{data.totalDebtOutflow.toLocaleString('bs-BA')} KM</div>
            </div>
          </div>

          <div
            className={`p-2.5 rounded-lg border flex items-center justify-between font-bold ${
              isDeficit
                ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-300'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-emerald-300'
            }`}
          >
            <span>Mjesečni neto rezultat:</span>
            <span className="font-mono text-sm">
              {isDeficit ? '' : '+'}
              {data.netCashFlow.toLocaleString('bs-BA')} KM
            </span>
          </div>

          {data.isSummerDeficitMonth && (
            <div className="mt-2 text-[10px] text-amber-700 dark:text-amber-300 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              Ljetni likvidnosni manjak zahtijeva akumuliranu rezervu iz Q1/Q2.
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-gradient-to-b from-white to-blue-50/20 dark:from-slate-900 dark:to-slate-950 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              FORENZIČKI CASH-FLOW FORECAST · RECHARTS DINAMIKA
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> 12 MJESECI (NOV 2026 – OKT 2027)
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Projektovani prilivi školarina vs. Fiksni odlivi (plate, dug, leasing, zakup)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Realna dinamika servisa fiksnih obaveza sa uračunatom ljetnom sezonalnošću i anuitetima pozajmice (7.790 KM/mj.).
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs self-start md:self-auto">
          <button
            onClick={() => setViewMode('stacked')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'stacked'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Slojeviti raspored
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'comparison'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5" /> Prilivi vs. Odlivi
          </button>
          <button
            onClick={() => setViewMode('net')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'net'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Neto saldo
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
            Godišnji prilivi
          </span>
          <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
            {totalAnnualInflow.toLocaleString('bs-BA')} KM
          </div>
          <span className="text-[10px] text-slate-400">Školarine + subvencije</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
            Fiksni odlivi (12 mj.)
          </span>
          <div className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 font-mono mt-0.5">
            {totalAnnualOutflow.toLocaleString('bs-BA')} KM
          </div>
          <span className="text-[10px] text-slate-400">Plate, dug, leasing, zakup</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
            Kumulativni neto saldo
          </span>
          <div
            className={`text-base sm:text-lg font-black font-mono mt-0.5 ${
              netAnnualBalance >= 0
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {netAnnualBalance >= 0 ? '+' : ''}
            {netAnnualBalance.toLocaleString('bs-BA')} KM
          </div>
          <span className="text-[10px] text-slate-400">Nakon svih fiksnih obaveza</span>
        </div>

        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
          <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Ljetni jaz (Jun-Aug)
          </span>
          <div className="text-base sm:text-lg font-black text-amber-900 dark:text-amber-200 font-mono mt-0.5">
            {summerDeficitSum.toLocaleString('bs-BA')} KM
          </div>
          <span className="text-[10px] text-amber-700 dark:text-amber-400">
            Potreban likvidnosni buffer
          </span>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="w-full h-[380px] sm:h-[420px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'stacked' ? (
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
              <XAxis
                dataKey="monthShort"
                tick={{ fontSize: 11, fill: '#64748b' }}
                stroke="#94a3b8"
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#64748b' }}
                stroke="#94a3b8"
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                onClick={(e: any) =>
                  setActiveLegend(activeLegend === e.dataKey ? null : e.dataKey)
                }
              />
              <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />

              {/* Odlivi (Stacked bars) */}
              <Bar
                name="Plate i doprinosi"
                dataKey="salariesOutflow"
                stackId="outflows"
                fill="#f43f5e"
                opacity={activeLegend && activeLegend !== 'salariesOutflow' ? 0.3 : 0.85}
              />
              <Bar
                name="Zakup Buka 11/13 (7.531 KM)"
                dataKey="rentOutflow"
                stackId="outflows"
                fill="#fb7185"
                opacity={activeLegend && activeLegend !== 'rentOutflow' ? 0.3 : 0.85}
              />
              <Bar
                name="Servis duga (MF, Leasing, Pozajmica)"
                dataKey="totalDebtOutflow"
                stackId="outflows"
                fill="#be123c"
                opacity={activeLegend && activeLegend !== 'totalDebtOutflow' ? 0.3 : 0.85}
              />

              {/* Prilivi - Linija s tačkama */}
              <Line
                type="monotone"
                name="Ukupni prilivi (Školarine + Subvencije)"
                dataKey="totalInflow"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981' }}
                activeDot={{ r: 7 }}
              />

              {/* Neto linija */}
              <Line
                type="monotone"
                name="Neto mjesečni rezultat"
                dataKey="netCashFlow"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#3b82f6' }}
              />
            </ComposedChart>
          ) : viewMode === 'comparison' ? (
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
              <XAxis
                dataKey="monthShort"
                tick={{ fontSize: 11, fill: '#64748b' }}
                stroke="#94a3b8"
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#64748b' }}
                stroke="#94a3b8"
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />

              <Bar
                name="Ukupni Prilivi"
                dataKey="totalInflow"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                name="Ukupni Fiksni Odlivi"
                dataKey="totalFixedOutflow"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                name="Neto Saldo"
                dataKey="netCashFlow"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          ) : (
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
              <XAxis
                dataKey="monthShort"
                tick={{ fontSize: 11, fill: '#64748b' }}
                stroke="#94a3b8"
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#64748b' }}
                stroke="#94a3b8"
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <ReferenceLine y={0} stroke="#dc2626" strokeWidth={1.5} strokeDasharray="3 3" />

              <Bar
                name="Neto Mjesečni Saldo (KM)"
                dataKey="netCashFlow"
                radius={[4, 4, 0, 0]}
                fill="#3b82f6"
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Analitičke opservacije za direktora */}
      <div className="mt-4 p-4 rounded-xl bg-blue-50/50 dark:bg-slate-800/40 border border-blue-100 dark:border-slate-800 text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300">
          <Info className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <span>Forenzički zaključci za direktora Davora Mulalića:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700 dark:text-slate-300 leading-relaxed">
          <div>
            <b>1. Ljetna likvidnosna rupa (Juni – August 2027.):</b> Ukupni kumulativni manjak tokom ljetnog perioda dostiže <b>{Math.abs(summerDeficitSum).toLocaleString('bs-BA')} KM</b>. Zbog prestanka redovnih školarina IDSS-a, a nepromijenjenih fiksnih troškova plata i zakupa, grupa mora od novembra do maja sukcesivno izdvajati minimalno <b>15.000 KM mjesečno u likvidnosnu rezervu</b>.
          </div>
          <div>
            <b>2. Dospijeće overdraft limita i pozajmice:</b> Dana 12.06.2027. dospijeva overdraft od 15.000 KM u IDSS-u, dok se svakog 1. u mjesecu mora servisirati <b>7.790,40 KM rate pozajmice</b> prema Lamiji Kacili (Ugovor od 14.07.2026.). Svako kašnjenje dvije uzastopne rate pozajmice aktivira Član 6 i trenutnu naplatu cjelokupnog preostalog iznosa.
          </div>
        </div>
      </div>
    </div>
  );
};
