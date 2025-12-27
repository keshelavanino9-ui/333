
import React, { useState, useEffect, useContext } from 'react';
import { 
  Activity, BrainCircuit, Zap, ShieldAlert, RefreshCw, 
  ShieldCheck, AlertCircle, Sparkles, Briefcase, Wallet, Microscope, ArrowUpRight
} from 'lucide-react';
import { LanguageContext, CompanyContext } from '../App';
import { gemini } from '../services/geminiService';
import { ActionCard as IActionCard } from '../types';
import ActionCard from '../components/ai/ActionCard';
import N8NVisualizer from '../components/ai/N8NVisualizer';
import DebtPlanner from '../components/finance/DebtPlanner';

const Dashboard: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const companyCtx = useContext(CompanyContext);
  const [loading, setLoading] = useState(true);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [workflowLogs, setWorkflowLogs] = useState<string[]>([]);
  const [actions, setActions] = useState<IActionCard[]>([]);
  const [isDebtPlannerOpen, setIsDebtPlannerOpen] = useState(false);

  const t = {
    en: {
      title: "NYX CORE", subtitle: companyCtx?.currentCompany.nameEn || "Logistics IQ",
      telemetry: "Operational Pulse", actions: "Autonomous Moves",
      analysis: "Strategic Gap Analysis"
    },
    ka: {
      title: "NYX CORE", subtitle: companyCtx?.currentCompany.nameKa || "ინტელექტი",
      telemetry: "ტელემეტრია", actions: "სტრატეგიული სვლები",
      analysis: "სტრატეგიული ხარვეზები"
    }
  }[lang];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setWorkflowLogs([]);
    await gemini.simulateAdvancedWorkflow((step) => {
      setActiveNode(step.id);
      setWorkflowLogs(prev => [step.msg, ...prev]);
    });
    setIsSyncing(false);
    setActiveNode(null);
  };

  const runAudit = async () => {
    setIsAuditing(true);
    try {
      const result = await gemini.runAutonomousAudit(lang);
      if (result && Array.isArray(result.actions)) {
        setActions(prev => [...result.actions, ...prev]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#020205] gap-8">
      <BrainCircuit className="text-cyan-400 animate-pulse" size={64} />
      <div className="text-micro text-slate-600 tracking-[1em] animate-pulse">Initializing Neural Core</div>
    </div>
  );

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-1000 relative">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-4">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-[11px] font-black uppercase border border-indigo-500/20 flex items-center gap-3">
              <Activity size={14} className="animate-pulse" /> {t.telemetry}
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[11px] font-black uppercase border border-emerald-500/20 tracking-widest">
              SYSTEM STATUS: OPTIMAL
            </span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none uppercase flex items-center gap-6">
            {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">3.5</span>
          </h1>
          <p className="text-slate-500 mt-3 text-xl font-medium tracking-tight opacity-60 uppercase">{t.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={runAudit}
            disabled={isAuditing}
            className="h-16 w-16 glass rounded-[1.8rem] flex items-center justify-center text-fuchsia-400 hover:text-white hover:bg-fuchsia-600 transition-all border-fuchsia-500/10 active:scale-95 disabled:opacity-50"
          >
            <ShieldAlert size={28} className={isAuditing ? 'animate-spin' : ''} />
          </button>
          
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="h-16 px-10 bg-indigo-600 text-white rounded-[1.8rem] flex items-center gap-5 transition-all shadow-2xl shadow-indigo-600/30 hover:bg-indigo-500 active:scale-95 group"
          >
            <RefreshCw size={20} className={isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'} />
            <div className="text-left">
              <div className="text-[13px] font-black uppercase tracking-[0.2em] leading-none">Sync System</div>
              <div className="text-[10px] opacity-60 uppercase font-black mt-1.5 tracking-widest">Neural Handshake Protocol</div>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
        {[
          { label: 'Asset Vacancies', val: '24 Roles', icon: Briefcase, color: 'text-fuchsia-400', trend: '+12%', bg: 'bg-fuchsia-500/5' },
          { label: 'Fiscal Variance', val: '-2.8%', icon: Wallet, color: 'text-emerald-400', trend: 'Stable', bg: 'bg-emerald-500/5' },
          { label: 'Integrity Index', val: '98.5%', icon: ShieldCheck, color: 'text-cyan-400', trend: '+0.4%', bg: 'bg-cyan-500/5' },
          { label: 'Production Yield', val: '$12.4K', icon: Zap, color: 'text-indigo-400', trend: '+1.8%', bg: 'bg-indigo-500/5' }
        ].map((m, i) => (
          <div key={i} className={`glass p-10 rounded-[3.5rem] border-white/5 relative overflow-hidden group hover:border-white/10 hover:shadow-2xl transition-all ${m.bg}`}>
            <m.icon className={`absolute -right-8 -bottom-8 size-40 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-1000 ${m.color}`} />
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${m.color} shadow-inner group-hover:scale-110 transition-transform`}><m.icon size={24} /></div>
              <div className="text-[12px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 group-hover:text-white transition-colors">
                {m.trend} <ArrowUpRight size={12} className="text-emerald-500" />
              </div>
            </div>
            <div className="text-4xl font-black text-white tracking-tighter mb-2 uppercase relative z-10 group-hover:translate-x-1 transition-transform">{m.val}</div>
            <div className="text-[11px] text-slate-500 font-black uppercase tracking-[0.4em] relative z-10">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
           <N8NVisualizer activeNodeId={activeNode} logs={workflowLogs} />
           
           <div className="glass p-14 rounded-[4rem] border-white/5 bg-gradient-to-br from-indigo-500/[0.03] to-transparent relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:opacity-[0.05] group-hover:rotate-12 transition-all duration-1000"><Microscope size={180} /></div>
              <h3 className="text-2xl font-black text-white mb-12 uppercase flex items-center gap-8 tracking-tighter">
                 <Microscope className="text-indigo-400" size={32} /> {t.analysis}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="p-10 bg-black/50 rounded-[2.5rem] border border-white/5 space-y-5 shadow-2xl group hover:border-indigo-500/30 transition-all">
                    <div className="text-[12px] text-slate-500 uppercase tracking-[0.5em] font-black flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-glow shadow-rose-500"></div> System Drift
                    </div>
                    <div className="text-2xl font-black text-white uppercase tracking-tighter">-$42.1k Delta Identified</div>
                    <p className="text-sm text-slate-500 leading-relaxed uppercase tracking-widest font-bold opacity-70">Friction detected in East Hub logistics chain. Neural reallocation protocol suggested.</p>
                 </div>
                 <div className="p-10 bg-black/50 rounded-[2.5rem] border border-white/5 space-y-5 shadow-2xl group hover:border-cyan-500/30 transition-all">
                    <div className="text-[12px] text-slate-500 uppercase tracking-[0.5em] font-black flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-glow shadow-cyan-500"></div> Asset Growth
                    </div>
                    <div className="text-2xl font-black text-cyan-400 uppercase tracking-tighter">+12.5% Yield gain</div>
                    <p className="text-sm text-slate-500 leading-relaxed uppercase tracking-widest font-bold opacity-70">Fleet electrification has reached critical mass in Southern regional sectors.</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-10">
           <div className="flex items-center justify-between px-6">
              <h3 className="text-xl font-black text-white flex items-center gap-4 uppercase tracking-widest">
                <Sparkles className="text-fuchsia-500" size={24} /> {t.actions}
              </h3>
              <div className="text-[12px] font-black text-slate-700 uppercase tracking-[0.4em] bg-white/5 px-4 py-2 rounded-xl border border-white/5">{actions.length} Task Nodes</div>
           </div>
           
           <div className="space-y-8 max-h-[1000px] overflow-y-auto pr-2 custom-scrollbar">
             {actions.length > 0 ? actions.map((act) => (
               <ActionCard 
                 key={act.id} 
                 card={act} 
                 onAccept={(id) => setActions(prev => prev.map(a => a.id === id ? {...a, status: 'ACCEPTED'} : a))} 
                 onDecline={(id) => setActions(prev => prev.filter(a => a.id !== id))} 
               />
             )) : (
               <div className="glass p-20 rounded-[4rem] text-center border-white/5 flex flex-col items-center opacity-30 shadow-2xl bg-black/20">
                  <AlertCircle className="text-slate-800 mb-10" size={80} />
                  <p className="text-micro font-black text-slate-700 tracking-[0.8em]">Inference Standby</p>
                  <button onClick={runAudit} className="mt-12 text-[11px] font-black text-indigo-400 hover:text-white transition-all uppercase tracking-[0.5em] underline decoration-2 underline-offset-8">Trigger Autonomous Scan</button>
               </div>
             )}
           </div>
        </div>
      </div>

      <button 
        onClick={() => setIsDebtPlannerOpen(true)}
        className="fixed bottom-36 right-12 z-[90] h-20 px-10 glass border-indigo-500/40 rounded-[2.5rem] flex items-center gap-6 text-indigo-400 hover:text-white hover:bg-indigo-600 transition-all shadow-[0_40px_100px_-10px_rgba(99,102,241,0.3)] active:scale-95 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Wallet size={28} className="group-hover:rotate-12 transition-transform relative z-10" />
        <span className="text-[12px] font-black uppercase tracking-[0.5em] relative z-10">Debt reduction Planner</span>
      </button>

      {isDebtPlannerOpen && <DebtPlanner onClose={() => setIsDebtPlannerOpen(false)} />}
    </div>
  );
};

export default Dashboard;