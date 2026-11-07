import React, { useState } from 'react';
import { IngestedDocument } from '../data/reportData';
import { X, CheckCircle2, AlertTriangle, FileText, Plus, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';

interface HarmonizationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  documents: IngestedDocument[];
  onToggleDoc: (id: string) => void;
  onAddCustomDoc: (doc: IngestedDocument) => void;
  onResetDocs: () => void;
  resolvedRisksCount: number;
  injectedCash: number;
  injectedEbitda: number;
}

export const HarmonizationDrawer: React.FC<HarmonizationDrawerProps> = ({
  isOpen,
  onClose,
  documents,
  onToggleDoc,
  onAddCustomDoc,
  onResetDocs,
  resolvedRisksCount,
  injectedCash,
  injectedEbitda,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newSource, setNewSource] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [cashImpact, setCashImpact] = useState<string>('0');
  const [ebitdaImpact, setEbitdaImpact] = useState<string>('0');

  if (!isOpen) return null;

  const baselineDocs = documents.filter((d) => !d.id.startsWith('DOC-EXT') && !d.id.startsWith('DOC-CUSTOM'));
  const modularDocs = documents.filter((d) => d.id.startsWith('DOC-EXT') || d.id.startsWith('DOC-CUSTOM'));

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const doc: IngestedDocument = {
      id: `DOC-CUSTOM-${Date.now()}`,
      code: newCode.trim() || `DOC-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle.trim(),
      source: newSource.trim() || 'Interni verifikovani akt',
      date: new Date().toLocaleDateString('bs-BA'),
      impactAreas: ['Harmonizacija', 'Finansije'],
      summary: newSummary.trim() || 'Priložen verifikovani dokument koji mijenja pretpostavke izvještaja.',
      effects: {
        cashDeltaKM: parseFloat(cashImpact) || 0,
        ebitdaDeltaKM: parseFloat(ebitdaImpact) || 0,
      },
      isActive: true,
    };

    onAddCustomDoc(doc);
    setNewTitle('');
    setNewCode('');
    setNewSource('');
    setNewSummary('');
    setCashImpact('0');
    setEbitdaImpact('0');
    setShowAddForm(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose} />

      {/* Drawer Container */}
      <div className="harmonization-drawer p-6 text-sm">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--idss-cyan)] animate-pulse" />
            <h3 className="font-bold text-base m-0 text-[var(--ink)]">
              Modularni harmonizacijski sistem
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            aria-label="Zatvori"
          >
            <X className="w-5 h-5 text-[var(--muted)]" />
          </button>
        </div>

        {/* Dynamic Impact Summary */}
        <div className="my-5 p-4 rounded-xl bg-[var(--surface-alt)] border border-[var(--line)]">
          <span className="eyebrow block mb-1">Harmonizacijski efekat</span>
          <div className="grid grid-cols-3 gap-2 mt-2 text-center">
            <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--line)]">
              <span className="text-[10px] uppercase font-bold text-[var(--muted)] block">Riješeno rizika</span>
              <b className="text-base font-extrabold text-[var(--imh-green)]">
                {resolvedRisksCount} / 7
              </b>
            </div>
            <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--line)]">
              <span className="text-[10px] uppercase font-bold text-[var(--muted)] block">Keš injekcija</span>
              <b className="text-sm font-extrabold text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]">
                +{injectedCash.toLocaleString('bs-BA')} KM
              </b>
            </div>
            <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--line)]">
              <span className="text-[10px] uppercase font-bold text-[var(--muted)] block">EBITDA delta</span>
              <b className="text-sm font-extrabold text-[var(--imh-green)]">
                +{injectedEbitda.toLocaleString('bs-BA')} KM
              </b>
            </div>
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-2 mb-0 leading-normal">
            Aktiviranjem verifikovanih pravnih i finansijskih isprava, sistem u realnom vremenu
            re-kalkuliše operativne marže, likvidnost i de-eskalira crvene zastavice u izvještaju.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="tool-btn text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Odustani' : 'Ubaci novi dokument'}</span>
          </button>
          <button
            type="button"
            onClick={onResetDocs}
            className="tool-btn text-xs text-[var(--muted)] hover:text-[var(--idss-red)]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset na audit</span>
          </button>
        </div>

        {/* Custom Document Form */}
        {showAddForm && (
          <form onSubmit={handleCreateDoc} className="mb-6 p-4 rounded-xl border border-[var(--idss-blue)] bg-[var(--surface-alt)]">
            <span className="eyebrow block mb-2">Novi dokument za ingestiju</span>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--muted)] mb-1">Naziv dokumenta</label>
                <input
                  type="text"
                  required
                  placeholder="npr. Potpisani Aneks ugovora o zakupu..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 text-xs rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--muted)] mb-1">Šifra akta</label>
                  <input
                    type="text"
                    placeholder="npr. ANX-2033"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full p-2 text-xs rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--muted)] mb-1">Izdavač / Izvor</label>
                  <input
                    type="text"
                    placeholder="npr. Općina Centar Sarajevo"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="w-full p-2 text-xs rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--muted)] mb-1">Kratki opis i pravna svrha</label>
                <textarea
                  rows={2}
                  placeholder="Svrha dokumenta i dokazni materijal..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full p-2 text-xs rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--muted)] mb-1">Finansijska injekcija (KM)</label>
                  <input
                    type="number"
                    value={cashImpact}
                    onChange={(e) => setCashImpact(e.target.value)}
                    className="w-full p-2 text-xs rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--muted)] mb-1">EBITDA delta (KM)</label>
                  <input
                    type="number"
                    value={ebitdaImpact}
                    onChange={(e) => setEbitdaImpact(e.target.value)}
                    className="w-full p-2 text-xs rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[var(--idss-blue)] hover:bg-[var(--idss-blue)]/90 text-white font-bold rounded text-xs transition"
              >
                Harmonizuj i poveži u izvještaj
              </button>
            </div>
          </form>
        )}

        {/* Modular Documents List */}
        <div className="space-y-4">
          <div>
            <span className="side-label block mb-2">Modularni verifikovani dokumenti</span>
            <div className="space-y-2">
              {modularDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onToggleDoc(doc.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    doc.isActive
                      ? 'border-[var(--imh-green)] bg-[var(--surface)] shadow-sm'
                      : 'border-[var(--line)] bg-[var(--surface-alt)] opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${doc.isActive ? 'bg-[var(--imh-green)]' : 'bg-slate-400'}`} />
                      <span className="font-extrabold text-xs text-[var(--idss-blue)] dark:text-[var(--idss-cyan)]">
                        [{doc.code}]
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        doc.isActive
                          ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {doc.isActive ? 'AKTIVAN' : 'NEAKTIVAN'}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs mt-1 mb-1 text-[var(--ink)]">{doc.title}</h4>
                  <p className="text-[11px] text-[var(--muted)] mb-2 line-clamp-2">{doc.summary}</p>
                  <div className="flex items-center justify-between text-[10px] text-[var(--muted)] border-t border-[var(--line)] pt-2">
                    <span>Izvor: {doc.source}</span>
                    {doc.effects.riskResolved && (
                      <span className="font-bold text-[var(--imh-green)] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Rješava: {doc.effects.riskResolved.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Baseline Reference Documents */}
          <div className="pt-2">
            <span className="side-label block mb-2">Bazna forenzička dokumentacija (31.08.2026.)</span>
            <div className="space-y-1.5">
              {baselineDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="w-3.5 h-3.5 text-[var(--idss-blue)] shrink-0" />
                    <span className="font-bold truncate text-[var(--ink)]">{doc.title}</span>
                  </div>
                  <span className="text-[10px] text-[var(--muted)] shrink-0">Verifikovano</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
