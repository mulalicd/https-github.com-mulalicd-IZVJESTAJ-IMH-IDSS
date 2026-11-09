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

export interface RiskMatrixItem {
  id: string; // 'RF-02' to 'RF-07'
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

export const MATRIX_RISKS: RiskMatrixItem[] = [
  {
    id: 'RF-02',
    title: 'Potraživanja od uprave (184.692 KM) i pozajmica prema Lamiji Kacili (93.484,84 KM)',
    shortTitle: 'Potraživanja od uprave & Pozajmica',
    category: 'Porezni & Krivični Rizici',
    severity: 'Kritično (CRITICAL)',
    amountKM: 184692,
    probVal: 3.8,
    impactVal: 4.8,
    probLabel: 'Srednje-Visoka (75%)',
    impactLabel: 'Kritičan (Prikrivena isplata dohotka)',
    zone: 'CRITICAL',
    forensicFinding: 'IMH potražuje 167.290 KM (127.725 KM nenovčane koristi i plaćeni troškovi uprave + 39.565 KM krediti fizičkim licima), a IDSS 17.402 KM. Ugovorom od 14.07.2026. definisan je povrat 93.484,84 KM za učešće u Porsche Cayenneu u 12 rata po 7.790,40 KM. Ostatak potraživanja iznad 93.484,84 KM (cca 91.207 KM) ostaje formalno nepokriven ugovorom.',
    statutoryBasis: 'Zakon o porezu na dohodak FBiH (čl. 10 i 14 - oporezivanje nenovčanih koristi), Zakon o doprinosima FBiH, Ugovor o pozajmici od 14.07.2026.',
    systemicImpact: 'U slučaju porezne inspekcije, nepokriveni dio potraživanja se prekvalifikuje u prikriveni lični dohodak uz nalog za retroaktivno plaćanje 60.000+ KM poreza, doprinosa i zateznih kamata.',
    mitigationSteps: {
      urgent0to30: [
        'Uredno i bez kašnjenja servisirati 12 mjesečnih rata po 7.790,40 KM po Ugovoru o pozajmici od 14.07.2026. na račun Sparkasse 1990496055893183 (Član 6: kašnjenje 2 rate povlači cijeli iznos odjednom).',
        'Zabraniti dalja plaćanja ličnih ili privatnih računa osnivača i uprave sa transakcijskih računa IMH i IDSS.'
      ],
      medium30to90: [
        'Za preostali dio potraživanja (cca 91.207 KM) sačiniti pisani sporazum o priznanju duga sa preciznim anuitetnim planom povrata sredstava.',
        'Provesti usaglašavanje konta 22 i 43 između licenciranog računovođe i osnivača.'
      ],
      permanentPolicy: [
        'Uspostaviti striktan pravilnik o materijalno-finansijskom poslovanju: sva službena putovanja i troškovi moraju imati vjerodostojan putni nalog i fiskalni račun.',
        'Godišnje eksterno usklađivanje salda sa ovlaštenim revizorom.'
      ],
      responsiblePerson: 'Direktor Davor Mulalić & Licencirani računovođa Ilvana Raščić',
      targetDeadline: 'Početak otplate 01.11.2026., ugovor za ostatak do 31.12.2026.'
    },
    harmonizationCondition: 'Striktno plaćanje 12 rata po 7.790,40 KM i pisano priznanje duga sa otplatnim planom za preostali iznos potraživanja.'
  },
  {
    id: 'RF-03',
    title: 'Deficit pokrića depozita roditelja (47.616 KM obaveza spram 24.148 KM gotovine IMH)',
    shortTitle: 'Deficit pokrića depozita roditelja',
    category: 'Likvidnost & Trezor',
    severity: 'Kritično (CRITICAL)',
    amountKM: 47616,
    probVal: 4.1,
    impactVal: 4.5,
    probLabel: 'Visoka (80% pri završetku ciklusa)',
    impactLabel: 'Kritičan (Nelikvidnost / Gubitak ugleda)',
    zone: 'CRITICAL',
    forensicFinding: 'Sigurnosni depoziti roditelja u IMH iznose 47.616 KM, dok je ukupna gotovina IMH-a na dan 31.08.2026. iznosila 24.148 KM (neto deficit 23.468 KM). Sredstva kaucija roditelja nisu izdvojena na namjenski escrow račun, već su apsorbovana u operativnu potrošnju.',
    statutoryBasis: 'Zakon o obligacionim odnosima FBiH (namjenski depoziti i depozitni ugovori), Zakon o zaštiti potrošača BiH.',
    systemicImpact: 'Ukoliko 10-15 porodica istovremeno zatraži povrat depozita (npr. pri prelasku u školu ili odlasku iz države), ustanova ne bi imala gotovinu za isplatu, što vodi blokadi i reputacijskom skandalu.',
    mitigationSteps: {
      urgent0to30: [
        'Otvoriti poseban namjenski podračun kod Sparkasse Banke namijenjen isključivo za sigurnosne depozite roditelja.',
        'Donijeti odluku uprave da se depoziti više ne smiju miješati sa tekućom likvidnošću za isplatu plata i dobavljača.'
      ],
      medium30to90: [
        'Sukcesivno izdvajati po 4.000 KM mjesečno iz redovnih priliva školarina na namjenski depozitni račun do potpunog zatvaranja deficita od 23.468 KM.',
        'Ažurirati evidenciju svih važećih depozita po djetetu u analitičkom računovodstvu.'
      ],
      permanentPolicy: [
        'Svaki novi uplaćeni depozit roditelja automatski deponovati na namjenski podračun u roku od 24 sata od uplate.',
        'Mjesečni izvještaj o 100% pokrivenosti depozita gotovinom na računu.'
      ],
      responsiblePerson: 'Rukovodstvo IMH, Finansijski referent & Direktor',
      targetDeadline: 'Namjenski račun u roku od 15 dana; 100% pokriće do 31.03.2027.'
    },
    harmonizationCondition: 'Otvaranje namjenskog podračuna za depozite i sukcesivno izdvajanje 4.000 KM mjesečno do uspostave 100% pokrića.'
  },
  {
    id: 'RF-04',
    title: 'Akumulirani dug za zakup i neredovno plaćanje tekućeg zakupa Buka 11/13',
    shortTitle: 'Dug za zakup Buka 11/13 (Općina Centar)',
    category: 'Imovinsko-Pravni Status',
    severity: 'Visoko (HIGH)',
    amountKM: 90375,
    probVal: 4.2,
    impactVal: 5.0,
    probLabel: 'Visoka (75%)',
    impactLabel: 'Katastrofalan (Jednostrani raskid i deložacija)',
    zone: 'CRITICAL',
    forensicFinding: 'Objekat od 1.287,40 m² na adresi Buka 11/13 koristi se po ugovoru zaključenom sa Općinom Centar, produženim do 2033. godine pod istim uslovima (5,00 KM/m² neto = 6.437,00 KM + PDV 17% = 7.531,29 KM/mj.). Zbog neredovnog plaćanja postoji akumulirani dug. Po članu XIV Ugovora, kašnjenje sa plaćanjem dvije uzastopne zakupnine daje Općini pravo na jednostrani raskid bez sudskog postupka i iseljenje u roku od 15 dana!',
    statutoryBasis: 'Ugovor o zakupu poslovne zgrade broj 04-49-36-59/13 (Član XIV - Raskid ugovora), Zakon o zakupu poslovnih zgrada i prostorija FBiH.',
    systemicImpact: 'Gubitak lokacije Buka 11/13 značio bi momentalni prestanak rada i škole i vrtića. Prelazak na komercijalni zakup (15-25 KM/m²) uvećao bi troškove na 250.000–380.000 KM godišnje, što bi uništilo poslovanje.',
    mitigationSteps: {
      urgent0to30: [
        'Zatražiti zvanični sastanak sa Službom za stambene i komunalne poslove Općine Centar Sarajevo radi usaglašavanja IOS-a.',
        'Uspostaviti trajni nalog u banci za automatsko plaćanje tekuće zakupnine od 7.531,29 KM svakog 1. u mjesecu.'
      ],
      medium30to90: [
        'Potpisati zvanični sporazum o obročnoj otplati akumuliranog duga na 24 do 36 mjeseci (npr. 2.500 KM/mj. uz tekuću zakupninu).',
        'Uspostaviti 3 uzastopna mjeseca 100% urednih uplata kako bi se otklonio rizik aktivacije Člana XIV.'
      ],
      permanentPolicy: [
        'Prioritetizacija zakupa kao zaštićenog fiksnog troška prve kategorije u sedmičnom cash-flow rasporedu.',
        'Očuvanje novog ugovora do 2033. godine kao ključnog stuba strateške vrijednosti grupacije.'
      ],
      responsiblePerson: 'Direktor Davor Mulalić & Pravni savjetnik grupacije',
      targetDeadline: 'Sastanak i usaglašavanje u roku od 30 dana; prvi aneks do 31.01.2027.'
    },
    harmonizationCondition: 'Sastanak s Općinom Centar, formalni plan obročne otplate i 3 uzastopna mjeseca urednog plaćanja tekućeg zakupa.'
  },
  {
    id: 'RF-05',
    title: 'Status kantonalnih subvencija KS (157.458 KM — Prolazna stavka za roditelje)',
    shortTitle: 'Subvencije KS (Prolazna stavka / Nema ovisnosti IMH)',
    category: 'Operativni & Troškovi Rada',
    severity: 'Srednje (MEDIUM)',
    amountKM: 157458,
    probVal: 1.8,
    impactVal: 1.5,
    probLabel: 'Niska (Prolazni tok)',
    impactLabel: 'Nizak (IMH naplaćuje puni iznos od roditelja)',
    zone: 'MEDIUM',
    forensicFinding: 'PRAVNA I FINANSIJSKA ČINJENICA: Roditelj plaća puni iznos školarine/boravka koji određuje IMH (redovni cjenovnik ili popust UO IMH). IMH svakog mjeseca sačinjava izvještaj za resorno ministarstvo. Ministarstvo po osnovu izvještaja uplaćuje subvenciju na račun IMH, a IMH cjelokupan iznos pojedinačno prosljeđuje roditeljima na njihove račune. IMH NEMA KORISTI od subvencija i NE ZAVISI od njih. Ako ministarstvo kasni s isplatom, IMH nema šta prebaciti roditeljima, ali redovno poslovanje i naplata IMH-a ostaju 100% netaknuti.',
    statutoryBasis: 'Javni poziv Ministarstva za odgoj i obrazovanje KS o sufinansiranju boravka djece u predškolskim ustanovama.',
    systemicImpact: 'Nema direktnog sistemskog rizika po likvidnost ili plate ustanove IMH, jer IMH svoj prihod naplaćuje direktno od roditelja. Rizik je isključivo administrativno-komunikacijski prema roditeljima u slučaju kašnjenja budžetskih doznaka kantona.',
    mitigationSteps: {
      urgent0to30: [
        'Uspostaviti jasan info-dopis roditeljima o mehanizmu refundacije: IMH prosljeđuje novac roditeljima onog trenutka kada ga ministarstvo uplati na račun ustanove.',
        'Pravovremeno i uredno slati mjesečne zbirne izvještaje resornom ministarstvu prvog dana u mjesecu za prethodni mjesec.'
      ],
      medium30to90: [
        'Kreirati automatizovanu evidenciju prolaznih doznaka kako bi roditelji u svakom trenutku imali uvid u status kantonalnih uplata.',
        'Održavati besprijekorno porezno uvjerenje radi administrativne urednosti aplikacije.'
      ],
      permanentPolicy: [
        'Zadržavanje principa pune samoodrživosti: ekonomska cijena vrtića formira se isključivo iz vlastitog cjenovnika, dok subvencije tretiraju strogo kao prolazna pomoć roditeljima.',
        'Nulta tolerancija na finansijsko oslanjanje na javne transfere.'
      ],
      responsiblePerson: 'Finansijska služba & Direktor Davor Mulalić',
      targetDeadline: 'Uspostavljeno kao trajno operativno pravilo.'
    },
    harmonizationCondition: 'Redovno slanje mjesečnih izvještaja ministarstvu i transparentna direktna isplata roditeljima po prijemu doznake.'
  },
  {
    id: 'RF-06',
    title: 'Troškovi rada na 90,4% školarine i rizik Ugovora o djelu (77.632 KM)',
    shortTitle: 'Ugovori o djelu za nastavu & Troškovi rada',
    category: 'Operativni & Troškovi Rada',
    severity: 'Visoko (HIGH)',
    amountKM: 77632,
    probVal: 4.5,
    impactVal: 3.7,
    probLabel: 'Vrlo visoka (85% inspekcijski rizik)',
    impactLabel: 'Značajan (Prekvalifikacija i kazne)',
    zone: 'HIGH',
    forensicFinding: 'Ukupni troškovi plata u IDSS-u iznose 704.500 KM naspram 779.476 KM ugovorene školarine (90,38%), što ostavlja minimalan prostor za ostale troškove. Pored toga, 77.632 KM u 8 mjeseci 2026. isplaćeno je vanjskim nastavnicima kroz ugovore o djelu za redovnu nastavu.',
    statutoryBasis: 'Zakon o radu FBiH (čl. 26 i 143 - izričita zabrana angažmana putem ugovora o djelu za redovnu djelatnost poslodavca).',
    systemicImpact: 'Kantonalna inspekcija rada u redovnim nadzorima prekvalifikuje ugovore o djelu u radni odnos sa nalogom za uplatu punih doprinosa (cca 72% umjesto 14%) uz prekršajne kazne od 2.000 do 10.000 KM po ugovoru.',
    mitigationSteps: {
      urgent0to30: [
        'Pravni pregled svih postojećih ugovora o djelu za predavače i nastavnike u IDSS-u.',
        'Uskladiti formulacije opisa poslova (fokus na jednokratne ekspertize, autorska predavanja, izradu kurikuluma).'
      ],
      medium30to90: [
        'Prevesti redovne nastavnike na ugovore o dopunskom radu (do trećine punog radnog vremena) u skladu sa Članom 26. Zakona o radu FBiH uz saglasnost matičnih škola.',
        'Pokrenuti kampanju upisa za podizanje broja učenika sa 83 na 95, čime udio plata u prihodu pada ispod 70%.'
      ],
      permanentPolicy: [
        'Potpuna zabrana angažmana nastavnog osoblja preko ugovora o djelu za fond sati redovne nastave.',
        'Standardizovani modeli ugovora o dopunskom radu verifikovani od strane radno-pravnog advokata.'
      ],
      responsiblePerson: 'Direktor Davor Mulalić & Pravna služba',
      targetDeadline: 'Revizija do 15.12.2026.; prevođenje ugovora do početka II polugodišta.'
    },
    harmonizationCondition: 'Prevođenje UOD aranžmana u dopunski rad u skladu sa Zakonom o radu i podizanje upisa na 90-95 učenika.'
  },
  {
    id: 'RF-07',
    title: 'Hronično kašnjenje doprinosa (60 dana) i negativan kapital grupacije (-37.304 KM)',
    shortTitle: 'Kašnjenje doprinosa & Negativan kapital',
    category: 'Likvidnost & Trezor',
    severity: 'Srednje (MEDIUM)',
    amountKM: 37304,
    probVal: 4.4,
    impactVal: 3.2,
    probLabel: 'Visoka (85% operativna realnost)',
    impactLabel: 'Značajan (Kamate / Blokada / Diskvalifikacija)',
    zone: 'MEDIUM',
    forensicFinding: 'Doprinosi na plate redovno se servisiraju sa zakašnjenjem od cca 60 dana, što stvara nepotreban trošak zakonskih zateznih kamata. Na dan 31.12.2025. vlastiti kapital oba entiteta je negativan (IDSS: -18.391 KM, IMH: -18.913 KM, zbirno -37.304 KM).',
    statutoryBasis: 'Zakon o poreznoj upravi FBiH, Zakon o doprinosima FBiH, Zakon o privrednim društvima FBiH (adekvatnost kapitala).',
    systemicImpact: 'Negativan vlastiti kapital formalno diskvalifikuje ustanove pri apliciranju za međunarodne grantove i komercijalne bankarske kredite, dok kašnjenje doprinosa stvara rizik porezne blokade.',
    mitigationSteps: {
      urgent0to30: [
        'Pribaviti zvaničnu analitičku karticu iz Porezne uprave FBiH i usaglasiti tačno stanje dospjelih doprinosa i obračunatih kamata.',
        'Isplanirati postepeno skraćenje roka kašnjenja doprinosa sa 60 na 45 dana.'
      ],
      medium30to90: [
        'Uvesti pravilo paralelnog plaćanja poreza i doprinosa istovremeno sa isplatom neto plata do 15. u mjesecu.',
        'Donijeti odluku osnivača o potpunom zadržavanju ostvarene dobiti za 2026. i 2027. radi sanacije kapitala.'
      ],
      permanentPolicy: [
        'Zadržavanje dobiti do potpunog prelaska kapitala u pozitivnu zonu od najmanje +50.000 KM do kraja 2028. godine.',
        'Nulta tolerancija na zatezne kamate Porezne uprave u godišnjem budžetu.'
      ],
      responsiblePerson: 'Licencirani računovođa Ilvana Raščić & Direktor Davor Mulalić',
      targetDeadline: 'Skraćenje kašnjenja do 28.02.2027.; pozitivan kapital do 31.12.2027.'
    },
    harmonizationCondition: 'Pribavljanje zvanične potvrde Porezne uprave o stanju duga i zadržavanje dobiti do potpunog prelaska kapitala u pozitivnu zonu.'
  }
];

interface RiskMatrixVisualProps {
  className?: string;
  resolvedRiskIds?: string[];
}

export const RiskMatrixVisual: React.FC<RiskMatrixVisualProps> = ({
  className = '',
  resolvedRiskIds = []
}) => {
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
            Vizuelna matrica ne-saniranih crvenih zastavica (RF-02 do RF-07)
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
              {filterKey === 'ALL' && 'Svi rizici (6)'}
              {filterKey === 'CRITICAL' && 'Kritični (2)'}
              {filterKey === 'HIGH' && 'Visoki (3)'}
              {filterKey === 'MEDIUM' && 'Srednji (1)'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-5">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--line)]">
          <span className="text-[11px] font-bold text-[var(--muted)] block">Ukupna finansijska izloženost:</span>
          <span className="text-lg font-black text-[var(--ink)]">{totalExposedKM.toLocaleString('bs-BA')} KM</span>
        </div>
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
          <span className="text-[11px] font-bold text-red-700 dark:text-red-300 block">Kritična zona (RF-02, RF-04):</span>
          <span className="text-lg font-black text-red-800 dark:text-red-200">275.067 KM</span>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 block">Visoka zona (RF-03, 05, 06):</span>
          <span className="text-lg font-black text-amber-800 dark:text-amber-200">282.706 KM</span>
        </div>
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
          <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 block">Srednja zona (RF-07):</span>
          <span className="text-lg font-black text-blue-800 dark:text-blue-200">37.304 KM</span>
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
                    <span className="font-black text-rose-300">{risk.amountKM.toLocaleString('bs-BA')} KM</span>
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
                      {risk.amountKM.toLocaleString('bs-BA')} KM
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
                  <span>Finansijska izloženost: <b className="text-[var(--ink)]">{selectedRisk.amountKM.toLocaleString('bs-BA')} KM</b></span>
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
