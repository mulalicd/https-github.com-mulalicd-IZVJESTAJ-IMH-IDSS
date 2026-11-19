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
    creditor: 'MF Banka a.d. Banja Luka',
    entity: 'IMH',
    type: 'Kredit',
    originalAmount: '100.000,00 KM',
    monthlyBurden: '4.660,68 KM / mj. (zadnja 4.660,73 KM)',
    maturity: '20.08.2028. (24 rate od 20.09.2026.); stanje 31.10.2026.: 92.481,66 KM',
    interestRate: '10,99% fiksna (EKS 12,63%)',
    collateral: 'Bjanko mjenice, naknada 1.000 KM + interkalarna kamata 632,30 KM',
    purpose: 'Dugoročni kredit (30.07.2026.) za operativnu likvidnost. Ukupni trošak kredita 13.488,67 KM (ukupno za povrat 113.488,67 KM).',
    status: 'Verifikovano [V] · Aktivan'
  },
  {
    id: 'DEBT-02',
    creditor: 'MF Banka a.d. Banja Luka',
    entity: 'IDSS',
    type: 'Kredit',
    originalAmount: '20.000,00 KM',
    monthlyBurden: 'Anuitet (36 mj.), stanje 31.10.2026.: 8.447,36 KM',
    maturity: 'juni 2028. (ugovor br. 457-0249/2025 od 12.06.2025.)',
    interestRate: '10,99% fiksna (EKS 12,69%)',
    collateral: '5 bjanko mjenica bez protesta (3 IDSS + 2 IMH) + solidarni dužnici IMH i Lamia Kacila (cjelokupna imovina, Sud u Banjoj Luci)',
    purpose: 'Trajna obrtna sredstva IDSS (plaćanje po fakturama). Zabrana poklanjanja/otuđenja imovine i obaveza prijave statusnih promjena banci.',
    status: 'Verifikovano [V] · Aktivan'
  },
  {
    id: 'DEBT-03',
    creditor: 'MF Banka a.d. Banja Luka',
    entity: 'IDSS',
    type: 'Overdraft',
    originalAmount: '15.000,00 KM limit',
    monthlyBurden: 'Kamata mjesečno (stanje 31.10.2026.: 5.554,04 KM)',
    maturity: '12.06.2026. (ugovor br. 437-0154/2025) – aneks produženja nedostaje u VDR-u',
    interestRate: '11,90% fiksna (EKS 13,45%)',
    collateral: '3 bjanko mjenice bez protesta + solidarni dužnici IMH i Lamia Kacila (Sud u Banjoj Luci)',
    purpose: 'Revolving likvidnost na računu 5724560000042638. Ugovorni rok istekao 12.06.2026., ali je konto 4240 i dalje aktivan – dostaviti aneks produženja u VDR.',
    status: 'Verifikovano [V] · Nedostaje aneks obnove nakon 12.06.2026.'
  },
  {
    id: 'DEBT-04',
    creditor: 'Sparkasse Leasing d.o.o. Sarajevo',
    entity: 'IMH',
    type: 'Leasing',
    originalAmount: '53.182,11 EUR finansirano (nabavna 100.980,15 EUR = 197.500,01 KM)',
    monthlyBurden: '1.027,91 EUR / mj. (≈2.010 KM) + zavisni troškovi 46.371 KM / 5 god.',
    maturity: 'juli 2031. (60 rata, ugovor br. 12546/26 od 14.07.2026.)',
    interestRate: '5,99% (6M Euribor 2,55% + 3,44%), EKS 8,02% s PDV',
    collateral: 'Upisan zalog (197.500,01 KM) u Registru zaloga Ministarstva pravde BiH + 2 mjenice IMH + 1 mjenica Lamia Kacila',
    purpose: 'Porsche Cayenne 2025 (368 kW, dobavljač AUTO MT d.o.o. Mostar). Tačka IX sadrži Change-of-Control raskidnu klauzulu pri promjeni vlasništva! Kasko 33.929,74 KM + reg. 7.358,32 KM + AO 5.083,30 KM.',
    status: 'Verifikovano [V] · Change-of-Control rizik · Preporuka: carve-out'
  },
  {
    id: 'DEBT-05',
    creditor: 'Lamia Kacila (Osnivač)',
    entity: 'IMH',
    type: 'Pozajmica',
    originalAmount: '93.484,84 KM',
    monthlyBurden: '7.790,40 KM / mj. (zadnja 7.790,44 KM)',
    maturity: '01.11.2026. – 01.10.2027. (12 rata po Prilogu 1)',
    interestRate: '0% (beskamatna pozajmica; zakonska zatezna pri kašnjenju)',
    collateral: 'Ugovor od 14.07.2026. (ranije vozilo Porsche 9YA Cayenne osnivača dato kao učešće 47.798,04 EUR)',
    purpose: 'Učešće za nabavku novog Cayennea predato AUTO MT d.o.o. Mostar. Član 6: kašnjenje 2 uzastopne rate povlači dospijeće cijelog duga odjednom.',
    status: 'Verifikovano [V] · Nije zasebno knjiženo na 422 · Prebiti s 184.692 KM'
  },
  {
    id: 'DEBT-06',
    creditor: 'Općina Centar Sarajevo',
    entity: 'Grupa',
    type: 'Zakup',
    originalAmount: 'Notarski ugovor OPU-IP-850/2023 od 27.09.2023. (Notar Nedžada Kapidžić) + Zaključak 08.08.2023. (0 KM duga)',
    monthlyBurden: '7.531,29 KM / mj. (6.437,00 KM neto + 1.094,29 KM PDV 17%)',
    maturity: '01.09.2023. – 31.08.2033. (zahtjev za produženje min. 30 dana ranije)',
    interestRate: 'Zakonska zatezna kamata; Član 9: neposredna notarska izvršnost bez parnice!',
    collateral: 'Član 9: IMH + Lamia Kacila LIČNO cjelokupnom pokretnom i nepokretnom imovinom! Račun UniCredit 3386902296575219',
    purpose: 'Poslovna zgrada Buka 11 i 13 (1.287,40 m², 5,00 KM/m²). Rok plaćanja PROMIJENJEN na 10. u mjesecu (Član 3). Član 6.5 i 11.3.e strogo zabranjuju podzakup/treće pravno lice (IDSS na Buka 13 treba pisanu saglasnost Općine!).',
    status: 'Verifikovano [V] u VDR-u · Potreban IOS (pretplata 22.468,71 KM) i aneks za IDSS'
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
    representative: 'Davor Mulalić (potpisano 07.11.2026. — 3 dana nakon razrješenja Odlukom UO IMH 04.11.2026.; hitno zamijeniti potpisom v.d. Anesa Memića i prebiti)',
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
  contractTitle: 'NOTARSKI UGOVOR O ZAKUPU POSLOVNE ZGRADE (VERIFIKOVANO [V])',
  contractNumber: 'OPU-IP-850/2023 (raniji ugovor: 04-49-36-59/13)',
  contractDate: '27.09.2023. (Notar Nedžada Kapidžić, Sarajevo)',
  place: 'Sarajevo',
  landlord: {
    name: 'Općina Centar Sarajevo',
    address: 'ul. Mis Irbina br. 1, Sarajevo',
    representative: 'Pravobranilac Mia Jeličić-Pizović (Generalna punomoć OPU-IP-210/2023 načelnika Srđana Mandića)',
    role: 'Zakupodavac'
  },
  tenant: {
    name: 'PPU INTERNATIONAL MONTESSORI HOUSE SARAJEVO (+ lični supotpis: Lamia Kacila, Član Društva)',
    address: 'ul. Buka br. 11, Sarajevo (MBS 65-01-0165-12, JIB 4201731140006)',
    ministryRegistration: 'Rješenje Ministarstva KS UP-11-01-38-29958/11 (16.12.2011.) i izmjena 11-06/01-34-42039-1/26 (14.10.2026.)',
    representative: 'Davor Mulalić (direktor u trenutku potpisa) i Lamia Kacila (Član Društva)',
    role: 'Zakupac + Lični jemac izvršnosti'
  },
  premises: {
    address: 'Buka 11 i 13, Sarajevo',
    totalAreaM2: 1287.40,
    purpose: 'Isključivo za obavljanje djelatnosti iz oblasti obrazovanja (Član 1 i 6)'
  },
  financialTermsOriginal: {
    pricePerM2: 5.00,
    monthlyRentNetKM: 6437.00,
    monthlyRentVatKM: 1094.29,
    monthlyRentGrossKM: 7531.29,
    paymentDeadline: 'Najkasnije do 10-tog u mjesecu (promijenjeno sa 15-tog!) na UniCredit Bank d.d. 3386902296575219 (Član 3)',
    startDate: '01.09.2023. (kontinuitet od 01.09.2013.)',
    operatingExpensesExcluded: 'Tekuće održavanje zgrade, komunalne naknade za građevinsko zemljište, odvoz smeća, voda, električna energija, centralno grijanje, dimnjačarske usluge'
  },
  securitiesAndDuration: {
    security: 'ČLAN 9 (IZVRŠNA NOTARSKA ISPRAVA): Neposredno prinudno izvršenje bez parničnog postupka na cjelokupnoj imovini IMH-a I ličnoj pokretnoj i nepokretnoj imovini Lamie Kacile (čl. 90 i 106 Zakona o notarima FBiH)!',
    durationOriginal: 'Prvobitno 01.09.2013. – 31.08.2023.; Zaključkom Komisije br. 16-45-sl.-60/23 od 08.08.2023. potvrđeno je 0,00 KM duga na dan produženja.',
    renewalTo2033: 'VERIFIKOVANO [V] U VDR-u: Notarski ugovor OPU-IP-850/2023 važi od 01.09.2023. do 31.08.2033. pod istom zaštićenom cijenom 5,00 KM/m² neto (7.531,29 KM/mj. bruto s PDV) za 1.287,40 m². Zahtjev za produženje podnosi se min. 30 dana ranije.',
    strategicHorizon: 'Zgrada Buka 11 i 13 je notarski osigurana do 31.08.2033., ali su-korištenje IDSS-a na Buka 13 mora se formalizovati pisanim aneksom Općine Centar!'
  },
  prohibitionsAndTermination: {
    subleaseProhibition: 'Član 6.5 i 11.3.e: Izričita zabrana podzakupa ili davanja prostora na korištenje trećem pravnom licu (uključujući poslovno-tehničku saradnju) – kršenje daje pravo na jednostrani raskid!',
    unilateralTerminationClause: 'Član 9 i 11: Ako zakupac ne plati 2 dospjele zakupnine u roku od 15 dana od preporučene opomene, Općina ima pravo na jednostrani raskid I neposredno prinudno izvršenje bez parnice protiv IMH-a i Lamie Kacile lično.'
  },
  annex2014: {
    annexTitle: 'ANEX RANJEG UGOVORA O ZAKUPU (HISTORIJSKA KOMPENZACIJA 2014.)',
    annexNumber: '04-49-13-12/14',
    annexDate: '13.03.2014.',
    basis: 'Član 27. Odluke o dodjeli zgrada (Sl. novine KS 13/07) i Zaključak Komisije za ocjenu nužnih radova 04-49-2538/13 od 05.12.2013.',
    investmentsTotalKM: 97993.10,
    recognizedInvestments60PctKM: 58795.86,
    compensationStructure: {
      immediateDueRentCompensationKM: 48187.74,
      remainingCompensationKM: 10608.12,
      reducedMonthlyRentNetKM: 5258.32,
      fullRentResumptionDate: '01.01.2015. (6.437,00 KM neto + 1.094,29 KM PDV = 7.531,29 KM/mj.)'
    }
  }
};
