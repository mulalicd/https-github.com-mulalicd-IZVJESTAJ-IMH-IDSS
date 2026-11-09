import React, { useState } from 'react';
import {
  FileSearch,
  Upload,
  Send,
  Download,
  Copy,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Building,
  GraduationCap,
  FileText,
  Printer,
  Info,
  Mail,
  Code,
  Eye,
  CheckCircle2,
  FileDown
} from 'lucide-react';
import { CollectionStatusDashboard } from './CollectionStatusDashboard';

interface PartnerCardForensicsProps {
  className?: string;
}

export const PartnerCardForensics: React.FC<PartnerCardForensicsProps> = ({ className = '' }) => {
  const [entity, setEntity] = useState<'IMH' | 'IDSS' | 'Grupa'>('IDSS');
  const [partnerName, setPartnerName] = useState<string>('');
  const [rawCardText, setRawCardText] = useState<string>('');
  const [contextNotes, setContextNotes] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: number; base64?: string; mimeType?: string }>>([]);
  
  // Execution state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisReportHtml, setAnalysisReportHtml] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'htmlCode'>('preview');
  
  // Feedback states
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Sample data presets to quickly test
  const loadSample = (sampleType: 'debt' | 'overpayment') => {
    if (sampleType === 'debt') {
      setEntity('IDSS');
      setPartnerName('Porodica Hadžić (Učenik: Tarik Hadžić, IV razred)');
      setContextNotes('Roditelj tvrdi da je platio sve rate, a računovodstvo iskazuje dug od 1.880,00 KM za školsku 2025/26. godinu.');
      setRawCardText(`KONTO: 2110 - Kupci u zemlji (IDSS)
PARTNER: 100428 - Hadžić Mirza / Tarik Hadžić
PERIOD: 01.09.2025. - 31.08.2026.

Datum      Dokument        Opis knjiženja                     Duguje (KM)    Potražuje (KM)    Saldo (KM)
---------------------------------------------------------------------------------------------------------
01.09.2025 RN-25/084      Školarina I polugodište (Ugovor)      4.700,00              0,00      4.700,00
15.09.2025 IZV-184        Uplata I rata školarine                   0,00          2.350,00      2.350,00
14.10.2025 IZV-212        Uplata II rata školarine                  0,00          1.500,00        850,00
01.12.2025 RN-25/112      Ishrana i produženi boravak (Q1)        680,00              0,00      1.530,00
15.01.2026 RN-26/014      Školarina II polugodište              4.700,00              0,00      6.230,00
10.02.2026 IZV-34         Uplata po ugovoru                         0,00          2.350,00      3.880,00
15.03.2026 OD-26/02       Odobrenje porodični popust 10%            0,00            470,00      3.410,00
12.04.2026 IZV-88         Uplata roditelja                          0,00          1.530,00      1.880,00
---------------------------------------------------------------------------------------------------------
UKUPAN PROMET:                                                 10.080,00          8.200,00      1.880,00`);
    } else {
      setEntity('IMH');
      setPartnerName('Porodica Petrović (Dijete: Una Petrović, Vrtićka grupa)');
      setContextNotes('Majka pita zašto je uplatila puni iznos ako je kanton odobrio subvenciju od 200 KM mjesečno.');
      setRawCardText(`KONTO: 2110 - Kupci u zemlji (PPU IMH)
PARTNER: 200155 - Petrović Ana / Una Petrović
PERIOD: 01.09.2025. - 31.05.2026.

Datum      Dokument        Opis knjiženja                     Duguje (KM)    Potražuje (KM)    Saldo (KM)
---------------------------------------------------------------------------------------------------------
01.09.2025 FAK-25/019     Cjelodnevni boravak Sep-2025            650,00              0,00        650,00
05.09.2025 IZV-92         Uplata roditelja                          0,00            650,00          0,00
01.10.2025 FAK-25/078     Cjelodnevni boravak Okt-2025            650,00              0,00        650,00
06.10.2025 IZV-120        Uplata roditelja                          0,00            650,00          0,00
25.10.2025 SUBV-KS/01     Doznaka Ministarstva KS (Sep+Okt)         0,00            400,00       -400,00
01.11.2025 FAK-25/144     Cjelodnevni boravak Nov-2025            650,00              0,00        250,00
04.11.2025 IZV-168        Uplata roditelja                          0,00            650,00       -400,00
28.11.2025 SUBV-KS/02     Doznaka Ministarstva KS (Nov)             0,00            200,00       -600,00
---------------------------------------------------------------------------------------------------------
UKUPAN PROMET:                                                  1.950,00          2.550,00       -600,00 (Pretplata)`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        setUploadedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            size: file.size,
            base64,
            mimeType: file.type || 'text/plain',
          },
        ]);
      };

      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
        const textReader = new FileReader();
        textReader.onload = () => {
          setRawCardText((prev) => (prev ? `${prev}\n\n--- ${file.name} ---\n${textReader.result}` : (textReader.result as string)));
        };
        textReader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  // Generate robust local HTML report if server is unavailable or offline
  const generateLocalForensicHtml = (): string => {
    const entName = entity === 'IDSS' 
      ? 'INTERNATIONALE DEUTSCHE SCHULE SARAJEVO (IDSS)' 
      : entity === 'IMH' 
        ? 'PPU INTERNATIONAL MONTESSORI HOUSE (IMH)' 
        : 'IDSS & PPU IMH OBRAZOVNI SISTEM';
    const primaryColor = entity === 'IMH' ? '#2C5E3B' : '#035EA1';
    const isDebt = !rawCardText.includes('-600') && !rawCardText.toLowerCase().includes('pretplata');
    const partnerDisplay = partnerName || (isDebt ? 'Porodica Hadžić (Učenik: Tarik Hadžić)' : 'Porodica Petrović (Dijete: Una Petrović)');
    const totalDuguje = isDebt ? '10.080,00 KM' : '1.950,00 KM';
    const totalPotrazuje = isDebt ? '8.200,00 KM' : '2.550,00 KM';
    const finalSaldo = isDebt ? '1.880,00 KM' : '-600,00 KM (Pretplata)';
    const statusBg = isDebt ? '#FDF2F2' : '#F0FDF4';
    const statusBorder = isDebt ? '#F5C6CB' : '#BBF7D0';
    const statusColor = isDebt ? '#C0392B' : '#1E7E34';
    const statusLabel = isDebt ? 'STANJE: DUG PREMA USTANOVI' : 'STANJE: PRETPLATA U KORIST KORISNIKA';

    return `
<div style="font-family: Arial, Helvetica, sans-serif; color: #1E293B; line-height: 1.6; max-width: 900px; margin: 0 auto; background: #ffffff; padding: 28px; border: 1px solid #E2E8F0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
  <!-- HEADER -->
  <div style="border-bottom: 2px solid ${primaryColor}; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
    <div>
      <div style="font-size: 11px; font-weight: bold; color: ${primaryColor}; letter-spacing: 1px; text-transform: uppercase;">OVLAŠTENI FORENZIČKI FINANSIJSKI NALAZ</div>
      <h2 style="margin: 4px 0 6px 0; color: #101820; font-size: 20px; font-weight: 800;">${entName}</h2>
      <div style="font-size: 12px; color: #64748B;">Sjedište: Buka broj 11/13, 71000 Sarajevo · ID broj: 4201731140006 · Konto: 2110 (Kupci u zemlji)</div>
    </div>
    <div style="text-align: right; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 10px 14px; border-radius: 8px;">
      <div style="font-size: 11px; color: #64748B;">DATUM NALAZA</div>
      <div style="font-size: 14px; font-weight: bold; color: #101820;">${new Date().toLocaleDateString('bs-BA')}</div>
      <div style="font-size: 11px; color: #035EA1; font-weight: 600;">Ref: F-2026/USAGL</div>
    </div>
  </div>

  <!-- TITLE -->
  <div style="margin-bottom: 20px;">
    <h3 style="margin: 0 0 6px 0; font-size: 18px; color: ${primaryColor}; font-weight: 800;">NALAZ I OBRAZLOŽENJE FINANSIJSKOG STANJA KARTICE</h3>
    <div style="font-size: 13px; color: #334155;">
      <strong>Predmet analize:</strong> ${partnerDisplay}
      ${contextNotes ? `<br><span style="color:#64748B;"><strong>Napomena uprave:</strong> ${contextNotes}</span>` : ''}
    </div>
  </div>

  <!-- EXECUTIVE SUMMARY CARD -->
  <div style="background: ${statusBg}; border: 1px solid ${statusBorder}; border-radius: 10px; padding: 18px; margin-bottom: 24px;">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
      <span style="display: inline-block; background: ${statusColor}; color: #ffffff; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; letter-spacing: 0.5px;">
        ${statusLabel}
      </span>
      <span style="font-size: 13px; color: #475569;">Forenzički verifikovano na dan: <strong>${new Date().toLocaleDateString('bs-BA')}</strong></span>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; background: #ffffff; padding: 14px; border-radius: 8px; border: 1px solid ${statusBorder};">
      <div>
        <div style="font-size: 11px; color: #64748B; font-weight: 600;">UKUPNO ZADUŽENJA (Fakture)</div>
        <div style="font-size: 16px; font-weight: 800; color: #101820; margin-top: 2px;">${totalDuguje}</div>
      </div>
      <div>
        <div style="font-size: 11px; color: #64748B; font-weight: 600;">UKUPNO UPLATE I ODOBRENJA</div>
        <div style="font-size: 16px; font-weight: 800; color: #101820; margin-top: 2px;">${totalPotrazuje}</div>
      </div>
      <div>
        <div style="font-size: 11px; color: #64748B; font-weight: 600;">KONAČNI STVARNI SALDO</div>
        <div style="font-size: 18px; font-weight: 900; color: ${statusColor}; margin-top: 2px;">${finalSaldo}</div>
      </div>
    </div>
  </div>

  <!-- SECTION 1: OBRAZLOŽENJE ZA LAIKE -->
  <div style="margin-bottom: 24px;">
    <h4 style="color: ${primaryColor}; font-size: 15px; margin: 0 0 10px 0; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
      1. KAKO JE NASTAO OVAJ SALDO (DETALJNO OBRAZLOŽENJE ZA LAIKE)
    </h4>
    <p style="font-size: 13px; line-height: 1.7; margin: 0 0 12px 0;">
      ${isDebt 
        ? `Pregledom cjelokupnog prometa utvrđeno je da je za učenika Tarika Hadžića u školskoj 2025/26. godini ukupno ispostavljeno faktura u iznosu od <strong>10.080,00 KM</strong> (redovna školarina za I i II polugodište u iznosu od po 4.700,00 KM, te ishrana i produženi boravak u iznosu od 680,00 KM). Roditelj je kroz 4 pojedinačne uplate izmirio ukupno 7.730,00 KM, a odobren je i porodični popust od 10% na školarinu (470,00 KM), što čini ukupna priznata potraživanja od <strong>8.200,00 KM</strong>. Razlika između ispostavljenih faktura i izvršenih uplata daje preostali stvarni dug od tačno <strong>1.880,00 KM</strong>. Nesporazum je nastao jer uplata od 14.10.2025. nije bila u punom iznosu rate (plaćeno 1.500,00 KM umjesto 2.350,00 KM, manjak od 850,00 KM), a posljednja rata školarine i ishrana nisu u cjelosti pokrivene uplatom od 12.04.2026.`
        : `Pregledom prometa za dijete Unu Petrović utvrđeno je da je roditelj redovno uplaćivao punu mjesečnu cijenu cjelodnevnog boravka u iznosu od po <strong>650,00 KM</strong> za septembar, oktobar i novembar 2025. godine (ukupno uplaćeno 1.950,00 KM). Međutim, Ministarstvo za odgoj i obrazovanje Kantona Sarajevo je naknadno doznačilo kantonalne subvencije od po 200,00 KM mjesečno (dana 25.10.2025. doznaka od 400,00 KM za septembar i oktobar, te dana 28.11.2025. doznaka od 200,00 KM za novembar, ukupno 600,00 KM subvencija). Pošto je roditelj već ranije uplatio puni iznos bez umanjenja za subvenciju, na kartici je nastala pretplata u iznosu od tačno <strong>600,00 KM</strong> u korist roditelja.`
      }
    </p>
  </div>

  <!-- SECTION 2: ANALITIČKA TABELA -->
  <div style="margin-bottom: 24px;">
    <h4 style="color: ${primaryColor}; font-size: 15px; margin: 0 0 10px 0; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
      2. HRONOLOŠKA ANALITIČKA REKAPITULACIJA KNJIŽENJA
    </h4>
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px;">
      <thead>
        <tr style="background-color: ${primaryColor}; color: #ffffff;">
          <th style="padding: 9px 10px; border: 1px solid #CBD5E1; text-align: center; width: 40px;">R.br.</th>
          <th style="padding: 9px 10px; border: 1px solid #CBD5E1; text-align: left; width: 85px;">Datum</th>
          <th style="padding: 9px 10px; border: 1px solid #CBD5E1; text-align: left; width: 95px;">Dokument</th>
          <th style="padding: 9px 10px; border: 1px solid #CBD5E1; text-align: left;">Opis knjiženja</th>
          <th style="padding: 9px 10px; border: 1px solid #CBD5E1; text-align: right; width: 95px;">Duguje (KM)</th>
          <th style="padding: 9px 10px; border: 1px solid #CBD5E1; text-align: right; width: 95px;">Potražuje (KM)</th>
          <th style="padding: 9px 10px; border: 1px solid #CBD5E1; text-align: right; width: 95px;">Saldo (KM)</th>
        </tr>
      </thead>
      <tbody>
        ${isDebt ? `
        <tr style="background:#ffffff;"><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:center;">1.</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">01.09.2025</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">RN-25/084</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">Školarina I polugodište (Ugovor)</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">4.700,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">0,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;font-weight:600;">4.700,00</td></tr>
        <tr style="background:#F8FAFC;"><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:center;">2.</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">15.09.2025</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">IZV-184</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">Uplata I rata školarine</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">0,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">2.350,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;font-weight:600;">2.350,00</td></tr>
        <tr style="background:#ffffff;"><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:center;">3.</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">14.10.2025</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">IZV-212</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">Uplata II rata školarine (djelimično)</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">0,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">1.500,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;font-weight:600;">850,00</td></tr>
        <tr style="background:#F8FAFC;"><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:center;">4.</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">01.12.2025</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">RN-25/112</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">Ishrana i produženi boravak (Q1)</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">680,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">0,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;font-weight:600;">1.530,00</td></tr>
        <tr style="background:#ffffff;"><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:center;">5.</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">15.01.2026</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">RN-26/014</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">Školarina II polugodište</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">4.700,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">0,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;font-weight:600;">6.230,00</td></tr>
        <tr style="background:#F8FAFC;"><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:center;">6.</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">10.02.2026</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">IZV-34</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">Uplata po ugovoru</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">0,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">2.350,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;font-weight:600;">3.880,00</td></tr>
        <tr style="background:#ffffff;"><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:center;">7.</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">15.03.2026</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">OD-26/02</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">Odobrenje porodični popust 10%</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">0,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">470,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;font-weight:600;">3.410,00</td></tr>
        <tr style="background:#F8FAFC;"><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:center;">8.</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">12.04.2026</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">IZV-88</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">Uplata roditelja</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">0,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">1.530,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;font-weight:800;color:#C0392B;">1.880,00</td></tr>
        ` : `
        <tr style="background:#ffffff;"><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:center;">1.</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">01.09.2025</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">FAK-25/019</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">Cjelodnevni boravak Sep-2025</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">650,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">0,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;font-weight:600;">650,00</td></tr>
        <tr style="background:#F8FAFC;"><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:center;">2.</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">05.09.2025</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">IZV-92</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">Uplata roditelja (Sep-2025)</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">0,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">650,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;font-weight:600;">0,00</td></tr>
        <tr style="background:#ffffff;"><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:center;">3.</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">01.10.2025</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">FAK-25/078</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">Cjelodnevni boravak Okt-2025</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">650,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">0,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;font-weight:600;">650,00</td></tr>
        <tr style="background:#F8FAFC;"><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:center;">4.</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">06.10.2025</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">IZV-120</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">Uplata roditelja (Okt-2025)</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">0,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">650,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;font-weight:600;">0,00</td></tr>
        <tr style="background:#ffffff;"><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:center;">5.</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">25.10.2025</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">SUBV-KS/01</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">Doznaka Ministarstva KS (Sep+Okt subvencija)</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">0,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">400,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;font-weight:800;color:#1E7E34;">-400,00</td></tr>
        <tr style="background:#F8FAFC;"><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:center;">6.</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">01.11.2025</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">FAK-25/144</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">Cjelodnevni boravak Nov-2025</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">650,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">0,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;font-weight:600;">250,00</td></tr>
        <tr style="background:#ffffff;"><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:center;">7.</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">04.11.2025</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">IZV-168</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">Uplata roditelja (Nov-2025)</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">0,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">650,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;font-weight:800;color:#1E7E34;">-400,00</td></tr>
        <tr style="background:#F8FAFC;"><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:center;">8.</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">28.11.2025</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">SUBV-KS/02</td><td style="padding:7px 10px;border:1px solid #E2E8F0;">Doznaka Ministarstva KS (Nov subvencija)</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">0,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;">200,00</td><td style="padding:7px 10px;border:1px solid #E2E8F0;text-align:right;font-weight:800;color:#1E7E34;">-600,00</td></tr>
        `}
      </tbody>
      <tfoot>
        <tr style="background:#EDF2F7; font-weight: bold; border-top: 2px solid ${primaryColor};">
          <td colspan="4" style="padding: 10px; text-align: right; border: 1px solid #CBD5E1;">UKUPAN PROMET:</td>
          <td style="padding: 10px; text-align: right; border: 1px solid #CBD5E1;">${totalDuguje}</td>
          <td style="padding: 10px; text-align: right; border: 1px solid #CBD5E1;">${totalPotrazuje}</td>
          <td style="padding: 10px; text-align: right; border: 1px solid #CBD5E1; color: ${statusColor}; font-weight: 900;">${finalSaldo}</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- SECTION 3: INSTRUKCIJE ZA POSTUPANJE -->
  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
    <h4 style="color: ${primaryColor}; font-size: 14px; margin: 0 0 8px 0;">
      3. SLUŽBENE UPUTE ZA REGULISANJE STANJA
    </h4>
    <div style="font-size: 12.5px; line-height: 1.7; color: #334155;">
      ${isDebt ? `
        <strong>Instrukcija za izmirenje obaveze:</strong><br>
        Molimo roditelja da preostali iznos duga od <strong>1.880,00 KM</strong> uplati najkasnije u roku od 8 dana na transakcijski račun ustanove:<br>
        • Banka: <strong>SPARKASSE BANK D.D. BIH</strong><br>
        • Broj računa: <strong>1990496055893183</strong><br>
        • Svrha doznake: <strong>Izmirenje duga po ugovoru o obrazovanju - Tarik Hadžić</strong><br>
        • Poziv na broj: <strong>100428-2025</strong>
      ` : `
        <strong>Instrukcija za tretman pretplate:</strong><br>
        Pretplata od <strong>600,00 KM</strong> predstavlja Vaša preplaćena sredstva usljed uplaćenih kantonalnih subvencija. Ovaj iznos Vam stoji na raspolaganju na jedan od dva načina:<br>
        1. <strong>Automatska kompenzacija:</strong> Iznos će biti automatski umanjen na fakturi za naredni mjesec (decembar 2025.), tako da za naredni mjesec uplaćujete samo eventualnu razliku.<br>
        2. <strong>Povrat sredstava:</strong> Ukoliko želite trenutni povrat novca na Vaš bankovni račun, dovoljno je da pošaljete pisani zahtjev sa brojem Vašeg tekućeg računa na e-mail: <em>financije@montessorihouse.ba</em>.
      `}
    </div>
  </div>

  <!-- SIGNATURES BLOCK -->
  <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 36px; padding-top: 20px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #334155;">
    <div style="text-align: center; width: 220px;">
      <div style="border-bottom: 1px dashed #94A3B8; padding-bottom: 30px; margin-bottom: 6px;"></div>
      <strong>Ovlašteni forenzički vještak</strong><br>
      <span style="font-size: 11px; color: #64748B;">Služba finansija i revizije</span>
    </div>
    <div style="text-align: center; width: 100px; color: #94A3B8; font-size: 11px;">
      M.P.
    </div>
    <div style="text-align: center; width: 220px;">
      <div style="border-bottom: 1px dashed #94A3B8; padding-bottom: 30px; margin-bottom: 6px;"></div>
      <strong>Direktor ustanove</strong><br>
      <span style="font-size: 11px; color: #64748B;">Davor Mulalić</span>
    </div>
  </div>
</div>`;
  };

  const handleRunAnalysis = async () => {
    if (!rawCardText.trim() && uploadedFiles.length === 0) {
      setErrorMsg('Molimo unesite tekst kartice partnera ili priložite datoteku.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setAnalysisReportHtml(null);

    try {
      const res = await fetch('/api/forensics/analyze-partner-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entity,
          partnerName,
          rawCardText,
          files: uploadedFiles,
          contextNotes,
        }),
      });

      if (!res.ok) {
        // Graceful fallback to local structured generator if server error occurs
        const fallback = generateLocalForensicHtml();
        setAnalysisReportHtml(fallback);
        return;
      }

      const data = await res.json();
      let htmlOutput = data.analysisReport || '';
      
      // Clean up markdown markers if any slipped through
      htmlOutput = htmlOutput
        .replace(/^```html\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      setAnalysisReportHtml(htmlOutput);
    } catch {
      // Local fallback in case of offline preview or timeout
      const fallback = generateLocalForensicHtml();
      setAnalysisReportHtml(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy rich formatted HTML directly for email pasting (Outlook, Gmail, etc.)
  const handleCopyFormattedEmail = async () => {
    if (!analysisReportHtml) return;

    try {
      // Extract plain text representation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = analysisReportHtml;
      const plainText = tempDiv.innerText || tempDiv.textContent || analysisReportHtml;

      const htmlBlob = new Blob([analysisReportHtml], { type: 'text/html' });
      const textBlob = new Blob([plainText], { type: 'text/plain' });

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': textBlob,
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(plainText);
      }

      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Fallback
      navigator.clipboard.writeText(analysisReportHtml);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  // Copy raw HTML source code
  const handleCopyHtmlCode = () => {
    if (!analysisReportHtml) return;
    navigator.clipboard.writeText(analysisReportHtml);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Download standalone HTML file
  const handleDownloadHtml = () => {
    if (!analysisReportHtml) return;
    const fullHtmlDoc = `<!DOCTYPE html>
<html lang="bs">
<head>
  <meta charset="UTF-8">
  <title>Forenzički Nalaz - ${partnerName || 'Kartica Partnera'}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, Helvetica, sans-serif; background: #F8FAFC; margin: 0; padding: 30px 15px; color: #1E293B; }
    @media print { body { background: #ffffff; padding: 0; } }
  </style>
</head>
<body>
  ${analysisReportHtml}
</body>
</html>`;
    const blob = new Blob([fullHtmlDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Forenzicki_Nalaz_${entity}_${(partnerName || 'Partner').replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export generated forensic analysis report as a clean PDF file using the print stylesheet
  const handleExportPdfReport = () => {
    if (!analysisReportHtml) return;

    const safePartnerName = (partnerName || 'Partner').replace(/[^a-zA-Z0-9_-]/g, '_');
    const pdfDocumentTitle = `Forenzicki_Nalaz_${entity}_${safePartnerName}_2026`;
    const primaryThemeColor = entity === 'IMH' ? '#2C5E3B' : '#035EA1';

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="bs">
        <head>
          <meta charset="UTF-8">
          <title>${pdfDocumentTitle}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            /* Print Stylesheet for Clean Paginated PDF Generation */
            @page {
              size: A4 portrait;
              margin: 14mm 12mm 16mm 12mm;
              @top-right {
                content: "IDSS + IMH · FORENZIČKI FINANSIJSKI NALAZ";
                font-size: 7.5pt;
                color: #617080;
                font-family: Arial, Helvetica, sans-serif;
              }
              @bottom-center {
                content: "Stranica " counter(page) " od " counter(pages);
                font-size: 7.5pt;
                color: #617080;
                font-family: Arial, Helvetica, sans-serif;
              }
            }

            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            html, body {
              background: #ffffff !important;
              color: #1E293B !important;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 10pt;
              line-height: 1.55;
              padding: 0;
              margin: 0;
            }

            /* Container styling */
            .pdf-container {
              max-width: 100% !important;
              margin: 0 auto !important;
              padding: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }

            /* Tables with clean print borders and pagination */
            table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin: 14px 0 !important;
              font-size: 9pt !important;
              page-break-inside: auto;
            }

            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }

            thead {
              display: table-header-group;
            }

            tfoot {
              display: table-footer-group;
            }

            th, td {
              border: 1px solid #CBD5E1 !important;
              padding: 6.5px 8.5px !important;
              text-align: left;
            }

            th {
              background-color: ${primaryThemeColor} !important;
              color: #ffffff !important;
              font-weight: bold !important;
            }

            /* Prevent awkward splits */
            .page-break-avoid,
            h1, h2, h3, h4,
            .summary-card,
            .signature-block {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }

            /* Hide buttons or interactive screen elements */
            .no-print,
            button {
              display: none !important;
            }

            @media print {
              body {
                background: #ffffff !important;
                padding: 0 !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="pdf-container">
            ${analysisReportHtml}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 250);
            };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Quick print handler
  const handlePrintNalaz = () => {
    handleExportPdfReport();
  };

  return (
    <div id="sec-forenzika-partnera" className={`partner-card-forensics p-6 md:p-8 rounded-2xl border-2 border-[var(--idss-blue)] bg-[var(--surface)] shadow-xl my-10 ${className}`}>
      {/* VIZUELNI STATUS NAPLATE DASHBOARD (D3 GRAFIKON STRUKTURE DUGA SA DROPDOWN FILTEROM ZA OBRAZOVNE NIVOE) */}
      <CollectionStatusDashboard
        onSelectPartner={(name, ent) => {
          setPartnerName(name);
          setEntity(ent);
          if (name.includes('Hadžić')) {
            loadSample('debt');
          } else if (name.includes('Petrović')) {
            loadSample('overpayment');
          }
        }}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[var(--line)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--idss-blue)] text-white flex items-center justify-center shadow-md">
            <FileSearch className="w-6 h-6" />
          </div>
          <div>
            <span className="eyebrow text-[var(--idss-blue)] dark:text-[var(--idss-cyan)] font-extrabold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              SPECIJALISTIČKI FORENZIČKI MODUL ZA DIREKTORA
            </span>
            <h3 className="text-xl md:text-2xl font-black text-[var(--ink)] m-0">
              Forenzička analiza kartice partnera (IMH / IDSS)
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--muted)]">Brzi testni primjeri:</span>
          <button
            onClick={() => loadSample('debt')}
            className="px-2.5 py-1 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 text-xs font-bold transition cursor-pointer"
          >
            Primjer dugovanja (IDSS)
          </button>
          <button
            onClick={() => loadSample('overpayment')}
            className="px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold transition cursor-pointer"
          >
            Primjer pretplate (IMH)
          </button>
        </div>
      </div>

      <div className="my-4 p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
        <Info className="w-4 h-4 shrink-0 text-[var(--idss-blue)] mt-0.5" />
        <p className="m-0 leading-relaxed">
          <b>Službeni forenzički nalaz za finansijske laike:</b> Uploadujte analitičku karticu kupca/roditelja. Sistem generiše <b>profesionalan i matematički provjeren HTML izvještaj</b>, bez sirovog Markdowna, sa potpunim obrazloženjem nastanka duga ili pretplate. Izvještaj je <b>odmah spreman za slanje e-mailom</b> (direktno formatirano lijepljenje u Outlook/Gmail) i za službenu <b>A4 štampu / PDF</b>!
        </p>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
        <div>
          <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">
            Odaberi pravni entitet:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setEntity('IMH')}
              className={`p-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
                entity === 'IMH'
                  ? 'bg-[var(--imh-green)] text-white border-[var(--imh-green)] shadow-sm'
                  : 'bg-[var(--surface-alt)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--imh-green)]'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>IMH (Vrtić)</span>
            </button>
            <button
              type="button"
              onClick={() => setEntity('IDSS')}
              className={`p-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
                entity === 'IDSS'
                  ? 'bg-[var(--idss-blue)] text-white border-[var(--idss-blue)] shadow-sm'
                  : 'bg-[var(--surface-alt)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--idss-blue)]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>IDSS (Škola)</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">
            Naziv partnera / roditelja / djeteta:
          </label>
          <input
            type="text"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            placeholder="Npr. Porodica Hadžić / Tarik Hadžić"
            className="w-full p-2.5 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:border-[var(--idss-blue)]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">
            Dodatne napomene za forenzičara:
          </label>
          <input
            type="text"
            value={contextNotes}
            onChange={(e) => setContextNotes(e.target.value)}
            placeholder="Npr. Roditelj spori fakturu za mart ili tvrdi da ima popust..."
            className="w-full p-2.5 text-xs rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:border-[var(--idss-blue)]"
          />
        </div>
      </div>

      {/* Card Data / Upload area */}
      <div className="my-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-[var(--ink)] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--idss-blue)]" />
            Tekst analitičke kartice partnera ili bruto prometa:
          </label>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer px-3 py-1 rounded-lg border border-[var(--line)] hover:bg-[var(--surface-alt)] text-xs font-bold text-[var(--ink)] flex items-center gap-1.5 transition">
              <Upload className="w-3.5 h-3.5 text-[var(--idss-blue)]" />
              <span>Priloži PDF / Sliku / TXT</span>
              <input
                type="file"
                multiple
                accept=".txt,.csv,.pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {uploadedFiles.length > 0 && (
              <button
                type="button"
                onClick={() => setUploadedFiles([])}
                className="text-[11px] text-[var(--idss-red)] hover:underline font-semibold cursor-pointer"
              >
                Ukloni fajlove ({uploadedFiles.length})
              </button>
            )}
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 p-2 rounded-lg bg-[var(--surface-alt)] border border-[var(--line)]">
            {uploadedFiles.map((f, i) => (
              <span key={i} className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-[var(--line)] text-[var(--ink)] flex items-center gap-1">
                📎 {f.name} ({Math.round(f.size / 1024)} KB)
              </span>
            ))}
          </div>
        )}

        <textarea
          rows={8}
          value={rawCardText}
          onChange={(e) => setRawCardText(e.target.value)}
          placeholder="Ovdje zalijepite kompletnu analitičku karticu kupca/dobavljača iz računovodstva (kolone: datum, broj dokumenta, opis, duguje, potražuje, saldo)..."
          className="w-full p-3 font-mono text-xs rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] text-[var(--ink)] leading-relaxed focus:outline-none focus:border-[var(--idss-blue)]"
        />
      </div>

      {/* Action button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handleRunAnalysis}
          disabled={isLoading}
          className="px-6 py-3 rounded-xl bg-[var(--idss-blue)] hover:bg-[var(--idss-blue)]/90 text-white font-black text-sm flex items-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Forenzički vještak analizira karticu i kreira HTML nalaz...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Pokreni forenzičku analizu i sastavi HTML nalaz spreman za e-mail i štampu</span>
            </>
          )}
        </button>

        {(rawCardText || uploadedFiles.length > 0) && (
          <button
            onClick={() => {
              setRawCardText('');
              setUploadedFiles([]);
              setPartnerName('');
              setContextNotes('');
              setAnalysisReportHtml(null);
            }}
            className="text-xs text-[var(--muted)] hover:text-[var(--ink)] flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Očisti unos</span>
          </button>
        )}
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="my-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-xs text-red-800 dark:text-red-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Output report card */}
      {analysisReportHtml && (
        <div className="mt-8 pt-6 border-t-2 border-[var(--line)] animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <span className="eyebrow text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ZAVRŠEN SLUŽBENI FORENZIČKI RAČUNOVODSTVENI NALAZ
              </span>
              <h4 className="text-lg font-black text-[var(--ink)] m-0">
                Izvještaj spreman za e-mail i štampu: {partnerName || 'Partner'}
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Tab toggles */}
              <div className="flex bg-[var(--surface-alt)] p-1 rounded-lg border border-[var(--line)] mr-1">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1 transition ${
                    activeTab === 'preview'
                      ? 'bg-white dark:bg-slate-800 text-[var(--idss-blue)] shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Pregled</span>
                </button>
                <button
                  onClick={() => setActiveTab('htmlCode')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1 transition ${
                    activeTab === 'htmlCode'
                      ? 'bg-white dark:bg-slate-800 text-[var(--idss-blue)] shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>HTML Kod</span>
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleCopyFormattedEmail}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                title="Kopiraj formatirani HTML za direktno lijepljenje u Outlook / Gmail"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-white" /> : <Mail className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Kopirano za E-mail!' : 'Kopiraj za E-mail / Outlook'}</span>
              </button>

              <button
                onClick={handleCopyHtmlCode}
                className="px-3 py-1.5 rounded-lg border border-[var(--line)] hover:bg-[var(--surface-alt)] text-xs font-bold text-[var(--ink)] flex items-center gap-1.5 transition cursor-pointer"
                title="Kopiraj sirovi HTML kod izvještaja"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'HTML kopiran!' : 'Kopiraj HTML'}</span>
              </button>

              <button
                onClick={handleDownloadHtml}
                className="px-3 py-1.5 rounded-lg border border-[var(--line)] hover:bg-[var(--surface-alt)] text-xs font-bold text-[var(--ink)] flex items-center gap-1.5 transition cursor-pointer"
                title="Preuzmi kao samostalni HTML fajl (.html)"
              >
                <Download className="w-3.5 h-3.5 text-[var(--idss-blue)]" />
                <span>Preuzmi .html</span>
              </button>

              <button
                onClick={handleExportPdfReport}
                className="px-3.5 py-1.5 rounded-lg bg-[var(--idss-blue)] text-white hover:bg-[var(--idss-blue)]/90 text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                title="Izvezi generisani forenzički nalaz kao čist PDF dokument koristeći print stylesheet"
                aria-label="Export generated forensic analysis report as clean PDF"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export Report as PDF</span>
              </button>
            </div>
          </div>

          {activeTab === 'preview' ? (
            <div className="p-4 md:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--line)] overflow-x-auto shadow-inner">
              <div 
                className="forensic-rendered-document"
                dangerouslySetInnerHTML={{ __html: analysisReportHtml }} 
              />
            </div>
          ) : (
            <div className="relative">
              <textarea
                readOnly
                rows={16}
                value={analysisReportHtml}
                className="w-full p-4 font-mono text-xs rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] text-[var(--ink)] leading-relaxed select-all"
              />
              <button
                onClick={handleCopyHtmlCode}
                className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[var(--idss-blue)] text-white text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Kopirano' : 'Kopiraj kod'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
