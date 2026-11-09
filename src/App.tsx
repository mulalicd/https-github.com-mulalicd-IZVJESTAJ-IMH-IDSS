import React, { useState, useEffect } from 'react';
import {
  HISTORICAL_FINANCIALS,
  FinancialYear,
  ENROLLMENT_DATA,
  DEBT_OBLIGATIONS,
  LOAN_REPAYMENT_SCHEDULE,
  LOAN_CONTRACT_FULL,
  LEASE_CONTRACT_FULL,
} from './data/reportData';
import { useFinancials, km } from './lib/bilans/store';
import { formatBs } from './lib/bilans/parser';
import { LedgerSnapshot } from './components/LedgerSnapshot';
import { HarmonizationDrawer } from './components/HarmonizationDrawer';
import { SearchPanel } from './components/SearchPanel';
import { UnifiedLogo } from './components/UnifiedLogo';
import { RiskSimulator } from './components/RiskSimulator';
import { RiskMatrixVisual, buildMatrixRisks } from './components/RiskMatrixVisual';
import { CashFlowForecastVisual } from './components/CashFlowForecastVisual';
import { PartnerCardForensics } from './components/PartnerCardForensics';
import {
  Search,
  Moon,
  Sun,
  Printer,
  Sliders,
  Download,
  Menu,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  AlertTriangle,
  Scale,
  Car,
  Landmark,
  Building,
  GraduationCap,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  // UI state
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('sec-1-svrha');

  // Finansijski podaci: verifikovani bilansi (31.10.2026.) ili bilansi učitani u harmonizacijskom sistemu
  const fin = useFinancials();
  const g = fin.group;
  const financials: FinancialYear[] = HISTORICAL_FINANCIALS;
  const periodLabel = g?.periodTo ?? '31.10.2026.';

  // Toggle theme
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Scrollspy & Reading Progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);

      const sectionIds = [
        'sec-1-svrha',
        'sec-2-izvrsni-pregled',
        'sec-3-profil-model',
        'sec-4-finansije',
        'sec-5-forenzika',
        'sec-6-krediti-leasing-pozajmica',
        'sec-7-upis-komercijala',
        'sec-8-swot',
        'sec-9-vizija-stubovi',
        'sec-10-upravljanje-rizicima',
        'sec-11-akcijski-plan',
        'sec-12-analiza-entiteti',
        'sec-13-cash-flow-ritam',
        'sec-14-scenariji-upisa',
        'sec-15-otplatni-kalendar',
        'sec-16-poslovni-savjeti-zabrane',
        'sec-17-operativni-prirucnik-90-dana',
        'sec-18-rjecnik-i-zakljucak',
        'dodatak-usaglasavanje',
      ];

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Izvedeni pokazatelji iz knjiga
  const harmonizedCash = g?.cash ?? 0;
  const harmonizedNetResult = g?.resultNormalized ?? 0;
  const currentStudents = 83;
  // Mjesečni dug servis po ugovorima: anuitet MF kredita IMH + leasing + rata osnivaču po ugovoru
  const monthlyDebtService = 4661 + 2010 + 7790;
  const resolvedRiskIds: string[] = [];
  if (g && g.publicAgreements < 1) resolvedRiskIds.push('RF-07');
  if (fin.imh && fin.imh.cash - fin.imh.cashInTransit >= fin.imh.deposits) resolvedRiskIds.push('RF-03');

  // Standalone HTML Download
  const handleDownloadStandaloneHTML = () => {
    const link = document.createElement('a');
    link.href = `${import.meta.env.BASE_URL}assets/izvjestaj/IDSS_IMH_Strateski_izvjestaj_2027-2032_v3.pdf`;
    link.download = 'IDSS_IMH_Strateski_izvjestaj_2027-2032_v3.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full min-h-screen text-[var(--ink)] bg-[var(--paper)]">
      {/* Scroll reading progress bar */}
      <div
        className="progress-bar"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Topbar: Fixed, edge-to-edge full width */}
      <header className="topbar">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg border border-[var(--line)] text-[var(--ink)]"
            aria-label="Meni"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <div className="brand cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <UnifiedLogo size={36} />
            <div>
              <span>
                IDSS <span style={{ color: 'var(--idss-red)' }}>+</span> IMH
              </span>
              <small>FORENZIČKO-STRATEŠKI RADNI SISTEM · 2026.</small>
            </div>
          </div>
        </div>

        {/* Live indicator on desktop */}
        <div className="hidden xl:flex items-center gap-3 text-xs bg-[var(--surface-alt)] border border-[var(--line)] px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[var(--imh-green)] animate-pulse" />
          <span className="font-semibold text-[var(--muted)]">
            Status modela:{' '}
            <b className="text-[var(--ink)]">
              {fin.usingUploads ? `Učitani bilansi (${periodLabel})` : `Verifikovani bilansi (${periodLabel})`}
            </b>
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-[var(--muted)]">
            Gotovina:{' '}
            <b className="text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]">
              {formatBs(harmonizedCash)} KM
            </b>
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-[var(--muted)]">
            Dug servis po ugovorima:{' '}
            <b className="text-[var(--idss-red)] font-bold">≈{formatBs(monthlyDebtService)} KM/mj.</b>
          </span>
        </div>

        {/* Top actions */}
        <div className="toolbar">
          <button
            className="tool-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Pretraži dokument"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pretraži</span>
          </button>

          <button
            className={`tool-btn ${fin.usingUploads ? 'active' : ''}`}
            onClick={() => setDrawerOpen(true)}
            aria-label="Modularna harmonizacija"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Harmonizacija</span>
            {fin.usingUploads && (
              <span className="w-4 h-4 rounded-full bg-[var(--idss-red)] text-white text-[10px] flex items-center justify-center font-bold">
                {fin.uploadedLedgers.length}
              </span>
            )}
          </button>

          {/* Učitavanje bruto bilansa / kartica u harmonizacijski sistem */}
          <button
            className="tool-btn bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 font-extrabold shadow-xs transition"
            onClick={() => setDrawerOpen(true)}
            aria-label="Učitaj bruto bilans ili karticu konta"
            title="Učitajte PDF bruto bilansa ili kartice (Bilanca analitike) za IDSS ili IMH: cijeli izvještaj se ažurira"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">Učitaj bilans</span>
            <span className="inline md:hidden">Učitaj</span>
          </button>

          <button
            className="tool-btn"
            onClick={toggleTheme}
            aria-label="Promijeni temu"
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-yellow-400" /> : <Moon className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Izgled</span>
          </button>

          <button
            className="tool-btn bg-[var(--idss-blue)] text-white hover:bg-[var(--idss-blue)]/90 border-[var(--idss-blue)] font-extrabold shadow-sm"
            onClick={() => {
              const prevTitle = document.title;
              document.title = 'IDSS_IMH_Strateski_Forenzicki_Izvjestaj_2026';
              window.print();
              setTimeout(() => {
                document.title = prevTitle;
              }, 1000);
            }}
            aria-label="Download Full PDF"
            title="Generiši i preuzmi kompletan PDF dokument sa čistom A4 paginacijom"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Full PDF</span>
          </button>

          <button
            className="tool-btn hidden xl:inline-flex"
            onClick={handleDownloadStandaloneHTML}
            aria-label="Preuzmi samostalni HTML"
          >
            <FileText className="w-3.5 h-3.5 text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]" />
            <span>Izvještaj v3 (PDF)</span>
          </button>
        </div>
      </header>

      {/* Search Panel Overlay */}
      <SearchPanel isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Harmonization Drawer */}
      <HarmonizationDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Master Edge-to-Edge Layout */}
      <div className="master-layout">
        {/* Left Sticky Sidebar (Desktop & Mobile Drawer) */}
        <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <div>
            <div className="side-label">SADRŽAJ RADNOG DOKUMENTA</div>
            <nav className="toc" id="toc">
              <a
                href="#sec-1-svrha"
                className={activeSection === 'sec-1-svrha' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>1. SVRHA I METODOLOGIJA</span>
              </a>
              <a
                href="#sec-2-izvrsni-pregled"
                className={activeSection === 'sec-2-izvrsni-pregled' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>2. IZVRŠNI PREGLED (DIJAGNOZA)</span>
              </a>
              <a
                href="#sec-3-profil-model"
                className={activeSection === 'sec-3-profil-model' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>3. PROFIL I OBRAZOVNI MODEL</span>
              </a>
              <a
                href="#sec-4-finansije"
                className={activeSection === 'sec-4-finansije' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>4. FINANSIJSKA HISTORIJA</span>
              </a>
              <a
                href="#sec-5-forenzika"
                className={activeSection === 'sec-5-forenzika' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>5. FORENZIČKI PRESJEK ({periodLabel})</span>
              </a>
              <a
                href="#sec-6-krediti-leasing-pozajmica"
                className={activeSection === 'sec-6-krediti-leasing-pozajmica' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>6. KREDITI, LEASING, POZAJMICA</span>
                <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded-full">
                  ≈14,5k/mj.
                </span>
              </a>
              <a
                href="#sec-7-upis-komercijala"
                className={activeSection === 'sec-7-upis-komercijala' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>7. UPIS I KOMERCIJALA (64%)</span>
              </a>
              <a
                href="#sec-8-swot"
                className={activeSection === 'sec-8-swot' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>8. SWOT S OPSERVACIJAMA</span>
              </a>
              <a
                href="#sec-9-vizija-stubovi"
                className={activeSection === 'sec-9-vizija-stubovi' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>9. STRATEŠKA VIZIJA I STUBOVI</span>
              </a>
              <a
                href="#sec-10-upravljanje-rizicima"
                className={activeSection === 'sec-10-upravljanje-rizicima' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>10. UPRAVLJANJE RIZICIMA</span>
              </a>
              <a
                href="#sec-11-akcijski-plan"
                className={activeSection === 'sec-11-akcijski-plan' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>11. AKCIJSKI PLAN (0–100 DANA)</span>
              </a>
              <a
                href="#sec-12-analiza-entiteti"
                className={activeSection === 'sec-12-analiza-entiteti' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>12. ANALIZA PO ENTITETIMA</span>
              </a>
              <a
                href="#sec-13-cash-flow-ritam"
                className={activeSection === 'sec-13-cash-flow-ritam' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>13. CASH-FLOW I RITAM</span>
              </a>
              <a
                href="#sec-14-scenariji-upisa"
                className={activeSection === 'sec-14-scenariji-upisa' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>14. SCENARIJI UPISA (PRELOMNA TAČKA)</span>
              </a>
              <a
                href="#sec-15-otplatni-kalendar"
                className={activeSection === 'sec-15-otplatni-kalendar' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>15. DETALJNI KALENDAR DOSPIJEĆA</span>
              </a>
              <a
                href="#sec-16-poslovni-savjeti-zabrane"
                className={activeSection === 'sec-16-poslovni-savjeti-zabrane' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>16. POSLOVNI SAVJETI I ZABRANE</span>
              </a>
              <a
                href="#sec-17-operativni-prirucnik-90-dana"
                className={activeSection === 'sec-17-operativni-prirucnik-90-dana' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>17. PRIRUČNIK: PRVIH 90 DANA</span>
              </a>
              <a
                href="#sec-18-rjecnik-i-zakljucak"
                className={activeSection === 'sec-18-rjecnik-i-zakljucak' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>18. RJEČNIK I ZAVRŠNA PORUKA</span>
              </a>
              <a
                href="#dodatak-usaglasavanje"
                className={activeSection === 'dodatak-usaglasavanje' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>DODATAK: USAGLAŠAVANJE</span>
              </a>
              <a
                href="#sec-forenzika-partnera"
                className={`font-black ${activeSection === 'sec-forenzika-partnera' ? 'active' : ''}`}
                style={{ color: 'var(--idss-blue)', background: 'rgba(3, 94, 161, 0.08)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--idss-blue)] animate-pulse" />
                  DODATAK: FORENZIKA KARTICA
                </span>
              </a>
            </nav>

            {/* Sidebar KPI Status Box */}
            <div className="mt-6 p-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[11px] space-y-2">
              <span className="eyebrow block">KONTROLNA TABLA</span>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">Učenici IDSS:</span>
                <b className="font-bold">{currentStudents}</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">Gotovina grupe:</span>
                <b className="font-bold text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]">
                  {formatBs(harmonizedCash)} KM
                </b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">Rezultat grupe (normalizovan):</span>
                <b className="font-bold text-[var(--imh-green)]">
                  {formatBs(harmonizedNetResult)} KM
                </b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">Dug servis (ugovori):</span>
                <b className="font-bold text-[var(--idss-red)]">≈{formatBs(monthlyDebtService)} KM/mj.</b>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[var(--line)]">
                <span className="text-[var(--muted)]">Rizici (Zastavice):</span>
                <span className="font-bold text-xs">
                  <span className="text-[var(--idss-red)]">{buildMatrixRisks(fin).length - resolvedRiskIds.length} akt.</span>{' '}
                  / <span className="text-[var(--imh-green)]">{resolvedRiskIds.length} san.</span>
                </span>
              </div>
            </div>
          </div>

          <div className="confidential">
            STROGO POVJERLJIVO
            <br />
            <span style={{ fontWeight: 500, letterSpacing: 0 }}>
              Interni radni alat za upravljanje · Buka 11/13
            </span>
          </div>
        </aside>

        {/* Main Content: Edge-to-Edge Desktop Layout */}
        <main className="main-content">
          {/* Hero Banner */}
          <section className="hero">
            <div className="hero-top">
              <div className="hero-kicker">
                INTERNATIONALE DEUTSCHE SCHULE SARAJEVO{' '}
                <span style={{ color: 'var(--idss-red)' }}>+</span> INTERNATIONAL MONTESSORI HOUSE
              </div>
              <div className="hero-rule" style={{ marginTop: '26px' }} />
              <h1>Sveobuhvatna forenzička i strateška analiza poslovanja</h1>
              <div className="hero-sub">
                Razdoblje: 2022. – {periodLabel} <span style={{ opacity: 0.6 }}>|</span> Horizont
                plana: 2027. – 2032. <br />
                <span className="text-xs text-[#9edcf5]">
                  Objektivni radni sistem za direktora i menadžment · Analiza bez ukrasnih fraza
                </span>
              </div>
            </div>

            <div className="hero-bottom">
              <div className="hero-meta">
                <strong>SVEOBUHVATNA FORENZIČKA I STRATEŠKA ANALIZA</strong>
                Buka 11/13, Sarajevo-Centar · Novembar 2026.
                <br />
                Usklađeno s primarnom dokumentacijom: ugovori o kreditima, leasing, pozajmica, zakup,
                bruto bilansi
              </div>
              <div className="flex items-center gap-2">
                {fin.usingUploads && (
                  <div className="border border-green-400 bg-green-500/20 text-green-200 px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Harmonizovano iz učitanih bilansa ({fin.uploadedLedgers.length})
                  </div>
                )}
                <div className="conf-tag">STROGO POVJERLJIVO</div>
              </div>
            </div>
          </section>

          {/* Banner: izvještaj prikazuje podatke iz učitanih bilansa */}
          {fin.usingUploads && (
            <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/50 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm m-0 text-emerald-300">
                    Izvještaj je harmonizovan s učitanim bilansima (stanje {periodLabel})
                  </h4>
                  <p className="text-xs text-slate-300 m-0">
                    Gotovina grupe {km(g?.cash)} · Eksterni dug {km(g?.externalDebt)} · Kapital {km(g?.equity)} · Normalizovani rezultat {km(g?.resultNormalized)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setDrawerOpen(true)} className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition">
                  Uredi dokumente
                </button>
                <button onClick={fin.resetToVerified} className="px-3 py-1.5 rounded-lg border border-slate-600 hover:bg-slate-800 text-slate-300 text-xs transition">
                  Vrati na verifikovano stanje
                </button>
              </div>
            </div>
          )}

          {/* Document Content */}
          <div className="document">
            {/* POGLAVLJE 1 */}
            <h2 id="sec-1-svrha">1. SVRHA DOKUMENTA I METODOLOGIJA</h2>
            <p className="lead">
              Ovaj dokument nije formalni izvještaj za osnivača, banku, poresku upravu ili potencijalnog
              investitora. To je radni alat za upravljanje i forenzički pregled stanja grupacije IDSS i IMH,
              sa ciljem da se jasno prepoznaju stvarni pritisci, snage i prioritetizirane odluke koje se
              mogu odmah pokrenuti. Dokument služi kao radna mapa u narednih 12 do 18 mjeseci, a ne kao
              jednokratna prezentacija.
            </p>
            <p>
              Metodologija se oslanja isključivo na primarne izvore: godišnje finansijske izvještaje IDSS i
              IMH za 2023., 2024. i 2025. godinu, bruto bilanse na 31.08.2026. i 31.10.2026., karticu kupaca IDSS-a na 02.11.2026.,
              ugovore o kreditu MF Banke (20.000 KM i overdraft 15.000 KM za IDSS od 12.06.2025., dugoročni
              kredit 100.000 KM za IMH od 30.07.2026.), ugovor o finansijskom leasingu Sparkasse za Porsche
              Cayenne od 14.07.2026., ugovor o pozajmici između Lamie Kacile i IMH-a od 14.07.2026. o učešću u
              nabavci vozila (93.484,84 KM), ugovor o zakupu poslovne zgrade s Općinom Centar od 27.09.2023.,
              cjenovnike za školsku godinu 2026/27., otplatne planove, rekapitulacije plata i interne
              strateške materijale.
            </p>
            <p className="note">
              <b>Strateško promišljanje:</b> U privatnom obrazovanju najčešća greška menadžmenta nije
              nedostatak vizije, već nedostatak discipline u praćenju odliva i formalizaciji povezanih
              tokova. Ovaj alat postoji da tu disciplinu učini rutinskom. Ako se koristi mjesečno, vrijedi
              više od bilo koje vanjske studije.
            </p>

            {/* POGLAVLJE 2 */}
            <h2 id="sec-2-izvrsni-pregled">2. IZVRŠNI PREGLED: GDJE STOJI GRUPA DANAS</h2>
            <p>
              <b>Jedna rečenica dijagnoze:</b> Grupa ima zdravu jezgru poslovanja i dokaziv rast prihoda od
              2022. do 2025., ali je likvidnosno napeta, kapitalno negativna i opterećena fiksnim odlivima
              (krediti, leasing, pozajmica, dug za zakup) koji zahtijevaju mjesečnu disciplinu i
              formalizaciju.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
                <span className="eyebrow text-[var(--imh-green)] block mb-1">Šta radi (Prednosti)</span>
                <ul className="text-xs space-y-1.5 m-0 p-0 list-none text-[var(--ink)]">
                  <li>• <b>Vertikala funkcioniše:</b> 64% prvačića (7 od 11) u 2026/27. dolazi iz predškolske grupe IMH.</li>
                  <li>• <b>Rast prihoda:</b> Konsolidovani prihod s 1.516.304 KM (2023.) na 1.701.240 KM (2025.), rast 12,2%.</li>
                  <li>• <b>Profitabilnost IMH:</b> U 2025. ostvarena neto dobit od 63.815 KM i smanjen negativni kapital.</li>
                  <li>• <b>Cjenovnik:</b> Realizovana školarina IDSS-a iznosi 87,4% cjenovnika (odstupanje 108.324 KM, 12,6%).</li>
                  <li>• <b>Ugovor o zakupu:</b> Prema upravi produžen do 2033. pod istim uslovima [U]; dokument treba uvrstiti u data room.</li>
                  <li>• <b>Vozilo osnivača kao učešće:</b> Obaveza IMH-a prema osnivaču (93.484,84 KM) ima osnov, jer je ranije vozilo bilo osnivačevo; može se prebiti s potraživanjima od osnivača.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
                <span className="eyebrow text-[var(--idss-red)] block mb-1">Šta pritišće (Izazovi)</span>
                <ul className="text-xs space-y-1.5 m-0 p-0 list-none text-[var(--ink)]">
                  <li>• <b>Napeta gotovina:</b> Grupa {km(g?.cash)} na {periodLabel}, od čega {km(g?.cashInTransit)} na prelaznim kontima; stvarno na računima oko {km(g?.bankCash)}.</li>
                  <li>• <b>Fakture IDSS → IMH od 100.000 KM:</b> Iz namjenskog kredita MF Banke; kod IDSS-a prihod, kod IMH-a kapitalizovano kao ulaganje. Rezultat grupe po knjigama {km(g?.resultBooks)}, normalizovano {km(g?.resultNormalized)}.</li>
                  <li>• <b>Negativan vlastiti kapital:</b> IDSS {km(fin.idss?.equity)}, IMH {km(fin.imh?.equity)}, grupa {km(g?.equity)}.</li>
                  <li>• <b>Neusaglašen zakup:</b> U 2026. proknjiženo je 8 od 10 faktura Općine (60.250 KM), a kartica Općine u IMH-u pokazuje pretplatu od 22.469 KM.</li>
                  <li>• <b>Dug servis ≈{formatBs(monthlyDebtService)} KM/mj.:</b> Kredit MF IMH (≈4.661 KM), leasing (1.027,91 EUR ≈ 2.010 KM), rata osnivaču po ugovoru (7.790,40 KM). Uz to: prekoračenja {km((fin.imh?.overdraft ?? 0) + (fin.idss?.overdraft ?? 0))}.</li>
                  <li>• <b>Oscilacije upisa:</b> 79 ➔ 94 ➔ 68 ➔ 83 učenika; trenutno 12% ispod historijskog vrha.</li>
                  <li>• <b>Javne obaveze po sporazumima nisu izmirene:</b> {km(g?.publicAgreements)} na {periodLabel}; neisplaćene neto plate {km(g?.netSalariesPayable)}.</li>
                </ul>
              </div>
            </div>

            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Ključni pokazatelj</th>
                    <th scope="col">Vrijednost</th>
                    <th scope="col">Forenzički i upravljački komentar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Konsolidirani prihod 2025.</td>
                    <td>1.701.240 KM</td>
                    <td>Nakon eliminacije transfernih cijena (99.212 KM); zbir bez eliminacije: 1.800.452 KM</td>
                  </tr>
                  <tr>
                    <td>Neto rezultat IMH 2025.</td>
                    <td>+63.815 KM</td>
                    <td>Pozitivno poslovanje vrtića; nosi stabilnost grupacije</td>
                  </tr>
                  <tr>
                    <td>Neto rezultat IDSS 2025.</td>
                    <td>-9.501 KM</td>
                    <td>Efekat uvođenja transfernih cijena (TC), a ne operativni krah škole</td>
                  </tr>
                  <tr>
                    <td>Upis IDSS 2026/27.</td>
                    <td>83 učenika</td>
                    <td>12% ispod vrha iz 2024/25. (94 učenika); oporavak nakon pada na 68</td>
                  </tr>
                  <tr>
                    <td>Vertikala prelaska IMH ➔ IDSS</td>
                    <td>64% (63,64%)</td>
                    <td>7 od 11 prvačića dolazi iz IMH predškolske grupe</td>
                  </tr>
                  <tr>
                    <td>Gotovina na dan {periodLabel}</td>
                    <td>{km(g?.cash)}</td>
                    <td>IDSS {km(fin.idss?.cash)}, IMH {km(fin.imh?.cash)}; na prelaznim kontima {km(g?.cashInTransit)}; depoziti roditelja {km(g?.deposits)}</td>
                  </tr>
                  <tr>
                    <td>Rezultat po knjigama (2026., {fin.idss?.months ?? '–'} mj.)</td>
                    <td>{km(g?.resultBooks)}</td>
                    <td>Uključuje 100.000 KM prihoda IDSS-a po fakturama IMH-u (kredit MF Banke)</td>
                  </tr>
                  <tr>
                    <td>Normalizovani rezultat grupe</td>
                    <td><b>{km(g?.resultNormalized)}</b></td>
                    <td>Bez 100.000 KM i neusaglašenih međusobnih faktura; prije amortizacije i 2 nedostajuće fakture zakupa (≈15.063 KM)</td>
                  </tr>
                  <tr>
                    <td>Eksterni dug (bez leasinga)</td>
                    <td>{km(g?.externalDebt)}</td>
                    <td>Uz leasing vozila {km(g?.externalDebtWithLeasing)}; obaveza prema osnivaču (93.485 KM) nije proknjižena</td>
                  </tr>
                  <tr>
                    <td>Vlastiti kapital (prije rezultata 2026.)</td>
                    <td>{km(g?.equity)}</td>
                    <td>IDSS {km(fin.idss?.equity)}, IMH {km(fin.imh?.equity)} (iz knjiga)</td>
                  </tr>
                  <tr>
                    <td>Obaveza IMH-a prema osnivaču</td>
                    <td>93.484,84 KM</td>
                    <td>Ugovor potpisan 07.11.2026., na njemu datum 14.07.2026.; prva uplata ≈4.400 KM 09.11.2026. Preporuka: prebijanje s potraživanjima od osnivača ({km(g?.receivablesFounder)})</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* POGLAVLJE 3 */}
            <h2 id="sec-3-profil-model">3. PROFIL GRUPE I POSLOVNI MODEL</h2>
            <h3 id="sub-3-1-pravni-okvir">3.1. Pravni i organizacijski okvir</h3>
            <p>
              IDSS (JIB 4202220420007, djelatnost 85.20 osnovno obrazovanje) i IMH (JIB 4201731140006, djelatnost
              85.10 predškolsko obrazovanje) formalno su odvojena pravna lica, ali ekonomski i upravljački čine
              jednu grupu. Dijele istog direktora (Davor Mulalić), licenciranu računovođu (Ilvana Raščić,
              CR-6235/5) i isti poslovni kompleks na adresi Buka 11/13 u Sarajevu. Oba subjekta razvrstana su kao
              mala pravna lica i primjenjuju MSFI za MSP.
            </p>
            <p>
              Prednost zajedničkog menadžmenta je brzina donošenja odluka i niska administrativna trenja. Mane su
              koncentracija rizika na ključne osobe i mogućnost da se međufirmski tokovi tretiraju neformalno.
              Uvođenje sistema transfernih cijena (TC) 2025. godine bio je korak u pravom smjeru. Sljedeći korak
              je ista disciplina na likvidnosnim i povezanim transakcijama.
            </p>

            <h3 id="sub-3-2-vertikala">3.2. Poslovni model i obrazovna vertikala</h3>
            <p>
              Poslovni model počiva na vertikalnoj integraciji edukacijskih usluga. IMH prima djecu predškolskog
              uzrasta kroz Toddler grupu i predškolsku grupu. IDSS pruža osnovno obrazovanje od I do IX razreda
              prema njemačkom međunarodnom kurikulumu. Djeca koja završe predškolski program imaju prirodan put
              prema osnovnoj školi unutar iste grupe, što smanjuje trošak akvizicije (CAC) i povećava životnu
              vrijednost porodice (LTV) u sistemu.
            </p>
            <p>
              U školskoj 2026/27. godini, 7 od 11 prvačića dolazi iz predškolske grupe (64%). Vertikala takođe
              smanjuje rizik fluktuacije stranih porodica: domaća baza koja prolazi kroz IMH ima duži životni
              ciklus. Ako strani segment padne, domaća vertikala drži volumen. Zato ulaganje u vertikalu nije
              marketing, već upravljanje rizikom prihoda.
            </p>

            <h3 id="sub-3-3-cjenovnik">3.3. Cjenovna pozicija i struktura prihoda</h3>
            <p>
              Cjenovnici za 2026/27. godinu ostaju konkurentni na tržištu Sarajeva:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3 text-xs">
              <div className="p-3 rounded-lg border border-[var(--line)] bg-[var(--surface)]">
                <b>IDSS (Osnovna škola):</b>
                <br />• Upisnina: 1.000 KM (domaća) / 1.500 KM (strana lica)
                <br />• Školarina I do IV razred: 9.700 KM / 11.970 KM
                <br />• Školarina V do IX razred: 11.030 KM / 13.700 KM
                <br />• Produženi boravak: 2.500 KM
                <br />• Porodični popusti: 10% za drugo, 15% za treće dijete
              </div>
              <div className="p-3 rounded-lg border border-[var(--line)] bg-[var(--surface)]">
                <b>IMH (Montessori vrtić):</b>
                <br />• Godišnja školarina: oko 8.520 KM (domaći) / 9.720 KM (strani)
                <br />• Popust na školarinu: 20% za naredno dijete
                <br />• Depoziti roditelja: {km(fin.imh?.deposits)} ({fin.imh?.periodTo})
                <br />• Subvencije Ministarstva KS: {km(fin.imh?.ministrySubsidies)} do {fin.imh?.periodTo}, prolazna stavka (nije prihod IMH-a)
              </div>
            </div>
            <p>
              Realizovana školarina IDSS-a iznosi 87,4% cjenovnika (749.976 KM naspram 858.300 KM po cjenovniku) zbog popusta i ugovora bez školarine.
              Godišnji nivo troškova rada IDSS-a (704.517 KM, obračun 09/2026) iznosi 90,4% ugovorene vrijednosti za 2026/27.
              (779.476 KM), što znači da ostali troškovi (transferne cijene, materijal, energenti, servis duga)
              moraju biti pokriveni rastom upisa ili strogom kontrolom rashoda.
            </p>

            <h3 id="sub-3-4-prostor">3.4. Prostor i zakup: Buka 11/13 (Ugovor br. 04-49-36-59/13 & Anex)</h3>
            <p>
              Ustanova posluje u poslovnoj zgradi u ulici Buka 11 i 13, ukupne ugovorene površine <b>1.287,40 m²</b>,
              dodijeljenoj od strane <b>Općine Centar Sarajevo</b> (zastupao Općinski načelnik Dževad Bećirević) na osnovu
              Odluke Općinskog vijeća Centar broj 01-49-1594/13 od 29.07.2013. godine. Osnovni <i>Ugovor o zakupu poslovne zgrade</i>
              broj <b>04-49-36-59/13</b> zaključen je dana <b>30.08.2013. godine</b> na period od 10 godina (01.09.2013. – 31.08.2023.),
              uz namjensko ograničenje: <u>isključivo za obavljanje djelatnosti iz oblasti obrazovanja</u> (član II).
            </p>
            <p>
              Ugovorena cijena zakupa iznosi <b>5,00 KM po m²</b>, što na ukupnu kvadraturu daje mjesečnu neto zakupninu od
              <b> 6.437,00 KM</b>, odnosno sa pripadajućim PDV-om od 17% (1.094,29 KM) ukupno <b>7.531,29 KM mjesečno</b>, plativo do
              15-tog u mjesecu unaprijed na žiro račun Općine Centar (član III). Zakupac samostalno snosi sve režije, tekuće održavanje,
              naknade za građevinsko zemljište, grijanje, struju i dovođenje u stanje uslovnosti.
            </p>
            <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] my-3 text-xs">
              <span className="eyebrow text-[var(--idss-blue)] dark:text-[var(--idss-cyan)] block mb-1">
                ANEX UGOVORA (BR. 04-49-13-12/14 OD 13.03.2014.) — PRIZNATA NUŽNA ULAGANJA
              </span>
              <p className="m-0 leading-relaxed text-[var(--ink)]">
                Na osnovu člana 27. Odluke i Zaključka općinske komisije (br. 04-49-2538/13), Općina Centar je priznala 60% vrijednosti
                izvršenih nužnih opravki zgrade (od ukupno utvrđenih 97.993,10 KM), odnosno tačno <b>58.795,86 KM</b>:
                <br />• <b>48.187,74 KM</b> kompenzirano je odmah sa dospjelim dugovanjima zakupca na dan 15.03.2014. godine.
                <br />• <b>10.608,12 KM</b> kompenzirano je kroz 9 mjesečnih umanjenja zakupnine (za po 1.178,68 KM mjesečno), pa je zakupac u
                periodu od 01.04.2014. do 31.12.2014. plaćao umanjenu neto zakupninu od <b>5.258,32 KM/mj.</b>
                <br />• Od <b>01.01.2015. godine</b> ponovo se primjenjuje puni iznos od 6.437,00 KM + PDV 1.094,29 KM = <b>7.531,29 KM mjesečno</b>.
              </p>
            </div>
            <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 my-3 text-xs">
              <span className="eyebrow text-emerald-600 dark:text-emerald-400 block mb-1 font-black">
                PREMA PODACIMA UPRAVE [U]: UGOVOR O ZAKUPU PRODUŽEN DO 2033. GODINE POD ISTIM USLOVIMA
              </span>
              <p className="m-0 leading-relaxed text-[var(--ink)] font-medium">
                Izuzetno važna strateška činjenica za poslovanje i vrednovanje grupacije: Nakon isteka prvobitnog 10-godišnjeg perioda
                (2013–2023), prema podacima uprave <b>27.09.2023. zaključen je novi ugovor o zakupu s Općinom Centar s važenjem do 2033. godine</b> (dokument još nije dostavljen na verifikaciju),
                i to <u>pod potpuno istim uslovima</u>:
                <br />• <b>Ista zaštićena cijena zakupa:</b> 5,00 KM po m² neto (ukupno <b>6.437,00 KM neto + 1.094,29 KM PDV = 7.531,29 KM bruto mjesečno</b>).
                <br />• <b>Ista ugovorena površina:</b> 1.287,40 m² u ulici Buka 11 i 13, što obezbjeđuje dugoročni mir i krov nad glavom za IDSS i IMH sve do jeseni 2033. godine.
                <br />• <b>Tržišna vrijednost ove pogodnosti:</b> Komercijalni zakup sličnog objekta u centru Sarajeva iznosi 15–25 KM/m² (od 230.000 do 380.000 KM godišnje), što znači da grupa kroz ovaj ugovor ostvaruje godišnju uštedu veću od 150.000 KM!
              </p>
            </div>
            <p className="note">
              <b>KRITIČNA FORENZIČKA KLAUZULA — ČLAN XIV (JEDNOSTRANI RASKID I DELOŽACIJA):</b> Prema članu XIV ugovora,
              Općina Centar ima zakonsko i ugovorno pravo <u>jednostrano raskinuti ugovor sa otkaznim rokom od samo 15 dana</u> ukoliko
              zakupac <b>ne plati dvije dospjele zakupnine</b> nakon prijema opomene! Takođe, član XI strogo zabranjuje podzakup ili bilo
              kakvo učešće u poslovno-tehničkoj saradnji s trećim licima bez saglasnosti. Na 31.10.2026. u IMH-u je za 10 mjeseci proknjiženo 8 faktura Općine (60.250 KM), a kartica Općine pokazuje
              pretplatu od 22.469 KM. Stanje treba usaglasiti izvodom otvorenih stavki s Općinom i u data room uvrstiti ugovor do 2033.
            </p>

            {/* POGLAVLJE 4 */}
            <h2 id="sec-4-finansije">4. FINANSIJSKA HISTORIJA 2022. DO 2025.</h2>
            <p>
              Konsolidovani prihodi rasli su sa 1.516.304 KM (2023.) na 1.701.240 KM (2025.), što je rast od 12,2%.
              Zbir za 2022. (1.357.925 KM) sadrži 260.190 KM najma koji je IMH naplatio od IDSS-a; nakon eliminacije
              iznosi 1.097.735 KM. IDSS je od 2022. porastao za 42% (sa 633.571 na 899.881 KM), a IMH za 24% (sa
              724.354 na 900.571 KM).
            </p>

            <p className="text-xs text-[var(--muted)]">
              [V] FIA obrasci 2022–2023, bruto bilansi 2024–2025, godišnji izvještaji 2025. Red za 2026. preuzet je iz aktivnih bruto bilansa ({periodLabel}).
            </p>

            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Godina</th>
                    <th scope="col">Prihod IDSS</th>
                    <th scope="col">Prihod IMH</th>
                    <th scope="col">Konsolidirani prihod</th>
                    <th scope="col">Neto IDSS</th>
                    <th scope="col">Neto IMH</th>
                    <th scope="col">Neto rezultat grupe</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...financials.filter((f) => !f.year.startsWith('2026')),
                    ...(fin.idss && fin.imh && fin.idss.revenue !== null && fin.imh.revenue !== null && fin.idss.result !== null && fin.imh.result !== null
                      ? [{
                          year: `2026 (do ${periodLabel})`,
                          idssRev: Math.round(fin.idss.revenue),
                          imhRev: Math.round(fin.imh.revenue),
                          eliminations: Math.round(g?.intercompanyRevenue ?? 0),
                          consolidatedRev: Math.round(g?.revenueExternal ?? 0),
                          idssNet: Math.round(fin.idss.result),
                          imhNet: Math.round(fin.imh.result),
                          consolidatedNet: Math.round(g?.resultBooks ?? 0),
                        }]
                      : []),
                  ].map((f) => (
                    <tr key={f.year}>
                      <td><b>{f.year}</b></td>
                      <td>{formatBs(f.idssRev)} KM</td>
                      <td>{formatBs(f.imhRev)} KM</td>
                      <td><b>{formatBs(f.consolidatedRev)} KM</b></td>
                      <td className={f.idssNet < 0 ? 'text-[var(--idss-red)] font-semibold' : ''}>
                        {formatBs(f.idssNet)} KM
                      </td>
                      <td className="text-[var(--imh-green)] font-semibold">
                        {formatBs(f.imhNet)} KM
                      </td>
                      <td className="font-bold">
                        {formatBs(f.consolidatedNet)} KM
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              <b>Kontekst formalnog gubitka IDSS-a u 2025. (-9.501 KM):</b> Gubitak je rezultat fer raspodjele
              troškova s IMH-om kroz sistem transfernih cijena (84 fakture IMH prema IDSS-u, eliminisano 99.212 KM).
              Bez transfernih cijena IDSS bi formalno prikazivao dobit od oko 90.000 KM, ali to bi bila finansijski
              netačna slika.
            </p>
            <p>
              <b>Struktura rashoda i plate:</b> Plate i doprinosi u 2025. činili su 75,7% rashoda IDSS-a (688.011 KM)
              i 64,4% rashoda IMH-a (535.612 KM).
            </p>

            {/* POGLAVLJE 5 */}
            <h2 id="sec-5-forenzika">5. FORENZIČKI PRESJEK STANJA NA {periodLabel}</h2>
            <p>
              Presjek se računa direktno iz bruto bilansa IDSS-a i IMH-a. Nove bilanse možete učitati u modularnom
              harmonizacijskom sistemu, i tada se cijeli izvještaj preračunava. Pojedinačni podaci o roditeljima i djeci
              nisu dio javnog izvještaja.
            </p>
            <LedgerSnapshot onOpenHarmonization={() => setDrawerOpen(true)} />

            <p>
              <b>Fakture IDSS → IMH od 100.000 KM (kredit MF Banke):</b> IMH je 30.07.2026. dobio kredit od 100.000 KM
              namijenjen plaćanju dobavljača, kod kojeg banka novac isplaćuje dobavljaču po fakturi, a ne dužniku. IDSS je
              IMH-u fakturisao usluge (renoviranje dvorišta i slično), a MF Banka je iznos uplatila IDSS-u. Kod IDSS-a je to
              prihod od povezanog lica, a IMH je fakture kapitalizovao kao „ulaganja u tuđe građevinske objekte” (konto 0211).
              Na nivou grupe ovo nije prihod od trećih lica, pa se eliminiše. IMH je kao plaćeno IDSS-u knjižio 87.800 KM, a
              IDSS vodi 100.000 KM naplaćeno; razliku od 12.200 KM treba usaglasiti. Osnovna djelatnost IDSS-a je obrazovanje,
              pa bez ugovora i dokaza o izvedenim radovima fakture nose rizik prema banci, poreskim organima i reviziji.
            </p>

            <p>
              <b>Potraživanja od osnivača i obaveza prema osnivaču:</b> Cijelih 184.692 KM potraživanja od zaposlenih,
              uprave i fizičkih lica (IMH 127.725 KM + 39.565 KM, IDSS 17.402 KM) duguje osnivač obje ustanove. IMH istovremeno
              duguje osnivaču 93.484,84 KM, jer je ranije vozilo osnivača dato kao učešće za novo vozilo u leasingu. Ugovor
              o tome potpisan je 07.11.2026., a nosi datum 14.07.2026.; treba ga zamijeniti ugovorom ili aneksom s datumom
              potpisa. Preporuka je prebijanje: neto dug osnivača grupi iznosi 91.207 KM, bez ikakve gotovinske isplate.
            </p>

            {/* POGLAVLJE 6 - NOVO: DETALJNE KREDITNE OBAVEZE, LEASING I POZAJMICA */}
            <h2 id="sec-6-krediti-leasing-pozajmica">6. KREDITNE OBAVEZE, LEASING I POZAJMICA</h2>
            <p>
              Forenzički pregled svih kreditnih ugovora, ugovora o finansijskom leasingu i povezanih pozajmica otkriva
              stvarne mjesečne fiksne terete koji opterećuju cash-flow grupacije:
            </p>

            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Obaveza / Kreditor</th>
                    <th scope="col">Entitet</th>
                    <th scope="col">Ugovoreni iznos</th>
                    <th scope="col">Mjesečni / periodični teret</th>
                    <th scope="col">Kamata i uslovi</th>
                    <th scope="col">Dospijeće / Rok</th>
                  </tr>
                </thead>
                <tbody>
                  {DEBT_OBLIGATIONS.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <b>{d.creditor}</b> ({d.type})
                      </td>
                      <td>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--surface-alt)] border border-[var(--line)]">
                          {d.entity}
                        </span>
                      </td>
                      <td>{d.originalAmount}</td>
                      <td className="font-bold text-[var(--idss-red)]">{d.monthlyBurden}</td>
                      <td className="text-xs">{d.interestRate}</td>
                      <td>{d.maturity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl border border-[var(--idss-red)] bg-red-50/20 dark:bg-red-950/20 my-4">
              <span className="eyebrow text-[var(--idss-red)] block mb-1">KRITIČNI NALAZ: DUG SERVIS PO UGOVORIMA ≈14.460 KM MJESEČNO</span>
              <p className="text-xs text-[var(--ink)] m-0 leading-relaxed">
                Zbroj fiksnih obaveza samo po osnovu finansiranja (anuitet MF kredita IMH cca 4.661 KM + leasing rata
                Sparkasse Porsche Cayenne 1.027,91 EUR / cca 2.010 KM + rata pozajmice prema Lamiji Kacili 7.790,40 KM)
                <b> iznosi oko 14.460 KM svakog mjeseca</b>, prije plata, doprinosa i zakupa. Uz to, prekoračenja na računima
                iznose {km((fin.imh?.overdraft ?? 0) + (fin.idss?.overdraft ?? 0))} ({periodLabel}). Prebijanjem obaveze prema osnivaču
                mjesečni odliv pada za 7.790 KM.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs my-4">
              <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
                <b>Finansijski leasing Sparkasse — Porsche Cayenne:</b>
                <br />• Ugovor broj 12546/26 od 14.07.2026. sa Sparkasse Leasing d.o.o. Sarajevo.
                <br />• Vozilo: Porsche Cayenne 2025.
                <br />• Neto vrijednost: 100.980,15 EUR. Učešće: 47.798,04 EUR (47,33%). Finansirano: 53.182,11 EUR.
                <br />• Rok: 60 mjeseci. Mjesečna rata: 1.027,91 EUR (6M Euribor + 3,44% marža; EKS s PDV 8,02%).
                <br />• Mjenični dužnik: Lamia Kacila. Vozilo se vodi na IMH, a koristi ga isključivo osnivač privatno: korist u naravi i nepriznati rashod.
                <br />• U knjigama IMH-a (31.10.2026.): vozilo 216.933,55 KM, obaveza po leasingu {km(fin.imh?.leasing, 2)}. Iznos uključuje i učešće koje je dao osnivač; amortizacija nije knjižena.
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
                <b>Ugovor o pozajmici Lamia Kacila ➔ IMH (datum na ugovoru 14.07.2026., potpisan 07.11.2026.):</b>
                <br />• <b>Zajmodavac:</b> KACILA LAMIA (osnivač; lični podaci izostavljeni)
                <br />• <b>Zajmoprimac:</b> PPU INTERNATIONAL MONTESSORI HOUSE (ID: 4201731140006, Buka 11, zastupa direktor Davor Mulalić)
                <br />• <b>Iznos pozajmice:</b> 93.484,84 KM (beskamatna, 0% kamate).
                <br />• <b>Predmet:</b> Predaja vozila PORSCHE 9YA CAYENNE (reg. oznaka i VIN izostavljeni) dobavljaču AUTO MT d.o.o. Mostar (Buna 154 A) kao učešće za novi Cayenne 2025.
                <br />• <b>Povrat:</b> 12 mjesečnih rata po 7.790,40 KM (zadnja 7.790,44 KM) na lični račun zajmodavca kod SPARKASSE BANK D.D. BIH.
                <br />• <b>Stvarna otplata:</b> prva uplata ≈4.400 KM 09.11.2026., dalje sukcesivno prema raspoloživoj gotovini. Preporuka: prebijanje s potraživanjima od osnivača.
                <br />• <b>Ugovorna sankcija (Čl. 6):</b> Kašnjenje dvije uzastopne rate daje pravo Zajmodavcu da pisanim putem zahtijeva vraćanje <u>cijelog preostalog iznosa odjednom</u> sa zakonskim zateznim kamatama!
              </div>
            </div>

            {/* PUN OTPLATNI PLAN IZ PRILOGA 1 UGOVORA O POZAJMICI */}
            <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] my-5">
              <div className="flex items-center justify-between mb-2">
                <span className="eyebrow text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]">
                  PRILOG 1 UGOVORA O POZAJMICI OD 14.07.2026. — OTPLATNI PLAN
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  93.484,84 KM · 12 RATA · 0% KAMATE
                </span>
              </div>
              <p className="text-xs text-[var(--muted)] mb-3">
                Zvanični dinamički plan dospijeća 12 mjesečnih anuiteta prema Ugovoru o pozajmici zaključenom između Kacila Lamie i PPU International Montessori House:
              </p>
              <div className="table-wrap my-2">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Rata</th>
                      <th scope="col">Rok dospijeća</th>
                      <th scope="col">Iznos rate (KM)</th>
                      <th scope="col">Preostali dug (KM)</th>
                      <th scope="col">Račun za uplatu / Napomena</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LOAN_REPAYMENT_SCHEDULE.map((s) => (
                      <tr key={s.installmentNo}>
                        <td><b>{s.installmentNo}. rata</b></td>
                        <td><b>{s.dueDate}</b></td>
                        <td className="font-bold text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]">
                          {formatBs(s.amountKM, 2)} KM
                        </td>
                        <td>{formatBs(s.remainingDebtKM, 2)} KM</td>
                        <td className="text-[11px] text-[var(--muted)]">
                          Sparkasse (lični račun zajmodavca) {s.installmentNo === 1 ? '(Prva dospjela rata)' : s.installmentNo === 12 ? '(Konačno poravnanje duga)' : ''}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-[var(--surface)] font-bold">
                      <td colSpan={2}><b>UKUPNO OTPLAĆENO:</b></td>
                      <td className="text-[var(--imh-green)]"><b>93.484,84 KM</b></td>
                      <td><b>0,00 KM</b></td>
                      <td className="text-[11px] text-[var(--imh-green)] font-bold">Potpuno zatvaranje pozajmice 01.10.2027.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[var(--line)] text-xs text-[var(--muted)]">
                <div>
                  <b>Zajmodavac:</b> Kacila Lamia s.r. · <b>Zajmoprimac:</b> PPU IMH (direktor Davor Mulalić s.r., M.P.)
                </div>
                <div className="text-[11px]">
                  Mjesto: Sarajevo · Datum: 14.07.2026. · Broj primjeraka: 4 (četiri)
                </div>
              </div>
            </div>

            {/* DETALJNI PRAVNI I FINANSIJSKI PREGLED UGOVORA O ZAKUPU SA OPĆINOM CENTAR */}
            <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] my-5">
              <div className="flex items-center justify-between mb-2">
                <span className="eyebrow text-emerald-600 dark:text-emerald-400 font-extrabold">
                  UGOVOR O ZAKUPU · ZGRADA BUKA 11 I 13 (PRODUŽENJE DO 2033. PREMA UPRAVI [U])
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  VAŽNOST DO 2033. · ISTI USLOVI (5,00 KM/m² · 1.287,40 m²)
                </span>
              </div>
              <p className="text-xs text-[var(--muted)] mb-3">
                Nakon prvobitnog 10-godišnjeg ugovora (br. 04-49-36-59/13), prema podacima uprave <b>zaključen je novi ugovor s Općinom Centar s rokom važenja do 2033. godine pod istim uslovima</b>; dokument treba dostaviti na verifikaciju:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
                <div className="p-3 rounded-lg border border-[var(--line)] bg-[var(--surface)]">
                  <b>Ugovorne strane i ugovorni status do 2033.:</b>
                  <br />• <b>Zakupodavac:</b> Općina Centar Sarajevo, Mis Irbina 1.
                  <br />• <b>Zakupac:</b> PPU THE INTERNATIONAL MONTESSORI HOUSE (Buka 11).
                  <br />• <b>Predmet i površina:</b> Poslovna zgrada u ulici Buka 11 i 13, ukupne površine <b>1.287,40 m²</b>.
                  <br />• <b>Namjena:</b> Isključivo iz oblasti obrazovanja za cjelokupan kampus IDSS i IMH.
                  <br />• <b>Ugovorni rok:</b> do 2033. prema podacima uprave [U].
                </div>
                <div className="p-3 rounded-lg border border-[var(--line)] bg-[var(--surface)]">
                  <b>Identični finansijski uslovi zakupa do 2033.:</b>
                  <br />• <b>Nepromijenjena cijena:</b> Fiksno <b>5,00 KM po m² neto</b> = <b>6.437,00 KM/mj.</b> + PDV 17% (1.094,29 KM) = <b>7.531,29 KM mjesečno</b>.
                  <br />• <b>Tržišna ušteda:</b> Komercijalne cijene za 1.287 m² u Centru kreću se 15–25 KM/m², što donosi ustanovi preko 150.000 KM uštede godišnje.
                  <br />• <b>Rok dospijeća:</b> Do 15-tog u mjesecu unaprijed na račun Općine Centar.
                  <br />• <b>Režije:</b> Snosi zakupac (struja, voda, grijanje, odvoz smeća, održavanje).
                </div>
              </div>

              <div className="p-3 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/20 text-xs">
                <b className="text-amber-900 dark:text-amber-300">HISTORIJAT ANEKSA OD 13.03.2014. I PRAVNI RIZIK ČLANA XIV:</b>
                <p className="mt-1 mb-2 text-[var(--ink)] leading-relaxed">
                  Aneksom broj 04-49-13-12/14 Općina Centar je priznala 60% od 97.993,10 KM izvršenih nužnih ulaganja zakupca (ukupno <b>58.795,86 KM</b>).
                  Od toga je <b>48.187,74 KM</b> kompenzirano sa dospjelim dugom na dan 15.03.2014., a preostalih <b>10.608,12 KM</b> kroz umanjenje
                  zakupnine za 1.178,68 KM mjesečno (plaćano 5.258,32 KM neto) tokom 9 mjeseci do 31.12.2014. godine.
                </p>
                <p className="m-0 text-[var(--idss-red)] font-semibold">
                  ⚠️ <b>Član XIV (Raskid ugovora):</b> Ako zakupac ne plati <u>dvije dospjele zakupnine</u> u roku od 15 dana od prijema opomene,
                  Općina Centar ima pravo na jednostrani raskid ugovora. Na 31.10.2026. kartica Općine u IMH-u pokazuje pretplatu (22.469 KM) uz
                  2 neproknjižene fakture; prioritet je usaglašavanje stanja s Općinom i uredno plaćanje 7.531,29 KM do 15. u mjesecu.
                </p>
              </div>
            </div>

            {/* POGLAVLJE 7 */}
            <h2 id="sec-7-upis-komercijala">7. ANALIZA UPISA I KOMERCIJALNE SLIKE</h2>
            <p>
              Upis u IDSS-u bilježi jasne oscilacije: sa 79 učenika (2023/24.) na vrhunac od 94 učenika (2024/25.),
              nakon čega je uslijedio pad na 68 učenika (2025/26., -28%), te oporavak na 83 učenika u 2026/27. godini.
            </p>
            <p>
              <b>Uzrok pada u 2025/26. godini:</b> Prema upravi, pad je uglavnom posljedica odlaska stranih porodica nakon
              isteka mandata roditelja [U]; uzrok nije dokumentovan, pa analiza ispisa po razlozima mora postati dio
              godišnjeg izvještavanja. Pad od 28% pokazuje osjetljivost na miks upisa.
              Zato je obrazovna vertikala IMH ➔ IDSS (domaće porodice s višegodišnjim životnim ciklusom) primarni hedge
              protiv fluktuacije stranog diplomatskog kora.
            </p>

            {/* POGLAVLJE 8 */}
            <h2 id="sec-8-swot">8. SWOT ANALIZA S OPSERVACIJAMA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="p-4 rounded-xl border border-[var(--imh-green)] bg-[var(--surface)]">
                <span className="eyebrow text-[var(--imh-green)] block mb-1">SNAGE</span>
                <ul className="text-xs space-y-1 m-0 p-0 list-none">
                  <li>• Funkcionalna vertikala sa 64% prelaska (7 od 11 učenika).</li>
                  <li>• Komplementarni programi: Montessori i njemački kurikulum.</li>
                  <li>• Rast prihoda 2023–2025. (+12,2%). Prihodna strana je zdrava.</li>
                  <li>• Zajednički kompleks Buka 11/13 smanjuje troškove po entitetu.</li>
                  <li>• Uveden TC elaborat (84 fakture) – profesionalizacija je započeta.</li>
                  <li>• Oporavak upisa u 2026/27. (83 učenika).</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-[var(--idss-red)] bg-[var(--surface)]">
                <span className="eyebrow text-[var(--idss-red)] block mb-1">SLABOSTI</span>
                <ul className="text-xs space-y-1 m-0 p-0 list-none">
                  <li>• Negativan vlastiti kapital oba subjekta ({km(g?.equity)} zbirno).</li>
                  <li>• Visok udio plata (64% do 76% rashoda, 90,4% školarine). Niska operativna poluga.</li>
                  <li>• Napeta gotovina: na računima ≈{km(g?.bankCash)} naspram {km(g?.deposits)} depozita roditelja.</li>
                  <li>• Neusaglašen zakup s Općinom i nezatvoreni prelazni konti.</li>
                  <li>• Fakture IDSS → IMH od 100.000 KM bez ugovora i dokaza o radovima.</li>
                  <li>• Bruto bilans IDSS-a na 31.10.2026. nije u ravnoteži (−812,54 KM).</li>
                  <li>• Leasing luksuznog Cayennea (1.028 EUR/mj.) uz ličnu upotrebu.</li>
                  <li>• Sezonalnost prihoda: ljetni mjeseci operativno negativni.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-[var(--idss-cyan)] bg-[var(--surface)]">
                <span className="eyebrow text-[var(--idss-cyan)] block mb-1">PRILIKE</span>
                <ul className="text-xs space-y-1 m-0 p-0 list-none">
                  <li>• Jačanje vertikale i porodičnih popusta (podizanje sa 64% na 75-80%).</li>
                  <li>• Stabilan upis na nivou 90 do 95 učenika bez dodatnog zapošljavanja.</li>
                  <li>• Razvoj dodatnih programa (ljetni kampovi, STEM, jezici, boravak).</li>
                  <li>• Formalizacija plana otplate duga za zakup s Općinom Centar.</li>
                  <li>• Prelazak grupe u pozitivan vlastiti kapital do kraja 2028.</li>
                  <li>• Digitalizacija administracije i automatska naplata školarina.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-[var(--idss-yellow)] bg-[var(--surface)]">
                <span className="eyebrow text-[var(--idss-yellow)] block mb-1">PRIJETNJE</span>
                <ul className="text-xs space-y-1 m-0 p-0 list-none">
                  <li>• Promjena uslova zakupa ili gubitak lokacije Buka 11/13.</li>
                  <li>• Poreski i inspekcijski rizici: ugovori o djelu IDSS (93.117 KM u 10 mj. 2026.), transferne cijene, privatna upotreba vozila.</li>
                  <li>• Kašnjenje kantonalnih subvencija prema roditeljima (prolazna stavka koju IMH preusmjerava).</li>
                  <li>• Povećanje Euribora na leasing ratu Cayennea.</li>
                  <li>• Ovisnost o ključnim osobama (direktor, računovođa, osnivač kao garant).</li>
                  <li>• Ponavljanje fluktuacije i odlaska stranih diplomatskih porodica.</li>
                </ul>
              </div>
            </div>

            {/* POGLAVLJE 9 */}
            <h2 id="sec-9-vizija-stubovi">9. STRATEŠKA VIZIJA I PLAN 2027. DO 2032.</h2>
            <p>
              <b>Vizija:</b> Postati referentan i kapitalno zdrav edukacijski sistem u Sarajevu i šire, s
              pozitivnim vlastitim kapitalom do kraja 2028., EBITDA maržom iznad 9% do 2028/29 i 12,6% do 2031/32 (bazni scenarij),
              discipliniranim cash-flowom i jasnom vertikalom. Vizija nije agresivan rast po svaku cijenu, već
              održivi rast na očišćenoj i transparentnoj bazi.
            </p>

            <div className="space-y-3 my-4">
              <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
                <b>Stub 1: Stabilizacija i čišćenje (Q4 2026. do Q2 2027.)</b>
                <br />Dokumentacija faktura od 100.000 KM; prebijanje obaveze prema osnivaču (93.484,84 KM); usaglašavanje
                zakupa s Općinom i redovno plaćanje tekućeg; mjesečni cash-flow forecasting koji uključuje
                plate, doprinose, zakup, anuitete, leasing ratu i rate pozajmice; potvrda Porezne uprave; usklađivanje
                međufirmskih salda.
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
                <b>Stub 2: Konsolidacija i rast upisa (2027. do 2028.)</b>
                <br />Stabilan upis IDSS-a na razini 90 do 95 učenika uz dokumentirani plan zadržavanja. Troškovi rada
                najviše 72% prihoda do 2028/29. Prelazak grupe u pozitivan kapital do kraja
                2028.
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
                <b>Stub 3: Razvoj i diverzifikacija (2029. do 2032.)</b>
                <br />Dodatni programi (ljetni kampovi, STEM, bilingvalni moduli), razmatranje proširenja kapaciteta nakon
                stabilizacije, kontinuirani monitoring transfernih cijena i priprema za eventualnu transakciju na očišćenoj
                bazi. Bazni scenarij 2031/32: prihod 2,35 miliona KM i EBITDA marža 12,6%.
              </div>
            </div>

            {/* POGLAVLJE 10 */}
            <h2 id="sec-10-upravljanje-rizicima">10. UPRAVLJANJE RIZICIMA</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Rizik</th>
                    <th scope="col">Vjerovatnoća</th>
                    <th scope="col">Uticaj</th>
                    <th scope="col">Mitigacijska mjera</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Fakture IDSS → IMH 100.000 KM (kredit MF Banke)</td>
                    <td>Srednja</td>
                    <td className="text-[var(--idss-red)] font-bold">Visok</td>
                    <td>Ugovor i dokazi o izvedenim radovima; usaglasiti razliku od 12.200 KM; koristiti normalizovani rezultat.</td>
                  </tr>
                  <tr>
                    <td>Leasing Cayenne (1.028 EUR/mj.)</td>
                    <td>Srednja</td>
                    <td className="text-[var(--idss-red)] font-bold">Visok</td>
                    <td>Prenos leasinga na osnivača ili obračun koristi u naravi; ispraviti knjiženje učešća.</td>
                  </tr>
                  <tr>
                    <td>Solidarni dužnici i mjenice</td>
                    <td>Srednja</td>
                    <td className="text-[var(--idss-red)] font-bold">Visok</td>
                    <td>Transparentan registar izloženosti prema banci i leasingu.</td>
                  </tr>
                  <tr>
                    <td>Potraživanja od zaposlenih (184.692 KM)</td>
                    <td>Niska-srednja</td>
                    <td>Srednji</td>
                    <td>Prebijanje s obavezom prema osnivaču (93.484,84 KM); za 91.207 KM priznanje duga i otplatni plan.</td>
                  </tr>
                  <tr>
                    <td>Likvidnost i servis duga (≈14,5k/mj.)</td>
                    <td>Srednja</td>
                    <td className="text-[var(--idss-red)] font-bold">Visok</td>
                    <td>Jedinstveni mjesečni cash-flow list; disciplina i rezerva za ljeto.</td>
                  </tr>
                  <tr>
                    <td>Oscilacija upisa (pad 28%)</td>
                    <td>Srednja</td>
                    <td className="text-[var(--idss-red)] font-bold">Visok</td>
                    <td>Plan zadržavanja porodica; jačanje domaće baze kroz IMH vertikalu.</td>
                  </tr>
                  <tr>
                    <td>Usaglašenost zakupa Buka 11/13</td>
                    <td>Srednja</td>
                    <td className="text-[var(--idss-red)] font-bold">Visok</td>
                    <td>Izvod otvorenih stavki s Općinom; knjiženje svih faktura; ugovor do 2033. u data room.</td>
                  </tr>
                  <tr>
                    <td>UOD preklasifikacija (93.117 KM, jan–okt 2026.)</td>
                    <td>Srednja</td>
                    <td>Srednji</td>
                    <td>Pravni pregled ugovora; prevođenje u dopunski rad.</td>
                  </tr>
                  <tr>
                    <td>Poreski (sporazumi {km(g?.publicAgreements)} neizmireni; doprinosi IMH ≈4 obračuna)</td>
                    <td>Visoka</td>
                    <td className="text-[var(--idss-red)] font-bold">Visok</td>
                    <td>Potvrda Porezne uprave; plan izmirenja; redovno ažuriranje TC dokumentacije.</td>
                  </tr>
                  <tr>
                    <td>Integritet knjiga (bilans IDSS nije u ravnoteži; prelazni konti otvoreni)</td>
                    <td>Visoka</td>
                    <td className="text-[var(--idss-red)] font-bold">Visok</td>
                    <td>Računovođa objašnjava razliku od 812,54 KM; mjesečno zatvaranje prelaznih konta.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="note">
              <b>Opservacija o rizicima:</b> Najveći rizik nije jedan izolovani događaj, već <b>kumulacija</b>: napeta
              likvidnost plus neusaglašen zakup plus stalan odliv leasinga i kredita (≈14.460 KM/mj.) plus eventualni novi
              pad upisa. Zato je jedinstveni mjesečni cash-flow list svih odliva prioritet broj jedan.
            </p>

            {/* VIZUELNA MATRICA RIZIKA (RF-02 do RF-07) SA DVOSTRUKOM OSOM I PLANOVIMA MITIGACIJE */}
            <div className="my-6">
              <RiskMatrixVisual resolvedRiskIds={resolvedRiskIds} />
            </div>

            {/* SIMULATOR RIZIKA (INTERAKTIVNI DIREKTORSKI MODEL) */}
            <RiskSimulator />

            {/* POGLAVLJE 11 */}
            <h2 id="sec-11-akcijski-plan">11. AKCIJSKI PLAN</h2>
            <h3 id="sub-11-1-neodlozivo">11.1. Neodloživo (0 do 30 dana)</h3>
            <ol className="text-xs space-y-2 pl-4">
              <li>
                <b>1. Napravi jedan mjesečni cash-flow list:</b> plate, doprinosi, zakup (tekući plus dug), anuiteti MF,
                leasing rata, rate pozajmice (od 01.11.2026.), ostali fiksni odlivi.
              </li>
              <li>
                <b>2. Interni memo o toku 100.000 KM za arhivu:</b> nalozi, fakture, obrazloženje namjene kredita.
              </li>
              <li>
                <b>3. Prebij obavezu prema osnivaču (93.484,84 KM)</b> s potraživanjima od osnivača i zamijeni ugovor ugovorom s datumom potpisa (07.11.2026.).
              </li>
              <li>
                <b>4. Usaglašavanje s Općinom:</b> 2 neproknjižene fakture i pretplata 22.469 KM; redovno plaćanje do 15. u mjesecu.
              </li>
              <li>
                <b>5. Neravnoteža bruto bilansa IDSS-a (812,54 KM):</b> računovođa mora pronaći i ispraviti razliku prije svakog vanjskog izvještaja.
              </li>
            </ol>

            <h3 id="sub-11-2-srednjorocno">11.2. Srednjoročno (30 do 100 dana)</h3>
            <ol className="text-xs space-y-2 pl-4">
              <li><b>1. Dokumentiraj fluktuaciju upisa:</b> analiza odlaska stranih porodica naspram domaće baze.</li>
              <li><b>2. Pregled UOD-a:</b> pravna analiza rizika preklasifikacije ugovora o djelu (93.117 KM u 10 mj. 2026.).</li>
              <li><b>3. Usklađivanje međufirmskih salda:</b> razlike od 6.297,05 KM (fakture IMH → IDSS) i 12.200 KM (plaćanje 100.000 KM), avans od 32.150 KM.</li>
              <li><b>4. Potvrda Porezne uprave:</b> službeno uvjerenje o stanju duga i doprinosa.</li>
              <li><b>5. Formalizacija ostatka potraživanja:</b> rješavanje iznosa iznad 93.484,84 KM (cca 91.207 KM).</li>
            </ol>

            <h3 id="sub-11-3-srednjorocni-ciljevi">11.3. Ciljevi 2027. do 2028. i 2029. do 2032.</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs my-3">
              <div className="p-3 rounded-lg border border-[var(--line)] bg-[var(--surface)]">
                <b>2027. do 2028.:</b>
                <br />• Stabilan upis 90 do 95 učenika.
                <br />• Troškovi rada najviše 72% prihoda (2028/29).
                <br />• Prelazak grupe u pozitivan vlastiti kapital do kraja 2028.
                <br />• Sve povezane pozajmice zatvorene ili pod jasnim planom.
              </div>
              <div className="p-3 rounded-lg border border-[var(--line)] bg-[var(--surface)]">
                <b>2029. do 2032.:</b>
                <br />• Diverzifikacija programa (ljetne škole, STEM, jezici).
                <br />• Jačanje vertikale na 75-80% konverzije.
                <br />• EBITDA marža 12,6% (bazni scenarij 2031/32).
                <br />• Priprema za eventualnu transakciju na očišćenoj bazi.
              </div>
            </div>

            {/* POGLAVLJE 12 - NOVO: DETALJNA ANALIZA PO ENTITETIMA */}
            <h2 id="sec-12-analiza-entiteti">12. DETALJNA ANALIZA PO ENTITETIMA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
              <div className="p-4 rounded-xl border border-[var(--idss-blue)] bg-[var(--surface)]">
                <span className="eyebrow text-[var(--idss-blue)] dark:text-[var(--idss-cyan)] block mb-1">
                  12.1. IDSS (OSNOVNA ŠKOLA)
                </span>
                <p className="text-xs leading-relaxed">
                  IDSS je nosilac osnovnog obrazovanja. Prihodi su rasli sa 633.571 KM (2022.) na 899.881 KM (2025.,
                  +42%), što dokazuje tržišno prihvatanje njemačkog kurikuluma. Formalni gubitak 2025. od 9.501 KM je
                  posljedica TC raspodjele.
                  <br /><br />
                  <b>Rigidnost troškova:</b> Plate čine 75,7% rashoda. Pri 83 učenika i školarinama od cca 779.476 KM,
                  trošak rada od 704.517 KM ostavlja samo 74.959 KM za sve ostalo. U 10 mjeseci 2026. IDSS je bez 100.000 KM od IMH-a na nuli (−225 KM).
                  <br /><br />
                  <b>Kreditna izloženost ({fin.idss?.periodTo}):</b> kredit MF {km(fin.idss?.bankLoans)}, prekoračenje {km(fin.idss?.overdraft)},
                  zajam od partnera bez naziva 23.700 KM (konto 4221-110), neisplaćene neto plate {km(fin.idss?.netSalariesPayable)}.
                  <br /><br />
                  <b>Poluga upravljanja:</b> volumen upisa i cjenovna disciplina; prelomna tačka škole je oko 98 učenika.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[var(--imh-green)] bg-[var(--surface)]">
                <span className="eyebrow text-[var(--imh-green)] block mb-1">
                  12.2. IMH (MONTESSORI VRTIĆ)
                </span>
                <p className="text-xs leading-relaxed">
                  IMH je stabilniji generator dobiti (+63.815 KM u 2025.). Prihodi 2025. od 900.571 KM izjednačeni su
                  sa školom. Udio plata od 64,4% je povoljniji, ali i dalje visok.
                  <br /><br />
                  <b>Fiksni odlivi i servis duga:</b> IMH nosi glavninu duga grupe: kredit MF {km(fin.imh?.bankLoans)} (rata ≈4.661 KM),
                  prekoračenje {km(fin.imh?.overdraft)}, leasing {km(fin.imh?.leasing)}, obavezu prema osnivaču (93.485 KM) i zakup Buka 11.
                  <br /><br />
                  <b>Kantonalne subvencije (Prolazna stavka za roditelje):</b> {km(fin.imh?.ministrySubsidies)} do {fin.imh?.periodTo} su <u>strogo prolazna sredstva</u>.
                  Roditelji plaćaju punu školarinu IMH-u, IMH šalje mjesečni izvještaj Ministarstvu KS, a primljeni iznos subvencije
                  IMH u cjelosti prosljeđuje roditeljima na njihove račune. IMH nema finansijske koristi od subvencija i <b>ne zavisi od njih</b>.
                  Ako Ministarstvo kasni, IMH nema šta prebaciti roditeljima, ali redovni prihodi, likvidnost i plate IMH-a ostaju potpuno stabilni.
                  <br /><br />
                  <b>Poluga upravljanja:</b> IMH se spašava volumenom predškolaca i strogom disciplinom servisa fiksnog
                  duga.
                </p>
              </div>
            </div>

            <p className="note">
              <b>12.3. Grupa kao cjelina:</b> Ekonomska cjelina je jasnija od pravne. Zajednički prostor, direktor,
              računovođa, TC tokovi i solidarni dugovi čine jednu grupu. Najveća slabost je što se likvidnosni pritisci
              i povezane transakcije lako prelijevaju s jednog entiteta na drugi. <i>"Gledaj IDSS i IMH odvojeno zbog
              pravne odgovornosti i bankarskih ugovora. Gledaj ih zajedno zbog cash-flowa, vertikale i rizika."</i>
            </p>

            {/* POGLAVLJE 13 - NOVO: CASH-FLOW DISCIPLINA I OPERATIVNI RITAM */}
            <h2 id="sec-13-cash-flow-ritam">13. CASH-FLOW DISCIPLINA I OPERATIVNI RITAM</h2>
            <p>
              Rezultat po knjigama od {km(g?.resultBooks)} stvara lažni osjećaj komfora. Normalizovani rezultat od
              {' '}{km(g?.resultNormalized)} i stvarna gotovina na računima od oko {km(g?.bankCash)} govore drugo. Fiksni odlivi
              (≈14.460 KM duga, plate i zakup) dospijevaju svakog mjeseca bez obzira na ljetnu pauzu školarina.
            </p>

            <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] my-3">
              <span className="eyebrow block mb-2">OPERATIVNI KALENDARSKI RITAM</span>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded bg-[var(--surface-alt)] border border-[var(--line)]">
                  <b>Svakog 5. u mjesecu:</b>
                  <p className="text-[11px] text-[var(--muted)] m-0 mt-1">
                    Zatvaranje prethodnog mjeseca (prihodi, stvarni odlivi, stanje gotovine IDSS i IMH).
                  </p>
                </div>
                <div className="p-2.5 rounded bg-[var(--surface-alt)] border border-[var(--line)]">
                  <b>Svakog 10. u mjesecu:</b>
                  <p className="text-[11px] text-[var(--muted)] m-0 mt-1">
                    Rolling cash-flow forecast za tekući i naredna dva mjeseca (anticipiranje ljetne rupe).
                  </p>
                </div>
                <div className="p-2.5 rounded bg-[var(--surface-alt)] border border-[var(--line)]">
                  <b>Svakog kvartala:</b>
                  <p className="text-[11px] text-[var(--muted)] m-0 mt-1">
                    Pregled kapitala, upisa, TC usklađenosti i statusa otvorenih stavki (memo 100k, dug zakupa).
                  </p>
                </div>
                <div className="p-2.5 rounded bg-[var(--surface-alt)] border border-[var(--line)]">
                  <b>Godišnje:</b>
                  <p className="text-[11px] text-[var(--muted)] m-0 mt-1">
                    Ažuriranje studije transfernih cijena, revizija cjenovnika prema inflaciji, plan upisa.
                  </p>
                </div>
              </div>
            </div>

            {/* INTERAKTIVNI FORENZIČKI CASH-FLOW FORECAST GRAFIKON (RECHARTS) */}
            <CashFlowForecastVisual />

            {/* POGLAVLJE 14 - NOVO: SCENARIJI UPISA I OSJETLJIVOST */}
            <h2 id="sec-14-scenariji-upisa">14. SCENARIJI UPISA I OSJETLJIVOST (IDSS)</h2>
            <p>
              Jedinična ekonomika iz izvještaja: prihod po učeniku 9.391 KM, puni godišnji trošak škole 900.153 KM pri 83
              učenika, direktni trošak dodatnog učenika oko 1.200 KM [P]. Prije ostalih prihoda (ljetna škola, dodatne usluge).
            </p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Učenika</th>
                    <th scope="col">Prihod (× 9.391 KM)</th>
                    <th scope="col">Ukupni trošak škole</th>
                    <th scope="col">Rezultat škole</th>
                  </tr>
                </thead>
                <tbody>
                  {[80, 83, 90, 95, 98, 102].map((n) => {
                    const rev = n * 9391;
                    const cost = 900153 + (n - 83) * 1200;
                    const res = rev - cost;
                    return (
                      <tr key={n}>
                        <td><b>{n}</b>{n === 83 ? ' (2026/27)' : n === 98 ? ' (prelomna tačka)' : n === 102 ? ' (cilj 2031/32)' : ''}</td>
                        <td>{km(rev)}</td>
                        <td>{km(cost)}</td>
                        <td className={res < 0 ? 'text-[var(--idss-red)] font-bold' : 'text-[var(--imh-green)] font-bold'}>{km(res)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* POGLAVLJE 15 - NOVO: DETALJNI OTPLATNI KALENDAR */}
            <h2 id="sec-15-otplatni-kalendar">15. DETALJNI OTPLATNI KALENDAR I LIKVIDNOSNI PRITISCI</h2>
            <p>
              Ugovor s osnivačem predviđa 12 rata po 7.790,40 KM od 01.11.2026.; stvarno je 09.11.2026. uplaćeno oko 4.400 KM,
              a dalje se plaća sukcesivno. Preporuka je prebijanje umjesto isplate. Paralelno teku leasing rate od 1.027,91
              EUR/mj. i anuitet kredita IMH od oko 4.661 KM. Prekoračenja na {periodLabel}: IMH {km(fin.imh?.overdraft)}, IDSS {km(fin.idss?.overdraft)}.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs my-4">
              <div className="p-3 rounded-lg border border-[var(--line)] bg-[var(--surface)]">
                <b>Nov. 2026. – Jan. 2027.:</b>
                <p className="text-[11px] text-[var(--muted)] m-0 mt-1">
                  Prebijanje obaveze prema osnivaču, leasing i anuiteti bez kašnjenja, usaglašavanje stanja zakupa
                  s Općinom Centar.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-[var(--line)] bg-[var(--surface)]">
                <b>Feb. – Maj 2027.:</b>
                <p className="text-[11px] text-[var(--muted)] m-0 mt-1">
                  Akumuliranje likvidnosne rezerve za ljeto; refinansiranje prekoračenja IMH-a; kampanja
                  ranog upisa za 2027/28.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-[var(--line)] bg-[var(--surface)]">
                <b>Juni – August 2027.:</b>
                <p className="text-[11px] text-[var(--muted)] m-0 mt-1">
                  Premošćavanje ljetne neoperativne sezone iz pripremljene rezerve bez kašnjenja plata i rata duga.
                </p>
              </div>
            </div>

            {/* POGLAVLJE 16 - NOVO: POSEBNI SAVJETI I LISTA ZABRANA */}
            <h2 id="sec-16-poslovni-savjeti-zabrane">16. POSEBNE OPSERVACIJE I ŠTA NE RADITI U NAREDNIH 12 MJESECI</h2>
            <div className="p-4 rounded-xl border border-[var(--idss-red)] bg-red-50/10 dark:bg-red-950/10 my-4">
              <span className="eyebrow text-[var(--idss-red)] block mb-2">LISTA IZRIČITIH ZABRANA ZA MENADŽMENT</span>
              <ul className="text-xs space-y-2 m-0 p-0 list-none text-[var(--ink)]">
                <li>✖ <b>Ne pokreći nove velike investicije</b> (prostor, nova vozila, preuranjena ekspanzija) dok cash-flow i dug za zakup nisu pod kontrolom.</li>
                <li>✖ <b>Ne isplaćuj dobit</b> dok grupni kapital nije bar na nuli ili jasan put do pozitivnog nije dokazan (pravilo: bez dividendi prije pozitivnog kapitala).</li>
                <li>✖ <b>Ne ponavljaj cirkularne tokove</b> poput stavke 100k kao rutinu. Ako treba likvidnost, traži čist instrument (garancija, kredit).</li>
                <li>✖ <b>Ne gradi projekcije na iskazanom rezultatu</b> koji uključuje 100k; jedini referentni broj je operativni rezultat.</li>
                <li>✖ <b>Ne povećavaj prekoračenja</b> ({km((fin.imh?.overdraft ?? 0) + (fin.idss?.overdraft ?? 0))} na {periodLabel}); refinansiraj ih dugoročnom linijom.</li>
                <li>✖ <b>Ne isplaćuj rate osnivaču</b> dok osnivač duguje grupi 184.692 KM: prebij obaveze.</li>
                <li>✖ <b>Ne knjiži kantonalne subvencije kao prihod</b>: to je prolazna stavka koju IMH prosljeđuje roditeljima.</li>
                <li>✖ <b>Ne štedi na formalizaciji:</b> interni memo, ugovori, poreske potvrde štite poslovanje više nego usmena obećanja.</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs my-4">
              <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
                <b>Plan komunikacije s osnivačem:</b>
                <br />Osnivač je solidarni dužnik za kredite IDSS-a, mjenični dužnik za leasing i strana u pozajmici.
                Predlaže se kvartalni sažetak na 1 stranici: gotovina, operativni rezultat, status rata duga, status
                zakupa, upis, 3 rizika i 3 akcije. Bez ukrasa, čiste brojke koje grade povjerenje.
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
                <b>Scenario imaginarnog Due Diligence-a:</b>
                <br />Šta vidi banka ili potencijalni investitor? Rast prihoda: pozitivno. Vertikala 64%: pozitivno.
                Negativan kapital: negativno. Fakture od 100.000 KM bez dokaza o radovima: negativno. Bilans IDSS-a koji nije u
                ravnoteži: negativno. Antedatiran ugovor o pozajmici: negativno dok se ne ispravi. Cilj je da sve stavke budu dokumentovane.
              </div>
            </div>

            {/* POGLAVLJE 17 - NOVO: OPERATIVNI PRIRUČNIK PRVIH 90 DANA */}
            <h2 id="sec-17-operativni-prirucnik-90-dana">17. OPERATIVNI PRIRUČNIK: PRVIH 90 DANA (SEDMICA PO SEDMICA)</h2>
            <div className="space-y-3 my-4 text-xs">
              <div className="p-3 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
                <b className="text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]">DANI 1 DO 30:</b>
                <ul className="mt-1 space-y-1 list-none p-0">
                  <li>• <i>Sedmica 1:</i> Sastaviti cash-flow list sa svim fiksnim odlivima za narednih 12 mjeseci i projekcijom prihoda.</li>
                  <li>• <i>Sedmica 2:</i> Pripremiti dokumentaciju za fakture od 100.000 KM (ugovor, radovi, izvodi) i potpisati izjavu o prebijanju s osnivačem.</li>
                  <li>• <i>Sedmica 3:</i> Zatražiti od Općine Centar izvod otvorenih stavki i usaglasiti 2 neproknjižene fakture.</li>
                  <li>• <i>Sedmica 4:</i> Zatražiti zvaničnu potvrdu Porezne uprave o stanju javnih obaveza i ažurirati starosnu strukturu potraživanja od roditelja.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
                <b className="text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]">DANI 31 DO 60:</b>
                <ul className="mt-1 space-y-1 list-none p-0">
                  <li>• Utemeljiti ritam: 5. u mjesecu zatvaranje, 10. u mjesecu forecast. Pratiti rate leasinga, kredita i pozajmice kao checklistu.</li>
                  <li>• Dokumentovati fluktuaciju upisa (strane porodice naspram domaće baze) za internu arhivu i banku.</li>
                  <li>• Uskladiti međufirmska salda s računovođom (analitičke kartice) kako bi se eliminisala neslaganja.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
                <b className="text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]">DANI 61 DO 90:</b>
                <ul className="mt-1 space-y-1 list-none p-0">
                  <li>• Ocijeniti da li je dogovor s Općinom Centar postignut i da li cash-flow ritam živi.</li>
                  <li>• Pripremiti kvartalni sažetak na jednoj stranici za osnivača.</li>
                  <li>• Postaviti ciljeve upisa za 2027/28. (cilj 90-95) i aktivnosti za jačanje vertikale (zajednički događaji, porodični popusti).</li>
                </ul>
              </div>
            </div>

            {/* POGLAVLJE 18 */}
            <h2 id="sec-18-rjecnik-i-zakljucak">18. RJEČNIK REFERENTNIH BROJEVA I ZAVRŠNA PORUKA</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Termin</th>
                    <th scope="col">Forenzička definicija za odlučivanje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>Operativni rezultat grupe</b></td>
                    <td>Iskazani rezultat minus jednokratne međufirmske stavke tipa 100k. Koristi se za sve stvarne odluke.</td>
                  </tr>
                  <tr>
                    <td><b>Gotovina</b></td>
                    <td>Saldo na računima, bez miješanja s depozitima roditelja kao da su slobodna sredstva.</td>
                  </tr>
                  <tr>
                    <td><b>Neto dug</b></td>
                    <td>Bankarski krediti i pozajmice minus gotovina. Leasing obaveze pratiti kao fiksni dugoročni teret.</td>
                  </tr>
                  <tr>
                    <td><b>ARPU</b></td>
                    <td>Ugovorena vrijednost školarina podijeljena brojem učenika (ne nominalna kataloška cijena).</td>
                  </tr>
                  <tr>
                    <td><b>Stopa prelaska</b></td>
                    <td>Udio prvačića koji dolaze iz IMH predškolske grupe (trenutno 64%).</td>
                  </tr>
                  <tr>
                    <td><b>Udio plata</b></td>
                    <td>Plate i doprinosi podijeljeni ukupnim rashodima ili prihodima, praćeno konzistentno.</td>
                  </tr>
                  <tr>
                    <td><b>Kapital grupe</b></td>
                    <td>Zbir vlastitog kapitala IDSS i IMH, prije ili poslije tekućeg rezultata.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <aside className="callout">
              <div className="callout-label">ZAVRŠNA STRATEŠKA PORUKA</div>
              <p>
                Model radi. Prihodi rastu. Vertikala postoji. Cjenovnik je konkurentan. IMH generira dobit. IDSS raste u
                prihodu. To je temelj na kojem se gradi.
                <br /><br />
                Istovremeno, likvidnost je napeta, kapital negativan, odlivi fiksni i značajni (≈14.460 KM/mj.), zakup nije
                usaglašen, a fakture od 100.000 KM iskrivljuju iskazani rezultat. To nije propast. To je poziv na
                disciplinu.
                <br /><br />
                Posao menadžmenta nije da izmisli novi biznis, već da učini postojeći biznis predvidivim: jedan cash-flow,
                uredan zakup, praćene rate, očišćene povezane stavke, stabilan upis, pozitivan kapital. Kad to stoji, sve
                ostalo postaje moguće i kredibilno.
              </p>
            </aside>

            {/* DODATAK */}
            <h2 id="dodatak-usaglasavanje">DODATAK: NAPOMENE ZA USAGLAŠAVANJE PODATAKA</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Područje / Pozicija</th>
                    <th scope="col">Iskazano u bilansima</th>
                    <th scope="col">Aritmetički zbir / Ugovor</th>
                    <th scope="col">Utvrđena razlika i preporuka</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Rezultat 8 mj. 2026.</td>
                    <td>175.864 KM</td>
                    <td>115.145 KM (IDSS) + 60.720 KM (IMH) = 175.865 KM</td>
                    <td>Razlika 1 KM usljed zaokruživanja; uskladiti u FIA obrascima.</td>
                  </tr>
                  <tr>
                    <td>Operativni rezultat 8 mj.</td>
                    <td>75.864 KM</td>
                    <td>15.145 KM (IDSS) + 60.720 KM (IMH) = 75.865 KM</td>
                    <td>Razlika 1 KM; potvrditi tretman 100k prije završnog računa.</td>
                  </tr>
                  <tr>
                    <td>Vlastiti kapital (31.12.2025.)</td>
                    <td>−37.328 KM (knjige 31.10.2026.)</td>
                    <td>IDSS −18.391,27 KM + IMH −18.936,30 KM = −37.327,57 KM</td>
                    <td>Mjerodavno je stanje iz knjiga. Izvođenje preko dobiti 2025. daje −37.302 KM; razlika od 26 KM je u IMH-u (23,75 KM na kontu 3000 i zaokruživanje).</td>
                  </tr>
                  <tr>
                    <td>Bruto bilans IDSS-a 31.10.2026.</td>
                    <td>Duguje 5.300.494,50 KM</td>
                    <td>Potražuje 5.301.307,04 KM</td>
                    <td>Bilans nije u ravnoteži za −812,54 KM; računovođa mora pronaći razliku.</td>
                  </tr>
                  <tr>
                    <td>Međusobne fakture IMH → IDSS</td>
                    <td>IMH 132.083,60 KM</td>
                    <td>IDSS 125.786,55 KM</td>
                    <td>Razlika 6.297,05 KM; usaglasiti izvodom otvorenih stavki.</td>
                  </tr>
                  <tr>
                    <td>Plaćanje faktura od 100.000 KM</td>
                    <td>IDSS naplaćeno 100.000 KM</td>
                    <td>IMH plaćeno 87.800 KM</td>
                    <td>Razlika 12.200 KM; provjeriti knjiženje sredstava kredita MF Banke u IMH-u.</td>
                  </tr>
                  <tr>
                    <td>Cjenovnik školarina 2026/27.</td>
                    <td>9.700 – 11.030 KM</td>
                    <td>9.700 – 11.970 KM (I–IV); 11.030 – 13.700 KM (V–IX)</td>
                    <td>Uskladiti diferencirane tarife za domaće i strane državljane u svim internim aktima.</td>
                  </tr>
                  <tr>
                    <td>Pad upisa 2025/26.</td>
                    <td>Zaokruženo 28%</td>
                    <td>Pad sa 94 na 68 učenika = tačno 27,66%</td>
                    <td>Uzrok prema upravi: odlazak stranih porodica [U]; nije dokumentovano.</td>
                  </tr>
                  <tr>
                    <td>Stopa konverzije IMH u IDSS</td>
                    <td>Zaokruženo 64%</td>
                    <td>7 učenika od 11 upisanih = tačno 63,64%</td>
                    <td>Ključni komercijalni argument i odbrana od fluktuacije stranog segmenta.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* POSEBAN DODATAK: FORENZIKA KARTICA PARTNERA (IMH / IDSS) */}
            <div className="my-10 pt-8 border-t-2 border-[var(--line)]">
              <h2 id="sec-forenzika-partnera" className="text-xl md:text-2xl font-black text-[var(--idss-blue)] dark:text-[var(--idss-cyan)] mb-2">
                DODATAK B: FORENZIKA KARTICE PARTNERA (OBRAZLOŽENJE DUG / PRETPLATA)
              </h2>
              <p className="text-xs text-[var(--muted)] mb-4">
                Pregled potraživanja od kupaca iz aktivnih bilansa i kartica. Učitana kartica kupaca prikazuje stanje po partneru samo u
                vašem pregledniku. Detaljni AI nalaz za pojedinačnog partnera radi samo na serveru s Gemini ključem; na javnoj verziji nije dostupan.
              </p>
              <PartnerCardForensics />
            </div>

            <h2 className="endmark">KRAJ DOKUMENTA</h2>
            <p className="text-center text-xs text-[var(--muted)]">
              Interni radni alat za upravljanje · Direktor Davor Mulalić · IDSS i IMH · 9. novembar 2026.
              <br />
              Samo za internu upotrebu.
            </p>
          </div>

          {/* Footer */}
          <footer className="footer">
            <span>
              IDSS + IMH · Sveobuhvatna forenzička i strateška analiza poslovanja 2022–2032. · Buka 11/13, Sarajevo
            </span>
            <span>
              Interni radni sistem · Podaci: bruto bilansi na {periodLabel}
            </span>
          </footer>
        </main>
      </div>

    </div>
  );
}
