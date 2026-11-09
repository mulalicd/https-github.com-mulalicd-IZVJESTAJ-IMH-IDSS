import React from 'react';
import { ShieldAlert, AlertTriangle, Upload } from 'lucide-react';
import { useFinancials, km } from '../lib/bilans/store';
import type { LedgerMetrics } from '../lib/bilans/parser';

const ROWS: { label: string; key: keyof LedgerMetrics; group?: string; note?: string }[] = [
  { label: 'Prihodi (klasa 6)', key: 'revenue', note: 'IDSS uključuje 100.000 KM od IMH-a' },
  { label: 'Rashodi (klasa 5)', key: 'expenses', note: 'Amortizacija nije knjižena' },
  { label: 'Rezultat po knjigama', key: 'result', group: 'resultBooks' },
  { label: 'Gotovina (klasa 20)', key: 'cash', group: 'cash' },
  { label: '– od toga na prelaznim kontima', key: 'cashInTransit', group: 'cashInTransit', note: 'Prelazni konti moraju biti zatvoreni' },
  { label: 'Kapital', key: 'equity', group: 'equity' },
  { label: 'Eksterni dug bez leasinga', key: 'externalDebt', group: 'externalDebt', note: 'Grupa: bez zajma IMH → IDSS' },
  { label: 'Finansijski leasing', key: 'leasing', group: 'leasing', note: 'Uključuje učešće koje je dao osnivač' },
  { label: 'Potraživanja od kupaca', key: 'receivablesCustomers' },
  { label: 'Potraživanja od zaposlenih i uprave', key: 'receivablesEmployees' },
  { label: 'Depoziti roditelja', key: 'deposits', group: 'deposits' },
  { label: 'Neisplaćene neto plate', key: 'netSalariesPayable', group: 'netSalariesPayable' },
  { label: 'Javne obaveze po sporazumima', key: 'publicAgreements', group: 'publicAgreements' },
  { label: 'Ostale javne obaveze', key: 'publicCurrent', group: 'publicCurrent' },
];

export const LedgerSnapshot: React.FC<{ onOpenHarmonization: () => void }> = ({ onOpenHarmonization }) => {
  const fin = useFinancials();
  const g = fin.group;
  const docs = [fin.idssDoc, fin.imhDoc].filter(Boolean) as NonNullable<typeof fin.idssDoc>[];
  const critical = docs.flatMap((d) => d.issues.filter((i) => i.severity === 'kritično').map((i) => ({ ...i, entity: d.entity })));
  const warnings = docs.flatMap((d) => d.issues.filter((i) => i.severity === 'upozorenje').map((i) => ({ ...i, entity: d.entity })));
  const reconDiffs = fin.recon.filter((r) => r.diff !== null && Math.abs(r.diff) >= 0.01);
  const v = (n: number | null | undefined) => (n === null || n === undefined ? '–' : km(n));

  return (
    <div className="my-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--line)] text-xs">
        <span>
          <b>Izvor:</b> {fin.usingUploads ? 'učitani bilansi' : 'verifikovani bruto bilansi'} · IDSS do {fin.idss?.periodTo ?? '–'} · IMH do {fin.imh?.periodTo ?? '–'}
          {fin.idssCustomersDoc && fin.idssCustomersDoc.periodTo !== fin.idss?.periodTo ? ` · kupci IDSS do ${fin.idssCustomersDoc.periodTo}` : ''}
        </span>
        <button onClick={onOpenHarmonization} className="tool-btn text-xs">
          <Upload className="w-3.5 h-3.5" /> Učitaj novije bilanse
        </button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Pozicija iz knjiga</th>
              <th scope="col">IDSS</th>
              <th scope="col">IMH</th>
              <th scope="col">Grupa</th>
              <th scope="col">Napomena</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.key}>
                <td>{r.label}</td>
                <td>{v(fin.idss?.[r.key] as number | null)}</td>
                <td>{v(fin.imh?.[r.key] as number | null)}</td>
                <td><b>{r.group && g ? v((g as any)[r.group]) : ''}</b></td>
                <td className="text-[11px] text-[var(--muted)]">{r.note ?? ''}</td>
              </tr>
            ))}
            <tr>
              <td><b>Normalizovani rezultat grupe</b></td>
              <td />
              <td />
              <td><b>{v(g?.resultNormalized)}</b></td>
              <td className="text-[11px] text-[var(--muted)]">Bez 100.000 KM prihoda od povezanog lica i neusaglašenih međusobnih faktura; prije amortizacije</td>
            </tr>
          </tbody>
        </table>
      </div>

      {(critical.length > 0 || warnings.length > 0 || reconDiffs.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3 text-xs">
          <div className="p-3 rounded-xl border border-[var(--idss-red)] bg-red-50/20 dark:bg-red-950/20">
            <span className="eyebrow text-[var(--idss-red)] block mb-1 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Forenzičke kontrole
            </span>
            <ul className="m-0 p-0 list-none space-y-1">
              {critical.map((i, k) => (
                <li key={`c${k}`}>• <b>{i.entity}:</b> {i.text}</li>
              ))}
              {warnings.map((i, k) => (
                <li key={`w${k}`} className="text-[var(--muted)]">• {i.entity}: {i.text}</li>
              ))}
            </ul>
          </div>
          <div className="p-3 rounded-xl border border-amber-400 bg-amber-50/20 dark:bg-amber-950/20">
            <span className="eyebrow text-amber-700 dark:text-amber-300 block mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Neusaglašeno između IDSS i IMH
            </span>
            {reconDiffs.length === 0 ? (
              <p className="m-0">Međusobna salda su usaglašena.</p>
            ) : (
              <ul className="m-0 p-0 list-none space-y-1">
                {reconDiffs.map((r) => (
                  <li key={r.label}>
                    • {r.label}: IDSS {v(r.idss)}, IMH {v(r.imh)} → <b>razlika {km(r.diff, 2)}</b>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
