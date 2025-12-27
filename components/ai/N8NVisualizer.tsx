import React, { useContext } from 'react';
import { 
  Workflow, Database, Cpu, Zap, Terminal, Search, Mail, ShieldCheck,
  Activity, CheckCircle2, ShieldAlert, RotateCw, RefreshCw, Layers,
  ChevronRight, Circle
} from 'lucide-react';
import { LanguageContext } from '../../App';

interface Props {
  activeNodeId?: string | null;
  logs: string[];
}

const N8NVisualizer: React.FC<Props> = ({ activeNodeId, logs }) => {
  const { lang } = useContext(LanguageContext);

  const t = {
    en: {
      title: "Neural Production Pipeline",
      healing: "Self-Healing Grid",
      active: "Kernel Ready",
      console: "COMMAND_STREAM",
      standby: "Neural Matrix Standby // Awaiting Signal Handshake",
      phases: ["Trigger", "Ingestion", "Inference", "Commit"],
      nodePrefix: "NODE",
      exec: "EXEC"
    },
    ka: {
      title: "ნეირალური წარმოების ხაზი",
      healing: "თვით-აღდგენადი ბადე",
      active: "ბირთვი მზად არის",
      console: "ბრძანებების_ნაკადი",
      standby: "მატრიცა მოლოდინის რეჟიმში // სიგნალის ძიება",
      phases: ["ტრიგერი", "შეგროვება", "ინფერენცია", "შესრულება"],
      nodePrefix: "კვანძი",
      exec: "შესრულება"
    }
  }[lang];

  const phases = [
    {
      title: t.phases[0],
      nodes: [
        { id: "manual-trigger", name: lang === 'en' ? "Webhook" : "ვებჰუკი", icon: <Zap /> },
        { id: "circuit-breaker", name: lang === 'en' ? "Gate Guard" : "დაცვის კარი", icon: <ShieldAlert /> }
      ]
    },
    {
      title: t.phases[1],
      nodes: [
        { id: "data-ingestion", name: lang === 'en' ? "Data Ingest" : "მონაცემთა მიღება", icon: <Database /> },
        { id: "data-validator", name: lang === 'en' ? "Quality Gate" : "ხარისხის კონტროლი", icon: <CheckCircle2 /> }
      ]
    },
    {
      title: t.phases[2],
      nodes: [
        { id: "ai-planner", name: lang === 'en' ? "Nyx Planner" : "Nyx დაგეგმარება", icon: <Cpu /> },
        { id: "qa-validator", name: lang === 'en' ? "Audit Node" : "აუდიტის კვანძი", icon: <Activity /> }
      ]
    },
    {
      title: t.phases[3],
      nodes: [
        { id: "final-notify", name: lang === 'en' ? "State Commit" : "მდგომარეობის შენახვა", icon: <Mail /> }
      ]
    }
  ];

  return (
    <div className="bg-[#050510]/80 backdrop-blur-3xl rounded-[4rem] border border-white/5 p-12 shadow-3xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,212,255,0.05),transparent_70%)] opacity-50"></div>
      
      <div className="flex items-center justify-between mb-16 relative z-10">
         <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-6">
               <Workflow className="text-cyan-400" size={28} /> {t.title} <span className="text-slate-700">::</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 uppercase">{t.healing}</span>
            </h2>
         </div>
         <div className="flex gap-4">
            <div className="px-6 py-3 glass rounded-2xl border-emerald-500/20 flex items-center gap-4">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-glow shadow-emerald-500"></div>
               <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">{t.active}</span>
            </div>
         </div>
      </div>

      <div className="flex justify-between items-start relative z-10 mb-16 gap-8">
        {phases.map((phase, idx) => (
          <div key={idx} className="flex-1 space-y-10 relative">
            <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] text-center border-b border-white/5 pb-6 mb-4">{phase.title}</div>
            
            <div className="space-y-6 relative">
              {phase.nodes.map(node => {
                const isActive = activeNodeId === node.id;
                return (
                  <div 
                    key={node.id} 
                    className={`
                      p-6 rounded-[2.5rem] border-2 transition-all duration-700 flex flex-col items-center gap-4 relative overflow-hidden
                      ${isActive 
                        ? 'border-cyan-400 bg-cyan-400/10 shadow-glow scale-105 z-20' 
                        : 'border-white/5 bg-white/[0.02] opacity-40 hover:opacity-100'}
                    `}
                  >
                    <div className={`p-4 rounded-2xl ${isActive ? 'bg-cyan-500 text-white shadow-glow' : 'bg-slate-900 text-slate-600'}`}>
                      {React.cloneElement(node.icon as any, { size: 24 })}
                    </div>
                    <div className="text-center relative z-10">
                      <div className={`text-[12px] font-black tracking-tight uppercase ${isActive ? 'text-white' : 'text-slate-500'}`}>{node.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="absolute inset-0 pointer-events-none opacity-20 -z-10 overflow-visible">
          <svg className="w-full h-full" preserveAspectRatio="none">
             {activeNodeId && (
               <path d="M 0,200 Q 400,100 800,200" fill="none" stroke="#00e5ff" strokeWidth="2" className="animate-flow" />
             )}
          </svg>
        </div>
      </div>

      <div className="bg-black/60 rounded-[3.5rem] p-10 border border-white/10 font-mono text-[11px] relative overflow-hidden shadow-inner group/console">
        <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-6">
          <Terminal size={20} className="text-cyan-500" />
          <span className="font-black tracking-[0.5em] uppercase text-slate-500">{t.console}</span>
        </div>
        
        <div className="space-y-3 h-48 overflow-y-auto custom-scrollbar">
          {logs.length > 0 ? logs.map((log, i) => (
            <div key={i} className="flex gap-6 animate-in slide-in-from-left-4 fade-in duration-500 group/line items-start">
              <span className="text-slate-800 shrink-0 font-black mono opacity-40">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
              <span className="text-cyan-900 font-black tracking-widest shrink-0 uppercase mono">{t.exec}</span>
              <span className="text-slate-400 leading-relaxed font-bold group-hover/line:text-white transition-colors uppercase">{log}</span>
            </div>
          )) : (
            <div className="flex flex-col items-center gap-8 text-slate-800 h-full justify-center opacity-30">
              <Activity size={48} className="animate-pulse" />
              <div className="text-[12px] font-black tracking-[0.8em] uppercase italic text-center">{t.standby}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default N8NVisualizer;