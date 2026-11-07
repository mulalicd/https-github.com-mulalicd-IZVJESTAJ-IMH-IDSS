export interface FinancialYear {
  year: string;
  idssRev: number;
  imhRev: number;
  eliminations: number;
  consolidatedRev: number;
  idssNet: number;
  imhNet: number;
  consolidatedNet: number;
}

export interface EnrollmentYear {
  period: string;
  students: number;
  contractValue: number;
  avgPerStudent: number;
  realizationRate: number; // percentage of rack price
  note?: string;
}

export interface LoanScheduleItem {
  installmentNo: number;
  dueDate: string;
  amountKM: number;
  remainingDebtKM: number;
}

export interface DebtObligation {
  id: string;
  creditor: string;
  entity: 'IDSS' | 'IMH' | 'Grupa';
  type: 'Kredit' | 'Overdraft' | 'Leasing' | 'Pozajmica' | 'Zakup';
  originalAmount: string;
  monthlyBurden: string;
  maturity: string;
  interestRate: string;
  collateral: string;
  purpose: string;
  status: string;
}

export interface RedFlag {
  id: string;
  title: string;
  category: 'Porezni & Krivični Rizici' | 'Likvidnost & Trezor' | 'Imovinsko-Pravni Status' | 'Operativni & Troškovi Rada';
  severity: 'Kritično (CRITICAL)' | 'Visoko (HIGH)' | 'Srednje (MEDIUM)';
  amountKM?: number;
  forensicFinding: string;
  statutoryBasis: string;
  systemicImpact: string;
  harmonizationCondition: string;
  status: 'Otvoreno (Aktivan rizik)' | 'Djelimično sanirano' | 'Harmonizovano';
}

export interface IngestedDocument {
  id: string;
  code: string;
  title: string;
  source: string;
  date: string;
  impactAreas: string[];
  summary: string;
  effects: {
    cashDeltaKM?: number;
    ebitdaDeltaKM?: number;
    equityDeltaKM?: number;
    riskResolved?: string[];
    studentsChange?: number;
  };
  isActive: boolean;
}

export const HISTORICAL_FINANCIALS: FinancialYear[] = [
  {
    year: '2022',
    idssRev: 633571,
    imhRev: 724354,
    eliminations: 0,
    consolidatedRev: 1357925,
    idssNet: -194595,
    imhNet: 183046,
    consolidatedNet: -11549,
  },
  {
    year: '2023',
    idssRev: 672553,
    imhRev: 843751,
    eliminations: 0,
    consolidatedRev: 1516304,
    idssNet: 66162,
    imhNet: 189063,
    consolidatedNet: 255225,
  },
  {
    year: '2024',
    idssRev: 784147,
    imhRev: 812874,
    eliminations: 0,
    consolidatedRev: 1597021,
    idssNet: 85280,
    imhNet: 73028,
    consolidatedNet: 158308,
  },
  {
    year: '2025',
    idssRev: 899881,
    imhRev: 900571,
    eliminations: 99212,
    consolidatedRev: 1701240,
    idssNet: -9501,
    imhNet: 63815,
    consolidatedNet: 54314,
  },
  {
    year: '2026 (8 mj.)',
    idssRev: 774489,
    imhRev: 654567,
    eliminations: 0,
    consolidatedRev: 1429056,
    idssNet: 115145, // iskazani
    imhNet: 60720,
    consolidatedNet: 175864, // iskazani
  },
];

export const ENROLLMENT_DATA: EnrollmentYear[] = [
  { period: '2023/24', students: 79, contractValue: 717527, avgPerStudent: 9083, realizationRate: 88, note: 'Polazna baza upisa' },
  { period: '2024/25', students: 94, contractValue: 884763, avgPerStudent: 9412, realizationRate: 89, note: 'Vrhunac posmatranog razdoblja' },
  { period: '2025/26', students: 68, contractValue: 717089, avgPerStudent: 10545, realizationRate: 84, note: 'Pad od 27,66% (~28%) usljed odlaska stranih porodica nakon isteka mandata' },
  { period: '2026/27', students: 83, contractValue: 779476, avgPerStudent: 9391, realizationRate: 86, note: 'Oporavak: 63,64% prvačića (7 od 11) potiče iz predškolske grupe IMH-a' },
];

export const DEBT_OBLIGATIONS: DebtObligation[] = [
  {
    id: 'DEBT-01',
    creditor: 'MF Banka',
    entity: 'IMH',
    type: 'Kredit',
    originalAmount: '100.000 KM',
    monthlyBurden: 'oko 4.661 KM / mj.',
    maturity: 'avgust 2028. (24 rate)',
    interestRate: '10,99% fiksna (EKS 12,63%)',
    collateral: 'Mjenice, namjena operativna likvidnost',
    purpose: 'Finansiranje tekuće likvidnosti i obaveza. Partija kredita: 5724574555355002. Ukupni trošak kredita 13.489 KM.',
    status: 'Aktivan'
  },
  {
    id: 'DEBT-02',
    creditor: 'MF Banka',
    entity: 'IDSS',
    type: 'Kredit',
    originalAmount: '20.000 KM',
    monthlyBurden: 'Anuitet (36 mj.)',
    maturity: 'juni 2028. (ugovoreno 12.06.2025.)',
    interestRate: '10,99% fiksna',
    collateral: 'Solidarni dužnici: IMH i Lamia Kacila',
    purpose: 'Obrtna sredstva IDSS. Ugovoreno 12.06.2025.',
    status: 'Aktivan'
  },
  {
    id: 'DEBT-03',
    creditor: 'MF Banka',
    entity: 'IDSS',
    type: 'Overdraft',
    originalAmount: '15.000 KM limit',
    monthlyBurden: 'Kamata mjesečno (glavnica na dospijeću)',
    maturity: '12.06.2026.',
    interestRate: '11,90% fiksna',
    collateral: 'Solidarni dužnici: IMH i Lamia Kacila',
    purpose: 'Tekuća likvidnost. Dospijeva 12.06.2026. i mora se planski refinansirati ili zatvoriti.',
    status: 'Dospijeva 12.06.2026.'
  },
  {
    id: 'DEBT-04',
    creditor: 'Sparkasse Leasing d.o.o.',
    entity: 'IMH',
    type: 'Leasing',
    originalAmount: '53.182,11 EUR (nabavna 100.980,15 EUR)',
    monthlyBurden: '1.027,91 EUR / mj. (cca 2.010 KM)',
    maturity: 'juli 2031. (60 mjeseci, ugovor 14.07.2026.)',
    interestRate: '5,99% (6M Euribor + 3,44%), EKS 8,02%',
    collateral: 'Vozilo, učešće 47.798 EUR (47,33%), mjenični dužnik Lamia Kacila',
    purpose: 'Porsche Cayenne 2025 (šasija WP1ZZZ9YXSDA48559). Ugovor br. 12546/26. Neoperativna imovina koja tereti cash-flow.',
    status: 'Aktivan'
  },
  {
    id: 'DEBT-05',
    creditor: 'Lamia Kacila (Osnivač)',
    entity: 'IMH',
    type: 'Pozajmica',
    originalAmount: '93.484,84 KM',
    monthlyBurden: '7.790,40 KM / mj. (zadnja 7.790,44 KM)',
    maturity: '01.11.2026. – 01.10.2027. (12 rata)',
    interestRate: '0% (beskamatna pozajmica)',
    collateral: 'Sporazum od 14.07.2026. (prethodni Porsche J01-O-261)',
    purpose: 'Učešće za nabavku novog Cayennea dato preko AUTO MT d.o.o. Mostar. Račun Sparkasse: 1990496055893183. Kašnjenje 2 rate povlači cijeli iznos.',
    status: 'Počinje 01.11.2026.'
  },
  {
    id: 'DEBT-06',
    creditor: 'Općina Centar Sarajevo',
    entity: 'Grupa',
    type: 'Zakup',
    originalAmount: 'Novi ugovor od 27.09.2023. do 2033. godine (raniji ugovor 04-49-36-59/13 od 30.08.2013. i Anex 13.03.2014.)',
    monthlyBurden: '7.531,29 KM / mj. (6.437,00 KM neto + 1.094,29 KM PDV 17%)',
    maturity: '31.08.2033. (Puni novi 10-godišnji ugovorni mandat pod identičnim uslovima)',
    interestRate: 'Zakonska zatezna kamata na dospjela dugovanja',
    collateral: 'Poslovna zgrada Buka 11 i 13 (1.287,40 m² po fiksnoj zaštićenoj cijeni 5,00 KM/m²)',
    purpose: 'STABILNOST LOKACIJE DO 2033.: Uspješno zaključen NOVI UGOVOR DO 2033. GODINE POD POTPUNO ISTIM USLOVIMA ZAKUPA (5,00 KM/m² neto = 6.437,00 KM + PDV = 7.531,29 KM/mj.). Zgrada od 1.287,40 m² na adresi Buka 11 i 13 osigurana je za obrazovnu djelatnost IDSS i IMH narednih 7+ godina. Ključni operativni prioritet je redovno plaćanje tekuće zakupnine i mirno poravnanje akumuliranog duga kako se ne bi aktivirao čl. XIV o jednostranom raskidu.',
    status: 'Osiguran dugoročni zakup do 2033. pod istim uslovima (potrebno uredno servisiranje)'
  }
];

export const LOAN_REPAYMENT_SCHEDULE: LoanScheduleItem[] = [
  { installmentNo: 1, dueDate: '01.11.2026', amountKM: 7790.40, remainingDebtKM: 85694.44 },
  { installmentNo: 2, dueDate: '01.12.2026', amountKM: 7790.40, remainingDebtKM: 77904.04 },
  { installmentNo: 3, dueDate: '01.01.2027', amountKM: 7790.40, remainingDebtKM: 70113.64 },
  { installmentNo: 4, dueDate: '01.02.2027', amountKM: 7790.40, remainingDebtKM: 62323.24 },
  { installmentNo: 5, dueDate: '01.03.2027', amountKM: 7790.40, remainingDebtKM: 54532.84 },
  { installmentNo: 6, dueDate: '01.04.2027', amountKM: 7790.40, remainingDebtKM: 46742.44 },
  { installmentNo: 7, dueDate: '01.05.2027', amountKM: 7790.40, remainingDebtKM: 38952.04 },
  { installmentNo: 8, dueDate: '01.06.2027', amountKM: 7790.40, remainingDebtKM: 31161.64 },
  { installmentNo: 9, dueDate: '01.07.2027', amountKM: 7790.40, remainingDebtKM: 23371.24 },
  { installmentNo: 10, dueDate: '01.08.2027', amountKM: 7790.40, remainingDebtKM: 15580.84 },
  { installmentNo: 11, dueDate: '01.09.2027', amountKM: 7790.40, remainingDebtKM: 7790.44 },
  { installmentNo: 12, dueDate: '01.10.2027', amountKM: 7790.44, remainingDebtKM: 0.00 },
];

export const LOAN_CONTRACT_FULL = {
  contractTitle: 'UGOVOR O POZAJMICI',
  date: '14.07.2026.',
  place: 'Sarajevo',
  lender: {
    name: 'KACILA LAMIA',
    residence: 'Sarajevo, Novo Sarajevo, ul. Nevesinjska broj 14A',
    jmbg: '0907975177845',
    role: 'Zajmodavac',
    account: '1990496055893183 kod SPARKASSE BANK D.D. BIH'
  },
  borrower: {
    name: 'PPU INTERNATIONAL MONTESSORI HOUSE',
    address: 'Sarajevo, ul. Buka broj 11, 71000 Sarajevo',
    idNumber: '4201731140006',
    representative: 'direktor Davor Mulalić',
    role: 'Zajmoprimac'
  },
  subjectVehicle: {
    brand: 'PORSCHE',
    commercialModel: 'CAYENNE',
    type: '9YA',
    licensePlate: 'J01-O-261',
    vin: 'WP1ZZZ9YZLDA02893',
    deliveredTo: 'AUTO MT d.o.o. Mostar, Buna 154 A, 88000 Mostar',
    valuationKM: 93484.84,
  },
  newVehicleLeasing: {
    brand: 'PORSCHE CAYENNE (2025)',
    vin: 'WP1ZZZ9YXSDA48559',
    leasingContractNumber: '12546/26 od 14.07.2026.',
    lessor: 'Sparkasse Leasing d.o.o. Sarajevo',
    downPaymentEUR: 47798.04
  },
  keyClauses: [
    { article: 'Član 1.', title: 'Predmet ugovora', text: 'Pozajmica radi plaćanja učešća od 47.798,04 EUR po Ugovoru o leasingu br. 12546/26 za Porsche Cayenne 2025 (WP1ZZZ9YXSDA48559).' },
    { article: 'Član 2.', title: 'Vozilo dato kao učešće', text: 'Pozajmica u stvari predajom vozila Porsche 9YA Cayenne (J01-O-261, WP1ZZZ9YZLDA02893) dobavljaču AUTO MT d.o.o. Mostar, Buna 154 A.' },
    { article: 'Član 3.', title: 'Iznos pozajmice', text: 'Saglasno utvrđena vrijednost od 93.484,84 KM predstavlja iznos pozajmice koja se vraća u novcu.' },
    { article: 'Član 4.', title: 'Kamata', text: 'Pozajmica je beskamatna (0% kamate).' },
    { article: 'Član 5.', title: 'Vraćanje pozajmice', text: '12 mjesečnih rata prema Prilogu 1 uplatom na račun 1990496055893183 kod Sparkasse. Pravo prijevremenog povrata bez naknade.' },
    { article: 'Član 6.', title: 'Kašnjenje u plaćanju', text: 'Zakonska zatezna kamata; kašnjenje dvije uzastopne rate daje pravo Zajmodavcu da traži vraćanje cijelog preostalog iznosa odjednom.' },
    { article: 'Član 7.-10.', title: 'Zakon i nadležnost', text: 'Zakon o obligacionim odnosima, izmjene isključivo pisanim aneksom, nadležnost suda u Sarajevu, 4 primjerka.' }
  ]
};

export const LEASE_CONTRACT_FULL = {
  contractTitle: 'UGOVOR O ZAKUPU POSLOVNE ZGRADE',
  contractNumber: '04-49-36-59/13 (Šifra: 0-000-0-0)',
  contractDate: '30.08.2013.',
  place: 'Sarajevo',
  landlord: {
    name: 'Općina Centar Sarajevo',
    address: 'ul. Mis Irbina br. 1, Sarajevo',
    representative: 'Dževad Bećirević, Općinski načelnik',
    role: 'Zakupodavac'
  },
  tenant: {
    name: 'PPU THE INTERNATIONAL MONTESSORI HOUSE',
    address: 'ul. Avde Smajlovića 9, Sarajevo (sjedište po osnivanju)',
    ministryRegistration: 'Rješenje Ministarstva obrazovanja i nauke KS broj UP-11-01-38-29958/11 od 16.12.2011.',
    representative: 'Lamija Kacila, osnivač Predškolske ustanove',
    role: 'Zakupac'
  },
  premises: {
    address: 'Buka 11 i 13, Sarajevo',
    totalAreaM2: 1287.40,
    purpose: 'Isključivo za obavljanje djelatnosti iz oblasti obrazovanja (čl. II)'
  },
  financialTermsOriginal: {
    pricePerM2: 5.00,
    monthlyRentNetKM: 6437.00,
    monthlyRentVatKM: 1094.29,
    monthlyRentGrossKM: 7531.29,
    paymentDeadline: 'Najkasnije do 15-tog u mjesecu za tekući mjesec na žiro račun zakupodavca',
    startDate: '01.10.2013.',
    operatingExpensesExcluded: 'Tekuće održavanje zgrade, dovođenje u stanje uslovnosti, komunalne naknade za građevinsko zemljište, odvoz smeća, voda, električna energija, centralno grijanje, dimnjačarske usluge'
  },
  securitiesAndDuration: {
    security: 'Bankarska garancija na petogodišnji iznos zakupnine ILI 60 potpisanih mjenica na mjesečni iznos zakupnine ILI uplata jednogodišnjeg iznosa unaprijed (čl. V)',
    durationOriginal: '10 godina, od 01.09.2013. do 31.08.2023. (Odluka Općinskog vijeća Centar 01-49-1594/13 od 29.07.2013.)',
    renewalTo2033: 'NOVI UGOVOR ZAKLJUČEN 27.09.2023. GODINE DO 2033. GODINE POD POTPUNO ISTIM USLOVIMA ZAKUPA (isti iznos od 5,00 KM/m² neto, identična površina 1.287,40 m², bruto 7.531,29 KM/mj. s PDV, isključiva djelatnost obrazovanja)',
    strategicHorizon: 'Zgrada Buka 11 i 13 je pravno osigurana za rad IDSS i IMH do kraja augusta 2033. godine!'
  },
  prohibitionsAndTermination: {
    subleaseProhibition: 'Izričita zabrana podzakupa ili korištenja kao učešće u poslovno-tehničkoj saradnji sa trećim licima (čl. XI)',
    unilateralTerminationClause: 'Zakupodavac može jednostrano raskinuti ugovor u roku od 15 dana ako: (1) zakupac ne plati dvije dospjele zakupnine nakon opomene; (2) u roku od 3 mjeseca ne otpočne djelatnost; (3) izgubi pravo na djelatnost; (4) ne koristi zgradu duže od dva mjeseca (čl. XIV)'
  },
  annex2014: {
    annexTitle: 'ANEX UGOVORA O ZAKUPU POSLOVNE ZGRADE',
    annexNumber: '04-49-13-12/14',
    annexDate: '13.03.2014.',
    basis: 'Član 27. Odluke o dodjeli zgrada (Sl. novine KS 13/07) i Zaključak Komisije za ocjenu nužnih radova 04-49-2538/13 od 05.12.2013.',
    investmentsTotalKM: 97993.10,
    recognizedInvestments60PctKM: 58795.86,
    compensationStructure: {
      immediateDueRentCompensationKM: 48187.74, // kompenzacija sa dospjelim dugovanjima na dan 15.03.2014.
      remainingCompensationKM: 10608.12, // kompenzacija kroz 9 mjesečnih umanjenja zakupnine
      reducedMonthlyRentNetKM: 5258.32, // umanjeno za 1.178,68 KM mjesečno (period 01.04.2014. do 31.12.2014.)
      fullRentResumptionDate: '01.01.2015. (6.437,00 KM neto + 1.094,29 KM PDV = 7.531,29 KM/mj.)'
    }
  }
};

export const BASE_RED_FLAGS: RedFlag[] = [
  {
    id: 'RF-01',
    title: 'Cirkularni tok i međufirmska faktura od 100.000 KM preko MF Banke',
    category: 'Porezni & Krivični Rizici',
    severity: 'Kritično (CRITICAL)',
    amountKM: 100000,
    forensicFinding: 'MF Banka je odobrila kredit IMH-u za operativna sredstva (30.07.2026., 100.000 KM, partija 5724574555355002). Sredstva nisu prebačena direktno na IMH već preko prefakturisanja IDSS prema IMH. Banka je uplatila IDSS-u, a novac je preraspodijeljen za doprinose i tekuće obaveze oba subjekta. Riječ je o cirkularnom toku radi likvidnosti, a ne operativnoj prodaji usluga. Uključivanjem u prihod IDSS-a fiktivno je iskazan 8-mjesečni rezultat od 115.145 KM (bez toga 15.145 KM).',
    statutoryBasis: 'Zakon o porezu na dobit FBiH (čl. 45-48, Transferne cijene), Međunarodni računovodstveni standardi (MSFI za MSP, sekcija 33, Objavljivanje povezanih lica).',
    systemicImpact: 'Nevažeći operativni EBITDA u pregovorima s bankama; rizik poreznog osporavanja troškova u IMH i pitanje namjenskog utroška kredita prema MF Banci.',
    harmonizationCondition: 'Sačiniti interni memo u arhivi o toku odobrenja, isporuke i preraspodjele; u operativnom P&L-u i cash-flowu isključiti 100k kao neoperativnu stavku.',
    status: 'Otvoreno (Aktivan rizik)'
  },
  {
    id: 'RF-02',
    title: 'Potraživanja od uprave (184.692 KM) i pozajmica prema Lamiji Kacili (93.484,84 KM)',
    category: 'Porezni & Krivični Rizici',
    severity: 'Kritično (CRITICAL)',
    amountKM: 184692,
    forensicFinding: 'IMH potražuje 167.290 KM (127.725 KM nenovčane koristi i plaćeni troškovi uprave + 39.565 KM krediti fizičkim licima), a IDSS 17.402 KM. Ugovorom od 14.07.2026. regulisan je dio: IMH duguje Lamiji Kacili 93.484,84 KM (vrijednost prethodnog Porschea WP1ZZZ9YZLDA02893 datog firmi AUTO MT d.o.o. Mostar kao učešće za novi leasing). Pozajmica se vraća u 12 rata po 7.790,40 KM od 01.11.2026. do 01.10.2027. na račun Sparkasse 1990496055893183. Međutim, ostatak potraživanja iznad 93.484,84 KM (cca 91.207 KM) ostaje formalno neriješen.',
    statutoryBasis: 'Zakon o porezu na dohodak FBiH (čl. 10 i 14, Prikrivena isplata dohotka), Zakon o doprinosima FBiH, Ugovor o pozajmici od 14.07.2026.',
    systemicImpact: 'Rizik da Porezna uprava neregulisani dio potraživanja tretira kao prikriveni lični dohodak uz obračun 60.000+ KM retroaktivnih poreza, doprinosa i kamata.',
    harmonizationCondition: 'Striktno plaćanje 12 rata po 7.790,40 KM prema planu i pisano priznanje duga sa otplatnim planom za preostali iznos potraživanja.',
    status: 'Otvoreno (Aktivan rizik)'
  },
  {
    id: 'RF-03',
    title: 'Deficit pokrića depozita roditelja (47.616 KM obaveza spram 24.148 KM gotovine IMH)',
    category: 'Likvidnost & Trezor',
    severity: 'Kritično (CRITICAL)',
    amountKM: 47616,
    forensicFinding: 'Sigurnosni depoziti roditelja u IMH iznose 47.616 KM, dok je ukupna gotovina IMH-a na dan 31.08.2026. iznosila 24.148 KM (deficit 23.468 KM). Sredstva roditelja nisu odvojena na namjenski escrow račun, već su apsorbovana u operativnu potrošnju.',
    statutoryBasis: 'Zakon o obligacionim odnosima FBiH (namjenski depoziti i kaucije), Zakon o zaštiti potrošača BiH.',
    systemicImpact: 'U slučaju serijskog raskida ugovora od strane 10-15 porodica, ustanova ulazi u stanje trenutne tehničke nesolventnosti i gubitka pedagoške reputacije.',
    harmonizationCondition: 'Otvaranje namjenskog podračuna za depozite i sukcesivno izdvajanje 4.000 KM mjesečno do uspostave 100% pokrića.',
    status: 'Otvoreno (Aktivan rizik)'
  },
  {
    id: 'RF-04',
    title: 'Akumulirani dug za zakup i neuredno plaćanje tekućeg zakupa Buka 11/13',
    category: 'Imovinsko-Pravni Status',
    severity: 'Visoko (HIGH)',
    amountKM: 90375,
    forensicFinding: 'Kompleks od 1.287,40 m² koristi se po osnovnom Ugovoru broj 04-49-36-59/13 od 30.08.2013. zaključenom s Općinom Centar (načelnik Dževad Bećirević) na 10 godina (do 31.08.2023.), uz Anex broj 04-49-13-12/14 od 13.03.2014. kojim je priznato 58.795,86 KM (60% od 97.993,10 KM) nužnih ulaganja kroz kompenzaciju dospjelih 48.187,74 KM duga i 9-mjesečno umanjenje na 5.258,32 KM/mj. Od 01.01.2015. tekući zakup iznosi 6.437,00 KM + PDV 1.094,29 KM = 7.531,29 KM/mj. Ugovor je produžen 27.09.2023. do 2033. godine. Međutim, postoji akumulirani dug, a tekući zakup se neredovno plaća. Po članu XIV Ugovora, kašnjenje sa dvije dospjele zakupnine nakon opomene daje Općini pravo na momentalni jednostrani raskid i iseljenje u roku od 15 dana!',
    statutoryBasis: 'Ugovor o zakupu poslovne zgrade 04-49-36-59/13 (30.08.2013.), Anex 04-49-13-12/14 (13.03.2014.), Zakon o zakupu poslovnih zgrada i prostorija FBiH.',
    systemicImpact: 'Gubitak lokacije Buka 11/13 ili prelazak na komercijalnu cijenu (15-25 KM/m² = 250.000 - 380.000 KM godišnje) uništava ekonomski model grupe.',
    harmonizationCondition: 'Sastanak s Općinom Centar: formalno priznanje stanja duga, pismeni plan obročne otplate i uspostava 3 uzastopna mjeseca urednog plaćanja tekućeg zakupa.',
    status: 'Otvoreno (Aktivan rizik)'
  },
  {
    id: 'RF-05',
    title: 'Strukturna zavisnost IMH-a od kantonalnih subvencija (157.458 KM = 24% prihoda)',
    category: 'Operativni & Troškovi Rada',
    severity: 'Visoko (HIGH)',
    amountKM: 157458,
    forensicFinding: 'Subvencije Ministarstva za odgoj i obrazovanje KS iznose 157.458 KM (24,05% prihoda IMH). Subvencije su ključne za održavanje pozitivnog poslovanja vrtića, ali su uslovljene urednim izmirenjem javnih obaveza.',
    statutoryBasis: 'Uredba o sufinansiranju predškolskog odgoja i obrazovanja Kantona Sarajevo.',
    systemicImpact: 'Bilo kakva blokada ili kašnjenje doznaka stvara trenutnu krizu likvidnosti i nemogućnost isplate plata odgajateljima.',
    harmonizationCondition: 'Kontinuirano posjedovanje čistog poreznog uvjerenja i izrada internog finansijskog scenarija poslovanja bez subvencija.',
    status: 'Otvoreno (Aktivan rizik)'
  },
  {
    id: 'RF-06',
    title: 'Troškovi rada na 90,4% školarine i rizik Ugovora o djelu (77.632 KM)',
    category: 'Operativni & Troškovi Rada',
    severity: 'Visoko (HIGH)',
    amountKM: 77632,
    forensicFinding: 'Godišnji trošak osoblja IDSS-a za 2026/27. iznosi 704.500 KM naspram 779.476 KM ugovorene školarine (90,38%). Za sve ostale troškove ostaje samo 74.976 KM. Dodatno, u 8 mjeseci 2026. isplaćeno je 77.632 KM (prosječno 9.700 KM/mj.) nastavnicima kroz ugovore o djelu koji imaju matična zaposlenja u drugim školama.',
    statutoryBasis: 'Zakon o radu FBiH (čl. 26 i 143, zabrana UOD za redovnu nastavnu djelatnost).',
    systemicImpact: 'Inspekcija rada rutinski preklasifikuje ugovore o djelu u radni odnos sa nalogom za retroaktivnu uplatu punih doprina i novčane kazne.',
    harmonizationCondition: 'Prevođenje UOD aranžmana u dopunski rad u skladu sa Zakonom o radu i podizanje upisa na 90-95 učenika kako bi se udio plata spustio ispod 70%.',
    status: 'Otvoreno (Aktivan rizik)'
  },
  {
    id: 'RF-07',
    title: 'Hronično kašnjenje doprinosa (60 dana) i negativan kapital grupacije (-37.328 KM)',
    category: 'Likvidnost & Trezor',
    severity: 'Srednje (MEDIUM)',
    amountKM: 37328,
    forensicFinding: 'Raniji porezni sporovi su otplaćeni, ali se redovni doprinosi servisiraju s uobičajenim kašnjenjem od cca 2 mjeseca uz obračun zateznih kamata. Na dan 31.12.2025. vlastiti kapital oba entiteta je negativan (IDSS: -18.391 KM, IMH: -18.936 KM, zbir -37.328 KM).',
    statutoryBasis: 'Zakon o poreznoj upravi FBiH, Zakon o doprinosima FBiH, Zakon o privrednim društvima FBiH (adekvatnost kapitala).',
    systemicImpact: 'Rizik prinudne blokade računa od strane Porezne uprave i formalna diskvalifikacija pri ugovaranju komercijalnih bankarskih kredita.',
    harmonizationCondition: 'Pribavljanje zvanične potvrde Porezne uprave o stanju duga i zadržavanje dobiti do potpunog prelaska kapitala u pozitivnu zonu do kraja 2028.',
    status: 'Otvoreno (Aktivan rizik)'
  }
];

export const INITIAL_INGESTED_DOCS: IngestedDocument[] = [
  {
    id: 'DOC-01',
    code: 'ZB-2025',
    title: 'Godišnji finansijski izvještaji i bruto bilansi 2022–2025.',
    source: 'FIA FBiH i licencirani računovođa Ilvana Raščić (CR-6235/5)',
    date: '31.12.2025.',
    impactAreas: ['Konsolidacija', 'Kapital', 'Prihodi'],
    summary: 'Potvrđeni konsolidirani prihodi od 1.701.240 KM, 84 fakture transfernih cijena (99.212 KM) i negativan vlastiti kapital grupe od -37.328 KM.',
    effects: {},
    isActive: true,
  },
  {
    id: 'DOC-02',
    code: 'BB-08-2026',
    title: 'Bruto bilans i interpretacija stanja na 31.08.2026.',
    source: 'Računovodstvo grupacije',
    date: '31.08.2026.',
    impactAreas: ['Tekući rezultat', 'Likvidnost', 'Potraživanja'],
    summary: 'Iskazan rezultat grupe od 175.864 KM, gotovina 37.639 KM, međufirmska stavka 100.000 KM i potraživanja od uprave 184.692 KM.',
    effects: {},
    isActive: true,
  },
  {
    id: 'DOC-03',
    code: 'POZ-LAMIJA',
    title: 'Ugovor o pozajmici Lamia Kacila – IMH od 14.07.2026.',
    source: 'Arhiva osnivača i IMH',
    date: '14.07.2026.',
    impactAreas: ['Pozajmice', 'Leasing', 'Cash-flow'],
    summary: 'Beskamatna pozajmica od 93.484,84 KM u 12 mjesečnih rata po 7.790,40 KM (01.11.2026.–01.10.2027.) na račun Sparkasse 1990496055893183. Prethodni Porsche J01-O-261 predat dobavljaču AUTO MT.',
    effects: {},
    isActive: true,
  },
  {
    id: 'DOC-04',
    code: 'LEAS-SPARKASSE',
    title: 'Finansijski leasing Sparkasse br. 12546/26 za Porsche Cayenne',
    source: 'Sparkasse Leasing d.o.o. Sarajevo',
    date: '14.07.2026.',
    impactAreas: ['Leasing', 'Odlivi', 'Cash-flow'],
    summary: 'Vozilo Porsche Cayenne 2025 (WP1ZZZ9YXSDA48559). Neto 100.980 EUR, učešće 47.798 EUR (47,33%), finansirano 53.182 EUR. Rata 1.027,91 EUR/mj. tokom 60 mj. Mjenični dužnik Lamia Kacila.',
    effects: {},
    isActive: true,
  },
  {
    id: 'DOC-05',
    code: 'MF-KREDITI',
    title: 'Ugovori o kreditima i overdraftu MF Banke (IDSS & IMH)',
    source: 'MF Banka a.d. Banja Luka / Filijala Sarajevo',
    date: '30.07.2026.',
    impactAreas: ['Krediti', 'Solidarni dužnici', 'Overdraft'],
    summary: 'IMH kredit 100.000 KM (partija 5724574555355002, rata cca 4.661 KM do 08.2028.). IDSS kredit 20.000 KM i overdraft 15.000 KM (dospijeva 12.06.2026.). Solidarni dužnici IMH i Lamia Kacila.',
    effects: {},
    isActive: true,
  },
  {
    id: 'DOC-06',
    code: 'ZAK-2013-2023',
    title: 'Ugovor o zakupu Buka 11/13 (br. 04-49-36-59/13), Anex 2014 i obnova do 2033.',
    source: 'Općina Centar Sarajevo (zastupa Načelnik Dževad Bećirević) & IMH (Lamija Kacila)',
    date: '30.08.2013. / Anex 13.03.2014. / 27.09.2023.',
    impactAreas: ['Imovina', 'Zakup', 'Dug', 'Pravna sigurnost'],
    summary: 'Poslovna zgrada Buka 11 i 13 površine 1.287,40 m² po cijeni 5,00 KM/m² (6.437,00 KM neto + 1.094,29 KM PDV = 7.531,29 KM/mj.). Anexom priznato 58.795,86 KM ulaganja (kompenzovano 48.187,74 KM duga + 9 mj. zakupnina 5.258,32 KM). Član XIV propisuje jednostrani raskid ugovora i deložaciju ako se zakasni sa dvije uzastopne zakupnine.',
    effects: {},
    isActive: true,
  },
  {
    id: 'DOC-EXT-01',
    code: 'DOGOVOR-ZAKUP',
    title: 'Sporazum sa Općinom Centar o otplati duga za zakup Buka 11/13',
    source: 'Služba za upravljanje imovinom Općine Centar Sarajevo',
    date: 'Simulirani akt',
    impactAreas: ['Imovina', 'Zakup', 'Pravna sigurnost'],
    summary: 'Pismeni sporazum o reprogramu akumuliranog duga za zakup i uspostava trajnog trajnog naloga za 7.531,29 KM tekućeg zakupa. Otklanja se rizik deložacije.',
    effects: {
      riskResolved: ['RF-04'],
    },
    isActive: false,
  },
  {
    id: 'DOC-EXT-02',
    code: 'PU-POTVRDA',
    title: 'Pismena potvrda Porezne uprave FBiH o stanju javnih obaveza',
    source: 'Porezna uprava FBiH - Porezna ispostava Centar',
    date: 'Simulirani akt',
    impactAreas: ['Porezi', 'Subvencije', 'Likvidnost'],
    summary: 'Službena potvrda da su dospjele obaveze za doprinose servisirane, zatezne kamate poravnate i da nema smetnji za isplatu kantonalnih subvencija od 157.458 KM.',
    effects: {
      riskResolved: ['RF-07', 'RF-05'],
    },
    isActive: false,
  },
  {
    id: 'DOC-EXT-03',
    code: 'SANACIJA-DUGA',
    title: 'Formalizacija plana otplate preostalih potraživanja od uprave',
    source: 'Notarska kancelarija Sarajevo / Osnivač',
    date: 'Simulirani akt',
    impactAreas: ['Likvidnost', 'Porezi', 'Keš Tok'],
    summary: 'Pismeni notarski aneks kojim se definiše otplata preostalog dijela potraživanja (iznad 93.484,84 KM) u iznosu od 91.207 KM u roku od 12 mjeseci.',
    effects: {
      cashDeltaKM: 91207,
      riskResolved: ['RF-02'],
    },
    isActive: false,
  },
  {
    id: 'DOC-EXT-04',
    code: 'MEMO-100K',
    title: 'Interni računovodstveni memo o toku i reklasifikaciji 100.000 KM',
    source: 'Uprava grupacije i ovlašteni revizor',
    date: 'Simulirani akt',
    impactAreas: ['EBITDA', 'Transferne cijene', 'Pravni status'],
    summary: 'Kompletan interni dosije sa pratećim fakturama, bankovnim izvodima i pravnim obrazloženjem namjene sredstava MF Banke, uz izdvajanje iz redovnog prihoda.',
    effects: {
      riskResolved: ['RF-01'],
    },
    isActive: false,
  },
  {
    id: 'DOC-EXT-05',
    code: 'UPIS-95-CILJ',
    title: 'Realizacija plana ranog upisa: 95 učenika u IDSS (2027/28.)',
    source: 'Upisna komisija IDSS & IMH',
    date: 'Simulirani akt',
    impactAreas: ['Upis', 'EBITDA', 'Koeficijent Plata'],
    summary: 'Dostizanje cilja od 95 učenika (ARPU 9.800 KM = 931.000 KM prihoda od školarina). Udio plata pada sa 90,4% na 75,6% bez rasta nastavnog kadra.',
    effects: {
      ebitdaDeltaKM: 151524,
      studentsChange: 12,
      riskResolved: ['RF-06'],
    },
    isActive: false,
  },
];
