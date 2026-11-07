import React from 'react';
import { ENROLLMENT_DATA } from '../data/reportData';
import { Users, GraduationCap, TrendingUp, AlertTriangle, ArrowRight, DollarSign, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const EnrollmentFunnelTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Funnel Moat Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/40 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            Strateška Prednost: Integrisana Obrazovna Vertikala
          </span>
          <span className="text-xs text-blue-200/80 font-mono">
            Stopa konverzije IMH &rarr; IDSS: 63.64% (7 od 11 učenika I razreda 2026/27.)
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
          Pedagoški Lijak: Tržišna Funkcija i Životna Vrijednost Porodice (LTV)
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
          Komplementarni model povezivanja predškolskog obrazovanja (IMH Montessori) i osnovnog obrazovanja (IDSS njemački međunarodni kurikulum) 
          omogućava kontinuitet odnosa sa porodicama od 1.5 do 15 godina starosti djeteta. 
          Ovakva vertikala drastično minimizira trošak akvizicije učenika (CAC) na otvorenom tržištu Sarajeva i 
          obezbjeđuje kumulativnu vrijednost od <strong>preko 130.000 KM po djetetu</strong> kroz cjelokupni ciklus.
        </p>

        {/* Funnel Pipeline Visual */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 relative">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">1. Toddler Grupa (IMH)</div>
            <div className="text-lg font-black text-white mt-1">Uzrast 1.5 &ndash; 3 god.</div>
            <p className="text-xs text-slate-400 mt-1">Rano uvođenje porodice u sistem i kampus Buka 11/13.</p>
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-slate-900 border border-slate-700 rounded-full p-1 text-slate-400">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 relative">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">2. Predškolska Grupa (IMH)</div>
            <div className="text-lg font-black text-white mt-1">Uzrast 3 &ndash; 6 god.</div>
            <p className="text-xs text-slate-400 mt-1">Podrška kantonalnih subvencija (157.4k KM) i priprema za dvojezičnu nastavu.</p>
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-slate-900 border border-slate-700 rounded-full p-1 text-slate-400">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-blue-900/40 rounded-xl p-4 border border-blue-500/40 relative">
            <div className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">3. Upis u I Razred (IDSS)</div>
            <div className="text-lg font-black text-blue-200 mt-1">63.64% Prelazak</div>
            <p className="text-xs text-blue-100/80 mt-1">7 od 11 učenika potiče iz IMH-a. Tržišno najefikasniji kanal upisa.</p>
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-slate-900 border border-slate-700 rounded-full p-1 text-slate-400">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60">
            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">4. Baza I &ndash; IX Razred</div>
            <div className="text-lg font-black text-white mt-1">83 Učenika</div>
            <p className="text-xs text-slate-400 mt-1">Ugovorena vrijednost 779.476 KM (prosjek 9.391 KM po učeniku).</p>
          </div>
        </div>
      </div>

      {/* Historical Trajectory & Analysis of 2025/26 Drop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                Historijat Upisa u IDSS i Ugovorena Vrijednost Školarina
              </h3>
              <p className="text-xs text-slate-400">
                Kretanje broja učenika, ukupnog ugovora i realizovanog prosjeka
              </p>
            </div>
            <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">
              Maksimum: 94 učenika
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-700">
                <tr>
                  <th className="py-3 px-3">Školska Godina</th>
                  <th className="py-3 px-3">Broj Učenika</th>
                  <th className="py-3 px-3">Ugovorena Vrijednost</th>
                  <th className="py-3 px-3">Prosjek / Učenik</th>
                  <th className="py-3 px-3">Realizacija</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {ENROLLMENT_DATA.map((row) => {
                  const isDropYear = row.period === '2025/26';
                  const isCurrent = row.period === '2026/27';

                  return (
                    <tr
                      key={row.period}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isDropYear ? 'bg-red-950/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-3 font-sans font-bold text-white">
                        {row.period}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-black text-base px-2 py-0.5 rounded ${
                            isDropYear
                              ? 'text-red-400 bg-red-500/10'
                              : isCurrent
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-white'
                          }`}
                        >
                          {row.students}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-200">
                        {row.contractValue.toLocaleString('bs-BA')} KM
                      </td>
                      <td className="py-3.5 px-3 text-blue-300 font-semibold">
                        {row.avgPerStudent.toLocaleString('bs-BA')} KM
                      </td>
                      <td className="py-3.5 px-3 text-slate-300">
                        {row.realizationRate}%
                      </td>
                      <td className="py-3.5 px-3 font-sans text-xs text-slate-400">
                        {row.note}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Visual Bar */}
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Korištenje prostornog kapaciteta kampusa Buka 11/13 (~110 učenika)
            </div>
            {ENROLLMENT_DATA.map((r) => {
              const pct = (r.students / 110) * 100;
              const isDrop = r.period === '2025/26';
              return (
                <div key={r.period} className="flex items-center gap-3 text-xs">
                  <span className="w-16 font-medium text-slate-300">{r.period}</span>
                  <div className="flex-1 bg-slate-800 h-6 rounded-lg overflow-hidden p-0.5 border border-slate-700/60">
                    <div
                      className={`h-full rounded-md transition-all duration-500 flex items-center justify-end pr-2 text-[11px] font-bold text-white ${
                        isDrop
                          ? 'bg-gradient-to-r from-red-600 to-amber-500'
                          : 'bg-gradient-to-r from-blue-600 to-sky-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    >
                      {r.students}
                    </div>
                  </div>
                  <span className="w-16 text-right font-mono text-slate-400">
                    {Math.round(pct)}% iskorišteno
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Forensic Analysis of 2025/26 Drop */}
        <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h4 className="font-bold text-base text-white">
              Strukturni Uzroci Pada Upisa u 2025/26. (-27.66%)
            </h4>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Pad sa <strong>94 na 68 učenika</strong> u školskoj 2025/26. godini (-26 učenika) predstavljao je primarni izvor operativnog gubitka IDSS-a.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-red-900/30">
              <span className="font-bold text-red-300 block mb-1">1. Fiksni Troškovi Nisu Smanjivi</span>
              <p className="text-slate-400 leading-relaxed">
                U privatnoj osnovnoj školi odjeljenja moraju funkcionisati bez obzira na broj učenika u razredu (učitelj i prostor koštaju isto). Gubitak 26 učenika značio je gubitak od cca 240.000 KM čistog marginalnog prihoda.
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-red-900/30">
              <span className="font-bold text-red-300 block mb-1">2. Cjenovni Pritisak i Odlivi</span>
              <p className="text-slate-400 leading-relaxed">
                Povećanje prosječne školarine na 10.545 KM dovelo je do osipanja porodica prema konkurentskim programima u odsustvu formalizovanog sistema retencije.
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-red-900/30">
              <span className="font-bold text-emerald-300 block mb-1">3. Oporavak na 83 i Cilj od 95</span>
              <p className="text-slate-400 leading-relaxed">
                Povratak na 83 učenika stabilizovao je operacije, ali za prelazak u stabilnu zonu profitabilnosti neophodno je dostići <strong>prag od 95 učenika</strong> u školskoj 2027/28.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Cost Structural Analysis */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-amber-400" />
          Ekonomika Plata: 90.38% Ugovorene Školarine Angažovano za Troškove Osoblja
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Uporedna analiza strukture rashoda IDSS-a u odnosu na industrijski standard privatnog obrazovanja:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/60">
            <div className="text-xs font-bold text-red-400 uppercase">Trenutni Koeficijent IDSS (2026/27)</div>
            <div className="text-3xl font-black text-red-400 mt-2">90.38%</div>
            <div className="text-xs text-slate-300 mt-1">Troškovi rada / Ugovorene školarine</div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Trošak plata i doprinosa iznosi <strong>704.500 KM</strong> naspram ugovorenih školarina od <strong>779.476 KM</strong>. 
              Za pokriće svih preostalih troškova (zakup, energenti, ishrana, administracija, kamate) preostaje svega <strong>74.976 KM (9.62%)</strong>.
            </p>
          </div>

          <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/60">
            <div className="text-xs font-bold text-emerald-400 uppercase">Industrijski Benchmark</div>
            <div className="text-3xl font-black text-emerald-400 mt-2">65.0% &ndash; 68.0%</div>
            <div className="text-xs text-slate-300 mt-1">Održivi udio plata u prihodima</div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Održive privatne škole raspoređuju do 68% na plate, 12-14% na prostor i održavanje, a 15-18% zadržavaju kao operativni EBITDA za amortizaciju, investicije i rezervu.
            </p>
          </div>

          <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/60">
            <div className="text-xs font-bold text-blue-400 uppercase">Strategija Dostizanja Održivosti</div>
            <div className="text-3xl font-black text-blue-300 mt-2">Prag: 95</div>
            <div className="text-xs text-slate-300 mt-1">Skok upisa bez rasta broja nastavnika</div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Spuštanje koeficijenta plata ne postiže se linearnim smanjenjem primanja nastavnika, već <strong>popunjavanjem postojećih razreda sa 83 na 95-100 učenika</strong>. 
              Dodatnih 12 učenika generiše cca +120.000 KM čistog prihoda bez povećanja nastavne norme, spuštajući udio plata ispod 78%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
