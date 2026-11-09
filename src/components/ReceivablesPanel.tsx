import React, { useMemo, useState } from 'react';
import { Users, Lock } from 'lucide-react';
import { useFinancials, km } from '../lib/bilans/store';
import { dateKey, type EntityCode } from '../lib/bilans/parser';

/**
 * Stanje potraživanja od kupaca (roditelja) iz aktivnih bilansa/kartica.
 * Imena partnera prikazuju se samo iz dokumenata koje je korisnik sam učitao (lokalno u pregledniku);
 * verifikovano stanje u javnoj aplikaciji sadrži samo šifre konta i zbirove.
 */
export const ReceivablesPanel: React.FC = () => {
  const fin = useFinancials();
  const [entity, setEntity] = useState<EntityCode>('IDSS');

  const summaryDoc = useMemo(() => {
    const docs = fin.documents.filter((d) => d.entity === entity && d.customers);
    return docs.sort((a, b) => dateKey(b.periodTo) - dateKey(a.periodTo))[0] ?? null;
  }, [fin.documents, entity]);

  const uploaded = useMemo(() => {
    const ls = fin.uploadedLedgers.filter((l) => l.entity === entity && l.accounts.some((a) => a.sub && a.base.startsWith('211')));
    return ls.sort((a, b) => dateKey(b.periodTo) - dateKey(a.periodTo))[0] ?? null;
  }, [fin.uploadedLedgers, entity]);

  const detailed = uploaded && summaryDoc && uploaded.periodTo === summaryDoc.periodTo
    ? uploaded.accounts
        .filter((a) => a.sub && a.base.startsWith('211') && !/montessori|deutsche/i.test(a.name) && Math.abs(a.saldo) >= 0.01)
        .sort((x, y) => y.saldo - x.saldo)
    : null;

  const c = summaryDoc?.customers;

  return (
    <div className="mb-8 p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-alt)]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]" />
          <h3 className="m-0 text-base font-black text-[var(--ink)]">Stanje potraživanja od kupaca (roditelja)</h3>
        </div>
        <div className="flex gap-1.5">
          {(['IDSS', 'IMH'] as const).map((e) => (
            <button key={e} onClick={() => setEntity(e)} className={`px-3 py-1 rounded-lg text-xs font-bold ${entity === e ? 'bg-[var(--idss-blue)] text-white' : 'border border-[var(--line)]'}`}>
              {e}
            </button>
          ))}
        </div>
      </div>

      {!c ? (
        <p className="text-xs text-[var(--muted)] m-0">Nema podataka o kupcima za {entity}. Učitajte bruto bilans ili karticu kupaca u harmonizacijskom sistemu.</p>
      ) : (
        <>
          <p className="text-xs text-[var(--muted)] mt-0">
            Izvor: {summaryDoc!.kind === 'kartica' ? 'kartica kupaca' : 'bruto bilans'} do {summaryDoc!.periodTo} ({summaryDoc!.source === 'učitano' ? 'učitano' : 'verifikovano'}).
            Kupci iz grupe (IDSS/IMH) nisu uključeni.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs my-3">
            <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--line)]"><span className="block text-[var(--muted)]">Partnera</span><b>{c.count}</b></div>
            <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--line)]"><span className="block text-[var(--muted)]">Duguje ({c.debtors})</span><b className="text-[var(--idss-red)]">{km(c.debitTotal, 2)}</b></div>
            <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--line)]"><span className="block text-[var(--muted)]">Pretplata ({c.creditors})</span><b className="text-[var(--imh-green)]">{km(c.creditTotal, 2)}</b></div>
            <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--line)]"><span className="block text-[var(--muted)]">Neto potraživanje</span><b>{km(c.net, 2)}</b></div>
            <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--line)]"><span className="block text-[var(--muted)]">Bez ijedne uplate</span><b>{c.noPayment.length} · {km(c.noPayment.reduce((s, x) => s + x.saldo, 0), 2)}</b></div>
          </div>

          {detailed ? (
            <div className="table-wrap max-h-[360px] overflow-y-auto">
              <table className="data-table">
                <thead>
                  <tr><th>Konto</th><th>Partner (iz vašeg učitanog dokumenta)</th><th>Duguje</th><th>Potražuje</th><th>Saldo</th></tr>
                </thead>
                <tbody>
                  {detailed.map((a) => (
                    <tr key={a.konto}>
                      <td>{a.konto}</td>
                      <td>{a.name}{a.p === 0 && a.saldo > 0 ? ' · bez uplate' : ''}</td>
                      <td>{km(a.d, 2)}</td>
                      <td>{km(a.p, 2)}</td>
                      <td className={a.saldo > 0 ? 'text-[var(--idss-red)] font-bold' : 'text-[var(--imh-green)] font-bold'}>{km(a.saldo, 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr><th>Najveća dugovanja (šifra konta)</th><th>Saldo</th></tr>
                  </thead>
                  <tbody>
                    {c.largest.map((x) => (
                      <tr key={x.code}><td>{x.code}{c.noPayment.some((n) => n.code === x.code) ? ' · bez ijedne uplate' : ''}</td><td className="font-bold">{km(x.saldo, 2)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-[var(--muted)] flex items-center gap-1.5 mb-0">
                <Lock className="w-3 h-3" /> Imena roditelja i djece ne objavljuju se. Učitajte karticu kupaca da biste u svom pregledniku vidjeli stanje po partneru.
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
};
