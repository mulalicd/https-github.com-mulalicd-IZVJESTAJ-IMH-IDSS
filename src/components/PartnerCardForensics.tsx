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
import { ReceivablesPanel } from './ReceivablesPanel';

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
      setPartnerName('Porodica P-201 (Učenik: Učenik P-201, IV razred)');
      setContextNotes('Roditelj tvrdi da je platio sve rate, a računovodstvo iskazuje dug od 1.880,00 KM za školsku 2025/26. godinu.');
      setRawCardText(`KONTO: 2110 - Kupci u zemlji (IDSS)
PARTNER: 100428 - Roditelj P-201 / Učenik P-201
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
      setPartnerName('Porodica P-103 (Dijete: Dijete P-103, Vrtićka grupa)');
      setContextNotes('Majka pita zašto je uplatila puni iznos ako je kanton odobrio subvenciju od 200 KM mjesečno.');
      setRawCardText(`KONTO: 2110 - Kupci u zemlji (PPU IMH)
PARTNER: 200155 - Roditelj P-103 / Dijete P-103
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
  const handleRunAnalysis = async () => {
    if (!rawCardText.trim() && uploadedFiles.length === 0) {
      setErrorMsg('Molimo unesite tekst kartice partnera ili priložite datoteku.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setAnalysisReportHtml(null);

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/forensics/analyze-partner-card`, {
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
        let msg = 'AI analiza nije uspjela.';
        try {
          const err = await res.json();
          if (err?.error) msg = err.error;
        } catch {
          /* odgovor nije JSON */
        }
        setErrorMsg(msg);
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
      setErrorMsg('AI server nije dostupan. Javna verzija aplikacije (GitHub Pages) nema server; za AI nalaz aplikaciju treba pokrenuti lokalno s GEMINI_API_KEY.');
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
      <ReceivablesPanel />

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
            placeholder="Npr. Porodica P-201 / Učenik P-201"
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
