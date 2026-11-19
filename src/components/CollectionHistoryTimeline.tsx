import React, { useState, useMemo, useEffect } from 'react';
import {
  History,
  Clock,
  PhoneCall,
  Mail,
  FileText,
  UserCheck,
  ShieldAlert,
  Calendar,
  Plus,
  Send,
  MessageSquare,
  Building,
  GraduationCap,
  Scale,
  Handshake,
  CheckCircle2,
  X,
  ChevronDown,
  User,
  Trash2,
  AlertTriangle
} from 'lucide-react';
interface PartnerDebtPortfolioItem {
  id: string;
  partnerName: string;
  childName: string;
  entity: 'IDSS' | 'IMH';
  totalDebt: number;
  daysOverdue: number;
  dueDate?: string;
  notes?: string;
}
const PARTNER_DEBT_PORTFOLIO: PartnerDebtPortfolioItem[] = [];

export type ActionChannel = 'Email' | 'Telefon' | 'Preporučena pošta' | 'Sastanak uživo' | 'SMS / WhatsApp';
export type ActionStatus = 'Dogovoreno' | 'Poslano' | 'Čeka se uplata' | 'Eskalirano' | 'Djelimično' | 'Zatvoreno';

export interface CollectionAction {
  id: string;
  stepNumber: number;
  date: string;
  title: string;
  channel: ActionChannel;
  status: ActionStatus;
  officer: string;
  note: string;
  amountDiscussed?: number;
}

export interface ParentCollectionProfile {
  partnerId: string;
  partnerName: string;
  childName: string;
  entity: 'IDSS' | 'IMH';
  totalDebt: number;
  currentStage: string;
  lastContactDate: string;
  actions: CollectionAction[];
}

// Preset tailored 5-step collection histories for key accounts
export const DEFAULT_COLLECTION_PROFILES: Record<string, ParentCollectionProfile> = {
  'Porodica Hadžić': {
    partnerId: 'P-201',
    partnerName: 'Porodica Hadžić',
    childName: 'Tarik Hadžić (IV razred)',
    entity: 'IDSS',
    totalDebt: 1880,
    currentStage: 'Faza 4: Završna opomena pred utuženje',
    lastContactDate: '28.09.2026.',
    actions: [
      {
        id: 'act-1',
        stepNumber: 1,
        date: '15.01.2026.',
        title: 'Ispostavljanje redovne fakture za II polugodište',
        channel: 'Email',
        status: 'Poslano',
        officer: 'Računovodstvo IDSS',
        note: 'Faktura RN-26/014 ispostavljena na iznos 4.700,00 KM sa dospijećem 15 dana. Dostavljena elektronskim putem sa instrukcijom za plaćanje.',
        amountDiscussed: 4700,
      },
      {
        id: 'act-2',
        stepNumber: 2,
        date: '20.02.2026.',
        title: 'I Pisana opomena i podsjetnik na obavezu',
        channel: 'SMS / WhatsApp',
        status: 'Poslano',
        officer: 'Referent za naplatu potraživanja',
        note: 'Nakon djelimične uplate od 2.350,00 KM (10.02.), upućen je zvanični podsjetnik na preostali dug po ugovoru o obrazovanju.',
        amountDiscussed: 2350,
      },
      {
        id: 'act-3',
        stepNumber: 3,
        date: '15.03.2026.',
        title: 'Telefonski pregovori & odobrenje porodičnog popusta',
        channel: 'Telefon',
        status: 'Dogovoreno',
        officer: 'Direktor Davor Mulalić',
        note: 'Obavljen razgovor sa ocem. Razmotrena molba za porodični popust od 10% (470,00 KM). Direktor odobrio odobrenje OD-26/02 uz uslov uplate ostatka do kraja aprila.',
        amountDiscussed: 3410,
      },
      {
        id: 'act-4',
        stepNumber: 4,
        date: '16.04.2026.',
        title: 'Registrovana parcijalna uplata i redefinisanje roka',
        channel: 'Email',
        status: 'Djelimično',
        officer: 'Referent za naplatu potraživanja',
        note: 'Dana 12.04. uplaćeno 1.530,00 KM. Preostali stvarni saldo iznosi 1.880,00 KM. Roditelju dostavljen ažurirani analitički izvod sa molbom za zatvaranje kartice.',
        amountDiscussed: 1880,
      },
      {
        id: 'act-5',
        stepNumber: 5,
        date: '28.09.2026.',
        title: 'Završna opomena pred sudsko utuženje (Rok: 8 dana)',
        channel: 'Preporučena pošta',
        status: 'Eskalirano',
        officer: 'Direktor Davor Mulalić & Pravna služba',
        note: 'Zbog izostanka uplate tokom ljeta, upućena preporučena opomena sa povratnicom. Upozorenje na pokretanje sudskog izvršnog postupka i obračun zateznih kamata ukoliko dug od 1.880,00 KM ne bude izmiren.',
        amountDiscussed: 1880,
      },
    ],
  },
  'Porodica Dizdarević': {
    partnerId: 'P-202',
    partnerName: 'Porodica Dizdarević',
    childName: 'Kenan Dizdarević (II razred)',
    entity: 'IDSS',
    totalDebt: 4700,
    currentStage: 'Faza 5: Advokatska opomena pred tužbu',
    lastContactDate: '15.10.2026.',
    actions: [
      {
        id: 'act-d1',
        stepNumber: 1,
        date: '15.05.2026.',
        title: 'Dospijeće cjelokupne rate II polugodišta',
        channel: 'Email',
        status: 'Poslano',
        officer: 'Računovodstvo IDSS',
        note: 'Ugovorom definisana rata od 4.700,00 KM nije uplaćena na dan dospijeća. Automatski generisano obavještenje o dospijeću.',
        amountDiscussed: 4700,
      },
      {
        id: 'act-d2',
        stepNumber: 2,
        date: '05.06.2026.',
        title: 'I Službena opomena o kašnjenju',
        channel: 'Email',
        status: 'Poslano',
        officer: 'Referent za naplatu',
        note: 'Dostavljen opomenuti nalog sa specifikacijom neizmirenih ugovornih obaveza. Zatraženo hitno izjašnjenje roditelja.',
        amountDiscussed: 4700,
      },
      {
        id: 'act-d3',
        stepNumber: 3,
        date: '28.06.2026.',
        title: 'Telefonski kontakt sa roditeljem i usmeno obećanje',
        channel: 'Telefon',
        status: 'Čeka se uplata',
        officer: 'Referent za naplatu',
        note: 'Otac naveo privremenu blokadu računa firme i obećao uplatu do 15.07.2026. Odobren privremeni moratorij od 15 dana.',
        amountDiscussed: 4700,
      },
      {
        id: 'act-d4',
        stepNumber: 4,
        date: '20.08.2026.',
        title: 'Poziv na službeni sastanak u upravi škole',
        channel: 'Preporučena pošta',
        status: 'Eskalirano',
        officer: 'Uprava IDSS',
        note: 'Nakon što obećanje nije ispunjeno, poslan zvaničan poziv na sastanak. Roditelj se nije odazvao u predloženom terminu.',
        amountDiscussed: 4700,
      },
      {
        id: 'act-d5',
        stepNumber: 5,
        date: '15.10.2026.',
        title: 'Finalna opomena pred utuženje sa advokatskim rokom',
        channel: 'Preporučena pošta',
        status: 'Eskalirano',
        officer: 'Direktor Davor Mulalić',
        note: 'Posljednje pismeno upozorenje pred predaju spisa advokatskoj kancelariji na izvršenje (dug 4.700 KM, kašnjenje 178 dana).',
        amountDiscussed: 4700,
      },
    ],
  },
  'Porodica Kovačević': {
    partnerId: 'P-301',
    partnerName: 'Porodica Kovačević',
    childName: 'Ema Kovačević (VIII razred)',
    entity: 'IDSS',
    totalDebt: 3800,
    currentStage: 'Faza 4: Kršenje sporazuma o obročnoj otplati',
    lastContactDate: '22.09.2026.',
    actions: [
      {
        id: 'act-k1',
        stepNumber: 1,
        date: '20.03.2026.',
        title: 'Registracija akumuliranog duga školarine',
        channel: 'Email',
        status: 'Poslano',
        officer: 'Računovodstvo IDSS',
        note: 'Iskazano dugovanje od 3.800,00 KM za školarinu i vannastavne aktivnosti. Dopis sa specifikacijom poslan roditeljima.',
        amountDiscussed: 3800,
      },
      {
        id: 'act-k2',
        stepNumber: 2,
        date: '10.04.2026.',
        title: 'I Pismeni podsjetnik uz analitičku karticu',
        channel: 'Email',
        status: 'Poslano',
        officer: 'Referent za naplatu',
        note: 'Dostavljena analitička kartica kupca sa detaljnim pregledom svih zaduženja i uplata.',
        amountDiscussed: 3800,
      },
      {
        id: 'act-k3',
        stepNumber: 3,
        date: '18.05.2026.',
        title: 'Sastanak uživo u kabinetu direktora',
        channel: 'Sastanak uživo',
        status: 'Dogovoreno',
        officer: 'Direktor Davor Mulalić',
        note: 'Održan lični sastanak sa majkom. Ustanovljena dinamika plaćanja kroz 4 mjesečne rate po 950 KM počevši od juna.',
        amountDiscussed: 3800,
      },
      {
        id: 'act-k4',
        stepNumber: 4,
        date: '15.07.2026.',
        title: 'Upozorenje o nepoštivanju sporazuma',
        channel: 'Telefon',
        status: 'Čeka se uplata',
        officer: 'Referent za naplatu',
        note: 'Prva i druga dogovorena rata nisu uplaćene. Telefonsko upozorenje da se sporazum poništava ukoliko se ne uplati bar jedna rata.',
        amountDiscussed: 1900,
      },
      {
        id: 'act-k5',
        stepNumber: 5,
        date: '22.09.2026.',
        title: 'Pravna opomena i raskid obročnog sporazuma',
        channel: 'Preporučena pošta',
        status: 'Eskalirano',
        officer: 'Direktor Davor Mulalić & Pravna služba',
        note: 'Poništenje dogovorenog plana otplate. Zatražena isplata cjelokupnog duga od 3.800,00 KM u roku od 8 dana pod prijetnjom blokade.',
        amountDiscussed: 3800,
      },
    ],
  },
  'Porodica Hadžimehmedović': {
    partnerId: 'P-101',
    partnerName: 'Porodica Hadžimehmedović',
    childName: 'Amina Hadžimehmedović',
    entity: 'IMH',
    totalDebt: 1950,
    currentStage: 'Faza 3: Usklađivanje i pojašnjenje subvencija KS',
    lastContactDate: '10.10.2026.',
    actions: [
      {
        id: 'act-h1',
        stepNumber: 1,
        date: '15.07.2026.',
        title: 'Fakturisanje vrtića za 3 mjeseca (1.950 KM)',
        channel: 'Email',
        status: 'Poslano',
        officer: 'Računovodstvo IMH',
        note: 'Ispostavljene mjesečne fakture za cjelodnevni boravak djeteta u iznosu od po 650,00 KM.',
        amountDiscussed: 1950,
      },
      {
        id: 'act-h2',
        stepNumber: 2,
        date: '01.08.2026.',
        title: 'I Pismeni upit i odgovor roditelja',
        channel: 'Email',
        status: 'Čeka se uplata',
        officer: 'Referent za naplatu IMH',
        note: 'Roditelj odgovorio da očekuje kantonalnu subvenciju od resornog ministarstva prije izvršenja uplate vrtiću.',
        amountDiscussed: 1950,
      },
      {
        id: 'act-h3',
        stepNumber: 3,
        date: '20.08.2026.',
        title: 'Službeno pojašnjenje pravila o kantonalnim subvencijama',
        channel: 'Email',
        status: 'Dogovoreno',
        officer: 'Uprava IMH (tadašnji direktor Davor Mulalić)',
        note: 'Direktor pismeno pojasnio: Roditelj je dužan plaćati puni iznos vrtiću po cjenovniku. IMH prosljeđuje subvenciju roditelju tek kada ministarstvo doznači novac. IMH ne zavisi od subvencija.',
        amountDiscussed: 1950,
      },
      {
        id: 'act-h4',
        stepNumber: 4,
        date: '15.09.2026.',
        title: 'Dogovor o uplati dospjelih obaveza',
        channel: 'Telefon',
        status: 'Čeka se uplata',
        officer: 'Referent za naplatu',
        note: 'Roditelj prihvatio pravni stav ustanove i preuzeo obavezu uplate 50% duga do kraja septembra.',
        amountDiscussed: 975,
      },
      {
        id: 'act-h5',
        stepNumber: 5,
        date: '10.10.2026.',
        title: 'Kontrolna provjera i urgencija za izvršenje uplate',
        channel: 'SMS / WhatsApp',
        status: 'Čeka se uplata',
        officer: 'Računovodstvo IMH',
        note: 'Urgencija roditelju da dostavi dokaz o uplati ili pristupi usaglašavanju kartice u finansijskoj službi.',
        amountDiscussed: 1950,
      },
    ],
  },
  'Porodica Petrović': {
    partnerId: 'P-103',
    partnerName: 'Porodica Petrović',
    childName: 'Una Petrović',
    entity: 'IMH',
    totalDebt: -600,
    currentStage: 'Završeno: Utvrđena pretplata u korist roditelja',
    lastContactDate: '28.11.2025.',
    actions: [
      {
        id: 'act-p1',
        stepNumber: 1,
        date: '01.09.2025.',
        title: 'Ispostavljanje redovne fakture za septembar',
        channel: 'Email',
        status: 'Poslano',
        officer: 'Računovodstvo IMH',
        note: 'Faktura FAK-25/019 na puni mjesečni iznos od 650,00 KM za cjelodnevni Montessori boravak.',
        amountDiscussed: 650,
      },
      {
        id: 'act-p2',
        stepNumber: 2,
        date: '05.09.2025.',
        title: 'Uredna uplata punog iznosa od strane roditelja',
        channel: 'Email',
        status: 'Zatvoreno',
        officer: 'Računovodstvo IMH',
        note: 'Izvodom IZV-92 proknjižena uplata 650,00 KM. Stanje kartice 0,00 KM.',
        amountDiscussed: 650,
      },
      {
        id: 'act-p3',
        stepNumber: 3,
        date: '25.10.2025.',
        title: 'Doznaka subvencije Ministarstva KS (Sep+Okt 400 KM)',
        channel: 'Email',
        status: 'Dogovoreno',
        officer: 'Finansijska služba',
        note: 'Ministarstvo za odgoj i obrazovanje KS doznačilo subvenciju. IMH evidentirao 400,00 KM u korist roditelja (pretplata -400 KM).',
        amountDiscussed: 400,
      },
      {
        id: 'act-p4',
        stepNumber: 4,
        date: '04.11.2025.',
        title: 'Uplata roditelja za novembar bez umanjenja',
        channel: 'Email',
        status: 'Zatvoreno',
        officer: 'Računovodstvo IMH',
        note: 'Roditelj uplatio punih 650,00 KM. Pretplata porasla na -400 KM.',
        amountDiscussed: 650,
      },
      {
        id: 'act-p5',
        stepNumber: 5,
        date: '28.11.2025.',
        title: 'Doznaka novembarske subvencije & obavijest o povratu',
        channel: 'Email',
        status: 'Dogovoreno',
        officer: 'Uprava IMH (v.d. direktor Anes Memić)',
        note: 'Konačna pretplata roditelja iznosi 600,00 KM. Poslana službena instrukcija sa opcijama automatske kompenzacije na narednoj fakturi ili povrata novca na tekući račun.',
        amountDiscussed: 600,
      },
    ],
  },
};

const STORAGE_KEY = 'idss_imh_collection_custom_actions_v1';
const VALID_CHANNELS: ActionChannel[] = ['Email', 'Telefon', 'Preporučena pošta', 'Sastanak uživo', 'SMS / WhatsApp'];
const VALID_STATUSES: ActionStatus[] = ['Dogovoreno', 'Poslano', 'Čeka se uplata', 'Eskalirano', 'Djelimično', 'Zatvoreno'];

function deterministicPartnerId(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 900;
  }
  return `P-${100 + Math.abs(hash)}`;
}

function loadPersistedCustomActions(): Record<string, CollectionAction[]> {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return {};
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    const clean: Record<string, CollectionAction[]> = {};
    for (const [partner, list] of Object.entries(parsed)) {
      if (!Array.isArray(list)) continue;
      const validItems: CollectionAction[] = [];
      for (const item of list) {
        if (!item || typeof item !== 'object') continue;
        const rec = item as Record<string, unknown>;
        if (typeof rec.id !== 'string' || typeof rec.title !== 'string' || typeof rec.note !== 'string') continue;
        const channel = VALID_CHANNELS.includes(rec.channel as ActionChannel) ? (rec.channel as ActionChannel) : 'Telefon';
        const status = VALID_STATUSES.includes(rec.status as ActionStatus) ? (rec.status as ActionStatus) : 'Poslano';
        const amount =
          typeof rec.amountDiscussed === 'number' && Number.isFinite(rec.amountDiscussed) && rec.amountDiscussed >= 0
            ? rec.amountDiscussed
            : undefined;
        validItems.push({
          id: rec.id,
          stepNumber: typeof rec.stepNumber === 'number' ? rec.stepNumber : 5,
          date: typeof rec.date === 'string' ? rec.date : '',
          title: rec.title.slice(0, 200),
          channel,
          status,
          officer: typeof rec.officer === 'string' ? rec.officer.slice(0, 120) : 'Uprava ustanove',
          note: rec.note.slice(0, 1500),
          amountDiscussed: amount,
        });
      }
      if (validItems.length > 0) {
        clean[partner] = validItems.slice(-20);
      }
    }
    return clean;
  } catch {
    return {};
  }
}

// Deterministic fallback generator backed by real PARTNER_DEBT_PORTFOLIO lookup
function generateFallbackProfile(name: string, entity: 'IDSS' | 'IMH'): ParentCollectionProfile {
  const lowerName = name.trim().toLowerCase();
  const portfolioMatch = PARTNER_DEBT_PORTFOLIO.find(
    (p) =>
      p.partnerName.toLowerCase() === lowerName ||
      lowerName.includes(p.partnerName.toLowerCase()) ||
      p.partnerName.toLowerCase().includes(lowerName)
  );

  const resolvedEntity = portfolioMatch?.entity || entity;
  const isImh = resolvedEntity === 'IMH';
  const partnerId = portfolioMatch?.id || deterministicPartnerId(name || resolvedEntity);
  const partnerDisplay = portfolioMatch?.partnerName || name.trim() || 'Odabrani partner / roditelj';
  const childName = portfolioMatch?.childName || (isImh ? 'Predškolsko dijete' : 'Učenik osnovne škole');
  const totalDebt = portfolioMatch ? portfolioMatch.totalDebt : isImh ? 1300 : 2350;
  const daysOverdue = portfolioMatch?.daysOverdue ?? 45;

  const currentStage =
    totalDebt < 0
      ? 'Završeno: Utvrđena pretplata u korist roditelja'
      : daysOverdue >= 90
      ? `Faza 4: Kritično kašnjenje (${daysOverdue} dana) — opomena pred utuženje`
      : daysOverdue >= 60
      ? `Faza 3: II pisana opomena (${daysOverdue} dana kašnjenja)`
      : 'Faza 2: Tekuće usklađivanje potraživanja';

  return {
    partnerId,
    partnerName: partnerDisplay,
    childName,
    entity: resolvedEntity,
    totalDebt,
    currentStage,
    lastContactDate: '26.10.2026.',
    actions: [
      {
        id: `${partnerId}-gen-1`,
        stepNumber: 1,
        date: portfolioMatch?.dueDate || '01.09.2026.',
        title: 'Ispostavljanje ugovorne fakture',
        channel: 'Email',
        status: 'Poslano',
        officer: `Računovodstvo ${resolvedEntity}`,
        note: `Ispostavljena faktura po ugovoru o obrazovanju / boravku${portfolioMatch ? ` (${portfolioMatch.notes})` : ''}.`,
        amountDiscussed: Math.abs(totalDebt),
      },
      {
        id: `${partnerId}-gen-2`,
        stepNumber: 2,
        date: '20.09.2026.',
        title: 'I Pisana opomena (E-mail podsjetnik)',
        channel: 'Email',
        status: 'Poslano',
        officer: 'Referent za naplatu',
        note: 'Obavijest roditelju o isteku valute plaćanja i molba za hitno dostavljanje dokaza o uplati.',
        amountDiscussed: Math.abs(totalDebt),
      },
      {
        id: `${partnerId}-gen-3`,
        stepNumber: 3,
        date: '05.10.2026.',
        title: 'Telefonski kontakt i provjera razloga kašnjenja',
        channel: 'Telefon',
        status: 'Dogovoreno',
        officer: 'Referent za naplatu',
        note: 'Roditelj kontaktiran radi usaglašavanja stanja na analitičkoj kartici konta 2110.',
      },
      {
        id: `${partnerId}-gen-4`,
        stepNumber: 4,
        date: '15.10.2026.',
        title: 'Dostava analitičkog izvoda sa rokom 8 dana',
        channel: 'Email',
        status: 'Čeka se uplata',
        officer: 'Finansijska služba',
        note: 'Dostavljen analitički izvod iz konta 2110. Definisan novi rok za uplatu prije slanja formalne opomene.',
        amountDiscussed: Math.abs(totalDebt),
      },
      {
        id: `${partnerId}-gen-5`,
        stepNumber: 5,
        date: '26.10.2026.',
        title: totalDebt > 0 && daysOverdue >= 90 ? 'Završna opomena pred eskalaciju i utuženje' : 'Kontrolni podsjetnik o dospjelom saldu',
        channel: totalDebt > 0 && daysOverdue >= 90 ? 'Preporučena pošta' : 'SMS / WhatsApp',
        status: totalDebt > 0 && daysOverdue >= 90 ? 'Eskalirano' : 'Čeka se uplata',
        officer: 'Direktor Davor Mulalić',
        note: 'Službena komunikacija sa pozivom na izmirenje ili usaglašavanje otvorenih stavki.',
        amountDiscussed: Math.abs(totalDebt),
      },
    ],
  };
}

interface CollectionHistoryTimelineProps {
  selectedPartnerName?: string;
  entity?: 'IDSS' | 'IMH' | 'Grupa';
  onPartnerChange?: (name: string, entity: 'IDSS' | 'IMH') => void;
  className?: string;
}

export const CollectionHistoryTimeline: React.FC<CollectionHistoryTimelineProps> = ({
  selectedPartnerName = '',
  entity = 'IDSS',
  onPartnerChange,
  className = '',
}) => {
  // Local store of custom added actions per partner (persisted safely in localStorage)
  const [customActions, setCustomActions] = useState<Record<string, CollectionAction[]>>(loadPersistedCustomActions);

  // New Action Form Modal / Drawer State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newActionTitle, setNewActionTitle] = useState<string>('');
  const [newActionChannel, setNewActionChannel] = useState<ActionChannel>('Telefon');
  const [newActionStatus, setNewActionStatus] = useState<ActionStatus>('Dogovoreno');
  const [newActionOfficer, setNewActionOfficer] = useState<string>('Uprava ustanove');
  const [newActionDate, setNewActionDate] = useState<string>(
    new Date().toLocaleDateString('bs-BA')
  );
  const [newActionNote, setNewActionNote] = useState<string>('');
  const [newActionAmount, setNewActionAmount] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customActions));
      }
    } catch {
      // Ignore storage quota or private-mode restrictions cleanly
    }
  }, [customActions]);

  useEffect(() => {
    if (!isAddModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAddModalOpen(false);
        setFormError(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isAddModalOpen]);

  // Active profile determination
  const activeProfile = useMemo(() => {
    let matchedKey: string | null = null;
    const lower = (selectedPartnerName || '').toLowerCase();

    if (lower.includes('hadžimehmedović') || lower.includes('hadzimehmedovic')) {
      matchedKey = 'Porodica Hadžimehmedović';
    } else if (lower.includes('hadžić') || lower.includes('hadzic')) {
      matchedKey = 'Porodica Hadžić';
    } else if (lower.includes('dizdarević') || lower.includes('dizdarevic')) {
      matchedKey = 'Porodica Dizdarević';
    } else if (lower.includes('kovačević') || lower.includes('kovacevic')) {
      matchedKey = 'Porodica Kovačević';
    } else if (lower.includes('petrović') || lower.includes('petrovic')) {
      matchedKey = 'Porodica Petrović';
    }

    const baseProfile = matchedKey
      ? DEFAULT_COLLECTION_PROFILES[matchedKey]
      : selectedPartnerName.trim()
      ? generateFallbackProfile(selectedPartnerName, entity === 'IMH' ? 'IMH' : 'IDSS')
      : DEFAULT_COLLECTION_PROFILES['Porodica Hadžić'];

    const extraActions = customActions[baseProfile.partnerName] || [];
    const combinedActions = [...baseProfile.actions, ...extraActions];
    const last5Actions = combinedActions.slice(-5).map((act, index) => ({
      ...act,
      stepNumber: index + 1,
    }));

    return {
      ...baseProfile,
      actions: last5Actions,
    };
  }, [selectedPartnerName, entity, customActions]);

  const handleAddNewAction = (e: React.FormEvent) => {
    e.preventDefault();
    const titleClean = newActionTitle.trim();
    const noteClean = newActionNote.trim();
    if (!titleClean || !noteClean) {
      setFormError('Naziv radnje i detaljna bilješka su obavezna polja.');
      return;
    }

    let parsedAmount: number | undefined = undefined;
    if (newActionAmount.trim() !== '') {
      const val = Number.parseFloat(newActionAmount);
      if (!Number.isFinite(val) || val < 0) {
        setFormError('Iznos u KM mora biti pozitivan broj ili prazan.');
        return;
      }
      parsedAmount = Math.round(val * 100) / 100;
    }

    const newAction: CollectionAction = {
      id: `custom-${Date.now()}`,
      stepNumber: 5,
      date: newActionDate.trim() || new Date().toLocaleDateString('bs-BA'),
      title: titleClean.slice(0, 200),
      channel: newActionChannel,
      status: newActionStatus,
      officer: newActionOfficer.trim().slice(0, 120) || 'Uprava ustanove',
      note: noteClean.slice(0, 1500),
      amountDiscussed: parsedAmount,
    };

    setCustomActions((prev) => {
      const existing = prev[activeProfile.partnerName] || [];
      return {
        ...prev,
        [activeProfile.partnerName]: [...existing, newAction].slice(-20),
      };
    });

    setNewActionTitle('');
    setNewActionNote('');
    setNewActionAmount('');
    setFormError(null);
    setIsAddModalOpen(false);
  };

  const handleDeleteCustomAction = (actionId: string) => {
    setCustomActions((prev) => {
      const existing = prev[activeProfile.partnerName] || [];
      const filtered = existing.filter((a) => a.id !== actionId);
      if (filtered.length === 0) {
        const next = { ...prev };
        delete next[activeProfile.partnerName];
        return next;
      }
      return {
        ...prev,
        [activeProfile.partnerName]: filtered,
      };
    });
  };

  // Helper for Status Badge styling
  const getStatusBadge = (status: ActionStatus) => {
    switch (status) {
      case 'Dogovoreno':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Handshake className="w-3 h-3 text-emerald-600" />
            <span>Dogovoreno</span>
          </span>
        );
      case 'Poslano':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <Send className="w-3 h-3 text-blue-600" />
            <span>Poslano</span>
          </span>
        );
      case 'Čeka se uplata':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Čeka se uplata</span>
          </span>
        );
      case 'Eskalirano':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            <span>Eskalirano</span>
          </span>
        );
      case 'Djelimično':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
            <CheckCircle2 className="w-3 h-3 text-purple-600" />
            <span>Djelimično</span>
          </span>
        );
      case 'Zatvoreno':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Zatvoreno</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Helper for Channel Icon & styling
  const getChannelBadge = (channel: ActionChannel) => {
    switch (channel) {
      case 'Email':
        return (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-slate-600 dark:text-slate-300">
            <Mail className="w-3.5 h-3.5 text-blue-500" />
            <span>E-mail</span>
          </span>
        );
      case 'Telefon':
        return (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-slate-600 dark:text-slate-300">
            <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
            <span>Telefon</span>
          </span>
        );
      case 'Preporučena pošta':
        return (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-slate-600 dark:text-slate-300">
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            <span>Preporučena pošta</span>
          </span>
        );
      case 'Sastanak uživo':
        return (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-slate-600 dark:text-slate-300">
            <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sastanak uživo</span>
          </span>
        );
      case 'SMS / WhatsApp':
        return (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-slate-600 dark:text-slate-300">
            <MessageSquare className="w-3.5 h-3.5 text-teal-500" />
            <span>SMS / WhatsApp</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`collection-history-timeline bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 mb-8 shadow-sm ${className}`}>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 flex items-center gap-1">
              <History className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              HISTORIJAT NAPLATE (COLLECTION HISTORY)
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Posljednjih 5 službenih radnji po kartici kupca
            </span>
          </div>
          <h4 className="text-base md:text-lg font-black text-slate-900 dark:text-slate-100 mt-1">
            Hronologija naplatnih radnji, opomena i pregovora sa roditeljem
          </h4>
        </div>

        {/* Quick Profile Selectors & Add Action Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Switcher dropdown */}
          <div className="relative">
            <select
              aria-label="Odaberi partnera za pregled historijata naplate"
              value={
                DEFAULT_COLLECTION_PROFILES[activeProfile.partnerName]
                  ? activeProfile.partnerName
                  : '__custom__'
              }
              onChange={(e) => {
                const targetKey = e.target.value;
                const found = DEFAULT_COLLECTION_PROFILES[targetKey];
                if (found && onPartnerChange) {
                  onPartnerChange(found.partnerName, found.entity);
                }
              }}
              className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-800 dark:text-slate-100 text-xs font-bold py-2 pl-3 pr-8 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition"
            >
              {!DEFAULT_COLLECTION_PROFILES[activeProfile.partnerName] && (
                <option value="__custom__">
                  {activeProfile.partnerName} ({activeProfile.entity} ·{' '}
                  {activeProfile.totalDebt < 0 ? 'Pretplata' : `${activeProfile.totalDebt} KM`})
                </option>
              )}
              {Object.keys(DEFAULT_COLLECTION_PROFILES).map((key) => (
                <option key={key} value={key}>
                  {key} ({DEFAULT_COLLECTION_PROFILES[key].entity} · {DEFAULT_COLLECTION_PROFILES[key].totalDebt > 0 ? `${DEFAULT_COLLECTION_PROFILES[key].totalDebt} KM` : 'Pretplata'})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Button to Record a New Collection Action */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-black shadow-sm transition cursor-pointer"
            title="Dodaj novu provedenu radnju naplate za ovog partnera"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Evidentiraj radnju</span>
          </button>
        </div>
      </div>

      {/* Parent Summary Card Bar */}
      <div className="my-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs ${
              activeProfile.entity === 'IDSS' ? 'bg-[var(--idss-blue)]' : 'bg-[var(--imh-green)]'
            }`}
          >
            {activeProfile.entity === 'IDSS' ? (
              <GraduationCap className="w-5 h-5" />
            ) : (
              <Building className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h5 className="text-sm font-black text-slate-900 dark:text-slate-100 m-0">
                {activeProfile.partnerName}
              </h5>
              <span
                className={`text-[9.5px] font-mono font-bold px-2 py-0.2 rounded uppercase ${
                  activeProfile.entity === 'IDSS'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {activeProfile.entity}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activeProfile.childName} · Partner ID: <span className="font-mono">{activeProfile.partnerId}</span>
            </div>
          </div>
        </div>

        {/* Current Collection Status Badges */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div>
            <span className="text-[10.5px] text-slate-500 block">Dugovanje / Saldo:</span>
            <span
              className={`font-black font-mono text-sm ${
                activeProfile.totalDebt < 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {activeProfile.totalDebt < 0
                ? `${activeProfile.totalDebt.toLocaleString('bs-BA')} KM (Pretplata)`
                : `${activeProfile.totalDebt.toLocaleString('bs-BA')} KM`}
            </span>
          </div>

          <div className="border-l border-slate-200 dark:border-slate-700 pl-4">
            <span className="text-[10.5px] text-slate-500 block">Trenutna faza opomene:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-indigo-600" />
              {activeProfile.currentStage}
            </span>
          </div>

          <div className="border-l border-slate-200 dark:border-slate-700 pl-4">
            <span className="text-[10.5px] text-slate-500 block">Zadnji kontakt:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {activeProfile.lastContactDate}
            </span>
          </div>
        </div>
      </div>

      {/* TIMELINE VIEW (Vertical 5-Step Process) */}
      <div className="mt-6 relative">
        {/* Continuous vertical timeline connector line */}
        <div className="absolute left-[23px] md:left-[31px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-700" />

        <div className="space-y-6">
          {activeProfile.actions.map((action, index) => {
            const isLast = index === activeProfile.actions.length - 1;
            const isEscalated = action.status === 'Eskalirano';

            return (
              <div
                key={action.id}
                className="relative flex items-start gap-3.5 md:gap-5 group"
              >
                {/* Step Circle Badge */}
                <div
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 border-2 transition-all shadow-xs z-10 ${
                    isEscalated
                      ? 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/60 dark:border-rose-600 dark:text-rose-300'
                      : isLast
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-600 dark:text-indigo-300 ring-4 ring-indigo-100 dark:ring-indigo-950/50'
                      : 'bg-white border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">
                    KORAK
                  </span>
                  <span className="text-base md:text-lg font-black leading-tight">
                    #{action.stepNumber}
                  </span>
                </div>

                {/* Event Card Content */}
                <div
                  className={`flex-1 rounded-xl p-4 border transition-all ${
                    isEscalated
                      ? 'bg-rose-50/40 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/60'
                      : isLast
                      ? 'bg-indigo-50/30 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/60 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {/* Card Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 dark:border-slate-700/60">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {action.date}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      {getChannelBadge(action.channel)}
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {action.officer}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {action.amountDiscussed !== undefined && (
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                          {action.amountDiscussed.toLocaleString('bs-BA')} KM
                        </span>
                      )}
                      {getStatusBadge(action.status)}
                      {action.id.startsWith('custom-') && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomAction(action.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                          title="Obriši ovu evidentiranu radnju"
                          aria-label={`Obriši radnju ${action.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title and Notes */}
                  <h6 className="text-sm font-black text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
                    {action.title}
                    {isLast && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        Zadnja akcija
                      </span>
                    )}
                  </h6>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed m-0">
                    {action.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info & Guidance for Recovery */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span title="Pravno obavezujući koraci naplate" className="inline-flex">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          </span>
          <span>
            <b>Standardna procedura IDSS / IMH:</b> Radnje naplate moraju imati tačno dokumentovan kanal (SMS, Email, Lično, Pošta) i ovlaštenog referenta prije aktiviranja sudskog izvršnog postupka.
          </span>
        </div>
        <div className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">
          Usklađeno s Pravilnikom o naplati potraživanja
        </div>
      </div>

      {/* Modal / Dialog for Adding New Collection Action */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-collection-action-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAddModalOpen(false);
              setFormError(null);
            }
          }}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h5 id="add-collection-action-title" className="text-sm font-black text-slate-900 dark:text-slate-100 m-0">
                    Evidentiraj novu radnju naplate
                  </h5>
                  <span className="text-[11px] text-slate-500">
                    Za partnera: <b>{activeProfile.partnerName}</b>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setFormError(null);
                }}
                aria-label="Zatvori dijalog"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddNewAction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Naziv radnje naplate / Predmet:
                </label>
                <input
                  type="text"
                  required
                  value={newActionTitle}
                  onChange={(e) => setNewActionTitle(e.target.value)}
                  placeholder="Npr. Telefonski pregovori o odgodi rate, II Pisana opomena..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kanal komunikacije:
                  </label>
                  <select
                    value={newActionChannel}
                    onChange={(e) => setNewActionChannel(e.target.value as ActionChannel)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Telefon">Telefon</option>
                    <option value="Email">Email</option>
                    <option value="Preporučena pošta">Preporučena pošta</option>
                    <option value="Sastanak uživo">Sastanak uživo</option>
                    <option value="SMS / WhatsApp">SMS / WhatsApp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status ishoda:
                  </label>
                  <select
                    value={newActionStatus}
                    onChange={(e) => setNewActionStatus(e.target.value as ActionStatus)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Dogovoreno">Dogovoreno</option>
                    <option value="Poslano">Poslano</option>
                    <option value="Čeka se uplata">Čeka se uplata</option>
                    <option value="Eskalirano">Eskalirano</option>
                    <option value="Djelimično">Djelimično</option>
                    <option value="Zatvoreno">Zatvoreno</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Datum radnje:
                  </label>
                  <input
                    type="text"
                    value={newActionDate}
                    onChange={(e) => setNewActionDate(e.target.value)}
                    placeholder="DD.MM.GGGG."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Odgovorna osoba / Službenik:
                  </label>
                  <input
                    type="text"
                    value={newActionOfficer}
                    onChange={(e) => setNewActionOfficer(e.target.value)}
                    placeholder="Uprava ustanove / Odgovorno lice"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Iznos u KM (opcionalno):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newActionAmount}
                    onChange={(e) => setNewActionAmount(e.target.value)}
                    placeholder="Npr. 1880.00"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detaljna bilješka o provedenoj radnji i dogovoru:
                </label>
                <textarea
                  rows={3}
                  required
                  value={newActionNote}
                  onChange={(e) => setNewActionNote(e.target.value)}
                  placeholder="Navedite tačan ishod razgovora, rok uplate, razloge roditelja ili broj preporučene pošiljke..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer"
                >
                  Spremi radnju u historijat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
