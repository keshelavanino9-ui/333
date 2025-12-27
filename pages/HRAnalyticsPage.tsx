
import React, { useState, useContext, useMemo } from 'react';
import { 
  Activity, BrainCircuit, ShieldAlert, LayoutGrid, Scale, ShieldCheck, Search, 
  Star, AlertTriangle, UserCheck, CreditCard, Filter, ArrowRight, Sparkles, 
  Award, BookOpen, GraduationCap, TrendingUp, X, Target, BarChart, History,
  TrendingDown, Zap, Microscope, LayoutDashboard, Award as Medal, RefreshCw, ArrowUpRight
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import { LanguageContext } from '../App';

interface MatrixRow {
  id: number;
  name: string;
  role: string;
  grade: number;
  communication: number;
  routeOpt: number;
  safety: number;
  leadership: number;
  problemSolving: number;
  progression: number[]; // Skill level over last 6 months
  lastAppraisal: string;
  appraisalScore: number;
}

const initialMatrixData: MatrixRow[] = [
  { id: 1, name: 'Aleksandre Kvaratskhelia', role: 'Warehouse Manager', grade: 4, communication: 5, routeOpt: 4, safety: 5, leadership: 4, problemSolving: 4, progression: [65, 72, 78, 82, 88, 92], lastAppraisal: '2023-12-15', appraisalScore: 94 },
  { id: 2, name: 'Ketevan Ivanishvili', role: 'Logistics Coordinator', grade: 3, communication: 4, routeOpt: 5, safety: 4, leadership: 3, problemSolving: 4, progression: [50, 58, 64, 72, 79, 85], lastAppraisal: '2023-11-20', appraisalScore: 88 },
  { id: 3, name: 'Irakli Nozadze', role: 'Driver', grade: 2, communication: 3, routeOpt: 3, safety: 4, leadership: 2, problemSolving: 3, progression: [40, 45, 48, 52, 58, 62], lastAppraisal: '2024-01-10', appraisalScore: 75 },
  { id: 4, name: 'Natela Shengelia', role: 'Analyst', grade: 4, communication: 5, routeOpt: 4, safety: 3, leadership: 5, problemSolving: 5, progression: [70, 75, 80, 85, 90, 95], lastAppraisal: '2023-12-05', appraisalScore: 92 },
];

const HRAnalyticsPage: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const [selectedEntity, setSelectedEntity] = useState<MatrixRow | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<'matrix' | 'appraisals' | 'development'>('matrix');

  const t = {
    en: { title: "Strategic Workforce Architecture", sub: "Cognitive Talent Orchestration", metrics: ["Retention Index", "Knowledge Density", "Asset Velocity", "Equity Balance"], tabs: ["Competency Matrix", "Appraisal Cycles", "Developmental Paths"] },
    ka: { title: "პერსონალის სტრატეგიული არქიტექტურა", sub: "ტალანტის ნეირალური მართვა", metrics: ["ბრუნვა", "ცოდნა", "ანაზღაურება", "ექვითი"], tabs: ["კომპეტენციები", "შეფასების ციკლი", "განვითარების გზები"] }
  }[lang];

  const radarData = useMemo(() => {
    if (!selectedEntity) return [];
    return [
      { subject: 'COMMUNICATION', A: selectedEntity.communication, fullMark: 5 },
      { subject: 'LOGISTICS OPT', A: selectedEntity.routeOpt, fullMark: 5 },
      { subject: 'SAFETY PROTOCOL', A: selectedEntity.safety, fullMark: 5 },
      { subject: 'LEADERSHIP', A: selectedEntity.leadership, fullMark: 5 },
      { subject: 'PROB. SOLVING', A: selectedEntity.problemSolving, fullMark: 5 },
    ];
  }, [selectedEntity]);

  return (
    <div className="space-y-12 pb-40 fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pt-6">
        <div className="animate-in slide-in-from-left-12 duration-1000">
          <div className="flex items-center gap-6 mb-10">
             <div className="h-px w-20 bg-fuchsia-500 shadow-glow shadow-fuchsia-500/50"></div>
             <span className="text-[10px] text-fuchsia-400 uppercase tracking-[0.6em] font-black">{t.sub}</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none uppercase">
            Workforce <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-500 uppercase">Architecture</span>
          </h1>
        </div>
        <div className="flex gap-2 glass p-2 rounded-[3rem] border-white/5 shadow-2xl overflow-x-auto no-scrollbar max-w-full">
           {['matrix', 'appraisals', 'development'].map((id, i) => (
             <button 
               key={id}
               onClick={() => setActiveAnalysis(id as any)}
               className={`px-10 py-5 text-[10px] uppercase font-black rounded-[2.5rem] transition-all whitespace-nowrap ${activeAnalysis === id ? 'bg-indigo-600 text-white shadow-glow shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
             >
               {t.tabs[i]}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 animate-in slide-in-from-bottom-8 duration-1000">
        <StatItem label={t.metrics[0]} value="0.94" trend="+1.2%" icon={UserCheck} color="text-emerald-400" />
        <StatItem label={t.metrics[1]} value="92.4" trend="+5.4%" icon={BrainCircuit} color="text-indigo-400" />
        <StatItem label={t.metrics[2]} value="$2.8M" trend="Stable" icon={CreditCard} color="text-cyan-400" />
        <StatItem label={t.metrics[3]} value="1.05" trend="Target" icon={ShieldAlert} color="text-fuchsia-400" />
      </div>

      {activeAnalysis === 'matrix' && (
        <div className="glass p-1 border-white/5 rounded-[4rem] bg-[#02020a]/40 shadow-3xl overflow-hidden relative">
          <div className="p-14 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-6">
                <LayoutGrid className="text-indigo-500" size={32} /> Organizational Competency Matrix
              </h3>
              <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.4em] mt-3 italic leading-none">Neural Skill Grading Synthesis :: Kernel V3.5.2</p>
            </div>
            <div className="flex gap-6">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={20} />
                <input type="text" placeholder="Filter Matrix Nodes..." className="bg-black/60 border border-white/10 rounded-[1.8rem] pl-16 pr-8 py-5 text-[11px] text-white focus:border-indigo-500 focus:outline-none placeholder:text-slate-900 font-bold uppercase tracking-widest shadow-inner" />
              </div>
              <button className="px-10 py-5 glass rounded-[1.8rem] text-micro font-black uppercase text-slate-600 hover:text-white transition-all border border-white/5 flex items-center gap-4"><Filter size={18} /> Refine Signals</button>
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] border-b border-white/5">
                <tr>
                  <th className="px-14 py-8">Asset Entity</th>
                  <th className="px-14 py-8">Role Profile</th>
                  <th className="px-14 py-8 text-center">COMM</th>
                  <th className="px-14 py-8 text-center">LOG OPT</th>
                  <th className="px-14 py-8 text-center">SAFETY</th>
                  <th className="px-14 py-8 text-center">LEAD</th>
                  <th className="px-14 py-8 text-right">SYNT. SCORE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {initialMatrixData.map(row => (
                  <tr key={row.id} onClick={() => setSelectedEntity(row)} className="group hover:bg-white/[0.04] transition-all cursor-pointer border-l-4 border-transparent hover:border-indigo-500">
                    <td className="px-14 py-10">
                      <div className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-indigo-400 transition-colors leading-none">{row.name}</div>
                      <div className="text-[10px] text-slate-800 font-black uppercase mt-2 tracking-widest leading-none">E-{(row.id + 200)} // ARCHIVE_ACTIVE</div>
                    </td>
                    <td className="px-14 py-10">
                      <div className="text-sm font-black text-slate-400 uppercase tracking-tight leading-none mb-2">{row.role}</div>
                      <div className="flex gap-1.5">
                         {[...Array(5)].map((_, i) => <div key={i} className={`h-1.5 w-5 rounded-full ${i < row.grade ? 'bg-indigo-500 shadow-glow shadow-indigo-500/40' : 'bg-slate-900'}`}></div>)}
                      </div>
                    </td>
                    {[row.communication, row.routeOpt, row.safety, row.leadership].map((score, i) => (
                      <td key={i} className="px-14 py-10 text-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-black text-base border shadow-inner group-hover:scale-110 transition-transform ${score >= 4 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                          {score}
                        </div>
                      </td>
                    ))}
                    <td className="px-14 py-10 text-right">
                      <div className="text-4xl font-black text-white font-mono drop-shadow-glow leading-none">{((row.communication + row.routeOpt + row.safety + row.leadership) / 4).toFixed(1)}</div>
                      <div className="text-[8px] text-slate-800 uppercase font-black tracking-widest mt-1">Variance: ±0.12</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeAnalysis === 'appraisals' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 animate-in slide-in-from-bottom-8 duration-1000">
           {initialMatrixData.map(row => (
             <div key={row.id} className="glass p-12 rounded-[4rem] border-white/5 bg-[#02020a]/40 shadow-3xl hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity duration-700 transform group-hover:rotate-12"><Medal size={200} /></div>
                <div className="flex justify-between items-start mb-12 relative z-10 border-b border-white/5 pb-8">
                   <div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-indigo-400 transition-colors leading-none mb-2">{row.name}</h3>
                      <div className="text-micro text-slate-600 font-black uppercase tracking-widest">Archive ID: E-{(row.id + 200)} // Appraisal Node</div>
                   </div>
                   <div className="text-right">
                      <div className="text-micro text-slate-700 font-black uppercase tracking-widest mb-1">Cycle Grade</div>
                      <div className="text-5xl font-black text-white font-mono drop-shadow-glow leading-none">{row.appraisalScore}</div>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-10 relative z-10">
                   <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 space-y-4">
                      <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                         <History size={14} /> Historical Drift
                      </div>
                      <div className="h-20 flex items-end gap-1.5">
                         {row.progression.map((h, i) => (
                           <div key={i} className="flex-1 bg-gradient-to-t from-indigo-950 to-indigo-500 rounded-t-lg transition-all duration-1000" style={{ height: `${h}%` }}></div>
                         ))}
                      </div>
                   </div>
                   <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 space-y-4">
                      <div className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest flex items-center gap-3">
                         <Medal size={14} /> Core Achievement
                      </div>
                      <p className="text-micro text-slate-500 uppercase tracking-widest font-black leading-relaxed">Demonstrated 99% accuracy in regional hub routing protocols during peak cycle Q4.</p>
                   </div>
                </div>
                <div className="mt-10 pt-10 border-t border-white/5 flex justify-between items-center relative z-10">
                   <div className="text-micro text-slate-700 font-black uppercase tracking-widest">Final Audit: {row.lastAppraisal}</div>
                   <button className="flex items-center gap-4 text-micro font-black text-indigo-400 hover:text-white transition-all uppercase tracking-[0.4em] group-hover:gap-6">
                      View Full Manifest <ArrowRight size={16} />
                   </button>
                </div>
             </div>
           ))}
        </div>
      )}

      {selectedEntity && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-8 bg-[#02020a]/95 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="glass w-full max-w-6xl rounded-[5rem] p-20 border-white/10 relative shadow-[0_64px_256px_-12px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[95vh]">
            <button onClick={() => setSelectedEntity(null)} className="absolute top-12 right-12 p-5 glass rounded-full text-slate-500 hover:text-white transition-all border-white/10 active:scale-90"><X size={32} /></button>
            
            <div className="flex gap-20 overflow-y-auto custom-scrollbar pr-6">
              <div className="w-1/3 space-y-14">
                <div className="flex flex-col items-center text-center">
                  <div className="w-48 h-48 bg-indigo-600/10 rounded-[4rem] border-2 border-indigo-500/20 flex items-center justify-center font-black text-7xl text-white shadow-glow shadow-indigo-500/10 mb-10 relative group">
                    <div className="absolute inset-0 bg-indigo-500/10 animate-pulse rounded-[4rem]"></div>
                    <span className="relative z-10">{selectedEntity.name.split(' ').map(n => n[0]).join('')}</span>
                    <div className="absolute -bottom-3 -right-3 bg-emerald-500 p-4 rounded-3xl border-4 border-[#02020a] shadow-glow shadow-emerald-500/40"><ShieldCheck size={32} className="text-white" /></div>
                  </div>
                  <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{selectedEntity.name}</h2>
                  <p className="text-indigo-400 text-base font-black uppercase tracking-[0.5em] mt-5 opacity-80">{selectedEntity.role}</p>
                </div>

                <div className="p-8 bg-black/40 rounded-[3rem] border border-white/5 shadow-inner relative overflow-hidden h-[400px]">
                  <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] border-b border-white/5 pb-6 mb-4 flex items-center gap-4 text-center justify-center relative z-10">
                    <Target size={16} className="text-fuchsia-400" /> Holo-Competency Scan
                  </h4>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,70,239,0.05),transparent_70%)]"></div>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="45%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#ffffff10" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 800, dy: 3 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                      <Radar
                        name={selectedEntity.name}
                        dataKey="A"
                        stroke="#d946ef"
                        strokeWidth={3}
                        fill="#d946ef"
                        fillOpacity={0.2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex-1 space-y-16">
                 <div className="flex items-center gap-10">
                   <div className="p-8 bg-fuchsia-600/10 text-fuchsia-400 rounded-[2.5rem] border border-fuchsia-500/20 shadow-glow shadow-fuchsia-500/5"><Sparkles size={48} /></div>
                   <div>
                      <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">AI Competency Synthesis</h3>
                      <p className="text-slate-700 text-micro uppercase font-black tracking-[0.6em] mt-4">Inference Matrix Result: OPT-V3.5</p>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="p-12 glass rounded-[4rem] border-emerald-500/20 bg-emerald-500/5 space-y-8 group hover:bg-emerald-500/10 transition-all duration-700 shadow-inner">
                      <h4 className="text-base font-black text-emerald-400 uppercase tracking-widest flex items-center gap-6 leading-none"><Award size={24} /> Domain Mastery</h4>
                      <p className="text-slate-400 leading-[1.8] font-medium text-lg uppercase tracking-tight opacity-80">Exceptional proficiency in complex logistics orchestration. Entity shows 92% readiness for G5 strategic nodes within the regional mainframe.</p>
                    </div>
                    <div className="p-12 glass rounded-[4rem] border-rose-500/20 bg-rose-500/5 space-y-8 group hover:bg-rose-500/10 transition-all duration-700 shadow-inner">
                      <h4 className="text-base font-black text-rose-400 uppercase tracking-widest flex items-center gap-6 leading-none"><Target size={24} /> Developmental Gaps</h4>
                      <p className="text-slate-400 leading-[1.8] font-medium text-lg uppercase tracking-tight opacity-80">Critical deficit in 'Cross-Hub Fiscal Balancing'. Suggesting immediate deployment into the Financial Matrix Training Protocol.</p>
                    </div>

                    <div className="md:col-span-2 p-12 glass rounded-[4.5rem] border-indigo-500/20 bg-indigo-500/5 space-y-12 relative overflow-hidden group/roadmap shadow-2xl">
                      <div className="absolute top-0 right-0 p-16 opacity-[0.04] scale-150 transform group-hover/roadmap:rotate-12 transition-transform duration-1000"><GraduationCap size={160} /></div>
                      <h4 className="text-2xl font-black text-indigo-400 uppercase tracking-tighter flex items-center gap-8 border-b border-white/5 pb-10 relative z-10 leading-none">
                         <Medal size={32} /> Autonomous Growth Roadmap
                      </h4>
                      <div className="grid grid-cols-3 gap-10 relative z-10">
                         {[
                           { s: 'PHASE 01', t: 'Logistics II', d: 'Hub Sync Logic', active: true, color: 'indigo' },
                           { s: 'PHASE 02', t: 'Fiscal Resilience', d: 'CAPEX Matrix', active: false, color: 'fuchsia' },
                           { s: 'PHASE 03', t: 'Strategic Vision', d: 'G5 Leadership', active: false, color: 'cyan' },
                         ].map((p, i) => (
                           <div key={i} className={`p-8 rounded-[2.5rem] border-2 transition-all duration-700 ${p.active ? 'bg-indigo-600/15 border-indigo-500 shadow-glow shadow-indigo-500/10' : 'bg-black/60 border-white/5 opacity-30 grayscale hover:opacity-100 hover:grayscale-0'}`}>
                              <div className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em] mb-3 leading-none">{p.s}</div>
                              <div className="text-xl font-black text-white uppercase tracking-tighter mb-2">{p.t}</div>
                              <div className="text-micro font-medium text-slate-500 mt-2 uppercase tracking-widest">{p.d}</div>
                              {p.active && (
                                <div className="mt-8 flex justify-end">
                                   <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl animate-pulse"><RefreshCw size={18} /></div>
                                </div>
                              )}
                           </div>
                         ))}
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatItem = ({ label, value, trend, icon: Icon, color }: any) => (
  <div className="glass border-white/10 rounded-[3.5rem] p-12 relative overflow-hidden group hover:border-indigo-500/30 transition-all shadow-2xl bg-gradient-to-br from-white/[0.01] to-transparent">
    <Icon className={`absolute -right-10 -bottom-10 size-48 opacity-[0.02] group-hover:opacity-[0.06] transition-all duration-1000 transform group-hover:rotate-12 ${color}`} />
    <div className="flex items-center justify-between mb-10 relative z-10">
      <div className={`p-5 rounded-[1.8rem] bg-white/5 border border-white/10 ${color} shadow-inner group-hover:scale-110 transition-transform`}><Icon size={28} /></div>
      <div className={`text-[10px] px-5 py-2 rounded-full border flex items-center gap-3 font-black tracking-widest shadow-inner text-emerald-400 bg-emerald-500/10 border-emerald-500/20`}>
        {trend} <ArrowUpRight size={12} />
      </div>
    </div>
    <div className="relative z-10">
      <div className="text-5xl font-black text-white mb-2 tracking-tighter uppercase leading-none font-mono drop-shadow-glow">{value}</div>
      <div className="text-micro text-slate-700 font-black uppercase tracking-[0.6em]">{label}</div>
    </div>
  </div>
);

export default HRAnalyticsPage;
