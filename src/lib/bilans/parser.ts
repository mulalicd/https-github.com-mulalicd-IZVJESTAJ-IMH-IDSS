// Parser za "Bilanca analitike" (bruto bilans / kartice) iz knjigovodstvenog programa IDSS-a i IMH-a.
// Čista logika bez zavisnosti: radi i u pregledniku i u Node testu.

export type EntityCode = 'IDSS' | 'IMH';

export interface TextItem {
  str: string;
  x: number;
  y: number;
  page: number;
}

export interface LedgerAccount {
  konto: string;        // npr. "2112", "20", "2112-139"
  base: string;         // sintetički dio konta ("2112")
  sub: string | null;   // analitički broj partnera ("139") ili null
  name: string;
  d: number;            // duguje
  p: number;            // potražuje
  saldo: number;        // d - p (pozitivno = dugovni saldo)
}

export interface Ledger {
  entity: EntityCode | null;
  entityName: string;
  jib: string | null;
  periodFrom: string | null;  // DD.MM.YYYY
  periodTo: string | null;
  printedAt: string | null;
  accounts: LedgerAccount[];
  totals: { d: number; p: number; saldoD: number; saldoP: number } | null;
  fileName: string;
  kind: 'bruto-bilans' | 'kartica';
}

export const JIB: Record<EntityCode, string> = {
  IDSS: '4202220420007',
  IMH: '4201731140006',
};

const AMOUNT_RE = /-?\d{1,3}(?:\.\d{3})*,\d{2}/g;
const KONTO_RE = /^(\d{1,7})\s?(?:-\s*(\d+))?\s+(.+)$/;

export function parseAmount(s: string): number {
  return Number(s.replace(/\./g, '').replace(',', '.'));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Grupiše tekstualne elemente PDF-a u redove (po stranici i y-koordinati). */
export function groupTextItems(items: TextItem[], tolerance = 2.5): string[] {
  const sorted = [...items].filter((i) => i.str.trim() !== '').sort((a, b) => a.page - b.page || b.y - a.y || a.x - b.x);
  const lines: { page: number; y: number; parts: TextItem[] }[] = [];
  for (const it of sorted) {
    const last = lines[lines.length - 1];
    if (last && last.page === it.page && Math.abs(last.y - it.y) <= tolerance) {
      last.parts.push(it);
    } else {
      lines.push({ page: it.page, y: it.y, parts: [it] });
    }
  }
  return lines.map((l) =>
    l.parts
      .sort((a, b) => a.x - b.x)
      .map((p) => p.str)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

const HEADER_NOISE = [/^Konto Naziv konta/i, /Štampano .* Stranica/i, /^\(4D\)/];

/** Parsira redove teksta u strukturu bilansa. */
export function parseLedgerLines(lines: string[], fileName = ''): Ledger {
  let entityName = '';
  let jib: string | null = null;
  let periodFrom: string | null = null;
  let periodTo: string | null = null;
  let printedAt: string | null = null;
  const accounts: LedgerAccount[] = [];
  let totals: Ledger['totals'] = null;

  let headerDone = false;
  const headerNameParts: string[] = [];
  let cur: { konto: string; base: string; sub: string | null; nameParts: string[]; amounts: number[] } | null = null;

  const flush = () => {
    if (!cur) return;
    if (cur.amounts.length >= 2) {
      const d = cur.amounts[0];
      const p = cur.amounts[1];
      accounts.push({
        konto: cur.konto,
        base: cur.base,
        sub: cur.sub,
        name: cur.nameParts.join(' ').replace(/\s+/g, ' ').trim(),
        d,
        p,
        saldo: round2(d - p),
      });
    }
    cur = null;
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+/g, ' ').trim();
    if (!line) continue;

    const per = line.match(/za period od\s*(\d{1,2}\.\s?\d{1,2}\.\s?\d{4})\s*do\s*(\d{1,2}\.\s?\d{1,2}\.\s?\d{4})/i);
    if (per) {
      periodFrom = periodFrom ?? per[1].replace(/\s/g, '');
      periodTo = periodTo ?? per[2].replace(/\s/g, '');
      headerDone = true;
      continue;
    }
    const pr = line.match(/Štampano\s+(\d{1,2}\.\s?\d{1,2}\.\s?\d{4})/i);
    if (pr) printedAt = printedAt ?? pr[1].replace(/\s/g, '');
    if (HEADER_NOISE.some((r) => r.test(line))) continue;
    if (/^\d{13}$/.test(line)) {
      jib = jib ?? line;
      continue;
    }

    if (!headerDone) {
      headerNameParts.push(line);
      continue;
    }

    // Ponovljeno zaglavlje stranice (naziv, adresa, JIB) – preskoči
    if (headerNameParts.includes(line)) continue;

    const m = line.match(KONTO_RE);
    const amountsInLine = (line.match(AMOUNT_RE) || []).map(parseAmount);
    if (m && !/^\d{1,3}(?:\.\d{3})*,\d{2}/.test(line)) {
      flush();
      const base = m[1];
      const sub = m[2] ?? null;
      const rest = m[3];
      const firstAmt = rest.search(/-?\d{1,3}(?:\.\d{3})*,\d{2}/);
      const namePart = firstAmt >= 0 ? rest.slice(0, firstAmt) : rest;
      cur = {
        konto: sub ? `${base}-${sub}` : base,
        base,
        sub,
        nameParts: [namePart.trim()],
        amounts: firstAmt >= 0 ? (rest.slice(firstAmt).match(AMOUNT_RE) || []).map(parseAmount) : [],
      };
      continue;
    }

    if (amountsInLine.length > 0 && line.replace(AMOUNT_RE, '').trim() === '') {
      // Red sa samo iznosima: nastavak tekućeg konta ili završni zbir
      if (cur && cur.amounts.length < 2) {
        cur.amounts.push(...amountsInLine);
      } else if (amountsInLine.length === 4) {
        flush();
        totals = { d: amountsInLine[0], p: amountsInLine[1], saldoD: amountsInLine[2], saldoP: amountsInLine[3] };
      }
      continue;
    }

    // Nastavak naziva konta (može doći i iza reda s iznosima)
    if (cur) {
      const firstAmt = line.search(/-?\d{1,3}(?:\.\d{3})*,\d{2}/);
      if (firstAmt >= 0 && cur.amounts.length < 2) {
        cur.nameParts.push(line.slice(0, firstAmt).trim());
        cur.amounts.push(...(line.slice(firstAmt).match(AMOUNT_RE) || []).map(parseAmount));
      } else if (firstAmt < 0) {
        cur.nameParts.push(line);
      }
    }
  }
  flush();

  entityName = headerNameParts.join(' ').replace(/\s+/g, ' ').trim();
  let entity: EntityCode | null = null;
  if (jib === JIB.IDSS) entity = 'IDSS';
  else if (jib === JIB.IMH) entity = 'IMH';
  else if (/montessori/i.test(entityName)) entity = 'IMH';
  else if (/I\s?D\s?S\s?S|deutsche/i.test(entityName)) entity = 'IDSS';

  const classes = new Set(accounts.filter((a) => !a.sub && a.base.length === 1).map((a) => a.base));
  const kind: Ledger['kind'] = classes.has('5') && classes.has('6') && classes.has('4') ? 'bruto-bilans' : 'kartica';

  return { entity, entityName, jib, periodFrom, periodTo, printedAt, accounts, totals, fileName, kind };
}

// ---------------------------------------------------------------- Kontrole integriteta

export interface IntegrityIssue {
  severity: 'kritično' | 'upozorenje' | 'info';
  text: string;
  amount?: number;
}

function find(ledger: Ledger, konto: string): LedgerAccount | undefined {
  return ledger.accounts.find((a) => a.konto === konto);
}

/** Saldo konta: tačan sintetički red ako postoji, inače zbir analitike koja počinje tim kodom. */
export function saldoOf(ledger: Ledger, code: string): number {
  const exact = find(ledger, code);
  if (exact) return exact.saldo;
  const leaves = ledger.accounts.filter((a) => a.base.startsWith(code) && isLeaf(ledger, a));
  return round2(leaves.reduce((s, a) => s + a.saldo, 0));
}

export function sumOf(ledger: Ledger, code: string): { d: number; p: number } {
  const exact = find(ledger, code);
  if (exact) return { d: exact.d, p: exact.p };
  const leaves = ledger.accounts.filter((a) => a.base.startsWith(code) && isLeaf(ledger, a));
  return { d: round2(leaves.reduce((s, a) => s + a.d, 0)), p: round2(leaves.reduce((s, a) => s + a.p, 0)) };
}

/** Nadređeni konto: kontni plan je hijerarhijski samo do 3 cifre; konta od 4+ cifara su analitička. */
function computeParent(byBase: Map<string, LedgerAccount>, acc: LedgerAccount): LedgerAccount | undefined {
  if (acc.sub) {
    const own = byBase.get(acc.base);
    if (own) return own;
  }
  const maxLen = acc.sub ? Math.min(acc.base.length, 3) : Math.min(acc.base.length - 1, 3);
  for (let len = maxLen; len >= 1; len--) {
    const syn = byBase.get(acc.base.slice(0, len));
    if (syn) return syn;
  }
  return undefined;
}

const treeCache = new WeakMap<Ledger, Map<LedgerAccount, LedgerAccount[]>>();

function tree(ledger: Ledger): Map<LedgerAccount, LedgerAccount[]> {
  let t = treeCache.get(ledger);
  if (t) return t;
  const byBase = new Map<string, LedgerAccount>();
  for (const a of ledger.accounts) if (!a.sub && !byBase.has(a.base)) byBase.set(a.base, a);
  t = new Map();
  for (const a of ledger.accounts) t.set(a, []);
  for (const a of ledger.accounts) {
    const par = computeParent(byBase, a);
    if (par && par !== a) t.get(par)!.push(a);
  }
  treeCache.set(ledger, t);
  return t;
}

function children(ledger: Ledger, acc: LedgerAccount): LedgerAccount[] {
  return tree(ledger).get(acc) ?? [];
}

function isLeaf(ledger: Ledger, acc: LedgerAccount): boolean {
  return children(ledger, acc).length === 0;
}

export function checkIntegrity(ledger: Ledger): IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  if (!ledger.entity) issues.push({ severity: 'kritično', text: 'Ustanova nije prepoznata (JIB nije IDSS ni IMH).' });
  if (!ledger.periodTo) issues.push({ severity: 'upozorenje', text: 'Period izvještaja nije pronađen u zaglavlju.' });
  if (ledger.accounts.length === 0) issues.push({ severity: 'kritično', text: 'Nijedan konto nije pročitan iz dokumenta.' });

  if (ledger.totals) {
    const dp = round2(ledger.totals.d - ledger.totals.p);
    const ss = round2(ledger.totals.saldoD - ledger.totals.saldoP);
    if (ledger.kind === 'bruto-bilans') {
      if (Math.abs(dp) >= 0.01) issues.push({ severity: 'kritično', text: `Bilans nije u ravnoteži: ukupno duguje − potražuje = ${fmt(dp)} KM.`, amount: dp });
      if (Math.abs(ss) >= 0.01) issues.push({ severity: 'kritično', text: `Salda nisu u ravnoteži: dugovna − potražna salda = ${fmt(ss)} KM.`, amount: ss });
    }
    const classSum = ledger.accounts.filter((a) => !a.sub && a.base.length === 1);
    if (classSum.length) {
      const sd = round2(classSum.reduce((s, a) => s + a.d, 0));
      const sp = round2(classSum.reduce((s, a) => s + a.p, 0));
      if (Math.abs(sd - ledger.totals.d) >= 0.01 || Math.abs(sp - ledger.totals.p) >= 0.01) {
        issues.push({ severity: 'upozorenje', text: `Zbir klasa (D ${fmt(sd)} / P ${fmt(sp)}) razlikuje se od završnog reda (D ${fmt(ledger.totals.d)} / P ${fmt(ledger.totals.p)}).` });
      }
    }
  } else {
    issues.push({ severity: 'upozorenje', text: 'Završni red sa ukupnim iznosima nije pronađen.' });
  }

  // Sintetički konto = zbir podređenih
  for (const acc of ledger.accounts) {
    const ch = children(ledger, acc);
    if (!ch.length) continue;
    const d = round2(ch.reduce((s, a) => s + a.d, 0));
    const p = round2(ch.reduce((s, a) => s + a.p, 0));
    const diff = round2(d - acc.d) || round2(p - acc.p);
    if (Math.abs(round2(d - acc.d)) >= 0.01 || Math.abs(round2(p - acc.p)) >= 0.01) {
      issues.push({
        severity: 'kritično',
        text: `Konto ${acc.konto} (${acc.name}) ne odgovara zbiru analitike: D ${fmt(acc.d)} vs ${fmt(d)}, P ${fmt(acc.p)} vs ${fmt(p)}.`,
        amount: diff,
      });
    }
  }

  // Prelazni konti moraju biti zatvoreni
  for (const acc of ledger.accounts) {
    if (/prelazn/i.test(acc.name) && Math.abs(acc.saldo) >= 1) {
      issues.push({ severity: 'upozorenje', text: `Prelazni konto ${acc.konto} (${acc.name}) nije zatvoren: saldo ${fmt(acc.saldo)} KM.`, amount: acc.saldo });
    }
  }
  // Konta bez naziva partnera
  for (const acc of ledger.accounts) {
    if (acc.sub && (acc.name === '' || acc.name === '-') && Math.abs(acc.saldo) >= 1) {
      issues.push({ severity: 'upozorenje', text: `Analitički konto ${acc.konto} nema naziv partnera (saldo ${fmt(acc.saldo)} KM).`, amount: acc.saldo });
    }
  }
  return issues;
}

/** Format broja po bosanskom standardu (1.234.567,89), neovisno o jeziku preglednika. */
export function formatBs(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return '–';
  const neg = n < 0;
  const fixed = Math.abs(n).toFixed(digits);
  const [int, dec] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const out = dec ? `${grouped},${dec}` : grouped;
  return neg && Number(fixed) !== 0 ? `−${out}` : out;
}

export function fmt(n: number): string {
  return formatBs(n, 2);
}

// ---------------------------------------------------------------- Ključni pokazatelji

export interface LedgerMetrics {
  entity: EntityCode;
  periodTo: string | null;
  months: number | null;
  cash: number;
  cashInTransit: number;
  receivablesCustomers: number;
  customersDebit: number;
  customersCredit: number;
  receivablesEmployees: number;
  loansToIndividuals: number;
  loansToRelated: number;
  equity: number | null;
  bankLoans: number;
  overdraft: number;
  otherLoans: number;
  leasing: number;
  externalDebt: number;
  deposits: number;
  netSalariesPayable: number;
  publicAgreements: number;
  publicCurrent: number;
  revenue: number | null;
  revenueRelated: number;
  expenses: number | null;
  result: number | null;
  labor: number | null;
  contractsWork: number | null;
  rent: number | null;
  interest: number | null;
  latePaymentInterest: number | null;
  amortization: number | null;
  ministrySubsidies: number | null;
}

function monthsBetween(from: string | null, to: string | null): number | null {
  if (!from || !to) return null;
  const [d1, m1, y1] = from.split('.').map(Number);
  const [d2, m2, y2] = to.split('.').map(Number);
  const start = new Date(y1, m1 - 1, d1).getTime();
  const end = new Date(y2, m2 - 1, d2).getTime();
  return Math.round(((end - start) / 86400000 + 1) / 30.4375 * 10) / 10;
}

const PUBLIC_RE = /^(45[1-2]|46[7-8]|460|48)/;

export function computeMetrics(ledger: Ledger): LedgerMetrics | null {
  if (!ledger.entity) return null;
  const L = ledger;
  const has = (code: string) => L.accounts.some((a) => a.base.startsWith(code));
  const s = (code: string) => saldoOf(L, code);
  const credit = (code: string) => round2(-s(code));

  const transit = L.accounts
    .filter((a) => !a.sub && a.base.startsWith('20') && /prelazn/i.test(a.name) && isLeaf(L, a))
    .reduce((acc, a) => acc + a.saldo, 0);
  const customers = L.accounts.filter((a) => a.sub && a.base.startsWith('211'));
  const publicLeaves = L.accounts.filter((a) => !a.sub && PUBLIC_RE.test(a.base) && isLeaf(L, a));
  const agreements = publicLeaves.filter((a) => /sporazum/i.test(a.name)).reduce((acc, a) => acc - a.saldo, 0);
  const publicAll = publicLeaves.reduce((acc, a) => acc - a.saldo, 0);
  const amort = has('54') ? s('54') : 0;

  const revenue = has('6') ? credit('6') : null;
  const expenses = has('5') ? s('5') : null;
  const revenueRelated = L.accounts.filter((a) => !a.sub && a.base.startsWith('6') && /povezan/i.test(a.name) && !/nepovezan/i.test(a.name) && isLeaf(L, a)).reduce((acc, a) => acc - a.saldo, 0);

  const bankLoans = credit('413');
  const overdraft = credit('424');
  const otherLoans = credit('422');
  const leasing = credit('415');

  return {
    entity: L.entity!,
    periodTo: L.periodTo,
    months: monthsBetween(L.periodFrom, L.periodTo),
    cash: s('20'),
    cashInTransit: round2(transit),
    receivablesCustomers: s('211'),
    customersDebit: round2(customers.filter((a) => a.saldo > 0).reduce((acc, a) => acc + a.saldo, 0)),
    customersCredit: round2(-customers.filter((a) => a.saldo < 0).reduce((acc, a) => acc + a.saldo, 0)),
    receivablesEmployees: s('232'),
    loansToIndividuals: round2(s('240210') + s('240211')),
    loansToRelated: s('24020'),
    equity: has('3') ? credit('3') : null,
    bankLoans,
    overdraft,
    otherLoans,
    leasing,
    externalDebt: round2(bankLoans + overdraft + otherLoans),
    deposits: credit('430'),
    netSalariesPayable: credit('4500'),
    publicAgreements: round2(agreements),
    publicCurrent: round2(publicAll - agreements),
    revenue,
    revenueRelated: round2(revenueRelated),
    expenses,
    result: revenue !== null && expenses !== null ? round2(revenue - expenses) : null,
    labor: has('52') ? s('52') : null,
    contractsWork: has('5291') ? s('5291') : null,
    rent: has('5330') ? s('5330') : null,
    interest: has('561') ? s('561') : null,
    latePaymentInterest: has('5616') ? s('5616') : null,
    amortization: has('5') ? amort : null,
    ministrySubsidies: L.entity === 'IMH' && has('238800') ? sumOf(L, '238800').d : null,
  };
}

// ---------------------------------------------------------------- Usaglašavanje IDSS ↔ IMH

export interface ReconLine {
  label: string;
  idss: number | null;
  imh: number | null;
  diff: number | null;
  note: string;
}

function partner(ledger: Ledger, base: string, re: RegExp): LedgerAccount | undefined {
  return ledger.accounts.find((a) => a.sub && a.base === base && re.test(a.name));
}

export function reconcile(idss: Ledger, imh: Ledger): ReconLine[] {
  const IMH_RE = /montessori/i;
  const IDSS_RE = /deutsche/i;
  const lines: ReconLine[] = [];
  const r = (n: number | undefined | null) => (n === undefined || n === null ? null : round2(n));

  // Fakture IMH -> IDSS (zajednički troškovi)
  const imhCust = partner(imh, '2112', IDSS_RE);
  const idssSupp = partner(idss, '4320', IMH_RE);
  lines.push({
    label: 'Fakture IMH → IDSS (zajednički troškovi): fakturisano',
    imh: r(imhCust?.d),
    idss: r(idssSupp?.p),
    diff: imhCust && idssSupp ? round2(imhCust.d - idssSupp.p) : null,
    note: 'IMH kupac IDSS (duguje) vs IDSS dobavljač IMH (potražuje)',
  });
  lines.push({
    label: 'Fakture IMH → IDSS: plaćeno',
    imh: r(imhCust?.p),
    idss: r(idssSupp?.d),
    diff: imhCust && idssSupp ? round2(imhCust.p - idssSupp.d) : null,
    note: 'IMH naplaćeno vs IDSS plaćeno',
  });

  // Fakture IDSS -> IMH (kredit MF Banke)
  const idssCust = partner(idss, '2112', IMH_RE);
  const imhSupp = partner(imh, '4320', IDSS_RE);
  lines.push({
    label: 'Fakture IDSS → IMH (kredit MF Banke): fakturisano',
    idss: r(idssCust?.d),
    imh: r(imhSupp?.p),
    diff: idssCust && imhSupp ? round2(idssCust.d - imhSupp.p) : null,
    note: 'IDSS kupac IMH vs IMH dobavljač IDSS',
  });
  lines.push({
    label: 'Fakture IDSS → IMH: plaćeno',
    idss: r(idssCust?.p),
    imh: r(imhSupp?.d),
    diff: idssCust && imhSupp ? round2(idssCust.p - imhSupp.d) : null,
    note: 'IDSS naplaćeno vs IMH plaćeno',
  });

  // Međusobni zajmovi
  const idssLoanGiven = saldoOf(idss, '24020');
  const imhOtherIdss = imh.accounts.find((a) => !a.sub && /prema IDSS/i.test(a.name));
  lines.push({
    label: 'Zajam IDSS → IMH',
    idss: r(idssLoanGiven),
    imh: imhOtherIdss ? r(-imhOtherIdss.saldo) : null,
    diff: imhOtherIdss ? round2(idssLoanGiven + imhOtherIdss.saldo) : null,
    note: 'IDSS 24020 vs IMH obaveze prema IDSS',
  });
  const imhLoanGiven = saldoOf(imh, '24020');
  const idssLoanFromImh = idss.accounts.find((a) => !a.sub && a.base.startsWith('422') && /IMH|montessori/i.test(a.name));
  lines.push({
    label: 'Zajam IMH → IDSS',
    imh: r(imhLoanGiven),
    idss: idssLoanFromImh ? r(-idssLoanFromImh.saldo) : null,
    diff: idssLoanFromImh ? round2(imhLoanGiven + idssLoanFromImh.saldo) : null,
    note: 'IMH 24020 vs IDSS krediti od IMH',
  });
  const advance = idss.accounts.find((a) => !a.sub && /avans/i.test(a.name) && /IMH/i.test(a.name));
  lines.push({
    label: 'Avans IDSS-a IMH-u (knjige)',
    idss: advance ? r(advance.saldo) : null,
    imh: null,
    diff: advance ? round2(advance.saldo) : null,
    note: 'Nema protustavke u IMH-u',
  });
  return lines;
}

// ---------------------------------------------------------------- Sažetak (bez imena fizičkih lica)

export interface CustomerSummary {
  count: number;
  debtors: number;
  creditors: number;
  debitTotal: number;
  creditTotal: number;
  net: number;
  noPayment: { code: string; saldo: number }[];
  largest: { code: string; saldo: number }[];
}

export interface LedgerSummary {
  id: string;
  entity: EntityCode | null;
  entityName: string;
  jib: string | null;
  periodFrom: string | null;
  periodTo: string | null;
  printedAt: string | null;
  fileName: string;
  kind: Ledger['kind'];
  accountsCount: number;
  totals: Ledger['totals'];
  issues: IntegrityIssue[];
  metrics: LedgerMetrics | null;
  customers: CustomerSummary | null;
}

export function summarizeCustomers(ledger: Ledger): CustomerSummary | null {
  const c = ledger.accounts.filter((a) => a.sub && a.base.startsWith('211') && !/montessori|deutsche/i.test(a.name));
  if (!c.length) return null;
  const debit = c.filter((a) => a.saldo > 0.005);
  const credit = c.filter((a) => a.saldo < -0.005);
  return {
    count: c.length,
    debtors: debit.length,
    creditors: credit.length,
    debitTotal: round2(debit.reduce((s, a) => s + a.saldo, 0)),
    creditTotal: round2(-credit.reduce((s, a) => s + a.saldo, 0)),
    net: round2(c.reduce((s, a) => s + a.saldo, 0)),
    noPayment: c.filter((a) => a.p === 0 && a.saldo > 0.005).map((a) => ({ code: a.konto, saldo: a.saldo })).sort((x, y) => y.saldo - x.saldo),
    largest: [...debit].sort((x, y) => y.saldo - x.saldo).slice(0, 10).map((a) => ({ code: a.konto, saldo: a.saldo })),
  };
}

export function ledgerId(l: { entity: EntityCode | null; kind: string; periodTo: string | null; fileName: string }): string {
  return `${l.entity ?? 'NEPOZNATO'}|${l.kind}|${l.periodTo ?? ''}|${l.fileName}`;
}

export function summarizeLedger(ledger: Ledger): LedgerSummary {
  return {
    id: ledgerId(ledger),
    entity: ledger.entity,
    entityName: ledger.entityName,
    jib: ledger.jib,
    periodFrom: ledger.periodFrom,
    periodTo: ledger.periodTo,
    printedAt: ledger.printedAt,
    fileName: ledger.fileName,
    kind: ledger.kind,
    accountsCount: ledger.accounts.length,
    totals: ledger.totals,
    issues: checkIntegrity(ledger),
    metrics: computeMetrics(ledger),
    customers: summarizeCustomers(ledger),
  };
}

/** Datum DD.MM.YYYY -> broj za poređenje. */
export function dateKey(d: string | null): number {
  if (!d) return 0;
  const [dd, mm, yy] = d.split('.').map(Number);
  return yy * 10000 + mm * 100 + dd;
}

// ---------------------------------------------------------------- Konsolidovani pogled

export interface GroupMetrics {
  periodTo: string | null;
  cash: number;
  cashInTransit: number;
  bankCash: number;
  externalDebt: number;
  externalDebtWithLeasing: number;
  leasing: number;
  equity: number | null;
  receivablesFounder: number;
  publicAgreements: number;
  publicCurrent: number;
  netSalariesPayable: number;
  deposits: number;
  resultBooks: number | null;
  intercompanyRevenue: number;
  resultNormalized: number | null;
  revenueExternal: number | null;
  labor: number | null;
  months: number | null;
}

export function groupMetrics(idss: LedgerMetrics | null, imh: LedgerMetrics | null, recon: ReconLine[]): GroupMetrics | null {
  if (!idss || !imh) return null;
  const icLoanImhToIdss = recon.find((r) => r.label.startsWith('Zajam IMH'))?.idss ?? 0;
  const icInvoiceDiff = recon.find((r) => r.label.startsWith('Fakture IMH → IDSS (zajednički'))?.diff ?? 0;
  const icShared = recon.find((r) => r.label.startsWith('Fakture IMH → IDSS (zajednički'))?.imh ?? 0;
  const ic100 = idss.revenueRelated;
  const resultBooks = idss.result !== null && imh.result !== null ? round2(idss.result + imh.result) : null;
  const externalDebt = round2(idss.externalDebt + imh.externalDebt - (icLoanImhToIdss ?? 0));
  return {
    periodTo: dateKey(idss.periodTo) <= dateKey(imh.periodTo) ? idss.periodTo : imh.periodTo,
    cash: round2(idss.cash + imh.cash),
    cashInTransit: round2(idss.cashInTransit + imh.cashInTransit),
    bankCash: round2(idss.cash + imh.cash - idss.cashInTransit - imh.cashInTransit),
    externalDebt,
    externalDebtWithLeasing: round2(externalDebt + idss.leasing + imh.leasing),
    leasing: round2(idss.leasing + imh.leasing),
    equity: idss.equity !== null && imh.equity !== null ? round2(idss.equity + imh.equity) : null,
    receivablesFounder: round2(imh.receivablesEmployees + imh.loansToIndividuals + idss.loansToIndividuals),
    publicAgreements: round2(idss.publicAgreements + imh.publicAgreements),
    publicCurrent: round2(idss.publicCurrent + imh.publicCurrent),
    netSalariesPayable: round2(idss.netSalariesPayable + imh.netSalariesPayable),
    deposits: round2(idss.deposits + imh.deposits),
    resultBooks,
    intercompanyRevenue: round2(ic100 + (icShared ?? 0)),
    resultNormalized: resultBooks !== null ? round2(resultBooks - ic100 - (icInvoiceDiff ?? 0)) : null,
    revenueExternal: idss.revenue !== null && imh.revenue !== null ? round2(idss.revenue + imh.revenue - ic100 - (icShared ?? 0)) : null,
    labor: idss.labor !== null && imh.labor !== null ? round2(idss.labor + imh.labor) : null,
    months: idss.months,
  };
}
