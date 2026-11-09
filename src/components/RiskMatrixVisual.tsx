import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  X,
  Clock,
  UserCheck,
  Scale,
  DollarSign,
  ChevronRight,
  Info,
  Maximize2,
  Eye,
  FileText
} from 'lucide-react';
import { useFinancials, type FinancialState } from '../lib/bilans/store';
import { formatBs } from '../lib/bilans/parser';

export interface RiskMatrixItem {
  id: string; // 'RF-02' do 'RF-10'
  title: string;
  shortTitle: string;
  category: 'Porezni & Krivični Rizici' | 'Likvidnost & Trezor' | 'Imovinsko-Pravni Status' | 'Operativni & Troškovi Rada';
  severity: 'Kritično (CRITICAL)' | 'Visoko (HIGH)' | 'Srednje (MEDIUM)';
  amountKM: number;
  probVal: number; // 1 to 5 (X-axis: 1=Niska, 3=Srednja, 4=Visoka, 5=Vrlo visoka)
  impactVal: number; // 1 to 5 (Y-axis: 1=Podnošljiv, 3=Značajan, 4=Visok, 5=Katastrofalan)
  probLabel: string;
  impactLabel: string;
  zone: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  forensicFinding: string;
  statutoryBasis: string;
  systemicImpact: string;
  mitigationSteps: {
    urgent0to30: string[];
    medium30to90: string[];
    permanentPolicy: string[];
    responsiblePerson: string;
    targetDeadline: string;
  };
  harmonizationCondition: string;
}

const fmtKM = (n: number) => `${formatBs(Math.round(n))} KM`;

/** Rizici se računaju iz aktivnih bilansa (verifikovanih ili učitanih). */
export function buildMatrixRisks(fin: FinancialState): RiskMatrixItem[] {
  const idss = fin.idss;
  const imh = fin.imh;
  const g = fin.group;
  const period = g?.periodTo ?? '31.10.2026.';
  const months = imh?.months ?? 10;
  const imhBankCash = imh ? imh.cash - imh.cashInTransit : 0;
  const depositGap = imh ? Math.max(0, imh.deposits - imhBankCash) : 0;
  const rentExpected = Math.round(months) * 7531.29;
  const rentGap = imh?.rent !== null && imh?.rent !== undefined ? Math.max(0, rentExpected - imh.rent) : 0;
  const reconDiff = fin.recon.filter((r) => r.diff !== null && Math.abs(r.diff) >= 0.01 && !r.label.startsWith('Avans'));
  const reconSum = reconDiff.reduce((s, r) => s + Math.abs(r.diff ?? 0), 0);
  const imbalance = [fin.idssDoc, fin.imhDoc]
    .flatMap((d) => d?.issues ?? [])
    .filter((i) => i.severity === 'kritično' && /ravnotež/i.test(i.text))
    .reduce((s, i) => Math.max(s, Math.abs(i.amount ?? 0)), 0);
  const transit = g?.cashInTransit ?? 0;

  return [
    {
      id: 'RF-02',
      title: `Potraživanja od osnivača (${fmtKM(g?.receivablesFounder ?? 0)}) i obaveza IMH-a prema osnivaču (93.484,84 KM)`,
      shortTitle: 'Potraživanja od osnivača i obaveza prema osnivaču',
      category: 'Porezni & Krivični Rizici',
      severity: 'Kritično (CRITICAL)',
      amountKM: g?.receivablesFounder ?? 0,
      probVal: 3.8,
      impactVal: 4.8,
      probLabel: 'Srednje-visoka',
      impactLabel: 'Kritičan (prikrivena isplata dohotka)',
      zone: 'CRITICAL',
      forensicFinding: `Na ${period} potraživanja od zaposlenih, uprave i fizičkih lica iznose ${fmtKM(g?.receivablesFounder ?? 0)} i prema upravi ih cijela duguje osnivač obje ustanove. IMH istovremeno duguje osnivaču 93.484,84 KM (ranije vozilo osnivača dato kao učešće). Ugovor o tome potpisan je 07.11.2026., a nosi datum 14.07.2026.; prva uplata od oko 4.400 KM izvršena je 09.11.2026., a dalje se plaća sukcesivno.`,
      statutoryBasis: 'Zakon o porezu na dohodak FBiH (nenovčane koristi), Zakon o doprinosima FBiH, Zakon o obligacionim odnosima (prebijanje).',
      systemicImpact: 'Gotovinske uplate osnivaču dok osnivač duguje grupi dvostruko više smanjuju likvidnost bez ekonomskog razloga; nepokriven dio potraživanja porezni organ može tretirati kao prikriveni dohodak.',
      mitigationSteps: {
        urgent0to30: [
          'Potpisati izjavu o prebijanju obaveze IMH-a prema osnivaču (93.484,84 KM) s potraživanjima od osnivača.',
          'Zamijeniti ugovor o pozajmici ugovorom ili aneksom s datumom potpisa (07.11.2026.) koji potvrđuje obavezu nastalu 14.07.2026.',
        ],
        medium30to90: [
          'Za ostatak od oko 91.207 KM sačiniti pisano priznanje duga s otplatnim planom.',
          'Zabraniti plaćanje privatnih troškova osnivača s računa IMH-a i IDSS-a.',
        ],
        permanentPolicy: ['Registar transakcija s povezanim licima i godišnje usaglašavanje salda s revizorom.'],
        responsiblePerson: 'Direktor i računovođa',
        targetDeadline: 'Prebijanje u roku od 15 dana',
      },
      harmonizationCondition: 'Izjava o prebijanju i priznanje duga za ostatak potraživanja.',
    },
    {
      id: 'RF-03',
      title: `Depoziti roditelja (${fmtKM(imh?.deposits ?? 0)}) naspram stvarne gotovine IMH-a na računima (${fmtKM(imhBankCash)})`,
      shortTitle: 'Nepokriveni depoziti roditelja',
      category: 'Likvidnost & Trezor',
      severity: depositGap > 0 ? 'Kritično (CRITICAL)' : 'Srednje (MEDIUM)',
      amountKM: depositGap,
      probVal: 4.1,
      impactVal: 4.5,
      probLabel: 'Visoka pri kraju ciklusa',
      impactLabel: 'Kritičan (nelikvidnost i ugled)',
      zone: depositGap > 0 ? 'CRITICAL' : 'MEDIUM',
      forensicFinding: `Na ${period} depoziti roditelja u IMH-u iznose ${fmtKM(imh?.deposits ?? 0)}. Gotovina IMH-a u knjigama je ${fmtKM(imh?.cash ?? 0)}, ali ${fmtKM(imh?.cashInTransit ?? 0)} od toga stoji na prelaznim kontima, pa je stvarno na računima oko ${fmtKM(imhBankCash)}. Nepokriveni dio iznosi ${fmtKM(depositGap)}.`,
      statutoryBasis: 'Zakon o obligacionim odnosima FBiH (depoziti), Zakon o zaštiti potrošača BiH.',
      systemicImpact: 'Istovremeni zahtjevi više porodica za povrat depozita ustanova ne bi mogla isplatiti.',
      mitigationSteps: {
        urgent0to30: ['Zatvoriti prelazne konte i utvrditi stvarno stanje gotovine.', 'Otvoriti namjenski podračun za depozite.'],
        medium30to90: [`Sukcesivno izdvajati sredstva do pokrića nepokrivenog dijela (${fmtKM(depositGap)}).`],
        permanentPolicy: ['Mjesečni izvještaj o pokriću depozita gotovinom.'],
        responsiblePerson: 'Direktor i računovođa',
        targetDeadline: 'Namjenski račun u roku od 15 dana',
      },
      harmonizationCondition: 'Stvarna gotovina IMH-a na računima jednaka ili veća od depozita roditelja.',
    },
    {
      id: 'RF-04',
      title: 'Zakup Buka 11/13: neusaglašeno stanje s Općinom Centar',
      shortTitle: 'Zakup Buka 11/13 (Općina Centar)',
      category: 'Imovinsko-Pravni Status',
      severity: 'Visoko (HIGH)',
      amountKM: rentGap,
      probVal: 2.8,
      impactVal: 5.0,
      probLabel: 'Srednja',
      impactLabel: 'Katastrofalan (raskid ugovora)',
      zone: 'HIGH',
      forensicFinding: `Zakupnina iznosi 7.531,29 KM mjesečno. U IMH-u je do ${imh?.periodTo ?? period} trošak zakupa ${fmtKM(imh?.rent ?? 0)}, a za ${Math.round(months)} mjeseci očekuje se ${fmtKM(rentExpected)}; nedostaje ${fmtKM(rentGap)}. Kartica Općine na 31.10.2026. pokazivala je pretplatu od 22.469 KM. Produženje ugovora do 2033. potvrđeno je samo izjavom uprave [U]. Po članu XIV, neplaćanje dvije zakupnine nakon opomene daje Općini pravo na raskid.`,
      statutoryBasis: 'Ugovor o zakupu br. 04-49-36-59/13 (čl. XIV), aneks 04-49-13-12/14.',
      systemicImpact: 'Gubitak lokacije zaustavio bi rad obje ustanove.',
      mitigationSteps: {
        urgent0to30: ['Zatražiti izvod otvorenih stavki od Općine Centar.', 'Proknjižiti sve fakture zakupa za 2026.'],
        medium30to90: ['Uvrstiti ugovor do 2033. u data room.'],
        permanentPolicy: ['Trajni nalog za zakupninu do 15. u mjesecu.'],
        responsiblePerson: 'Direktor',
        targetDeadline: '30 dana',
      },
      harmonizationCondition: 'Usaglašen izvod otvorenih stavki s Općinom i dostavljen ugovor do 2033.',
    },
    {
      id: 'RF-05',
      title: `Subvencije Ministarstva KS (${fmtKM(imh?.ministrySubsidies ?? 0)} do ${imh?.periodTo ?? period}): prolazna stavka`,
      shortTitle: 'Subvencije KS (prolazna stavka)',
      category: 'Operativni & Troškovi Rada',
      severity: 'Srednje (MEDIUM)',
      amountKM: imh?.ministrySubsidies ?? 0,
      probVal: 1.8,
      impactVal: 1.5,
      probLabel: 'Niska',
      impactLabel: 'Nizak',
      zone: 'MEDIUM',
      forensicFinding: 'Roditelj plaća punu školarinu, IMH izvještava Ministarstvo, a primljenu subvenciju u cjelosti prosljeđuje roditeljima. Subvencija nije prihod IMH-a i ne utiče na rezultat; u knjigama se vodi preko konta 238800.',
      statutoryBasis: 'Javni poziv Ministarstva za odgoj i obrazovanje KS o sufinansiranju boravka djece.',
      systemicImpact: 'Rizik je samo administrativan: kašnjenje doznake prema roditeljima.',
      mitigationSteps: {
        urgent0to30: ['Redovni mjesečni izvještaji Ministarstvu.'],
        medium30to90: ['Evidencija prolaznih doznaka po porodici.'],
        permanentPolicy: ['Subvencije se nikad ne knjiže kao prihod IMH-a.'],
        responsiblePerson: 'Finansijska služba',
        targetDeadline: 'Trajno pravilo',
      },
      harmonizationCondition: 'Saldo konta 238800 usaglašen s isplatama roditeljima.',
    },
    {
      id: 'RF-06',
      title: `Ugovori o djelu u IDSS-u (${fmtKM(idss?.contractsWork ?? 0)} do ${idss?.periodTo ?? period})`,
      shortTitle: 'Ugovori o djelu za nastavu',
      category: 'Operativni & Troškovi Rada',
      severity: 'Visoko (HIGH)',
      amountKM: idss?.contractsWork ?? 0,
      probVal: 4.0,
      impactVal: 3.7,
      probLabel: 'Visoka',
      impactLabel: 'Značajan (preklasifikacija i kazne)',
      zone: 'HIGH',
      forensicFinding: `Troškovi ugovora o djelu u IDSS-u iznose ${fmtKM(idss?.contractsWork ?? 0)} za ${idss?.months ?? '–'} mjeseci (oko ${fmtKM((idss?.contractsWork ?? 0) / (idss?.months || 1))} mjesečno). Saradnici redovno izvode nastavu, a prema upravi zaposleni su u matičnim školama [U]. Godišnji nivo troškova rada IDSS-a (704.517 KM) iznosi 90,4% ugovorene vrijednosti školske godine.`,
      statutoryBasis: 'Zakon o radu FBiH (dopunski rad uz saglasnost matičnog poslodavca).',
      systemicImpact: 'Inspekcija rada može ugovore preklasifikovati u radni odnos s retroaktivnim doprinosima i kaznama.',
      mitigationSteps: {
        urgent0to30: ['Pravno mišljenje o statusu saradnika.'],
        medium30to90: ['Prelazak na dopunski rad uz saglasnost matičnih poslodavaca.'],
        permanentPolicy: ['Kadrovski plan prema popunjenosti razreda.'],
        responsiblePerson: 'Direktor i pravni savjetnik',
        targetDeadline: '90 dana',
      },
      harmonizationCondition: 'Saglasnosti matičnih poslodavaca i pravno mišljenje u data roomu.',
    },
    {
      id: 'RF-07',
      title: `Javne obaveze po sporazumima (${fmtKM(g?.publicAgreements ?? 0)}) i negativan kapital (${fmtKM(g?.equity ?? 0)})`,
      shortTitle: 'Javne obaveze i negativan kapital',
      category: 'Likvidnost & Trezor',
      severity: 'Visoko (HIGH)',
      amountKM: (g?.publicAgreements ?? 0) + Math.abs(Math.min(0, g?.equity ?? 0)),
      probVal: 4.4,
      impactVal: 3.6,
      probLabel: 'Visoka',
      impactLabel: 'Značajan (kamate, blokada)',
      zone: 'HIGH',
      forensicFinding: `Na ${period} obaveze po sporazumima s Poreznom upravom iznose ${fmtKM(g?.publicAgreements ?? 0)} (IDSS ${fmtKM(idss?.publicAgreements ?? 0)}, IMH ${fmtKM(imh?.publicAgreements ?? 0)}), ostale javne obaveze ${fmtKM(g?.publicCurrent ?? 0)}, a neisplaćene neto plate ${fmtKM(g?.netSalariesPayable ?? 0)}. Kapital grupe iznosi ${fmtKM(g?.equity ?? 0)}.`,
      statutoryBasis: 'Zakon o poreznoj upravi FBiH, Zakon o doprinosima FBiH.',
      systemicImpact: 'Kašnjenje javnih obaveza nosi zatezne kamate i rizik blokade računa; negativan kapital otežava kreditiranje.',
      mitigationSteps: {
        urgent0to30: ['Pribaviti uvjerenje Porezne uprave za obje ustanove.'],
        medium30to90: ['Plan izmirenja sporazuma i redovno plaćanje doprinosa uz plate.'],
        permanentPolicy: ['Zadržavanje dobiti do pozitivnog kapitala.'],
        responsiblePerson: 'Računovođa i direktor',
        targetDeadline: '30 dana za uvjerenje',
      },
      harmonizationCondition: 'Sporazumi izmireni (saldo 0) i kapital pozitivan.',
    },
    {
      id: 'RF-08',
      title: `Fakture IDSS → IMH (100.000 KM) i neusaglašena međusobna salda (${fmtKM(reconSum)})`,
      shortTitle: 'Fakture 100.000 KM i međusobna salda',
      category: 'Porezni & Krivični Rizici',
      severity: 'Visoko (HIGH)',
      amountKM: (idss?.revenueRelated ?? 0) + reconSum,
      probVal: 3.5,
      impactVal: 4.2,
      probLabel: 'Srednja',
      impactLabel: 'Visok (banka, porezni organ, revizija)',
      zone: 'HIGH',
      forensicFinding: `Za povlačenje namjenskog kredita MF Banke IDSS je IMH-u fakturisao usluge (renoviranje dvorišta i slično). IDSS to vodi kao prihod od povezanog lica (${fmtKM(idss?.revenueRelated ?? 0)}), a IMH kao ulaganje u tuđe objekte. ${reconDiff.map((r) => `${r.label}: razlika ${fmtKM(Math.abs(r.diff ?? 0))}`).join('; ')}.`,
      statutoryBasis: 'Ugovor o kreditu MF Banke (namjena), Zakon o porezu na dobit FBiH (transferne cijene), Zakon o računovodstvu i reviziji FBiH.',
      systemicImpact: 'Bez ugovora i dokaza o izvedenim radovima fakture se mogu smatrati fakturama bez stvarnog prometa.',
      mitigationSteps: {
        urgent0to30: ['Prikupiti dokaze o izvedenim radovima (ugovori, situacije, računi podizvođača, fotografije).'],
        medium30to90: ['Usaglasiti međusobna salda izvodom otvorenih stavki.', 'Nezavisna pravno-poreska ocjena.'],
        permanentPolicy: ['Ugovor o podjeli troškova i zabrana faktura bez ugovornog osnova.'],
        responsiblePerson: 'Direktor i računovođa',
        targetDeadline: '45 dana',
      },
      harmonizationCondition: 'Sva međusobna salda usaglašena i dokumentacija radova u data roomu.',
    },
    {
      id: 'RF-09',
      title: `Vozilo u leasingu za privatnu upotrebu osnivača (obaveza ${fmtKM(imh?.leasing ?? 0)})`,
      shortTitle: 'Vozilo u leasingu (privatna upotreba)',
      category: 'Porezni & Krivični Rizici',
      severity: 'Visoko (HIGH)',
      amountKM: imh?.leasing ?? 0,
      probVal: 4.0,
      impactVal: 3.0,
      probLabel: 'Visoka',
      impactLabel: 'Značajan (porez i nepriznati rashodi)',
      zone: 'HIGH',
      forensicFinding: `IMH je 14.07.2026. zaključio leasing za vozilo koje osnivač koristi isključivo privatno. U knjigama je obaveza po leasingu ${fmtKM(imh?.leasing ?? 0)}; iznos odgovara zbiru rata s kamatom i učešća, iako je učešće (93.484,84 KM) dao osnivač. Amortizacija vozila nije knjižena. Rata iznosi 1.027,91 EUR (≈2.010 KM) mjesečno.`,
      statutoryBasis: 'Zakon o porezu na dohodak FBiH (primici u naravi), Zakon o porezu na dobit FBiH (nepriznati rashodi).',
      systemicImpact: 'Korist u naravi podliježe porezu i doprinosima; troškovi vozila nisu priznat rashod; učešće može biti dvostruko iskazano.',
      mitigationSteps: {
        urgent0to30: ['Rekonstruisati knjiženje leasinga prema otplatnom planu Sparkasse Leasinga.'],
        medium30to90: ['Prenos ugovora o leasingu na osnivača ili obračun koristi u naravi.'],
        permanentPolicy: ['Putni nalozi i evidencija upotrebe za svako vozilo u vlasništvu ustanove.'],
        responsiblePerson: 'Direktor i poreski savjetnik',
        targetDeadline: '60 dana',
      },
      harmonizationCondition: 'Leasing knjižen po otplatnom planu, a tretman privatne upotrebe riješen.',
    },
    {
      id: 'RF-10',
      title: `Integritet knjiga: neravnoteža bilansa (${fmtKM(imbalance)}) i prelazni konti (${fmtKM(transit)})`,
      shortTitle: 'Integritet knjiga',
      category: 'Likvidnost & Trezor',
      severity: imbalance > 0 ? 'Kritično (CRITICAL)' : 'Visoko (HIGH)',
      amountKM: imbalance + Math.abs(transit),
      probVal: 4.5,
      impactVal: 4.0,
      probLabel: 'Visoka (utvrđeno)',
      impactLabel: 'Visok (pouzdanost svih brojki)',
      zone: imbalance > 0 ? 'CRITICAL' : 'HIGH',
      forensicFinding: `${imbalance > 0 ? `Bruto bilans nije u ravnoteži: razlika ukupnog duguje i potražuje iznosi ${fmtKM(imbalance)}. ` : ''}Na prelaznim kontima gotovine stoji ${fmtKM(transit)}, iako ti konti na kraju perioda moraju biti zatvoreni. Amortizacija u 2026. nije knjižena ni u jednoj ustanovi.`,
      statutoryBasis: 'Zakon o računovodstvu i reviziji FBiH, MSFI za MSP.',
      systemicImpact: 'Dok knjige nisu u ravnoteži, nijedan zbir nije pouzdan za banku, revizora ili vlasnika.',
      mitigationSteps: {
        urgent0to30: ['Računovođa pronalazi i ispravlja razliku.', 'Zatvaranje prelaznih konta.'],
        medium30to90: ['Mjesečno zatvaranje knjiga i obračun amortizacije.'],
        permanentPolicy: ['Kontrola ravnoteže bilansa prije svakog izvještaja.'],
        responsiblePerson: 'Računovođa',
        targetDeadline: '15 dana',
      },
      harmonizationCondition: 'Bilans u ravnoteži i prelazni konti zatvoreni.',
    },
  ];
}

interface RiskMatrixVisualProps {
  className?: string;
  resolvedRiskIds?: string[];
}

export const RiskMatrixVisual: React.FC<RiskMatrixVisualProps> = ({
  className = '',
  resolvedRiskIds = []
}) => {
  const fin = useFinancials();
  const MATRIX_RISKS = buildMatrixRisks(fin);
  const [selectedRisk, setSelectedRisk] = useState<RiskMatrixItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');

  const filteredRisks = MATRIX_RISKS.filter((r) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'CRITICAL') return r.severity.includes('CRITICAL');
    if (activeFilter === 'HIGH') return r.severity.includes('HIGH');
    if (activeFilter === 'MEDIUM') return r.severity.includes('MEDIUM');
    return true;
  });

  const totalExposedKM = MATRIX_RISKS.reduce((acc, r) => acc + r.amountKM, 0);
  const zoneSum = (z: RiskMatrixItem['zone']) => MATRIX_RISKS.filter((r) => r.zone === z).reduce((acc, r) => acc + r.amountKM, 0);
  const zoneIds = (z: RiskMatrixItem['zone']) => MATRIX_RISKS.filter((r) => r.zone === z).map((r) => r.id).join(', ');
  const sevCount = (s: string) => MATRIX_RISKS.filter((r) => r.severity.includes(s)).length;

  return (
    <div className={`p-6 md:p-8 rounded-2xl border-2 border-[var(--idss-blue)] bg-[var(--surface)] shadow-xl my-8 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow text-[var(--idss-blue)] dark:text-[var(--idss-cyan)] font-extrabold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              STRATEŠKI RADNI ALAT ZA DIREKTORA
            </span>
            <span className="text-[10px] font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.5 rounded-full uppercase">
              Aktivna matrica 5x5
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-[var(--ink)] m-0 mt-1">
            Vizuelna matrica crvenih zastavica (RF-02 do RF-10)
          </h3>
          <p className="text-xs text-[var(--muted)] m-0 mt-1">
            Mapiranje preostalih rizika po <b>vjerovatnoći nastanka (X-osa)</b> i <b>uticaju na poslovanje (Y-osa)</b>. Kliknite na bilo koju tačku za otvaranje detaljnog plana mitigacije.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-[var(--muted)]">Filter:</span>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setActiveFilter(filterKey)}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                activeFilter === filterKey
                  ? 'bg-[var(--idss-blue)] text-white shadow-xs'
                  : 'bg-[var(--surface-alt)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--idss-blue)]'
              }`}
            >
              {filterKey === 'ALL' && `Svi rizici (${MATRIX_RISKS.length})`}
              {filterKey === 'CRITICAL' && `Kritični (${sevCount('CRITICAL')})`}
              {filterKey === 'HIGH' && `Visoki (${sevCount('HIGH')})`}
              {filterKey === 'MEDIUM' && `Srednji (${sevCount('MEDIUM')})`}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-5">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--line)]">
          <span className="text-[11px] font-bold text-[var(--muted)] block">Ukupna finansijska izloženost:</span>
          <span className="text-lg font-black text-[var(--ink)]">{formatBs(Math.round(totalExposedKM))} KM</span>
        </div>
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
          <span className="text-[11px] font-bold text-red-700 dark:text-red-300 block">Kritična zona ({zoneIds('CRITICAL')}):</span>
          <span className="text-lg font-black text-red-800 dark:text-red-200">{formatBs(Math.round(zoneSum('CRITICAL')))} KM</span>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 block">Visoka zona ({zoneIds('HIGH')}):</span>
          <span className="text-lg font-black text-amber-800 dark:text-amber-200">{formatBs(Math.round(zoneSum('HIGH')))} KM</span>
        </div>
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
          <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 block">Srednja zona ({zoneIds('MEDIUM')}):</span>
          <span className="text-lg font-black text-blue-800 dark:text-blue-200">{formatBs(Math.round(zoneSum('MEDIUM')))} KM</span>
        </div>
      </div>

      {/* 2D VISUAL RISK MATRIX BOARD */}
      <div className="relative my-6 p-4 md:p-6 rounded-2xl bg-slate-100 dark:bg-slate-950/70 border border-[var(--line)]">
        {/* Matrix Legend Header */}
        <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--ink)]">Y-osa:</span> Uticaj na kontinuitet poslovanja
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Podnošljiva zona</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Upozoravajuća zona</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" /> Kritična crvena zona</span>
          </div>
        </div>

        {/* Matrix Grid Container */}
        <div className="relative w-full aspect-16/10 min-h-[360px] md:min-h-[440px] rounded-xl border-2 border-slate-300 dark:border-slate-700 overflow-hidden bg-gradient-to-tr from-emerald-100/40 via-amber-100/40 to-rose-200/60 dark:from-emerald-950/20 dark:via-amber-950/20 dark:to-rose-950/50">
          {/* Background Grid Lines (5x5) */}
          <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="border-b border-r border-slate-300/40 dark:border-slate-800/40 flex items-start justify-end p-1 text-[9px] font-mono text-slate-400 dark:text-slate-600"
              />
            ))}
          </div>

          {/* Quadrant Zone Labels */}
          <div className="absolute top-3 right-3 text-right pointer-events-none">
            <span className="text-[11px] font-black tracking-wider uppercase text-rose-700/80 dark:text-rose-400/80 block">
              KRITIČNA CRVENA ZONA
            </span>
            <span className="text-[10px] text-rose-600/70 dark:text-rose-400/60">
              Maksimalan nadzor & trenutna mitigacija
            </span>
          </div>
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <span className="text-[11px] font-black tracking-wider uppercase text-emerald-700/80 dark:text-emerald-400/80 block">
              ZELENA KONTROLISANA ZONA
            </span>
            <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/60">
              Redovan operativni monitoring
            </span>
          </div>

          {/* Interactive Risk Plot Points */}
          {filteredRisks.map((risk) => {
            // Coordinate mapping (1 to 5 mapped to 10% to 90% inside container)
            // X-axis: Probability (1 -> 12%, 5 -> 88%)
            const leftPct = ((risk.probVal - 1) / 4) * 76 + 12;
            // Y-axis: Impact (inverted, 5 top -> 12%, 1 bottom -> 88%)
            const topPct = 88 - ((risk.impactVal - 1) / 4) * 76;

            const isResolved = resolvedRiskIds.includes(risk.id);
            const isSelected = selectedRisk?.id === risk.id;

            return (
              <div
                key={risk.id}
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => setSelectedRisk(risk)}
                className={`group absolute cursor-pointer z-20 transition-all duration-200 select-none ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-115 hover:z-30'
                }`}
                title={`Kliknite za plan mitigacije: ${risk.id} - ${risk.title}`}
              >
                {/* Pulsing beacon for critical items */}
                {risk.zone === 'CRITICAL' && !isResolved && (
                  <span className="absolute -inset-2 rounded-full bg-rose-500/30 animate-ping pointer-events-none" />
                )}

                {/* Node Pill Badge */}
                <div
                  className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg border-2 font-black text-xs transition-all ${
                    isResolved
                      ? 'bg-emerald-600 text-white border-white dark:border-slate-800'
                      : risk.zone === 'CRITICAL'
                      ? 'bg-rose-600 text-white border-white dark:border-rose-400 shadow-rose-500/40'
                      : risk.zone === 'HIGH'
                      ? 'bg-amber-500 text-white border-white dark:border-amber-300 shadow-amber-500/30'
                      : 'bg-blue-600 text-white border-white dark:border-blue-300'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span className="tracking-wider">{risk.id}</span>
                  {isResolved && <CheckCircle2 className="w-3 h-3 text-emerald-200" />}
                </div>

                {/* Hover Quick Card Popup */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-56 p-2.5 rounded-xl bg-slate-900/95 text-white text-[11px] shadow-2xl z-40 border border-slate-700 pointer-events-none backdrop-blur-sm animate-in fade-in zoom-in-95 duration-150">
                  <div className="font-extrabold text-amber-300 mb-0.5">{risk.id}: {risk.shortTitle}</div>
                  <div className="text-[10px] text-slate-300 leading-tight mb-1.5">{risk.category}</div>
                  <div className="flex justify-between items-center text-[10px] border-t border-slate-700/80 pt-1">
                    <span className="text-slate-400">Izloženost:</span>
                    <span className="font-black text-rose-300">{formatBs(Math.round(risk.amountKM))} KM</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-400 mt-0.5">
                    <span>Vjerovatnoća: <b>{risk.probVal}/5</b></span>
                    <span>Uticaj: <b>{risk.impactVal}/5</b></span>
                  </div>
                  <div className="mt-1 text-[9px] text-cyan-300 font-bold text-center">
                    👉 Klikni za plan mitigacije
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis Label Bar */}
        <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)] mt-3 px-2">
          <span>← Niska vjerovatnoća (1)</span>
          <span className="text-[var(--ink)] font-black uppercase tracking-wider">
            X-osa: Vjerovatnoća nastanka rizika
          </span>
          <span>Vrlo visoka vjerovatnoća (5) →</span>
        </div>
      </div>

      {/* QUICK RISK CARDS LIST (CLICKABLE) */}
      <div className="my-6">
        <span className="eyebrow text-[var(--muted)] block mb-2 font-bold">
          Kliknite na karticu crvene zastavice za otvaranje detaljnog plana mitigacije:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredRisks.map((risk) => {
            const isResolved = resolvedRiskIds.includes(risk.id);
            const isSelected = selectedRisk?.id === risk.id;

            return (
              <div
                key={risk.id}
                onClick={() => setSelectedRisk(risk)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-[var(--idss-blue)] bg-blue-50/70 dark:bg-blue-950/40 shadow-md ring-2 ring-[var(--idss-blue)]'
                    : isResolved
                    ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500'
                    : 'border-[var(--line)] bg-[var(--surface-alt)] hover:border-[var(--idss-blue)] hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                          : risk.zone === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {risk.id} · {risk.severity.split(' ')[0]}
                    </span>
                    <span className="font-extrabold text-[var(--ink)]">
                      {formatBs(Math.round(risk.amountKM))} KM
                    </span>
                  </div>
                  <h5 className="font-extrabold text-[var(--ink)] text-xs m-0 leading-snug">
                    {risk.shortTitle}
                  </h5>
                  <p className="text-[11px] text-[var(--muted)] m-0 mt-1 line-clamp-2">
                    {risk.forensicFinding}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-[var(--idss-blue)] dark:text-[var(--idss-cyan)] pt-2 border-t border-[var(--line)]/50 mt-2">
                  <span>Vjerov.: {risk.probVal}/5 · Uticaj: {risk.impactVal}/5</span>
                  <span className="flex items-center gap-0.5">
                    Plan <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED MITIGATION PLAN MODAL / DRAWER */}
      {selectedRisk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--surface)] border-2 border-[var(--idss-blue)] rounded-2xl shadow-2xl p-6 text-[var(--ink)] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--line)]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                      selectedRisk.zone === 'CRITICAL'
                        ? 'bg-rose-600 text-white'
                        : selectedRisk.zone === 'HIGH'
                        ? 'bg-amber-500 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {selectedRisk.id} · {selectedRisk.severity}
                  </span>
                  <span className="text-xs font-bold text-[var(--muted)]">
                    Kategorija: {selectedRisk.category}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-[var(--ink)] m-0">
                  {selectedRisk.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[var(--muted)] mt-1">
                  <span>Finansijska izloženost: <b className="text-[var(--ink)]">{formatBs(Math.round(selectedRisk.amountKM))} KM</b></span>
                  <span>·</span>
                  <span>Vjerovatnoća: <b>{selectedRisk.probLabel} ({selectedRisk.probVal}/5)</b></span>
                  <span>·</span>
                  <span>Uticaj: <b>{selectedRisk.impactLabel} ({selectedRisk.impactVal}/5)</b></span>
                </div>
              </div>

              <button
                onClick={() => setSelectedRisk(null)}
                className="p-1.5 rounded-lg border border-[var(--line)] hover:bg-[var(--surface-alt)] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                aria-label="Zatvori plan mitigacije"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 my-4 text-xs leading-relaxed">
              {/* Forenzički nalaz */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--line)]">
                <span className="font-extrabold text-[var(--idss-blue)] dark:text-[var(--idss-cyan)] block mb-1">
                  🔍 FORENZIČKI NALAZ REVIZIJE:
                </span>
                <p className="m-0 text-[var(--ink)]">{selectedRisk.forensicFinding}</p>
                <div className="mt-2 text-[11px] text-[var(--muted)] font-mono">
                  <b>Zakonska osnova:</b> {selectedRisk.statutoryBasis}
                </div>
              </div>

              {/* Sistemski uticaj */}
              <div className="p-3.5 rounded-xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200">
                <span className="font-extrabold text-red-700 dark:text-red-300 block mb-1">
                  ⚠️ ŠTA SE DEŠAVA AKO DIREKTOR NE REAGUJE (SISTEMSKI UTICAJ):
                </span>
                <p className="m-0">{selectedRisk.systemicImpact}</p>
              </div>

              {/* OPERATIVNI PLAN MITIGACIJE KORAK PO KORAK */}
              <div className="border border-[var(--line)] rounded-xl p-4 bg-[var(--surface)]">
                <span className="eyebrow text-emerald-600 dark:text-emerald-400 font-extrabold block mb-2">
                  🛡️ OPERATIVNI DIREKTORSKI PLAN MITIGACIJE (KORAK PO KORAK)
                </span>

                {/* Faza 1 */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    <span>1. HITNO (Rok: 0 do 30 dana):</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[var(--ink)] m-0">
                    {selectedRisk.mitigationSteps.urgent0to30.map((step, idx) => (
                      <li key={idx}><b>{step}</b></li>
                    ))}
                  </ul>
                </div>

                {/* Faza 2 */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>2. SREDNJOROČNO (Rok: 30 do 90 dana):</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[var(--ink)] m-0">
                    {selectedRisk.mitigationSteps.medium30to90.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>

                {/* Faza 3 */}
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>3. TRAJNA PREVENTIVNA POLITIKA:</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[var(--ink)] m-0">
                    {selectedRisk.mitigationSteps.permanentPolicy.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Odgovornost i rokovi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--surface-alt)] border border-[var(--line)]">
                  <span className="font-bold text-[var(--muted)] block text-[11px]">Odgovorno lice za provođenje:</span>
                  <span className="font-extrabold text-[var(--ink)] flex items-center gap-1.5 mt-0.5">
                    <UserCheck className="w-3.5 h-3.5 text-[var(--idss-blue)]" />
                    {selectedRisk.mitigationSteps.responsiblePerson}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[var(--surface-alt)] border border-[var(--line)]">
                  <span className="font-bold text-[var(--muted)] block text-[11px]">Ciljni rok i dinamika:</span>
                  <span className="font-extrabold text-[var(--ink)] flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {selectedRisk.mitigationSteps.targetDeadline}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--line)] mt-4">
              <span className="text-[11px] text-[var(--muted)]">
                Uslov harmonizacije: {selectedRisk.harmonizationCondition}
              </span>
              <button
                onClick={() => setSelectedRisk(null)}
                className="px-4 py-2 rounded-xl bg-[var(--idss-blue)] hover:bg-[var(--idss-blue)]/90 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Razumijem i zatvori plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
