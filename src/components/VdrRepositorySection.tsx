import React, { useMemo, useState } from 'react';
import {
  Building2,
  ShieldAlert,
  FileCheck2,
  Scale,
  Users,
  FolderSearch,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Landmark,
  KeyRound,
  Briefcase,
  Search,
  Clock,
} from 'lucide-react';
import {
  VDR_OVERVIEW,
  VDR_READINESS_MATRIX,
  CORPORATE_PROFILES,
  GOVERNANCE_TIMELINE,
  BANK_SIGNATORY_AUDIT,
  VERIFIED_LEASE_OPU_850,
  EXECUTIVE_CONTRACTS_AND_COLLATERAL,
  HR_ROSTER_SUMMARY,
  VDR_DOCUMENT_CATALOG,
  type VdrEntity,
} from '../data/vdrRepositoryData';

type VdrTab = 'registry' | 'controls_lease' | 'contracts_hr' | 'readiness' | 'catalog';

const TABS: Array<{ id: VdrTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'registry', label: 'Ustavni & Registar', icon: Building2 },
  { id: 'controls_lease', label: 'Potpisi & Zakup OPU-850', icon: KeyRound },
  { id: 'contracts_hr', label: 'Ugovori, Zalog & HR (44)', icon: Briefcase },
  { id: 'readiness', label: 'Legal DD Spremnost (A–I)', icon: Scale },
  { id: 'catalog', label: 'Katalog 92 dokumenta', icon: FolderSearch },
];

export const VdrRepositorySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<VdrTab>('registry');
  const [entityFilter, setEntityFilter] = useState<'SVE' | VdrEntity>('SVE');
  const [folderFilter, setFolderFilter] = useState<string>('SVE');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const uniqueFolders = useMemo(() => {
    const set = new Set<string>();
    for (const item of VDR_DOCUMENT_CATALOG) {
      set.add(item.folder);
    }
    return ['SVE', ...Array.from(set)];
  }, []);

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return VDR_DOCUMENT_CATALOG.filter((item) => {
      if (entityFilter !== 'SVE' && item.entity !== entityFilter) return false;
      if (folderFilter !== 'SVE' && item.folder !== folderFilter) return false;
      if (q && !item.name.toLowerCase().includes(q) && !item.folder.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [entityFilter, folderFilter, searchQuery]);

  return (
    <section
      id="dodatak-ustavni-vdr"
      aria-label="USTAVNI i Legal Due Diligence VDR Repozitorij"
      className="my-10 pt-8 border-t-2 border-[var(--idss-blue)]"
    >
      {/* Executive Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <span className="eyebrow text-[var(--idss-blue)] dark:text-[var(--idss-cyan)] font-extrabold block mb-1">
            VERIFIKOVANO [V] · KOMPLETNA REVIZIJA 2-GOOGLE_DISK_VDR REPOZITORIJA
          </span>
          <h2 className="text-xl md:text-2xl font-black text-[var(--ink)] m-0 leading-tight">
            DODATAK A: USTAVNI, KORPORATIVNI &amp; LEGAL DD VDR REPOZITORIJ (IMH + IDSS)
          </h2>
          <p className="text-xs text-[var(--muted)] mt-1.5 mb-0 max-w-3xl leading-relaxed">
            Direktna pravna, statutna i forenzička revizija svih <b>{VDR_OVERVIEW.totalFiles} dokumenata</b> iz
            ovlaštenog Google Drive VDR repozitorija ({VDR_OVERVIEW.imhFiles} IMH · {VDR_OVERVIEW.idssFiles} IDSS ·{' '}
            {VDR_OVERVIEW.groupChecklistFiles} DD kontrolne liste), usklađena s aktivnim bruto bilansima na 31.10.2026.
          </p>
        </div>

        <a
          href={VDR_OVERVIEW.rootDriveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--idss-blue)] hover:bg-[#024c83] dark:bg-[var(--idss-cyan)] dark:text-slate-950 text-white text-xs font-bold shadow-sm transition-colors no-underline shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Otvori izvorni VDR (Google Drive)</span>
        </a>
      </div>

      {/* Top KPI Strip (Clean Numeric Anchors, Zero Pill Clutter) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6 tabular-nums">
        <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
          <div className="text-[11px] font-bold text-[var(--muted)]">Indeksirano VDR fajlova</div>
          <div className="text-xl font-black text-[var(--idss-blue)] dark:text-[var(--idss-cyan)] mt-0.5">
            {VDR_OVERVIEW.totalFiles} / {VDR_OVERVIEW.totalFiles}
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-0.5">
            IMH: {VDR_OVERVIEW.imhFiles} · IDSS: {VDR_OVERVIEW.idssFiles} · DD: {VDR_OVERVIEW.groupChecklistFiles}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/25">
          <div className="text-[11px] font-bold text-rose-700 dark:text-rose-300">KUIP nalog &amp; Uprava IMH</div>
          <div className="text-xl font-black text-rose-800 dark:text-rose-200 mt-0.5">04.11.2026.</div>
          <div className="text-[11px] text-rose-700/90 dark:text-rose-300/90 mt-0.5">
            v.d. Anes Memić · Konkurs 06.11.
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/25">
          <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300">Limit potpisa (Registar)</div>
          <div className="text-xl font-black text-amber-900 dark:text-amber-200 mt-0.5">2.000 KM</div>
          <div className="text-[11px] text-amber-800/90 dark:text-amber-300/90 mt-0.5">
            4/4 bankovna kartona: Neograničeno!
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/25">
          <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">Zakup OPU-IP-850/2023</div>
          <div className="text-xl font-black text-emerald-900 dark:text-emerald-200 mt-0.5">Do 31.08.2033.</div>
          <div className="text-[11px] text-emerald-800/90 dark:text-emerald-300/90 mt-0.5">
            Rok: 10. u mj. · Čl. 9 izvršna isprava
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] col-span-2 lg:col-span-1">
          <div className="text-[11px] font-bold text-[var(--muted)]">Ukupno zaposlenih (5.1)</div>
          <div className="text-xl font-black text-[var(--ink)] mt-0.5">
            {VDR_OVERVIEW.totalWorkforcePositions} pozicija
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-0.5">
            {VDR_OVERVIEW.uniqueIndividuals} osoba (IMH 20 · IDSS 24)
          </div>
        </div>
      </div>

      {/* Segmented Navigation Bar */}
      <div
        role="tablist"
        aria-label="Sekcije VDR repozitorija"
        className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-[var(--surface-alt)] border border-[var(--line)] mb-5"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                active
                  ? 'bg-[var(--idss-blue)] text-white dark:bg-[var(--idss-cyan)] dark:text-slate-950 shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: USTAVNI & KORPORATIVNI REGISTAR */}
      {activeTab === 'registry' && (
        <div className="space-y-5">
          {/* Critical KUIP & Governance Alert Banner */}
          <div className="p-4 rounded-xl border-2 border-rose-500 bg-rose-50/40 dark:bg-rose-950/25 text-xs">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <div className="font-black text-rose-900 dark:text-rose-200 uppercase tracking-wide">
                  KRITIČAN NALAZ IZ VDR-a: KUIP KS INSPEKCIJSKI NALOG (30.09.2026.) &amp; SMJENA UPRAVE IMH (04.11.2026.)
                </div>
                <p className="m-0 text-[var(--ink)] leading-relaxed">
                  Kantonalna uprava za inspekcijske poslove KS (Rješenje <b>UP-1-14-12-34-15117/26-12/07</b> od 30.09.2026.,
                  zaprimljeno 23.10.2026.) naložila je IMH-u rok od <b>30 dana</b> (+3 dana za obavijest) za otklanjanje
                  nepravilnosti u imenovanju direktora po <b>čl. 48 st. 4 i 5 Zakona o predškolskom odgoju KS</b> (traži se
                  VII stepen predškolskog/društvenog/humanističkog smjera + 5 god. radnog iskustva u obrazovanju).
                  Na 3. sjednici UO IMH (<b>Zapisnik br. 179-1/26 od 04.11.2026.</b>), uz pisanu saglasnost osnivačice Lamie Kacile,
                  <b> Davor Mulalić je razriješen funkcije direktora IMH-a</b>, za <b>v.d. direktora imenovan je Anes Memić</b>,
                  a javni konkurs je objavljen 06.11.2026. (rok 8 dana).
                </p>
                <p className="m-0 text-rose-800 dark:text-rose-300 font-semibold">
                  Latentni domino-rizik u IDSS-u: Davor Mulalić ostaje direktor IDSS-a po Menadžerskom ugovoru, ali{' '}
                  <u>Član 30. Osnivačkog akta IDSS-a (OPU-IP: 217/2016)</u> propisuje za direktora IDSS-a uslove nastavnika/pedagoga,
                  min. 3 god. iskustva u nastavi, <b>njemački jezik C1</b> i zvanje mentora!
                </p>
              </div>
            </div>
          </div>

          {/* Side-by-Side IMH vs IDSS Corporate Registry Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {CORPORATE_PROFILES.map((corp) => {
              const isImh = corp.entity === 'IMH';
              return (
                <div
                  key={corp.entity}
                  className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] flex flex-col justify-between space-y-3 text-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--line)]">
                      <div>
                        <span
                          className={`text-[11px] font-black uppercase tracking-wider ${
                            isImh ? 'text-[var(--imh-green)]' : 'text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]'
                          }`}
                        >
                          {corp.entity} · SUDSKI I MINISTARSKI REGISTAR
                        </span>
                        <h3 className="text-sm font-black text-[var(--ink)] m-0 mt-0.5 leading-snug">
                          {corp.fullName}
                        </h3>
                      </div>
                      <span className="font-mono text-[11px] font-bold px-2 py-1 rounded bg-[var(--surface-alt)] border border-[var(--line)] shrink-0">
                        JIB {corp.jib}
                      </span>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-3 mb-0">
                      <div>
                        <dt className="text-[10.5px] font-bold text-[var(--muted)] uppercase">MBS / Kapital</dt>
                        <dd className="m-0 font-semibold text-[var(--ink)] tabular-nums">
                          {corp.mbs} · {corp.capitalKM}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10.5px] font-bold text-[var(--muted)] uppercase">Osnivač (100%)</dt>
                        <dd className="m-0 font-semibold text-[var(--ink)]">{corp.founder}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-[10.5px] font-bold text-[var(--muted)] uppercase">Sjedište</dt>
                        <dd className="m-0 text-[var(--ink)]">{corp.seat}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-[10.5px] font-bold text-[var(--muted)] uppercase">Historijat vlasništva</dt>
                        <dd className="m-0 text-[var(--ink)] leading-relaxed">{corp.ownershipHistory}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-[10.5px] font-bold text-[var(--muted)] uppercase">Upisani zastupnik i ograničenje</dt>
                        <dd className="m-0 text-[var(--ink)] leading-relaxed">
                          <b>{corp.statutoryDirectorRegistered}</b> — {corp.representationLimit}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-[10.5px] font-bold text-[var(--muted)] uppercase">Stvarni status upravljanja</dt>
                        <dd className="m-0 text-[var(--ink)] leading-relaxed">{corp.actualGovernanceStatus}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-[10.5px] font-bold text-[var(--muted)] uppercase">Dozvola Ministarstva KS</dt>
                        <dd className="m-0 text-[var(--ink)] leading-relaxed">
                          <b>{corp.ministryPermitRef}:</b> {corp.ministryPermitNote}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[var(--line)]">
                    <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-[11px] leading-relaxed">
                      <b className="text-amber-900 dark:text-amber-300">Ustavna / Statutna klauzula:</b>{' '}
                      {corp.constitutionalRiskClause}
                    </div>
                    <div className="p-2.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/25 border border-rose-300 dark:border-rose-900 text-[11px] leading-relaxed">
                      <b className="text-rose-800 dark:text-rose-300">{corp.registryExtractRef}:</b>{' '}
                      {corp.registryCurrencyWarning}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Constitutional & Board Governance Timeline */}
          <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]" />
              <h3 className="text-sm font-black text-[var(--ink)] m-0">
                Hronologija ustavnih akata, zapisnika UO i regulatornih prekretnica (2011–2026.)
              </h3>
            </div>
            <div className="space-y-2.5">
              {GOVERNANCE_TIMELINE.map((ev, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-start gap-2.5 ${
                    ev.severity === 'critical'
                      ? 'border-rose-300 dark:border-rose-900 bg-rose-50/30 dark:bg-rose-950/20'
                      : ev.severity === 'warning'
                      ? 'border-amber-300 dark:border-amber-900 bg-amber-50/30 dark:bg-amber-950/15'
                      : 'border-[var(--line)] bg-[var(--surface-alt)]'
                  }`}
                >
                  <div className="sm:w-40 shrink-0">
                    <div className="font-mono font-bold text-[11px] text-[var(--ink)] tabular-nums">{ev.date}</div>
                    <div className="text-[10.5px] font-bold text-[var(--muted)]">{ev.entity}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-[var(--ink)]">{ev.title}</div>
                    <div className="text-[11px] text-[var(--muted)] font-mono mt-0.5">{ev.docRef}</div>
                    <p className="m-0 mt-1 text-[var(--ink)] leading-relaxed">{ev.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KONTROLA POTPISA & VERIFIKOVANI ZAKUP OPU-IP-850/2023 */}
      {activeTab === 'controls_lease' && (
        <div className="space-y-5">
          {/* Bank Signatory vs Court Registry Contradiction */}
          <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <span className="eyebrow text-rose-600 dark:text-rose-400 font-extrabold block">
                  KRITIČAN RASCJEP INTERNIH KONTROLA (4/4 BANKOVNA RAČUNA)
                </span>
                <h3 className="text-sm font-black text-[var(--ink)] m-0">
                  Sudski registar (limit 2.000 KM) naspram Kartona deponovanih potpisa (Neograničeno)
                </h3>
              </div>
            </div>
            <p className="text-xs text-[var(--muted)] mb-3 leading-relaxed">
              Oba sudska registra izričito propisuju da sva plaćanja i ugovori preko <b>2.000,00 KM</b> moraju imati
              saglasnost Osnivača. Međutim, revizija svih 4 kartona deponovanih potpisa u VDR-u otkrila je da bankovne
              kontrole uopšte ne sprovode to ograničenje — a nakon razrješenja u IMH 04.11.2026., kartoni IMH-a su
              pravno neusklađeni.
            </p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Subjekt &amp; Banka</th>
                    <th scope="col">Račun / Datum kartona</th>
                    <th scope="col">Deponovani potpisnici</th>
                    <th scope="col">Limit u banci</th>
                    <th scope="col">Status &amp; Hitna mjera</th>
                  </tr>
                </thead>
                <tbody>
                  {BANK_SIGNATORY_AUDIT.map((row) => (
                    <tr key={`${row.entity}-${row.accountNo}`}>
                      <td>
                        <b>{row.entity}</b>
                        <div className="text-[11px] text-[var(--muted)]">{row.bank}</div>
                      </td>
                      <td className="font-mono text-[11px] tabular-nums">
                        {row.accountNo}
                        <div className="text-[var(--muted)]">{row.cardDate}</div>
                      </td>
                      <td className="text-xs">{row.signatories}</td>
                      <td>
                        <span className="font-bold text-rose-700 dark:text-rose-400">{row.bankLimit}</span>
                        <div className="text-[10.5px] text-[var(--muted)]">vs Registar: 2.000 KM</div>
                      </td>
                      <td className="text-[11px] leading-snug">
                        <b className="text-rose-700 dark:text-rose-400 block">{row.complianceStatus}</b>
                        {row.actionRequired}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verified Lease OPU-IP-850/2023 Deep Dive */}
          <div className="p-4 rounded-xl border-2 border-emerald-500/80 bg-[var(--surface)] space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-black text-[var(--ink)] m-0">
                  VERIFIKOVANO [V]: Notarski Ugovor o zakupu Buka 11/13 ({VERIFIED_LEASE_OPU_850.notaryAct})
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                01.09.2023. – 31.08.2033.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[var(--surface-alt)] border border-[var(--line)] space-y-1.5">
                <div className="font-extrabold text-[var(--ink)]">Osnovni pravni i finansijski parametri</div>
                <div>• <b>Strane:</b> {VERIFIED_LEASE_OPU_850.parties}</div>
                <div>• <b>Punomoć i Komisija:</b> {VERIFIED_LEASE_OPU_850.powerOfAttorney}; {VERIFIED_LEASE_OPU_850.commissionConclusion}</div>
                <div>• <b>Predmet:</b> {VERIFIED_LEASE_OPU_850.premises}</div>
                <div>• <b>Rok trajanja:</b> {VERIFIED_LEASE_OPU_850.term}</div>
                <div>• <b>Zakupnina i dospijeće:</b> {VERIFIED_LEASE_OPU_850.rentAndDueDate}</div>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-lg border border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/25">
                  <div className="font-black text-rose-800 dark:text-rose-300 mb-1">
                    IZVRŠNA KLAUZULA — ČLAN 9 (BEZ PARNICE!)
                  </div>
                  <p className="m-0 leading-relaxed text-[var(--ink)]">
                    {VERIFIED_LEASE_OPU_850.enforceabilityClause}
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/25">
                  <div className="font-black text-amber-900 dark:text-amber-300 mb-1">
                    RIZIK SU-KORIŠTENJA IDSS-a NA BUKA 13 (ČLAN 6.5 i 11.3.e)
                  </div>
                  <p className="m-0 leading-relaxed text-[var(--ink)]">
                    {VERIFIED_LEASE_OPU_850.subleaseAndIdssRisk}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[var(--surface-alt)] border border-[var(--line)] text-[11.5px]">
              <b>Knjigovodstveni status na 31.10.2026.:</b> {VERIFIED_LEASE_OPU_850.accountingStatusOct2026}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MENADŽERSKI UGOVORI, KREDITI, ZALOG & HR (44 POZICIJE) */}
      {activeTab === 'contracts_hr' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {EXECUTIVE_CONTRACTS_AND_COLLATERAL.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10.5px] font-bold text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]">
                      {c.id} · {c.entity}
                    </span>
                    <span className="text-[10.5px] text-[var(--muted)] font-mono truncate">{c.docRef}</span>
                  </div>
                  <h4 className="text-sm font-black text-[var(--ink)] m-0">{c.title}</h4>
                  <p className="m-0 text-[var(--ink)] leading-relaxed">{c.keyFinancials}</p>
                  <div className="p-2.5 rounded-lg bg-rose-50/40 dark:bg-rose-950/25 border border-rose-300 dark:border-rose-900 text-[11.5px] leading-relaxed">
                    <b className="text-rose-800 dark:text-rose-300">Kritična ugovorna odredba:</b> {c.criticalClause}
                  </div>
                </div>
                <div className="pt-2 border-t border-[var(--line)] text-[11px] text-[var(--muted)] leading-relaxed">
                  <b className="text-[var(--ink)]">M&amp;A / Finansijski uticaj:</b> {c.maImpact}
                </div>
              </div>
            ))}
          </div>

          {/* Verified HR Roster Breakdown (44 positions / 43 unique individuals) */}
          <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]" />
                <h3 className="text-sm font-black text-[var(--ink)] m-0">
                  Verifikovana kadrovska struktura grupe (5.1_IMH &amp; 5.1_IDSS — 44 pozicije / 43 lica)
                </h3>
              </div>
              <div className="text-[11px] font-semibold text-[var(--muted)] tabular-nums">
                IMH: {HR_ROSTER_SUMMARY.imhTotal} ({HR_ROSTER_SUMMARY.imhIndefinite} neodr. / {HR_ROSTER_SUMMARY.imhFixedTerm} odr.) ·
                IDSS: {HR_ROSTER_SUMMARY.idssTotal} ({HR_ROSTER_SUMMARY.idssManagerial} menadž. / {HR_ROSTER_SUMMARY.idssIndefinite} neodr. / {HR_ROSTER_SUMMARY.idssFixedTerm} odr.)
              </div>
            </div>
            <p className="text-[11.5px] text-[var(--muted)] mb-3 leading-relaxed">
              {HR_ROSTER_SUMMARY.overlapNote}
            </p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Funkcionalna cjelina</th>
                    <th scope="col">IMH</th>
                    <th scope="col">IDSS</th>
                    <th scope="col">Ukupno</th>
                    <th scope="col">Struktura profila (anonimizirano)</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {HR_ROSTER_SUMMARY.departments.map((d) => (
                    <tr key={d.department}>
                      <td><b>{d.department}</b></td>
                      <td>{d.imhCount}</td>
                      <td>{d.idssCount}</td>
                      <td><b>{d.imhCount + d.idssCount}</b></td>
                      <td className="text-[11px] text-[var(--muted)]">{d.note}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td>UKUPNO POZICIJA (43 JEDINSTVENE OSOBE)</td>
                    <td>{HR_ROSTER_SUMMARY.imhTotal}</td>
                    <td>{HR_ROSTER_SUMMARY.idssTotal}</td>
                    <td>{HR_ROSTER_SUMMARY.imhTotal + HR_ROSTER_SUMMARY.idssTotal}</td>
                    <td className="text-[11px] text-[var(--muted)]">
                      Plus vanjski saradnici po ugovoru o djelu u IDSS-u (konto 5291: 93.117,01 KM za 10 mj. 2026.).
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LEGAL DD READINESS MATRIX (A–I) & CLOSING BLOCKERS */}
      {activeTab === 'readiness' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <b>Ocjena spremnosti za M&amp;A / Bankarski Due Diligence (prema Operativna_LIsta17112026.pdf):</b>{' '}
              Korporativna, vlasnička, zakupna i finansijsko-knjigovodstvena baza (A, B, C, D, E, I) je bogato
              dokumentovana (92 fajla), ali <b>sekcije G (Ugovori) i H (Sudski sporovi) imaju 0 dokumenata</b>, a
              nedostaju poreske potvrde PU FBiH (4.6) i UIO BiH (4.7), Knjiga izdanih mjenica (4.3.d), Pravilnik o radu
              (5.6), tekst KUIP rješenja (5.15) i svježi IDSS izvod iz 2026.
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Sekcija</th>
                  <th scope="col">IMH</th>
                  <th scope="col">IDSS</th>
                  <th scope="col">Status DD</th>
                  <th scope="col">Verifikovani sadržaj u VDR-u</th>
                  <th scope="col">Nedostajući dokumenti / Blokeri za zatvaranje</th>
                </tr>
              </thead>
              <tbody>
                {VDR_READINESS_MATRIX.map((row) => (
                  <tr key={row.code}>
                    <td>
                      <b>{row.code}. {row.title}</b>
                    </td>
                    <td className="tabular-nums font-bold">{row.imhCount}</td>
                    <td className="tabular-nums font-bold">{row.idssCount}</td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-[11px] whitespace-nowrap ${
                          row.status === 'Verifikovano'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : row.status === 'Djelimično'
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {row.status === 'Verifikovano' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : row.status === 'Djelimično' ? (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        ) : (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        )}
                        {row.status}
                      </span>
                    </td>
                    <td className="text-[11.5px] leading-snug">{row.verifiedHighlights}</td>
                    <td className="text-[11.5px] leading-snug text-[var(--muted)]">{row.criticalGaps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: FULL SEARCHABLE CATALOG OF ALL 92 VDR DOCUMENTS */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl border border-[var(--line)] bg-[var(--surface-alt)]">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pretraži 92 VDR dokumenta (npr. zakup, zapisnik, leasing, kredit, 2026)..."
                aria-label="Pretraga VDR dokumenata"
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-xs text-[var(--ink)] outline-none focus:border-[var(--idss-blue)] dark:focus:border-[var(--idss-cyan)]"
              />
            </div>

            <div className="flex items-center gap-1">
              {(['SVE', 'IMH', 'IDSS', 'Grupa'] as const).map((ent) => (
                <button
                  key={ent}
                  type="button"
                  onClick={() => setEntityFilter(ent)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                    entityFilter === ent
                      ? 'bg-[var(--idss-blue)] text-white dark:bg-[var(--idss-cyan)] dark:text-slate-950'
                      : 'bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--idss-blue)]'
                  }`}
                >
                  {ent}
                </button>
              ))}
            </div>

            <select
              value={folderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              aria-label="Filtriraj po VDR folderu"
              className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-xs text-[var(--ink)] outline-none"
            >
              {uniqueFolders.map((f) => (
                <option key={f} value={f}>
                  {f === 'SVE' ? 'Svi folderi (A–I)' : f}
                </option>
              ))}
            </select>

            <span className="text-[11px] font-bold text-[var(--muted)] tabular-nums ml-auto">
              Prikazano: {filteredCatalog.length} / {VDR_DOCUMENT_CATALOG.length}
            </span>
          </div>

          <div className="table-wrap max-h-[460px] overflow-y-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Subjekt</th>
                  <th scope="col">VDR Folder</th>
                  <th scope="col">Naziv izvornog dokumenta</th>
                  <th scope="col">Izvor</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {filteredCatalog.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-[var(--muted)]">
                      Nema dokumenata koji odgovaraju zadatom filteru.
                    </td>
                  </tr>
                ) : (
                  filteredCatalog.map((doc) => (
                    <tr key={doc.driveId}>
                      <td className="font-mono text-[11px] text-[var(--muted)]">{doc.idx}</td>
                      <td>
                        <b
                          className={
                            doc.entity === 'IMH'
                              ? 'text-[var(--imh-green)]'
                              : doc.entity === 'IDSS'
                              ? 'text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]'
                              : 'text-[var(--ink)]'
                          }
                        >
                          {doc.entity}
                        </b>
                      </td>
                      <td className="font-mono text-[11px] text-[var(--muted)]">{doc.folder}</td>
                      <td className="text-xs font-medium text-[var(--ink)] break-all">{doc.name}</td>
                      <td>
                        <a
                          href={`https://drive.google.com/file/d/${doc.driveId}/view`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--idss-blue)] dark:text-[var(--idss-cyan)] hover:underline whitespace-nowrap"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>Otvori</span>
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
