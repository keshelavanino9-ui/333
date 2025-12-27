
import React, { useState, useContext } from 'react';
import { Target, Filter, ChevronRight, Award, BrainCircuit, Activity, RefreshCw, Sparkles, TrendingUp, TrendingDown, Layers, Zap, ShieldCheck, Microscope, ArrowRight, UserPlus, FileText } from 'lucide-react';
import { gemini } from '../services/geminiService';
import { CompetencyGap } from '../types';
import { LanguageContext } from '../App';

const TalentPage: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const [selectedRole, setSelectedRole] = useState('Senior Product Designer');
  const [analyzing, setAnalyzing] = useState(false);
  const [gapData, setGapData] = useState<CompetencyGap | null>(null);

  const t = {
    en: { title: "Competency Matrix", sub: "Talent Orchestration Hub", desc: "Map, measure, and bridge organizational skill gaps using autonomous talent identification and grading synthesis.", action: "Run Analysis", elite: "Elite Cluster", benchmark: "Role Benchmark" },
    ka: { title: "კომპეტენციების მატრიცა", sub: "ტალანტის მართვის ჰაბი", desc: "მოახდინეთ ორგანიზაციული უნარების დეფიციტის რუკირება, გაზომვა და შევსება ავტონომიური ტალანტის იდენტიფიკაციით.", action: "ანალიზის დაწყება", elite: "ელიტარული კლასტერი", benchmark: "როლის ბენჩმარკი" }
  }[lang];

  const mockSkills = [
    { name: 'Route Optimization AI', level: 85, category: 'Technical' },
    { name: 'Fleet Telemetry Analysis', level: 70, category: 'Technical' },
    { name: 'Crisis Orchestration', level: 45, category: 'Soft' },
    { name: 'Multi-Hub Finance', level: 60, category: 'Business' },
  ];

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    setGapData(null);
    try {
      const result = await gemini.analyzeSkillGaps(
        { nameEn: 'Alex Rivera', skills: mockSkills },
        { title: selectedRole, requirements: ['Advanced Logistics Routing', 'Fleet Economics', 'Stakeholder Orchestration'] },
        lang
      );
      setGapData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-16 pb-40 fade-in">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 pt-6">
        <div className="animate-in slide-in-from-left-12 duration-1000">
          <div className="flex items-center gap-8 mb-10">
             <div className="h-px w-24 bg-indigo-500 shadow-glow shadow-indigo-500/50"></div>
             <span className="text-micro text-indigo-400 uppercase tracking-[0.7em] font-black">{t.sub}</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none uppercase">
            {t.title.split(' ')[0]}<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-400">{t.title.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-slate-500 mt-12 text-xl font-medium max-w-4xl leading-relaxed opacity-80 uppercase tracking-tight">
            {t.desc}
          </p>
        </div>
        <button 
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="h-28 px-16 bg-indigo-600 text-white rounded-[3.5rem] text-sm font-black flex items-center gap-10 hover:bg-indigo-500 shadow-glow shadow-indigo-600/30 transition-all duration-500 disabled:opacity-30 active:scale-95 group relative overflow-hidden border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          {analyzing ? <RefreshCw className="animate-spin" size={32} /> : <Microscope size={32} className="group-hover:scale-110 transition-transform" />}
          <div className="text-left relative z-10">
            <div className="text-xl uppercase tracking-widest leading-tight">{t.action}</div>
            <div className="text-micro opacity-60 uppercase mt-1">Inference Budget: High</div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
        <div className="xl:col-span-2 space-y-16 animate-in slide-in-from-bottom-12 duration-1200">
          <div className="glass border-white/5 rounded-[5rem] overflow-hidden shadow-3xl bg-[#02020a]/40 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(99,102,241,0.08),transparent_70%)] opacity-50"></div>
            <div className="p-16 border-b border-white/5 flex items-center justify-between bg-white/[0.02] relative z-10">
              <div className="flex items-center gap-10">
                 <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner"><Layers size={28} /></div>
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Entity Proficiency Profile</h3>
              </div>
            </div>
            
            <div className="p-16 relative z-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                 {mockSkills.map((skill, idx) => (
                   <div key={idx} className="space-y-8 p-10 bg-white/[0.01] rounded-[4rem] border border-white/5 group hover:border-indigo-500/40 transition-all duration-700 shadow-inner relative overflow-hidden">
                     <div className="flex justify-between items-center relative z-10">
                       <div className="flex flex-col gap-4">
                         <span className="text-xl font-black text-slate-200 group-hover:text-white transition-colors uppercase tracking-tighter leading-none">{skill.name}</span>
                         <span className="text-[10px] font-black text-indigo-500 bg-indigo-500/10 w-fit px-5 py-2 rounded-xl uppercase tracking-[0.4em] border border-indigo-500/20">{skill.category}</span>
                       </div>
                       <div className="text-4xl font-black text-white drop-shadow-glow font-mono">{skill.level}%</div>
                     </div>
                     <div className="h-4 bg-black/70 rounded-full overflow-hidden p-1 shadow-inner border border-white/5 relative z-10">
                       <div 
                         className="h-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-cyan-400 rounded-full transition-all duration-1500 shadow-glow shadow-indigo-500/60"
                         style={{ width: `${skill.level}%` }}
                       ></div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {gapData && (
            <div className="bg-gradient-to-br from-indigo-900 via-[#010105] to-[#0a0a25] rounded-[5rem] p-16 text-white border border-white/10 shadow-3xl animate-in zoom-in-95 slide-in-from-bottom-24 duration-1000 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-24 opacity-[0.05] scale-150 rotate-12 -z-0"><Award size={400} /></div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center gap-14 mb-16">
                   <div className="w-32 h-32 bg-indigo-500/20 rounded-[4rem] flex items-center justify-center backdrop-blur-3xl border border-white/10 shadow-[0_0_60px_rgba(99,102,241,0.3)] relative group">
                     <div className="absolute inset-0 bg-indigo-500/20 animate-pulse rounded-[4rem]"></div>
                     <div className="text-6xl font-black text-white drop-shadow-glow relative z-10 font-mono">{Math.round(gapData.readiness_score * 100)}%</div>
                   </div>
                   <div>
                     <h3 className="text-4xl font-black tracking-tighter mb-4 uppercase leading-none">Cognitive Readiness Synthesis</h3>
                     <p className="text-indigo-300 text-xl font-medium opacity-80 leading-relaxed max-w-2xl">Target Role Integration: <span className="text-white underline decoration-fuchsia-500 underline-offset-8 font-black decoration-4">{selectedRole}</span>.</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {gapData.gaps.map((gap: any, i: number) => (
                    <div key={i} className="bg-black/50 border border-white/5 p-12 rounded-[4.5rem] shadow-inner group hover:bg-black/70 transition-all duration-700">
                      <div className="flex justify-between items-start mb-8">
                        <div className="flex flex-col gap-3">
                          <span className="text-xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-fuchsia-400 transition-colors">{gap.skill}</span>
                          <span className="text-micro text-slate-600 font-black tracking-[0.4em]">Target: {gap.target}%</span>
                        </div>
                        <div className={`px-6 py-2 rounded-2xl text-[10px] font-black tracking-[0.5em] uppercase border ${gap.priority === 'High' ? 'bg-rose-500/10 text-rose-300 border-rose-500/20 shadow-glow shadow-rose-500/10' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'}`}>
                          {gap.priority}
                        </div>
                      </div>
                      <p className="text-lg text-slate-400 mb-10 font-medium leading-relaxed uppercase tracking-tight opacity-80">{gap.recommendation}</p>
                      <button className="flex items-center gap-4 text-micro font-black text-indigo-400 hover:text-white transition-all uppercase tracking-[0.4em] group-hover:gap-6">
                        Access Learning Protocol <ArrowRight size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-16 animate-in slide-in-from-right-12 duration-1200">
          <div className="glass border-white/5 p-12 rounded-[4.5rem] shadow-3xl bg-[#02020a]/60 relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
             <h3 className="text-2xl font-black text-white mb-10 tracking-tighter uppercase leading-none border-b border-white/5 pb-8 flex items-center gap-6"><FileText className="text-indigo-400" size={28} /> {t.benchmark}</h3>
             <div className="space-y-4">
               {['Engineering Lead', 'Senior Product Designer', 'Data Architect', 'Logistics Strategist'].map((role) => (
                 <button 
                   key={role}
                   onClick={() => setSelectedRole(role)}
                   className={`w-full flex items-center justify-between p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${
                     selectedRole === role 
                      ? 'border-indigo-600 bg-indigo-600/15 text-white shadow-glow shadow-indigo-600/30' 
                      : 'border-white/5 bg-black/50 text-slate-600 hover:border-white/20 hover:text-slate-200'
                   }`}
                 >
                   <span className="text-lg font-black tracking-tight uppercase">{role}</span>
                   <ChevronRight size={24} className={selectedRole === role ? 'text-indigo-400' : 'text-slate-800'} />
                 </button>
               ))}
             </div>
          </div>

          <div className="glass border-white/5 p-12 rounded-[4.5rem] shadow-3xl bg-[#02020a]/60 overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:rotate-45 transition-transform duration-1000 pointer-events-none"><Award size={180} /></div>
             <h3 className="text-2xl font-black text-white mb-10 tracking-tighter uppercase leading-none border-b border-white/5 pb-8 flex items-center gap-6"><Award className="text-fuchsia-400" size={28} /> {t.elite}</h3>
             <div className="space-y-10">
               {[
                 { name: 'Nino Keshelava', role: 'Architect', score: 99, color: 'from-fuchsia-600 to-indigo-600' },
                 { name: 'Alex Rivera', role: 'Strategist', score: 96, color: 'from-cyan-600 to-indigo-600' },
               ].map((talent, i) => (
                 <div key={i} className="flex items-center justify-between group/item cursor-pointer hover:bg-white/[0.02] transition-all p-5 rounded-[2.5rem] -mx-5 border border-transparent hover:border-white/5">
                   <div className="flex items-center gap-6">
                     <div className={`w-16 h-16 rounded-[1.8rem] bg-gradient-to-br ${talent.color} flex items-center justify-center font-black text-xl text-white shadow-2xl border border-white/20 group-hover/item:scale-110 transition-transform duration-700`}>
                       {talent.name.split(' ').map(n => n[0]).join('')}
                     </div>
                     <div>
                       <div className="text-xl font-black text-slate-200 group-hover/item:text-indigo-400 transition-colors uppercase leading-none mb-2">{talent.name}</div>
                       <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {talent.role}
                       </div>
                     </div>
                   </div>
                   <div className="text-3xl font-black text-white drop-shadow-glow font-mono">{talent.score}</div>
                 </div>
               ))}
             </div>
             <button className="w-full mt-10 py-6 glass-dark border-white/10 text-fuchsia-400 rounded-3xl text-micro font-black uppercase tracking-[0.5em] hover:bg-fuchsia-600 hover:text-white transition-all shadow-xl">Audit Elite Cluster</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentPage;
