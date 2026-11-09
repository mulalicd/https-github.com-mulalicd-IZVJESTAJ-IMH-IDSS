// Centralni izvor finansijskih podataka za cijelu aplikaciju.
// Početno stanje = verifikovani bilansi na 31.10.2026. (BASELINE). Učitani bilansi ga zamjenjuju.
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { BASELINE } from './baseline';
import {
  dateKey,
  formatBs,
  groupMetrics,
  reconcile,
  summarizeLedger,
  type EntityCode,
  type GroupMetrics,
  type Ledger,
  type LedgerMetrics,
  type LedgerSummary,
  type ReconLine,
} from './parser';

const STORAGE_KEY = 'idss-imh-ucitani-bilansi-v1';

export interface FinancialState {
  /** Svi dokumenti: verifikovani (baseline) + učitani */
  documents: (LedgerSummary & { source: 'verifikovano' | 'učitano' })[];
  idss: LedgerMetrics | null;
  imh: LedgerMetrics | null;
  idssDoc: LedgerSummary | null;
  imhDoc: LedgerSummary | null;
  idssCustomersDoc: LedgerSummary | null;
  group: GroupMetrics | null;
  recon: ReconLine[];
  usingUploads: boolean;
  uploadedLedgers: Ledger[];
  addLedgers: (ls: Ledger[]) => void;
  removeLedger: (id: string) => void;
  resetToVerified: () => void;
}

const Ctx = createContext<FinancialState | null>(null);

function loadStored(): Ledger[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStored(ls: Ledger[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ls));
  } catch {
    /* lokalno skladište nije dostupno: podaci vrijede do zatvaranja stranice */
  }
}

function latest(docs: LedgerSummary[], entity: EntityCode, kind: LedgerSummary['kind']): LedgerSummary | null {
  const c = docs.filter((d) => d.entity === entity && d.kind === kind && d.metrics);
  if (!c.length) return null;
  return c.reduce((a, b) => (dateKey(b.periodTo) > dateKey(a.periodTo) ? b : a));
}

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploaded, setUploaded] = useState<Ledger[]>(() => loadStored());

  useEffect(() => saveStored(uploaded), [uploaded]);

  const value = useMemo<FinancialState>(() => {
    const uploadedSummaries = uploaded.map((l) => ({ ...summarizeLedger(l), source: 'učitano' as const }));
    const baselineDocs = BASELINE.documents.map((d) => ({ ...d, source: 'verifikovano' as const }));
    // Učitani dokument iste ustanove, vrste i perioda zamjenjuje verifikovani
    const all = [
      ...uploadedSummaries,
      ...baselineDocs.filter((b) => !uploadedSummaries.some((u) => u.entity === b.entity && u.kind === b.kind && dateKey(u.periodTo) >= dateKey(b.periodTo))),
    ];

    const idssDoc = latest(all, 'IDSS', 'bruto-bilans');
    const imhDoc = latest(all, 'IMH', 'bruto-bilans');
    const idssCust = latest(all, 'IDSS', 'kartica');

    let idss = idssDoc?.metrics ? { ...idssDoc.metrics } : null;
    // Novija kartica kupaca ažurira potraživanja od kupaca
    if (idss && idssCust?.metrics && dateKey(idssCust.periodTo) > dateKey(idssDoc!.periodTo)) {
      idss = {
        ...idss,
        receivablesCustomers: idssCust.metrics.receivablesCustomers,
        customersDebit: idssCust.metrics.customersDebit,
        customersCredit: idssCust.metrics.customersCredit,
      };
    }
    const imh = imhDoc?.metrics ?? null;

    // Usaglašavanje: iz učitanih punih bilansa ako postoje oba, inače verifikovano
    const upIdss = uploaded.filter((l) => l.entity === 'IDSS' && l.kind === 'bruto-bilans').sort((a, b) => dateKey(b.periodTo) - dateKey(a.periodTo))[0];
    const upImh = uploaded.filter((l) => l.entity === 'IMH' && l.kind === 'bruto-bilans').sort((a, b) => dateKey(b.periodTo) - dateKey(a.periodTo))[0];
    const recon = upIdss && upImh ? reconcile(upIdss, upImh) : upIdss || upImh ? [] : BASELINE.recon;

    return {
      documents: all,
      idss,
      imh,
      idssDoc,
      imhDoc,
      idssCustomersDoc: idssCust,
      group: groupMetrics(idss, imh, recon.length ? recon : BASELINE.recon),
      recon,
      usingUploads: uploaded.length > 0,
      uploadedLedgers: uploaded,
      addLedgers: (ls) =>
        setUploaded((prev) => {
          const ids = new Set(ls.map((l) => `${l.entity}|${l.kind}|${l.periodTo}|${l.fileName}`));
          return [...prev.filter((p) => !ids.has(`${p.entity}|${p.kind}|${p.periodTo}|${p.fileName}`)), ...ls];
        }),
      removeLedger: (id) => setUploaded((prev) => prev.filter((p) => `${p.entity ?? 'NEPOZNATO'}|${p.kind}|${p.periodTo ?? ''}|${p.fileName}` !== id)),
      resetToVerified: () => setUploaded([]),
    };
  }, [uploaded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useFinancials(): FinancialState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useFinancials mora biti unutar FinancialProvider');
  return v;
}

export const km = (n: number | null | undefined, digits = 0) =>
  n === null || n === undefined || Number.isNaN(n) ? '–' : `${formatBs(n, digits)} KM`;
