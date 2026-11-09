import React, { useRef, useState } from 'react';
import { X, Upload, FileText, AlertTriangle, CheckCircle2, RotateCcw, Trash2, ShieldAlert, Info, Loader2 } from 'lucide-react';
import { useFinancials, km } from '../lib/bilans/store';
import type { Ledger, LedgerMetrics, IntegrityIssue } from '../lib/bilans/parser';

interface HarmonizationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type FileStatus = { name: string; state: 'obrada' | 'ok' | 'greška'; message: string };

const ROWS: { label: string; key: keyof LedgerMetrics; group?: string; hint?: string }[] = [
  { label: 'Gotovina (klasa 20)', key: 'cash', group: 'cash' },
  { label: '– od toga na prelaznim kontima', key: 'cashInTransit', group: 'cashInTransit' },
  { label: 'Potraživanja od kupaca (211)', key: 'receivablesCustomers' },
  { label: 'Potraživanja od zaposlenih / uprave (232)', key: 'receivablesEmployees' },
  { label: 'Krediti dati fizičkim licima', key: 'loansToIndividuals' },
  { label: 'Kapital (klasa 3)', key: 'equity', group: 'equity' },
  { label: 'Bankarski krediti (413)', key: 'bankLoans' },
  { label: 'Prekoračenja (424)', key: 'overdraft' },
  { label: 'Ostali krediti i zajmovi (422)', key: 'otherLoans' },
  { label: 'Eksterni dug bez leasinga', key: 'externalDebt', group: 'externalDebt' },
  { label: 'Finansijski leasing (415)', key: 'leasing', group: 'leasing' },
  { label: 'Depoziti roditelja (430)', key: 'deposits', group: 'deposits' },
  { label: 'Neisplaćene neto plate (4500)', key: 'netSalariesPayable', group: 'netSalariesPayable' },
  { label: 'Javne obaveze po sporazumima', key: 'publicAgreements', group: 'publicAgreements' },
  { label: 'Ostale javne obaveze (porezi, doprinosi)', key: 'publicCurrent', group: 'publicCurrent' },
  { label: 'Prihodi (klasa 6)', key: 'revenue' },
  { label: '– od toga od povezanog lica', key: 'revenueRelated' },
  { label: 'Rashodi (klasa 5)', key: 'expenses' },
  { label: 'Rezultat po knjigama', key: 'result', group: 'resultBooks' },
  { label: 'Troškovi rada (52)', key: 'labor', group: 'labor' },
  { label: '– ugovori o djelu (5291)', key: 'contractsWork' },
  { label: 'Zakup poslovnog prostora (5330)', key: 'rent' },
  { label: 'Amortizacija (54)', key: 'amortization' },
  { label: 'Subvencije Ministarstva KS (prolazna stavka)', key: 'ministrySubsidies' },
];

const sevOrder: Record<IntegrityIssue['severity'], number> = { kritično: 0, upozorenje: 1, info: 2 };

export const HarmonizationDrawer: React.FC<HarmonizationDrawerProps> = ({ isOpen, onClose }) => {
  const fin = useFinancials();
  const inputRef = useRef<HTMLInputElement>(null);
  const [statuses, setStatuses] = useState<FileStatus[]>([]);
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return;
    setStatuses(list.map((f) => ({ name: f.name, state: 'obrada', message: 'Čitam dokument…' })));
    const { readLedgerPdf } = await import('../lib/bilans/pdf');
    const parsed: Ledger[] = [];
    const next: FileStatus[] = [];
    for (const f of list) {
      if (!/\.pdf$/i.test(f.name)) {
        next.push({ name: f.name, state: 'greška', message: 'Podržan je PDF izvoz „Bilanca analitike” (bruto bilans ili kartica konta).' });
        continue;
      }
      try {
        const l = await readLedgerPdf(f);
        if (!l.entity) {
          next.push({ name: f.name, state: 'greška', message: 'Ustanova nije prepoznata: u zaglavlju nema JIB-a IDSS-a ni IMH-a.' });
          continue;
        }
        if (!l.accounts.length) {
          next.push({ name: f.name, state: 'greška', message: 'U dokumentu nije pronađen nijedan konto. Da li je PDF skeniran (slika)?' });
          continue;
        }
        parsed.push(l);
        next.push({
          name: f.name,
          state: 'ok',
          message: `${l.entity} · ${l.kind === 'bruto-bilans' ? 'bruto bilans' : 'kartica'} · ${l.periodFrom ?? '?'} – ${l.periodTo ?? '?'} · ${l.accounts.length} konta`,
        });
      } catch (e: any) {
        next.push({ name: f.name, state: 'greška', message: `Dokument nije moguće pročitati: ${e?.message ?? e}` });
      }
    }
    if (parsed.length) fin.addLedgers(parsed);
    setStatuses(next);
  };

  const g = fin.group;
  const activeDocs = [fin.idssDoc, fin.imhDoc, fin.idssCustomersDoc].filter(Boolean) as NonNullable<typeof fin.idssDoc>[];
  const issues = activeDocs
    .flatMap((d) => d.issues.map((i) => ({ ...i, entity: d.entity, kind: d.kind })))
    .sort((a, b) => sevOrder[a.severity] - sevOrder[b.severity]);
  const reconRows = fin.recon.length ? fin.recon : [];

  const cell = (v: number | null | undefined) => (v === null || v === undefined ? '–' : km(v, 2));

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="harmonization-drawer p-5 text-sm" role="dialog" aria-label="Modularni harmonizacijski sistem">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--idss-cyan)]" />
            <h3 className="font-bold text-base m-0 text-[var(--ink)]">Modularni harmonizacijski sistem</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition" aria-label="Zatvori">
            <X className="w-5 h-5 text-[var(--muted)]" />
          </button>
        </div>

        {/* Upload */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`my-4 p-5 rounded-xl border-2 border-dashed cursor-pointer text-center transition ${
            dragOver ? 'border-[var(--idss-blue)] bg-[var(--surface-alt)]' : 'border-[var(--line)] hover:border-[var(--idss-blue)]'
          }`}
        >
          <Upload className="w-6 h-6 mx-auto text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]" />
          <p className="font-bold text-[var(--ink)] mt-2 mb-1">Učitajte bruto bilans ili karticu konta (PDF)</p>
          <p className="text-[11px] text-[var(--muted)] m-0">
            IDSS ili IMH, izvoz „Bilanca analitike”. Može više fajlova odjednom. Dokumenti se obrađuju samo u ovom pregledniku i ne šalju se nikamo.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>

        {statuses.length > 0 && (
          <div className="mb-4 space-y-1.5">
            {statuses.map((s) => (
              <div
                key={s.name}
                className={`p-2 rounded-lg border text-[11px] flex items-start gap-2 ${
                  s.state === 'ok' ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30' : s.state === 'greška' ? 'border-red-400 bg-red-50 dark:bg-red-950/30' : 'border-[var(--line)]'
                }`}
              >
                {s.state === 'obrada' ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : s.state === 'ok' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                <div>
                  <b className="text-[var(--ink)]">{s.name}</b>
                  <div className="text-[var(--muted)]">{s.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active sources */}
        <div className="mb-4">
          <span className="side-label block mb-2">Aktivni izvori podataka u izvještaju</span>
          <div className="space-y-1.5">
            {fin.documents.map((d) => {
              const active = activeDocs.some((a) => a.id === d.id);
              return (
                <div key={d.id} className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 ${active ? 'border-[var(--imh-green)] bg-[var(--surface)]' : 'border-[var(--line)] opacity-70'}`}>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="w-3.5 h-3.5 text-[var(--idss-blue)] shrink-0" />
                    <div className="overflow-hidden">
                      <div className="font-bold truncate text-[var(--ink)]">
                        {d.entity} · {d.kind === 'bruto-bilans' ? 'Bruto bilans' : 'Kartica'} · do {d.periodTo}
                      </div>
                      <div className="text-[10px] text-[var(--muted)] truncate">{d.fileName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${d.source === 'učitano' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {d.source === 'učitano' ? 'UČITANO' : 'VERIFIKOVANO'}
                    </span>
                    {active && <span className="text-[10px] font-bold text-[var(--imh-green)]">AKTIVNO</span>}
                    {d.source === 'učitano' && (
                      <button onClick={() => fin.removeLedger(d.id)} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-950" aria-label="Ukloni dokument" title="Ukloni dokument">
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {fin.usingUploads && (
            <button type="button" onClick={fin.resetToVerified} className="tool-btn text-xs mt-2 text-[var(--muted)] hover:text-[var(--idss-red)]">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Vrati na verifikovano stanje (31.10.2026.)</span>
            </button>
          )}
        </div>

        {/* Integrity */}
        <div className="mb-4">
          <span className="side-label block mb-2">Forenzičke kontrole dokumenata</span>
          {issues.length === 0 ? (
            <div className="p-2.5 rounded-lg border border-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Nema nalaza.
            </div>
          ) : (
            <div className="space-y-1.5">
              {issues.map((i, k) => (
                <div key={k} className={`p-2 rounded-lg border text-[11px] flex items-start gap-2 ${i.severity === 'kritično' ? 'border-red-400 bg-red-50 dark:bg-red-950/30' : 'border-amber-400 bg-amber-50 dark:bg-amber-950/30'}`}>
                  {i.severity === 'kritično' ? <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />}
                  <span>
                    <b>{i.entity}</b> {i.kind === 'kartica' ? '(kartica)' : ''}: {i.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="mb-4 overflow-x-auto">
          <span className="side-label block mb-2">Ključne pozicije iz knjiga</span>
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="text-left border-b border-[var(--line)]">
                <th className="py-1 pr-2">Pozicija</th>
                <th className="py-1 px-1 text-right">IDSS<br /><span className="font-normal text-[var(--muted)]">{fin.idss?.periodTo}</span></th>
                <th className="py-1 px-1 text-right">IMH<br /><span className="font-normal text-[var(--muted)]">{fin.imh?.periodTo}</span></th>
                <th className="py-1 pl-1 text-right">Grupa</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.key} className="border-b border-[var(--line)]/50">
                  <td className="py-1 pr-2 text-[var(--ink)]">{r.label}</td>
                  <td className="py-1 px-1 text-right font-mono">{cell(fin.idss?.[r.key] as number | null)}</td>
                  <td className="py-1 px-1 text-right font-mono">{cell(fin.imh?.[r.key] as number | null)}</td>
                  <td className="py-1 pl-1 text-right font-mono font-bold">{r.group && g ? cell((g as any)[r.group]) : ''}</td>
                </tr>
              ))}
              {g && (
                <tr className="border-t-2 border-[var(--ink)]">
                  <td className="py-1 pr-2 font-bold">Normalizovani rezultat grupe (bez 100.000 KM i IC razlike)</td>
                  <td />
                  <td />
                  <td className="py-1 pl-1 text-right font-mono font-bold">{cell(g.resultNormalized)}</td>
                </tr>
              )}
            </tbody>
          </table>
          <p className="text-[10px] text-[var(--muted)] mt-1">
            Grupa: eksterni dug bez međusobnih zajmova; rezultat umanjen za prihod od povezanog lica (100.000 KM) i neusaglašene međusobne fakture. Amortizacija i nedostajuće fakture zakupa nisu uračunate.
          </p>
        </div>

        {/* Reconciliation */}
        <div className="mb-2 overflow-x-auto">
          <span className="side-label block mb-2">Usaglašavanje IDSS ↔ IMH</span>
          {reconRows.length === 0 ? (
            <div className="p-2.5 rounded-lg border border-[var(--line)] text-[11px] flex items-start gap-2">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /> Za usaglašavanje učitajte bruto bilanse obje ustanove za isti period.
            </div>
          ) : (
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="text-left border-b border-[var(--line)]">
                  <th className="py-1 pr-2">Stavka</th>
                  <th className="py-1 px-1 text-right">IDSS</th>
                  <th className="py-1 px-1 text-right">IMH</th>
                  <th className="py-1 pl-1 text-right">Razlika</th>
                </tr>
              </thead>
              <tbody>
                {reconRows.map((r) => (
                  <tr key={r.label} className="border-b border-[var(--line)]/50">
                    <td className="py-1 pr-2">{r.label}</td>
                    <td className="py-1 px-1 text-right font-mono">{cell(r.idss)}</td>
                    <td className="py-1 px-1 text-right font-mono">{cell(r.imh)}</td>
                    <td className={`py-1 pl-1 text-right font-mono font-bold ${r.diff && Math.abs(r.diff) >= 0.01 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {r.diff === null ? '–' : Math.abs(r.diff) < 0.01 ? 'usaglašeno' : km(r.diff, 2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
