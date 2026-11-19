// Potpuno verifikovani podaci iz USTAVNOG / Legal Due Diligence VDR repozitorija (2-GOOGLE_DISK_VDR)
// Svih 92 dokumenta su preuzeta, indeksirana i forenzički pregledana za IMH i IDSS.
// Lični podaci (JMBG, brojevi ličnih karata, privatni računi i imena neizvršnih radnika/roditelja) su izostavljeni.

export type VdrEntity = 'IMH' | 'IDSS' | 'Grupa';
export type VdrReadinessStatus = 'Verifikovano' | 'Djelimično' | 'Kritični jaz';

export interface VdrCategoryReadiness {
  code: string;
  folderKey: string;
  title: string;
  imhCount: number;
  idssCount: number;
  status: VdrReadinessStatus;
  verifiedHighlights: string;
  criticalGaps: string;
}

export interface CorporateRegistryProfile {
  entity: 'IMH' | 'IDSS';
  fullName: string;
  shortName: string;
  mbs: string;
  jib: string;
  seat: string;
  capitalKM: string;
  founder: string;
  ownershipHistory: string;
  registryExtractRef: string;
  registryCurrencyWarning: string;
  statutoryDirectorRegistered: string;
  actualGovernanceStatus: string;
  representationLimit: string;
  constitutionalRiskClause: string;
  ministryPermitRef: string;
  ministryPermitNote: string;
  activities: string[];
}

export interface GovernanceEvent {
  date: string;
  entity: VdrEntity;
  docRef: string;
  title: string;
  detail: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface BankSignatoryRow {
  entity: 'IMH' | 'IDSS';
  bank: string;
  accountNo: string;
  cardDate: string;
  signatories: string;
  bankLimit: string;
  courtRegistryLimit: string;
  complianceStatus: 'KRITIČAN RASCJEP' | 'HITNO AŽURIRANJE';
  actionRequired: string;
}

export interface ExecutiveContractSummary {
  id: string;
  entity: VdrEntity;
  title: string;
  docRef: string;
  keyFinancials: string;
  criticalClause: string;
  maImpact: string;
}

export interface HrDepartmentBreakdown {
  department: string;
  imhCount: number;
  idssCount: number;
  note: string;
}

export interface VdrCatalogItem {
  idx: number;
  entity: VdrEntity;
  folder: string;
  name: string;
  driveId: string;
}

export const VDR_OVERVIEW = {
  repoName: '2-GOOGLE_DISK_VDR (USTAVNI & Legal DD Repozitorij)',
  rootDriveUrl: 'https://drive.google.com/drive/folders/1VVawONLFPnJQt9psnUM6Y-aNj3YeMHgI',
  totalFiles: 92,
  totalFolders: 20,
  imhFiles: 54,
  idssFiles: 36,
  groupChecklistFiles: 2,
  verifiedAuditDate: 'Novembar 2026.',
  totalWorkforcePositions: 44,
  uniqueIndividuals: 43,
  criticalBlockersCount: 9,
};

export const VDR_READINESS_MATRIX: VdrCategoryReadiness[] = [
  {
    code: '0',
    folderKey: '0_DD_Checkliste',
    title: 'Operativna i NDA Legal DD lista',
    imhCount: 0,
    idssCount: 0,
    status: 'Verifikovano',
    verifiedHighlights: 'Operativna_LIsta17112026.pdf (11 str., 2-fazna DD lista A–I) i NDA list_legal DD_Bos_Eng 13112026.pdf (10 str., dvojezična lista).',
    criticalGaps: 'Služi kao referentna matrica: 2 cijele sekcije (G i H) i poreske potvrde (4.6, 4.7) još nisu popunjene.',
  },
  {
    code: 'A',
    folderKey: 'A_Korporativna_organizacija',
    title: 'Korporativna organizacija, osnivanje, UO i kartoni potpisa',
    imhCount: 23,
    idssCount: 18,
    status: 'Djelimično',
    verifiedHighlights: 'Osnivački akti, statuti/pravila, 4 kartona deponovanih potpisa, zapisnici UO (17.12.2025., 29.06.2026., 04.11.2026. – razrješenje u IMH i v.d. Anes Memić).',
    criticalGaps: 'Nedostaju historijski izvodi iz sudskog registra; IDSS izvod je iz 10.08.2023.; IMH izvod (23.06.2026.) ne odražava promjenu v.d. direktora od 04.11.2026.',
  },
  {
    code: 'B',
    folderKey: 'B_Vlasnistvo',
    title: 'Vlasništvo, prijenosi udjela i knjiga udjela',
    imhCount: 1,
    idssCount: 0,
    status: 'Djelimično',
    verifiedHighlights: 'IMH Ugovor o ustupanju 50% udjela bez naknade (Anja Imberg → Lamia Kacila, 09.03.2015., Apostille Hildesheim + notar Sarajevo).',
    criticalGaps: 'IDSS folder je prazan (promjena osnivača IMH → Lamia Kacila iz 19.06.2019. nalazi se u folderu A); nedostaju ažurne Knjige udjela za obje ustanove.',
  },
  {
    code: 'C',
    folderKey: 'C_Nekretnine',
    title: 'Nekretnine i ugovor o zakupu Buka 11/13',
    imhCount: 1,
    idssCount: 0,
    status: 'Djelimično',
    verifiedHighlights: 'POTPUNO VERIFIKOVAN notarski Ugovor OPU-IP-850/2023 od 27.09.2023. (01.09.2023.–31.08.2033., 1.287,40 m², 7.531,29 KM/mj., Zaključak 08.08.2023. bez duga).',
    criticalGaps: 'IDSS nema pisani pravni osnov za Buka 13! Član 6.5 i 11.3.e strogo zabranjuju podzakup/korištenje trećeg pravnog lica – neophodna pisana saglasnost Općine Centar.',
  },
  {
    code: 'D',
    folderKey: 'D_Pokretna_imovina',
    title: 'Pokretna imovina, leasing i registar zaloga',
    imhCount: 3,
    idssCount: 0,
    status: 'Verifikovano',
    verifiedHighlights: 'Sparkasse Leasing br. 12546/26 (14.07.2026., Porsche Cayenne 2025, 100.980,15 EUR neto), otplatni plan i Ugovor o zalogu (197.500,01 KM u Registru zaloga BiH).',
    criticalGaps: 'Nedostaje popis stalnih sredstava / inventurne liste za obje ustanove i potvrda iz Registra zaloga BiH za IDSS.',
  },
  {
    code: 'E',
    folderKey: 'E_Finansijski_aspekti_i_porezi',
    title: 'Krediti, pozajmice, bilansi (2023–31.10.2026.) i porezi',
    imhCount: 19,
    idssCount: 14,
    status: 'Djelimično',
    verifiedHighlights: 'Svi FIA izvještaji i glavne knjige 2023–2025, Bruto bilansi 31.10.2026., MF Banka ugovori (100k IMH, 20k + 15k IDSS) i Ugovor o pozajmici 93.484,84 KM.',
    criticalGaps: 'KRITIČNO NEDOSTAJU: 4.6.a/b Uvjerenja PU FBiH i porezne kartice (uz aktivne sporazume i dug na 45/467/468), 4.7 UIO BiH potvrde, 4.3.d Knjiga izdanih mjenica i aneks IDSS overdrafta nakon 12.06.2026.',
  },
  {
    code: 'F',
    folderKey: 'F_Radni_odnosi',
    title: 'Radni odnosi, menadžerski ugovori i inspekcije',
    imhCount: 2,
    idssCount: 3,
    status: 'Djelimično',
    verifiedHighlights: 'Spiskovi zaposlenih (20 IMH + 24 IDSS = 44 pozicije), Ugovor o radu Lamia Kacila (112/26, 3.000 KM neto), Menadžerski ugovori Davor Mulalić (2020. i 2024.).',
    criticalGaps: 'NEDOSTAJU: 5.6 Pravilnik o radu za obje ustanove, 5.15 KUIP rješenje UP-1-14-12-34-15117/26-12/07 od 30.09.2026. (spomenuto u zapisniku UO), ugovori o djelu (93.117 KM u IDSS-u).',
  },
  {
    code: 'G',
    folderKey: 'G_Ugovori',
    title: 'Komercijalni ugovori, dobavljači, roditelji i povezana lica',
    imhCount: 0,
    idssCount: 0,
    status: 'Kritični jaz',
    verifiedHighlights: 'Folder je prazan za obje ustanove (0 dokumenata).',
    criticalGaps: 'BLOKER ZA ZATVARANJE DD: Nedostaju Top 5 ugovora s dobavljačima, tipski ugovori s roditeljima, ugovor o podjeli troškova IMH↔IDSS (6.4) i pravni osnov za 100.000 KM (konto 6217).',
  },
  {
    code: 'H',
    folderKey: 'H_Sudski_sporovi',
    title: 'Sudski, upravni i inspekcijski postupci',
    imhCount: 0,
    idssCount: 0,
    status: 'Kritični jaz',
    verifiedHighlights: 'Folder je prazan za obje ustanove (0 dokumenata).',
    criticalGaps: 'BLOKER ZA ZATVARANJE DD: Nedostaju izjava uprave / advokatsko pismo o nepostojanju sporova (7.1–7.5) i pregled svih KUIP / poreznih postupaka.',
  },
  {
    code: 'I',
    folderKey: 'I_Dozvole_i_ostalo',
    title: 'Rješenja Ministarstva za odgoj i obrazovanje KS',
    imhCount: 5,
    idssCount: 1,
    status: 'Verifikovano',
    verifiedHighlights: 'IMH kompletna historija dozvola (2011., 2013., te novo Rješenje 11-06/01-34-42039-1/26 od 14.10.2026. za Buka 11); IDSS Rješenje UP-11-01-38-2587/16 od 19.02.2016.',
    criticalGaps: 'IMH rješenje od 14.10.2026. ima očitu grešku Ministarstva u uvodu („Dječiji vrtić Sveta obitelj“) – zatražiti zaključak o ispravci; u IDSS rješenju iz 2016. osnivač je još uvijek naveden kao IMH.',
  },
];

export const CORPORATE_PROFILES: CorporateRegistryProfile[] = [
  {
    entity: 'IMH',
    fullName: 'Privatna predškolska ustanova "International Montessori House" Sarajevo',
    shortName: '"International Montessori House" Sarajevo',
    mbs: '65-01-0165-12',
    jib: '4201731140006',
    seat: 'ul. Buka broj 11, Sarajevo-Centar (ranije Avde Smajlovića 9, preneseno OPU-IP: 69/2018)',
    capitalKM: '2.000,00 KM (100% upisan i uplaćen)',
    founder: 'Lamia Kacila (100%)',
    ownershipHistory: 'Osnovano 18.08.2011. (upis 31.01.2012.) u omjeru 50/50 Lamia Kacila i Anja Imberg (Wittingen, Njemačka). Ugovorom od 09.03.2015. (Apostille Hildesheim 10.03.2015., sudski upis 20.05.2015.) Anja Imberg ustupila je svoj udio od 50% (1.000 KM) bez naknade Lamiji Kacili.',
    registryExtractRef: 'Aktuelni izvod br. 065-0-RegZ-26-008337 od 23.06.2026.',
    registryCurrencyWarning: 'ZASTARJELO NAKON 04.11.2026.: U registru je još uvijek upisan Davor Mulalić; hitno provesti sudski upis v.d. direktora Anesa Memića i potom izabranog direktora po konkursu.',
    statutoryDirectorRegistered: 'Davor Mulalić (upisan rješenjem od 23.12.2020.)',
    actualGovernanceStatus: 'RAZRJEŠEN 04.11.2026. (Zapisnik 3. sjednice UO br. 179-1/26) po nalogu KUIP KS (UP-1-14-12-34-15117/26-12/07 od 30.09.2026.); imenovan v.d. direktor Anes Memić, javni konkurs objavljen 06.11.2026.',
    representationLimit: 'Ograničenje u sudskom registru: sva plaćanja i ugovori preko 2.000,00 KM moraju biti uz saglasnost Osnivača.',
    constitutionalRiskClause: 'Pravilnik o unutrašnjoj organizaciji (20.05.2015.) još uvijek navodi staro sjedište Avde Smajlovića 9 (čl. 5) i NE sadrži sistematizovano radno mjesto „Savjetnik za poslovanje“ (šifra 2419.13) na koje je 12.06.2026. zaposlena osnivačica.',
    ministryPermitRef: 'Rješenje Ministarstva KS br. 11-06/01-34-42039-1/26 od 14.10.2026. (Registar br. 17, str. 17)',
    ministryPermitNote: 'Potvrđuje sjedište Buka 11 i briše staru jedinicu Avde Smajlovića 9. Sadrži tehničku grešku Ministarstva u preambuli („Dječiji vrtić Sveta obitelj“) – tražiti zvaničnu ispravku.',
    activities: ['85.10 Predškolsko obrazovanje', '85.59 Ostalo obrazovanje', '85.60 Pomoćne uslužne djelatnosti u obrazovanju'],
  },
  {
    entity: 'IDSS',
    fullName: 'Privatna ustanova "INTERNATIONALE DEUTSCHE SCHULE SARAJEVO" - Međunarodna Njemačka Škola Sarajevo',
    shortName: 'PU I D S S',
    mbs: '65-05-0013-16',
    jib: '4202220420007',
    seat: 'ul. Buka br. 13, Sarajevo-Centar',
    capitalKM: '1.000,00 KM (100% upisan i uplaćen)',
    founder: 'Lamia Kacila (100%)',
    ownershipHistory: 'Osnovana 10.02.2016. (OPU-IP: 217/2016) od strane PPU IMH kao osnivača (uz saglasnost Vlade KS 02.12.2015. i Ministarstva 15.12.2015.). Odlukom Školskog odbora br. 044/2019-1 od 19.06.2019. IMH istupa, a Lamia Kacila lično postaje 100% osnivač.',
    registryExtractRef: 'Aktuelni izvod br. 065-0-RegZ-23-008444 od 10.08.2023.',
    registryCurrencyWarning: 'ZASTARJELO ZA 2026. DD: Izvod u VDR-u star je više od 3 godine; hitno pribaviti svježi aktuelni + historijski izvod iz 2026.',
    statutoryDirectorRegistered: 'Davor Mulalić (upisan rješenjem od 29.12.2020.; Menadžerski ugovor od 01.10.2024. do 01.10.2028.)',
    actualGovernanceStatus: 'Aktivan direktor po Menadžerskom ugovoru, ali postoji LATENTNI KUIP RIZIK: Član 30. Osnivačkog akta (OPU-IP: 217/2016) za direktora IDSS-a propisuje uslove nastavnika/pedagoga, min. 3 god. iskustva u nastavi, njemački C1 i zvanje mentora!',
    representationLimit: 'Ograničenje u sudskom registru: sva plaćanja i ugovori preko 2.000,00 KM moraju biti uz saglasnost Osnivača.',
    constitutionalRiskClause: 'Član 24. Osnivačkog akta (OPU-IP: 217/2016): „Osnivač škole supsidijarno je odgovoran za obaveze Škole.“ Član 22. i 43.: odluka o statusnoj promjeni (spajanje/pripajanje/podjela) donosi se min. 3 mjeseca unaprijed i važi tek od naredne školske godine.',
    ministryPermitRef: 'Rješenje Ministarstva KS br. UP-11-01-38-2587/16 od 19.02.2016. (Registar br. 76, str. 76)',
    ministryPermitNote: 'Potvrđuje ispunjenost uslova za osnovnu školu na Buka 11-13 (dostavljeno i Općini Centar – važan dokaz znanja Općine za Buka 13). U rješenju je još uvijek naveden IMH kao prvobitni osnivač.',
    activities: ['85.20 Osnovno obrazovanje', '85.51 / 85.52 / 85.59 / 85.60', '88.91 Dnevna briga o djeci', '58.14 / 58.19 Izdavaštvo'],
  },
];

export const GOVERNANCE_TIMELINE: GovernanceEvent[] = [
  {
    date: '16.12.2011. / 31.01.2012.',
    entity: 'IMH',
    docRef: 'UP-11-01-38-29958/11 · 065-0-Reg-12-000562',
    title: 'Osnivanje i dozvola za rad PPU IMH',
    detail: 'Registrovana predškolska ustanova na adresi Avde Smajlovića 9 (50/50 Lamia Kacila & Anja Imberg).',
    severity: 'info',
  },
  {
    date: '09.03.2015. / 20.05.2015.',
    entity: 'IMH',
    docRef: 'Ugovor o ustupanju · 065-0-Reg-15-001784',
    title: 'Konsolidacija 100% vlasništva Lamie Kacile u IMH',
    detail: 'Anja Imberg prenijela 50% udjela (1.000 KM) bez naknade Lamiji Kacili; potvrđen prečišćeni Statut OPU-IP: 340/15.',
    severity: 'info',
  },
  {
    date: '10.02.2016. / 19.02.2016.',
    entity: 'IDSS',
    docRef: 'OPU-IP: 217/2016 · UP-11-01-38-2587/16',
    title: 'Osnivanje i dozvola PU IDSS (Buka 13)',
    detail: 'Osnovana uz saglasnost Vlade KS (02.12.2015.); ugrađene supsidijarna odgovornost osnivača (čl. 24) i kvalifikacije direktora s njemačkim C1 (čl. 30).',
    severity: 'warning',
  },
  {
    date: '19.01.2018. & 19.06.2019.',
    entity: 'Grupa',
    docRef: 'OPU-IP: 69/2018 · Odluka 044/2019-1',
    title: 'Prenos sjedišta IMH na Buka 11 i direktno vlasništvo IDSS',
    detail: 'IMH prenosi sjedište na Buka 11; 19.06.2019. IMH istupa iz osnivaštva IDSS-a te Lamia Kacila postaje 100% direktni osnivač oba subjekta.',
    severity: 'info',
  },
  {
    date: '27.09.2023.',
    entity: 'IMH',
    docRef: 'OPU-IP-850/2023 (Notar Nedžada Kapidžić)',
    title: 'Notarski ugovor o zakupu Buka 11/13 do 31.08.2033.',
    detail: 'Zaključak Komisije 08.08.2023. potvrdio 0 KM duga. Ugovor sadrži Član 9 (neposredna izvršnost i na ličnoj imovini osnivača) i Član 6.5 (zabrana podzakupa).',
    severity: 'critical',
  },
  {
    date: '01.10.2024.',
    entity: 'IDSS',
    docRef: 'Menadžerski ugovor (čl. 27 ZOR FBiH)',
    title: 'Četverogodišnji menadžerski ugovor za direktora IDSS-a',
    detail: 'Neto plata 2.800 KM + indeksacija min. 3% + 5% neto dobiti + 6 mj. otkazni rok + 6 mj. otpremnina + 12 mj. non-compete po 50% (automatsko produženje 4 god.).',
    severity: 'warning',
  },
  {
    date: '17.12.2025.',
    entity: 'Grupa',
    docRef: 'Zapisnik 5. sjednice UO br. 107/25',
    title: 'Zajednička sjednica UO: norma nastavnika i 2FA kontrola',
    detail: 'Razmatran Pravilnik (25 nastavnih sati/sedm., odjeljenje sa 6 učenika ispod javnih standarda); osnivačica formalno zahtijevala admin pristup i 2FA na svoj broj na svim platformama.',
    severity: 'warning',
  },
  {
    date: '12.06.2026.',
    entity: 'IMH',
    docRef: 'Ugovor o radu br. 112/26',
    title: 'Zapošljavanje osnivačice u IMH-u na neodređeno',
    detail: 'Radno mjesto „Savjetnik za poslovanje“ (2419.13), 3.000 KM neto / 4.782,61 KM bruto (57.391 KM/god. bruto). Radno mjesto nije u Pravilniku iz 2015.',
    severity: 'warning',
  },
  {
    date: '14.07.2026. & 30.07.2026.',
    entity: 'IMH',
    docRef: 'Leasing 12546/26 · Pozajmica 93.485 KM · MF 100k',
    title: 'Porsche Cayenne leasing, zalog BiH, pozajmica osnivača i MF kredit',
    detail: 'Leasing s Change-of-Control klauzulom i zalogom na 197.500,01 KM; učešće dato putem starog vozila uz obavezu gotovinskog povrata 7.790,40 KM/mj. od 01.11.2026.; 16 dana kasnije uzet MF kredit 100.000 KM (EKS 12,63%).',
    severity: 'critical',
  },
  {
    date: '30.09.2026. / 04.11.2026.',
    entity: 'IMH',
    docRef: 'KUIP UP-1-14-12-34-15117/26-12/07 · UO 179-1/26',
    title: 'Inspekcijski nalog KUIP KS i smjena direktora u IMH',
    detail: 'KUIP naložio otklanjanje nepravilnosti po čl. 48 Zakona o predškolskom odgoju (rok 30 dana od 23.10.2026.). UO 04.11.2026. jednoglasno razriješio Davora Mulalića u IMH, imenovao v.d. Anesa Memića i 06.11.2026. raspisao javni konkurs (rok 8 dana).',
    severity: 'critical',
  },
];

export const BANK_SIGNATORY_AUDIT: BankSignatoryRow[] = [
  {
    entity: 'IMH',
    bank: 'Sparkasse Bank d.d. BiH',
    accountNo: '1990490058487943',
    cardDate: '15.04.2022.',
    signatories: 'Davor Mulalić (Pojedinačno) · Lamia Kacila (Pojedinačno)',
    bankLimit: 'Neograničeno',
    courtRegistryLimit: 'Do 2.000,00 KM (preko uz saglasnost Osnivača)',
    complianceStatus: 'HITNO AŽURIRANJE',
    actionRequired: 'Ukloniti/uskladiti ovlaštenje nakon razrješenja u IMH 04.11.2026., deponovati v.d. direktora i aktivirati dvostruki potpis preko 2.000 KM.',
  },
  {
    entity: 'IMH',
    bank: 'MF Banka a.d. Banja Luka',
    accountNo: '5724560000027469',
    cardDate: '27.03.2026.',
    signatories: 'Lamia Kacila (Samostalno) · Davor Mulalić (Samostalno)',
    bankLimit: 'Neograničeno',
    courtRegistryLimit: 'Do 2.000,00 KM (preko uz saglasnost Osnivača)',
    complianceStatus: 'HITNO AŽURIRANJE',
    actionRequired: 'Ažurirati karton nakon promjene direktora IMH 04.11.2026. i uskladiti limit s upisanim ograničenjem iz sudskog registra.',
  },
  {
    entity: 'IDSS',
    bank: 'Sparkasse Bank d.d. BiH',
    accountNo: '1994990021809884',
    cardDate: '15.04.2022.',
    signatories: 'Davor Mulalić (Pojedinačno) · Lamia Kacila (Pojedinačno)',
    bankLimit: 'Neograničeno',
    courtRegistryLimit: 'Do 2.000,00 KM (preko uz saglasnost Osnivača)',
    complianceStatus: 'KRITIČAN RASCJEP',
    actionRequired: 'Uvesti bankovni limit (dual-signature > 2.000 KM) ili formalno izmijeniti ograničenje u sudskom registru kako bi se uklonio ultra vires rizik.',
  },
  {
    entity: 'IDSS',
    bank: 'MF Banka a.d. Banja Luka',
    accountNo: '5724560000042638',
    cardDate: '13.06.2025.',
    signatories: 'SAMO Davor Mulalić (Samostalno) — Osnivač NIJE deponovan!',
    bankLimit: 'Neograničeno',
    courtRegistryLimit: 'Do 2.000,00 KM (preko uz saglasnost Osnivača)',
    complianceStatus: 'KRITIČAN RASCJEP',
    actionRequired: 'Hitno dodati osnivača na karton potpisa (kontinuitet poslovanja i kontrola) te uskladiti s limitom od 2.000 KM.',
  },
];

export const VERIFIED_LEASE_OPU_850 = {
  notaryAct: 'OPU-IP-850/2023 od 27.09.2023. (Notar Nedžada Kapidžić, Sarajevo)',
  commissionConclusion: 'Zaključak Komisije za poslovne prostorije br. 16-45-sl.-60/23 od 08.08.2023. (potvrđeno 0,00 KM duga na dan produženja)',
  powerOfAttorney: 'Generalna punomoć OPU-IP-210/2023 od 22.03.2023. (Načelnik Srđan Mandić → pravobranilac Mia Jeličić-Pizović)',
  parties: 'Općina Centar Sarajevo (Zakupodavac) · PPU International Montessori House (Zakupac) + Lamia Kacila kao lični supotpisnik (Član Društva)',
  premises: 'Poslovna zgrada ul. Buka 11 i 13 · 1.287,40 m² · isključivo obrazovna djelatnost',
  term: '01.09.2023. – 31.08.2033. (zahtjev za produženje min. 30 dana prije isteka, Član 2)',
  rentAndDueDate: '6.437,00 KM neto (5,00 KM/m²) + 1.094,29 KM PDV (17%) = 7.531,29 KM/mj., plativo DO 10. U MJESECU na UniCredit Bank d.d. 3386902296575219 (Član 3)',
  enforceabilityClause: 'ČLAN 9 (NEPOSREDNA IZVRŠNOST): Ugovor ima snagu izvršne notarske isprave (čl. 90 i 106 Zakona o notarima FBiH). I IMH i Lamia Kacila LIČNO cjelokupnom svojom pokretnom i nepokretnom imovinom pristali su na neposredno prinudno izvršenje bez parnice ako 2 dospjele zakupnine ostanu neplaćene 15 dana nakon preporučene opomene!',
  subleaseAndIdssRisk: 'ČLAN 6.5 i ČLAN 11.3.e (ZABRANA PODZAKUPA / IDSS BUKA 13): Stroga zabrana davanja prostora na korištenje trećem pravnom licu (uključujući poslovno-tehničku saradnju) pod prijetnjom jednostranog raskida. IDSS je posebno pravno lice (JIB 4202220420007) koje koristi Buka 13 i plaća IMH-u 68.419,89 KM (10 mj. 2026., konto 5599). Olakšavajuća okolnost: Rješenje Ministarstva KS za IDSS (19.02.2016.) dostavljeno je Općini Centar. OBAVEZNO: Pribaviti pisani aneks / saglasnost Općine za su-korištenje IDSS-a!',
  accountingStatusOct2026: 'Knjigovodstvo IMH na 31.10.2026. (konto 4320-177): plaćeno 82.719,03 KM vs proknjiženo 8 faktura (60.250,32 KM) → knjigovodstvena pretplata 22.468,71 KM. Potreban zvaničan IOS sa Općinom Centar.',
};

export const EXECUTIVE_CONTRACTS_AND_COLLATERAL: ExecutiveContractSummary[] = [
  {
    id: 'EXEC-01',
    entity: 'IDSS',
    title: 'Menadžerski ugovor direktora (Davor Mulalić)',
    docRef: '01.10.2024. (čl. 27 Zakona o radu FBiH)',
    keyFinancials: '2.800 KM neto/mj. · godišnja indeksacija inflacija ili min. 3% · bonus min. 5% godišnje neto dobiti · edukacija min. 5.000 KM/god. · službeno vozilo (poslovno i privatno) · privatno zdravstveno.',
    criticalClause: 'Član 14 & 12.5 & 17 (ZLATNI PADOBRAN): Mandat 4 god. (do 01.10.2028.) uz automatsko produženje za 4 god. ako se ne otkaže 6 mj. ranije. Otkazni rok 6 mjeseci + otpremnina bez krivice 6 mjesečnih plata + 12 mjeseci zabrane konkurencije uz naknadu 50% plate.',
    maImpact: 'Ugovorna izlazna izloženost pri raskidu bez krivice + aktivaciji zabrane konkurencije dostiže 12 do 18 mjesečnih plata! Također provjeriti usklađenost s Članom 30. Osnivačkog akta IDSS-a (njemački C1 / nastavnička sprema).',
  },
  {
    id: 'EXEC-02',
    entity: 'IMH',
    title: 'Ugovor o radu osnivačice (Lamia Kacila)',
    docRef: 'Broj 112/26 od 11.06.2026. (primjena 12.06.2026.)',
    keyFinancials: 'Neodređeno vrijeme (probni rad 6 mj. do 12.12.2026.) · Savjetnik za poslovanje (šifra 2419.13) · 3.000,00 KM neto / 4.782,61 KM bruto mjesečno (57.391 KM/god. bruto + topli obrok 1% FBiH + prevoz).',
    criticalClause: 'Radno mjesto „Savjetnik za poslovanje“ (2419.13) ne postoji u važećem Pravilniku o unutrašnjoj organizaciji IMH-a iz 2015. godine. Otkazni rok poslodavca 14 dana (7 dana u probnom radu).',
    maImpact: 'U M&A / EBITDA normalizaciji predstavlja potencijalni add-back od ~60.000 KM/god. ukoliko kupac ne zadržava savjetničku funkciju nakon zatvaranja transakcije.',
  },
  {
    id: 'EXEC-03',
    entity: 'IMH',
    title: 'Sparkasse Leasing br. 12546/26 & Zalog BiH (Porsche Cayenne 2025)',
    docRef: '14.07.2026. · Registar zaloga Ministarstva pravde BiH',
    keyFinancials: 'Nabavna neto 100.980,15 EUR (197.500,01 KM) · učešće 47,33% (47.798,04 EUR) · finansirano 53.182,11 EUR · 60 rata × 1.027,91 EUR (EKS 8,02% s PDV). Zavisni troškovi u 5 god.: kasko 33.929,74 KM, reg. 7.358,32 KM, AO 5.083,30 KM (ukupno 46.371 KM).',
    criticalClause: 'Tačka IX, alineja 8 (CHANGE-OF-CONTROL): Promjena vlasničke strukture IMH-a ili mjeničnog dužnika daje Sparkasse Leasingu pravo na momentalni raskid i naplatu cjelokupnog preostalog duga! Upisan zalog na 197.500,01 KM.',
    maImpact: 'Klasična neoperativna imovina za izdvajanje (carve-out) prije ili na dan transakcije; uz pozajmicu osnivača od 93.484,84 KM (7.790,40 KM/mj. od 01.11.2026.) opterećuje mjesečni cash-flow IMH-a za ≈9.800 KM/mj.',
  },
  {
    id: 'EXEC-04',
    entity: 'Grupa',
    title: 'MF Banka kreditni paket, unakrsna jemstva i bjanko mjenice',
    docRef: '457-0249/2025 · 437-0154/2025 · 5724574555355002',
    keyFinancials: 'IMH dugoročni 100.000 KM (30.07.2026., 24 rate × 4.660,68 KM, EKS 12,63%, saldo 31.10.2026.: 92.481,66 KM) · IDSS dugoročni 20.000 KM (12.06.2025., 36 mj., EKS 12,69%, saldo 8.447,36 KM) · IDSS overdraft 15.000 KM (EKS 13,45%, saldo 5.554,04 KM).',
    criticalClause: 'Unakrsno solidarno dužništvo (IDSS ↔ IMH ↔ Lamia Kacila cjelokupnom ličnom imovinom) + najmanje 8 bjanko mjenica bez protesta (5 za kredit 20k, 3 za overdraft 15k + mjenice za IMH 100k) + nadležnost Suda u Banjoj Luci + zabrana raspolaganja imovinom i obaveza prijave statusnih promjena.',
    maImpact: 'IDSS overdraftu je ugovorni rok istekao 12.06.2026. – u VDR-u nedostaje aneks produženja. Prije promjene vlasništva obavezno pisano odobrenje MF Banke ili potpuno refinansiranje.',
  },
];

export const HR_ROSTER_SUMMARY = {
  imhTotal: 20,
  imhIndefinite: 13,
  imhFixedTerm: 7,
  idssTotal: 24,
  idssManagerial: 1,
  idssIndefinite: 9,
  idssFixedTerm: 14,
  overlapNote: 'Ukupno 44 sistematizovane pozicije / ugovora, odnosno 43 jedinstvena lica (direktor Davor Mulalić evidentiran je u oba entiteta: u IMH na neodređeno od 05.01.2021., u IDSS po Menadžerskom ugovoru od 01.10.2020./2024.; u IMH razriješen funkcije direktora 04.11.2026.).',
  departments: [
    {
      department: 'Uprava, savjetovanje i administracija',
      imhCount: 4,
      idssCount: 2,
      note: 'IMH: direktor (u tranziciji), savjetnik za poslovanje (osnivač od 12.06.2026.), sekretar, finansijsko-admin saradnik; IDSS: direktor (menadžerski), sekretar (dipl. pravnik).',
    },
    {
      department: 'Nastavni, predškolski i stručni kadar',
      imhCount: 9,
      idssCount: 19,
      note: 'IMH: 2 pedagoga, 2 odgajatelja, 5 asistenata (2 studenta); IDSS: pedagog, školski psiholog i 17 nastavnika (4 njemački, 2 engleski, 2 bosanski, francuski, matematika, geografija, historija, muzičko, likovno, tjelesni/v.d. IMH, razredna nastava, etika).',
    },
    {
      department: 'Zdravstvena njega (pedijatrijske i med. sestre)',
      imhCount: 3,
      idssCount: 0,
      note: 'IMH: 2 pedijatrijske sestre i 1 medicinska sestra za jasličke i vrtićke grupe.',
    },
    {
      department: 'Kuhinja, tehničko održavanje i higijena',
      imhCount: 4,
      idssCount: 3,
      note: 'IMH: 2 radnika u kuhinji i 2 spremačice; IDSS: 1 domar i 2 spremačice.',
    },
  ] as HrDepartmentBreakdown[],
};

export const VDR_DOCUMENT_CATALOG: VdrCatalogItem[] = [
  { idx: 1, entity: 'Grupa', folder: '0_DD_Checkliste', name: "NDA list_legal DD_Bos_Eng 13112026.pdf", driveId: '1_p3QvBuDKn88gWKQLjzh8Vtb6CpEILmG' },
  { idx: 2, entity: 'Grupa', folder: '0_DD_Checkliste', name: "Operativna_LIsta17112026.pdf", driveId: '1osVZX8Vhd440QMDAXteHjq_2eH10nc4D' },
  { idx: 3, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.1.a_IMH_Rjesenje_o_registraciji_31.01.2012.pdf", driveId: '1DDW3tPFi5gYvJjCXI9gnjOGifnLzEdkM' },
  { idx: 4, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.1.b_IMH_Notarski_otpravak_utvrdjenje_statuta_19.01.2018.pdf", driveId: '1B8mLZbnZld4r-Our6LFkpkWZ3bOInrFB' },
  { idx: 5, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.1.b_IMH_Odluka_o_izmjeni_statuta_27.11.2019.pdf", driveId: '1QkizOZOerfRTTNXT7u6Wfyyb1rcWWiq9' },
  { idx: 6, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.1.b_IMH_Statut_PPU_IMH_01.04.2015.pdf", driveId: '1VkYz2OB7OgdNQ2WXvk-VVa_WNbTwxG9j' },
  { idx: 7, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.1.c_IMH_Odluka_o_izmjeni_odluke_o_osnivanju_OPU-IP_69-2018_19.01.2018.pdf", driveId: '18hS4LWmg4rrclVRTxcXsDorex42LBDcN' },
  { idx: 8, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.1.c_IMH_Odluka_razrjesenje_DB_imenovanje_DM_30.10.2020.pdf", driveId: '1YGvtkCHLQ8xUBeGFzL7XvgROjuE1phls' },
  { idx: 9, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.1.c_IMH_Odluka_razrjesenje_direktora_LK_26.11.2019.pdf", driveId: '1USotXS6cny-XAsQ-brCnMrcUWw-QR8o_' },
  { idx: 10, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.1.c_IMH_Rjesenje_o_izmjenama_podataka_09.01.2020.pdf", driveId: '1Md8NTVlcx1wOr34z2Q1OClk1WlSw5szf' },
  { idx: 11, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.1.c_IMH_Rjesenje_o_izmjenama_podataka_20.05.2015.pdf", driveId: '1eozeRldjPPvkEQK3cV83QBhH0O2VPDcb' },
  { idx: 12, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.1.c_IMH_Rjesenje_o_izmjenama_podataka_21.02.2018.pdf", driveId: '1TiZbf3g49c-ckK3j2HdSc2C8PJUhvWvs' },
  { idx: 13, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.1.c_IMH_Rjesenje_o_izmjeni_podataka_direktor_DM_23.12.2020_v2.pdf", driveId: '1PBlXgw0TOnQ4WDf1akpGkSZ13QJ32QHX' },
  { idx: 14, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.1.d_IMH_Aktuelni_izvod_iz_sudskog_registra_23.06.2026.pdf", driveId: '1HmQ0JUB0Gk6kzzt56a6flFUpGpko-lcw' },
  { idx: 15, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.1.d_IMH_Izvod_iz_sudskog_registra_05.02.2019.pdf", driveId: '1HnDjOpfrBe4a9urY4O6vfH-NgxGsnlcv' },
  { idx: 16, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.12_IMH_Pravilnik_o_unutrasnjoj_organizaciji_i_nacinu_rada.pdf", driveId: '1rZUnC644ROX5mnTZnz1WpNju4BUUmKp9' },
  { idx: 17, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.13_IMH_MF_Banka_Karton_deponovanih_potpisa_2026.pdf", driveId: '1QTXYwawc8YrXuVX-pe0_FilWBnfl3gJg' },
  { idx: 18, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.13_IMH_Sparkasse_Bank_Karton_deponovanih_potpisa.pdf", driveId: '1u1JznL9jBAdhBxsLudqUJsGjVaDIKGkD' },
  { idx: 19, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.4_IMH_Odluka_Upravnog_odbora_01.02.2018.pdf", driveId: '1x-R0-gdEGl24dayW_XxAUungyZloYPB-' },
  { idx: 20, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.4_IMH_Odluka_Upravnog_odbora_05.07.2017.pdf", driveId: '1cZr0XnEAvWU7f_FAZFJIUhTe4wyMi7pZ' },
  { idx: 21, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.4_IMH_Odluka_Upravnog_odbora_22.09.2021.pdf", driveId: '1KwJvkd6oQ7zNM6ghlw1wKHI1E4mh05PZ' },
  { idx: 22, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.4_IMH_Odluka_Upravnog_odbora_30.10.2020.pdf", driveId: '1M3bPkhefQFcAnxH8_JHmfGNzMlJjMoF_' },
  { idx: 23, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.4_IMH_Zapisnik_1_sjednice_UO_29.06.2026.pdf", driveId: '18ho2Jm5GGZuA-nw8AOr1MJJ5X6C-_tNq' },
  { idx: 24, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.4_IMH_Zapisnik_3_sjednice_UO_04.11.2026.pdf", driveId: '1DkgYB7BDIDJTMz1MunnlFQEVPez8b5lh' },
  { idx: 25, entity: 'IMH', folder: 'A_Korporativna_organizacija', name: "1.4_IMH_Zapisnik_5_sjednice_UO_17.12.2025.pdf", driveId: '1l3CEDllqa0LgEq_caUbBGE6lPXbeGCo5' },
  { idx: 26, entity: 'IMH', folder: 'B_Vlasnistvo', name: "2.1_IMH_Ugovor_o_ustupanju_udjela_09.03.2015.pdf", driveId: '1fYHhHo8wlmJkX8an-HujVZF5e5LUyaGZ' },
  { idx: 27, entity: 'IMH', folder: 'C_Nekretnine', name: "3.1.a_IMH_Ugovor_o_zakupu_poslovne_zgrade_Opcina_Centar_27.09.2023.pdf", driveId: '1o_xGX1djiRO3UpNJ-3VpdkjSkHSNtAhW' },
  { idx: 28, entity: 'IMH', folder: 'D_Pokretna_imovina', name: "3.4.c_IMH_Ugovor_o_zalogu_Sparkasse_Leasing_14.07.2026.pdf", driveId: '13LvaaPXngTG7WCWpmysTiTcFS2j-818z' },
  { idx: 29, entity: 'IMH', folder: 'D_Pokretna_imovina', name: "3.5_IMH_Sparkasse_Leasing_otplatni_plan_14.07.2026.pdf", driveId: '1GQuniX5CrzKTwyC0873Uh8vfa3gXVWZQ' },
  { idx: 30, entity: 'IMH', folder: 'D_Pokretna_imovina', name: "3.5_IMH_Sparkasse_Leasing_ugovor_14.07.2026.pdf", driveId: '1Li6KOM3tUXuMUIc52w352JsrwHP1683y' },
  { idx: 31, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.1_4.3.a_IMH_suduznik_MF_Overdraft_IDSS_12.06.2025.pdf", driveId: '1mkRVe_-obiUjNxeKPE8GQhnaEpcVCBZW' },
  { idx: 32, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.1_4.3.a_IMH_suduznik_MF_Ugovor_o_kreditu_IDSS_12.06.2025.pdf", driveId: '1EWgr5ohhAKtUHS0iMiRHSrLYaQ6pcDQS' },
  { idx: 33, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.1_IMH_MF_Banka_Dugorocni_kredit_100000_30.07.2026.pdf", driveId: '1t6k6cBrop0zKpElLgJwpJV7Q0-CGNmcE' },
  { idx: 34, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.1_IMH_MF_Banka_Ugovor_o_kreditu_17.07.2026.pdf", driveId: '18Rlp-AO1yqEYB6kMweQFGUFeV4tbetVD' },
  { idx: 35, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IMH_Bruto_bilans_01.05-31.12.2025.pdf", driveId: '1armdh_qZGtbY5dH7pBfthF4DydCUfPLC' },
  { idx: 36, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IMH_Bruto_bilans_2023.pdf", driveId: '1ZY_T3fxc2ngYEvuAekkyJVr5k8Cf7WQs' },
  { idx: 37, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IMH_Bruto_bilans_2024.pdf", driveId: '10QyJGNi7NeKVY2cf3glI7UFKLz5eV2KL' },
  { idx: 38, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IMH_Bruto_bilans_2025.docx", driveId: '1eg6FOrayReaJVsyB1Z01uMPk-PqJm0JH' },
  { idx: 39, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IMH_Bruto_bilans_2025.pdf", driveId: '1_g4FeJiC0Ry6qGxkJ4aaHvOFAQPeEULf' },
  { idx: 40, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IMH_Bruto_bilans_31.10.2026.docx", driveId: '1ipRz8U6M0Zano5P2ovvAxy3A11DoElXi' },
  { idx: 41, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IMH_Bruto_bilans_31.10.2026.pdf", driveId: '1vGpfj_aqdDXVSNF-iFtpgrJR-SxrYHzH' },
  { idx: 42, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IMH_Finansijski_izvjestaji_2023.pdf", driveId: '1iXIBwxTQHHJgRs69PIfO668kPx5E9duH' },
  { idx: 43, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IMH_Finansijski_izvjestaji_2024.pdf", driveId: '1wbfwVZbJKZK7JwUg0Phz8vS0tcfB8cIp' },
  { idx: 44, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IMH_Finansijski_izvjestaji_2025.pdf", driveId: '1mHBAxyJw4u7b3nZQKUk83LQNNHPZqq0J' },
  { idx: 45, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IMH_Glavna_knjiga_2023.pdf", driveId: '1-avEISHAn6goYQlDUDqwOk8IYSEOprj5' },
  { idx: 46, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IMH_Glavna_knjiga_2024.pdf", driveId: '18lN_OH4Qq39QV5ntZKJ9Wd38LBoODbd0' },
  { idx: 47, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IMH_Glavna_knjiga_2025.pdf", driveId: '1uCkYTu1CHl8BD829gf1oVv7YA1zO4DF7' },
  { idx: 48, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IMH_Glavna_knjiga_30.04.2025.pdf", driveId: '1f8ol5XNlr3BigT_q2_oiY9BknIplRehP' },
  { idx: 49, entity: 'IMH', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.5_4.1_IMH_Ugovor_o_pozajmici_Lamia_prema_IMH_2026.pdf", driveId: '1eDsPuQSJSCOco4Ywt1XMIcDUFfOFbh1R' },
  { idx: 50, entity: 'IMH', folder: 'F_Radni_odnosi', name: "5.1_IMH_Spisak_zaposlenih.xlsx", driveId: '1XwTALgeIjMe3PiO1rW8QIrUjsG_RfX3J' },
  { idx: 51, entity: 'IMH', folder: 'F_Radni_odnosi', name: "5.4_IMH_Ugovor_o_radu_Lamia_Kacila_12.06.2026.pdf", driveId: '1wDnT0_sr3b37d-TjB4QusWktYeEoBKcS' },
  { idx: 52, entity: 'IMH', folder: 'I_Dozvole_i_ostalo', name: "8.1_IMH_Rjesenje_Min_obrazovanja_16.12.2011.pdf", driveId: '1omMuZ7lSzxbKawjJ86wY0v1_DLNpBM0k' },
  { idx: 53, entity: 'IMH', folder: 'I_Dozvole_i_ostalo', name: "8.1_IMH_Rjesenje_o_ispunjenju_uslova_16.12.2011.pdf", driveId: '12LouhdaXwWXElYuT-Ntch1Kne6NiJKrY' },
  { idx: 54, entity: 'IMH', folder: 'I_Dozvole_i_ostalo', name: "8.1_IMH_Rjesenje_o_ispunjenju_uvjeta_20.12.2013.pdf", driveId: '1qzo1MmkU5Zw5s90HbGjJRfOedWolqruJ' },
  { idx: 55, entity: 'IMH', folder: 'I_Dozvole_i_ostalo', name: "8.1_IMH_Rjesenje_o_izmjenama_i_dopunama_14.10.2026.pdf", driveId: '1qNlIt0ADS1QzKk_yVEDpH3DQTVLTC6UR' },
  { idx: 56, entity: 'IMH', folder: 'I_Dozvole_i_ostalo', name: "8.1_IMH_Rjesenje_o_izmjenama_i_dopunama_27.12.2013.pdf", driveId: '1FS6Gs1OP3JZv5E1VC5HRvYlo11r2VO50' },
  { idx: 57, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.1.a_IDSS_Ispravka_izvornika_11.04.2016.pdf", driveId: '1mUrbojmXbHZsf38GYi9t2FwgkVq4iLPG' },
  { idx: 58, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.1.a_IDSS_Otpravak_izvornika_Osnivanje_10.02.2016.pdf", driveId: '1DIYu4VTe--kF3F12DS_3VCLRvYTD_x1f' },
  { idx: 59, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.1.a_IDSS_Rjesenje_o_registraciji_25.04.2016.pdf", driveId: '1tDxaq3F8JfFrjipN0xqZTmIK0tY4qm9Y' },
  { idx: 60, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.1.b_IDSS_Odluka_o_izmjeni_Pravila_044-2019-1_19.06.2019.pdf", driveId: '1URZpWPqBgU_wCT6VIY1HWwcppBRBn606' },
  { idx: 61, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.1.b_IDSS_Otpravak_izvornika_izmjena_04.11.2016.pdf", driveId: '1Nnx4Px57uIJJqKw0jR1Bq4mgM_K_RHgr' },
  { idx: 62, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.1.b_IDSS_Pravila_skole_15.12.2015.pdf", driveId: '1dgZhK1FDJbAcTanDD-SZQT1N8juYvsvp' },
  { idx: 63, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.1.c_IDSS_Rjesenje_o_izmjeni_podataka_01.10.2019.pdf", driveId: '1pvtAzJUxvjjyxFRVvpYVJm2cZBrT_tnT' },
  { idx: 64, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.1.c_IDSS_Rjesenje_o_izmjeni_podataka_04.12.2019.pdf", driveId: '1dR7FQvKHymmPro3rGab7bfDlmFO4kvtz' },
  { idx: 65, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.1.c_IDSS_Rjesenje_o_izmjeni_podataka_05.07.2019.pdf", driveId: '122zw9FV15hZ4J2MxKHQ92CGakS8u6pJY' },
  { idx: 66, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.1.c_IDSS_Rjesenje_o_izmjeni_podataka_14.11.2016.pdf", driveId: '1mwAMw1T6TFPQlX7ASJuAEtZqsuuA4GrK' },
  { idx: 67, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.1.c_IDSS_Rjesenje_o_izmjeni_podataka_16.03.2017.pdf", driveId: '1nk3jbDsc9rYFh6OhWN1RQ5h89lZP_5vr' },
  { idx: 68, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.1.c_IDSS_Rjesenje_o_izmjeni_podataka_29.12.2020.pdf", driveId: '1Jivx77dglsnUWY4cqQ0Pd3ZLNTQxf4Hd' },
  { idx: 69, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.1.d_IDSS_Izvod_iz_sudskog_registra_10.08.2023.pdf", driveId: '1nvpt01oi4o5yF1PApMEqathRLwZddawC' },
  { idx: 70, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.13_IDSS_MF_Banka_Karton_deponovanih_potpisa.pdf", driveId: '1ycxeSjPfnPC8Yp50eqpHl4Gs3eJRUbw-' },
  { idx: 71, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.13_IDSS_Sparkasse_Bank_Karton_deponovanih_potpisa.pdf", driveId: '1q_Zq-ew18rphYyIEMz9vdhTa67et_9ol' },
  { idx: 72, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.4_IDSS_Odluka_Upravnog_odbora_01.02.2018.pdf", driveId: '14MiWF1VMWORxjrGEQI7LuE3LXYbSD4Xl' },
  { idx: 73, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.4_IDSS_Odluka_Upravnog_odbora_05.07.2017.pdf", driveId: '1v-xTVEe7U4n8JTQzBOsM7QSoYkGrpo-0' },
  { idx: 74, entity: 'IDSS', folder: 'A_Korporativna_organizacija', name: "1.4_IDSS_Zapisnik_5_sjednice_UO_17.12.2025.pdf", driveId: '1C_nXXw_gayHcoIilpMJUhTDmOGmw5OyB' },
  { idx: 75, entity: 'IDSS', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.1_IDSS_MF_Banka_Ugovor_o_kreditu_12.06.2025.pdf", driveId: '1OrXJ8i-cAxuauPAv_S16lVXNQ9oPMwz8' },
  { idx: 76, entity: 'IDSS', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.1_IDSS_MF_Banka_Ugovor_o_kreditu_Overdraft_12.06.2025.pdf", driveId: '1S4TEkaLEKKBWGobb78h7fdoVJwFtOaWH' },
  { idx: 77, entity: 'IDSS', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IDSS_Bruto_bilans_01.05-31.12.2025.pdf", driveId: '1Qvnw7A32a2CbMRz_cmsNAeUV3N7PLFf1' },
  { idx: 78, entity: 'IDSS', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IDSS_Bruto_bilans_2023.pdf", driveId: '1IJvI1vD1d8eSI3LjHsuamm-abpi-4PdV' },
  { idx: 79, entity: 'IDSS', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IDSS_Bruto_bilans_2024.pdf", driveId: '1G_OIBrYttSB1bbUwsr_EWjvJs-PHbEro' },
  { idx: 80, entity: 'IDSS', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IDSS_Bruto_bilans_30.04.2025.pdf", driveId: '1G6PGz5NBQYvcZRcu5knlVzBgX3MDHUCF' },
  { idx: 81, entity: 'IDSS', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IDSS_Bruto_bilans_31.10.2026.pdf", driveId: '1TJfew0Ctd-uoqjZ-AJXi5nOF--Ste14p' },
  { idx: 82, entity: 'IDSS', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IDSS_Finansijski_izvjestaji_2023.pdf", driveId: '17WuVjMuFCwXQbZr5jMZKEBHw9RzuXCS9' },
  { idx: 83, entity: 'IDSS', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IDSS_Finansijski_izvjestaji_2024.pdf", driveId: '1gNKI1kt0HsCWvHH6ixjtP_W7uJIj4DOL' },
  { idx: 84, entity: 'IDSS', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IDSS_Finansijski_izvjestaji_2025.pdf", driveId: '1dmeLZjKc20-d7kCsEUrSuJmYEzvfvUa5' },
  { idx: 85, entity: 'IDSS', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IDSS_Glavna_knjiga_01.05.2025_nastavak.pdf", driveId: '1sKGsGSvmuPbUyheYXA1f4HAu8a6cblGT' },
  { idx: 86, entity: 'IDSS', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IDSS_Glavna_knjiga_2023.pdf", driveId: '1qDlpuzhfk9kIoGClMQwG3LfdMo30_Isb' },
  { idx: 87, entity: 'IDSS', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IDSS_Glavna_knjiga_2024.pdf", driveId: '1cykLS0BRQZK6lPNpIx6kTyXOEArgt3_U' },
  { idx: 88, entity: 'IDSS', folder: 'E_Finansijski_aspekti_i_porezi', name: "4.4_IDSS_Glavna_knjiga_30.04.2025.pdf", driveId: '1dPMNN0s5HszYPTONyOx6NbZePpXEqFFm' },
  { idx: 89, entity: 'IDSS', folder: 'F_Radni_odnosi', name: "5.1_IDSS_Spisak_zaposlenih.xlsx", driveId: '1PiN4AxvsgeWwlob7pehFPmylWasn79Oh' },
  { idx: 90, entity: 'IDSS', folder: 'F_Radni_odnosi', name: "5.5_IDSS_Menadzerski_ugovor_Davor_Mulalic_2020.pdf", driveId: '1EBB6EUhTOe7NYQGLyXYPWNveOW2VzGar' },
  { idx: 91, entity: 'IDSS', folder: 'F_Radni_odnosi', name: "5.5_IDSS_Menadzerski_ugovor_Davor_Mulalic_2024.pdf", driveId: '1kbtkmQVA8AO-kBEqRX9tMR-2uxeW1_NF' },
  { idx: 92, entity: 'IDSS', folder: 'I_Dozvole_i_ostalo', name: "8.1_IDSS_Rjesenje_Ministarstva_obrazovanja_KS_19.02.2016.pdf", driveId: '1kWQnYXo_DbVbz3YC0QQz7nU-8W0LHOvX' },
];
