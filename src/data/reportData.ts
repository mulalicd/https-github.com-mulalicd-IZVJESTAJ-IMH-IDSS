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
  { period: '2025/26', students: 68, contractValue: 717089, avgPerStudent: 10545, realizationRate: 84, note: 'Pad od 27,66% (~28%); uzrok prema upravi: odlazak stranih porodica [U]' },
  { period: '2026/27', students: 83, contractValue: 779476, avgPerStudent: 9391, realizationRate: 87.4, note: 'Oporavak: 63,64% prvačića (7 od 11) potiče iz predškolske grupe' },
];

export const DEBT_OBLIGATIONS: DebtObligation[] = [
  {
    id: 'DEBT-01',
    creditor: 'MF Banka',
    entity: 'IMH',
    type: 'Kredit',
    originalAmount: '100.000 KM',
    monthlyBurden: 'oko 4.661 KM / mj.',
    maturity: 'avgust 2028. (24 rate); stanje 31.10.2026.: 92.481,66 KM',
    interestRate: '10,99% fiksna (EKS 12,63%)',
    collateral: 'Mjenice, namjena operativna likvidnost',
    purpose: 'Finansiranje tekuće likvidnosti i obaveza. Partija kredita: [izostavljeno]. Ukupni trošak kredita 13.489 KM.',
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
    maturity: '12.06.2026. (status nakon dospijeća nije potvrđen); prekoračenje 31.10.2026.: 5.554,04 KM',
    interestRate: '11,90% fiksna',
    collateral: 'Solidarni dužnici: IMH i Lamia Kacila',
    purpose: 'Tekuća likvidnost. Dospijeva 12.06.2026. i mora se planski refinansirati ili zatvoriti.',
    status: 'Dospijeće prošlo; potvrditi obnovu ili zatvaranje'
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
    purpose: 'Porsche Cayenne 2025. Ugovor br. 12546/26. Vozilo koristi isključivo osnivač privatno. U knjigama IMH-a 31.10.2026.: obaveza 214.882,90 KM (uključuje učešće), amortizacija nije knjižena.',
    status: 'Aktivan'
  },
  {
    id: 'DEBT-05',
    creditor: 'Lamia Kacila (Osnivač)',
    entity: 'IMH',
    type: 'Pozajmica',
    originalAmount: '93.484,84 KM',
    monthlyBurden: '7.790,40 KM / mj. (zadnja 7.790,44 KM)',
    maturity: 'Po ugovoru 01.11.2026. – 01.10.2027. (12 rata); stvarno: prva uplata ≈4.400 KM 09.11.2026., dalje sukcesivno',
    interestRate: '0% (beskamatna pozajmica)',
    collateral: 'Ugovor potpisan 07.11.2026., na njemu datum 14.07.2026. (prethodno vozilo osnivača dato kao učešće)',
    purpose: 'Učešće za nabavku novog Cayennea dato preko AUTO MT d.o.o. Mostar. Uplata na lični račun zajmodavca kod Sparkasse. Kašnjenje 2 rate povlači cijeli iznos.',
    status: 'Nije proknjiženo na 31.10.2026.; preporuka: prebijanje s potraživanjima od osnivača'
  },
  {
    id: 'DEBT-06',
    creditor: 'Općina Centar Sarajevo',
    entity: 'Grupa',
    type: 'Zakup',
    originalAmount: 'Prema upravi novi ugovor od 27.09.2023. do 2033. [U] (raniji ugovor 04-49-36-59/13 od 30.08.2013. i Anex 13.03.2014.)',
    monthlyBurden: '7.531,29 KM / mj. (6.437,00 KM neto + 1.094,29 KM PDV 17%)',
    maturity: '31.08.2033. prema podacima uprave [U]',
    interestRate: 'Zakonska zatezna kamata na dospjela dugovanja',
    collateral: 'Poslovna zgrada Buka 11 i 13 (1.287,40 m² po fiksnoj zaštićenoj cijeni 5,00 KM/m²)',
    purpose: 'Zgrada Buka 11 i 13 (1.287,40 m²) za obrazovnu djelatnost IDSS i IMH. Zakupnina 7.531,29 KM/mj. do 15. u mjesecu; po čl. XIV neplaćanje dvije zakupnine nakon opomene daje Općini pravo na raskid.',
    status: 'Ugovor do 2033. treba dostaviti; stanje s Općinom treba usaglasiti (31.10.2026.: pretplata 22.468,71 KM, 8 od 10 faktura proknjiženo)'
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
    residence: 'Sarajevo',
    jmbg: '[izostavljeno – lični podatak]',
    role: 'Zajmodavac',
    account: 'lični račun zajmodavca kod SPARKASSE BANK D.D. BIH (broj izostavljen)'
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
    licensePlate: '[izostavljeno]',
    vin: '[izostavljeno]',
    deliveredTo: 'AUTO MT d.o.o. Mostar, Buna 154 A, 88000 Mostar',
    valuationKM: 93484.84,
  },
  newVehicleLeasing: {
    brand: 'PORSCHE CAYENNE (2025)',
    vin: '[izostavljeno]',
    leasingContractNumber: '12546/26 od 14.07.2026.',
    lessor: 'Sparkasse Leasing d.o.o. Sarajevo',
    downPaymentEUR: 47798.04
  },
  keyClauses: [
    { article: 'Član 1.', title: 'Predmet ugovora', text: 'Pozajmica radi plaćanja učešća od 47.798,04 EUR po Ugovoru o leasingu br. 12546/26 za Porsche Cayenne 2025.' },
    { article: 'Član 2.', title: 'Vozilo dato kao učešće', text: 'Pozajmica u stvari predajom vozila Porsche 9YA Cayenne (reg. oznaka i VIN izostavljeni) dobavljaču AUTO MT d.o.o. Mostar, Buna 154 A.' },
    { article: 'Član 3.', title: 'Iznos pozajmice', text: 'Saglasno utvrđena vrijednost od 93.484,84 KM predstavlja iznos pozajmice koja se vraća u novcu.' },
    { article: 'Član 4.', title: 'Kamata', text: 'Pozajmica je beskamatna (0% kamate).' },
    { article: 'Član 5.', title: 'Vraćanje pozajmice', text: '12 mjesečnih rata prema Prilogu 1 uplatom na lični račun zajmodavca kod Sparkasse. Pravo prijevremenog povrata bez naknade.' },
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
