import React from 'react';
import { ShieldAlert, AlertTriangle, FileText, BarChart3, Users, Sliders, CheckSquare, Download, Layers } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  auditMode: boolean;
  setAuditMode: (val: boolean) => void;
  onExportHTML: () => void;
  resolvedRisksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  auditMode,
  setAuditMode,
  onExportHTML,
  resolvedRisksCount,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-blue-700 to-sky-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-900/40 border border-white/20">
              <span>S</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">
                  IDSS <span className="text-red-500">+</span> IMH
                </span>
                <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Forenzičko-Strateški Izvještaj
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Objektivna analiza poslovanja &middot; Buka 11/13, Sarajevo &middot; 2022&ndash;2032
              </p>
            </div>
          </div>

          {/* Mode Switcher & Export */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700/80 shadow-inner">
              <button
                onClick={() => setAuditMode(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  !auditMode
                    ? 'bg-slate-700 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Prikazuje službene knjigovodstvene podatke bez eliminacija"
              >
                Službeni Bilansi
              </button>
              <button
                onClick={() => setAuditMode(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  auditMode
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-amber-400/80 hover:text-amber-300'
                }`}
                title="Prikazuje forenzički normalizirane podatke sa eliminacijom 100.000 KM"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Forenzički Normalizovano
              </button>
            </div>

            <button
              onClick={onExportHTML}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all border border-blue-400/30"
              title="Preuzmi cjeloviti Standalone HTML dokument"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preuzmi</span> .HTML
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-800/80 pt-2 text-xs">
          {[
            { id: 'forensic', label: '1. Forenzički Alarmi', icon: AlertTriangle, badge: `${7 - resolvedRisksCount} Otvoreno` },
            { id: 'financial', label: '2. Konsolidacija & Bilansi', icon: BarChart3 },
            { id: 'funnel', label: '3. Upisna Vertikala & Cijene', icon: Users, badge: '64% prelaza' },
            { id: 'harmonization', label: '4. Dokumenti & Harmonizacija', icon: Layers, badge: 'MODULARNO' },
            { id: 'simulator', label: '5. Stress-Test Simulator', icon: Sliders },
            { id: 'action', label: '6. Akcijski Protokol 100 Dana', icon: CheckSquare },
            { id: 'document', label: '7. Cjeloviti Izvještaj (.HTML)', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      tab.id === 'forensic'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : tab.id === 'harmonization'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Forensic Banner */}
      {auditMode && (
        <div className="bg-amber-500/10 border-t border-b border-amber-500/20 px-4 py-1.5 text-center text-xs text-amber-300 flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Forenzički normalizovan prikaz:</strong> Isključena je međufirmska stavka od 100.000 KM kreditne transakcije, evidentirano je 184.692 KM potraživanja od uprave i identifikovan deficit od 23.468 KM u pokriću depozita roditelja.
          </span>
        </div>
      )}
    </header>
  );
};
