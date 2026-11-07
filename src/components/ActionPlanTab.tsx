import React, { useState } from 'react';
import { CheckSquare, Calendar, UserCheck, ShieldCheck, Clock, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ActionPlanTab: React.FC = () => {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const TASKS_PHASE_1 = [
    { id: 1, task: 'Nezavisan pravni i porezni pregled transakcije od 100.000 KM (isključenje iz EBITDA)', owner: 'Direkcija & Vanjski revizor', deadline: 'Dan 10', status: 'HITNO' },
    { id: 2, task: 'Formalizacija notarskog ugovora o priznanju duga i mjenica za 184.692 KM potraživanja', owner: 'Pravna služba & Osnivač', deadline: 'Dan 15', status: 'U TOKU' },
    { id: 3, task: 'Pribavljanje službenog uvjerenja Porezne uprave FBiH o stanju obaveza i usaglašavanje kartica', owner: 'Računovodstvo grupacije', deadline: 'Dan 20', status: 'U TOKU' },
    { id: 4, task: 'Verifikacija i arhiviranje ovjerenog Aneksa ugovora o zakupu Buka 11/13 do 2033. sa Općinom Centar', owner: 'Uprava ustanova', deadline: 'Dan 25', status: 'KRITIČNO' },
    { id: 5, task: 'Uvođenje 13-sedmične rotirajuće prognoze novčanih tokova (13-Week Cash Flow Forecast)', owner: 'Finansijsko upravljanje', deadline: 'Dan 30', status: 'PLANIRANO' }
  ];

  const TASKS_PHASE_2 = [
    { id: 6, task: 'Analiza uzroka pada upisa u 2025/26. (-27.7%) i uvođenje programa retencije učenika', owner: 'Pedagoški kolegij & Upisni tim', deadline: 'Dan 45', status: 'PLANIRANO' },
    { id: 7, task: 'Pravna revizija ugovora o djelu (77.632 KM) i usklađivanje sa Zakonom o radu FBiH', owner: 'Pravni savjetnik', deadline: 'Dan 60', status: 'PLANIRANO' },
    { id: 8, task: 'Odvajanje i ring-fencing namjenskog escrow računa za depozite roditelja (47.616 KM)', owner: 'Računovodstvo & Uprava', deadline: 'Dan 75', status: 'PLANIRANO' },
    { id: 9, task: 'Uspostavljanje institucionalnog praćenja vertikale IMH->IDSS sa ciljem prelaza >75%', owner: 'Koordinacija programa', deadline: 'Dan 90', status: 'PLANIRANO' },
    { id: 10, task: 'Usvajanje konsolidovanog budžeta sa ciljem dostizanja pozitivnog kapitala do kraja 2028.', owner: 'Uprava grupacije', deadline: 'Dan 100', status: 'PLANIRANO' }
  ];

  const toggleTask = (id: number) => {
    setCompletedTasks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalTasks = TASKS_PHASE_1.length + TASKS_PHASE_2.length;
  const progressPct = Math.round((completedTasks.length / totalTasks) * 100);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Hero */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg">
              <CheckSquare className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Akcijski Protokol Sanacije: Prvih 100 Dana i Kontinuirano Upravljanje
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Strukturirana matrica institucionalnih mjera sa definisanim nosiocima, rokovima i dokazima izvršenja. 
            Prvih 30 dana fokusirano je na pravnu i poreznu izolaciju rizika, dok period od 31. do 100. dana osigurava 
            operativnu stabilnost, likvidnost i zaštitu upisne baze.
          </p>
        </div>

        {/* Progress Tracker Card */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl min-w-[220px] text-center">
          <div className="text-xs text-slate-400 font-semibold uppercase">Realizacija Protokola</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">{progressPct}%</div>
          <div className="text-xs text-slate-300 mt-0.5">
            {completedTasks.length} od {totalTasks} mjera evidentirano
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phase 1: First 30 Days */}
      <div className="bg-slate-900 border border-red-900/40 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold rounded-lg uppercase">
              Faza 1 &middot; Prvih 30 Dana
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Neodložne Pravne, Porezne i Trezorske Mjere
            </h3>
          </div>
          <span className="text-xs text-red-300/80 font-mono">
            Rok: 30 dana &middot; Prioritet najvišeg nivoa
          </span>
        </div>

        <div className="space-y-3">
          {TASKS_PHASE_1.map((task) => {
            const isDone = completedTasks.includes(task.id);
            return (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 select-none ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-800/60 opacity-80'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-slate-500 hover:border-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        isDone ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {task.task}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
                      <span className="flex items-center gap-1 text-slate-300">
                        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                        {task.owner}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-amber-300">
                        <Clock className="w-3.5 h-3.5" />
                        {task.deadline}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                    task.status === 'HITNO' || task.status === 'KRITIČNO'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {isDone ? 'EVIDENTIRANO' : task.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase 2: Days 31 to 100 */}
      <div className="bg-slate-900 border border-blue-900/40 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold rounded-lg uppercase">
              Faza 2 &middot; Od 31. do 100. Dana
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Operativna Stabilizacija, Retencija Učenika i Trezorski Nadzor
            </h3>
          </div>
          <span className="text-xs text-blue-300/80 font-mono">
            Rok: 100 dana &middot; Izgradnja institucionalne vrijednosti
          </span>
        </div>

        <div className="space-y-3">
          {TASKS_PHASE_2.map((task) => {
            const isDone = completedTasks.includes(task.id);
            return (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 select-none ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-800/60 opacity-80'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-slate-500 hover:border-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        isDone ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {task.task}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
                      <span className="flex items-center gap-1 text-slate-300">
                        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                        {task.owner}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-slate-300">
                        <Clock className="w-3.5 h-3.5" />
                        {task.deadline}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  {isDone ? 'EVIDENTIRANO' : task.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Governance Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Kontinuirani Mjesečni Nadzorni Paket (Institutional Board Pack)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Redovni mjesečni paket ključnih pokazatelja poslovanja koji se ažurira svakog 5. u mjesecu:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
            <span className="font-bold text-white block mb-1">1. Trezor i Dospijeća</span>
            <p className="text-slate-400">
              Stanje transakcijskih računa, zatezne kamate, porezni status i pokrivenost depozita roditelja.
            </p>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
            <span className="font-bold text-white block mb-1">2. Upis i Retencija</span>
            <p className="text-slate-400">
              Broj učenika po odjeljenjima, novi upisi, konverzija IMH &rarr; IDSS i analiza najavljenih odlazaka.
            </p>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
            <span className="font-bold text-white block mb-1">3. Naplata i Starost Duga</span>
            <p className="text-slate-400">
              Starosna struktura potraživanja od roditelja i praćenje mjesečnih rata povrata potraživanja od 184.692 KM.
            </p>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
            <span className="font-bold text-white block mb-1">4. Ugovorni Status</span>
            <p className="text-slate-400">
              Registracija zakupa Buka 11/13, status kantonalnih subvencija i evidencija nastavne norme.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
