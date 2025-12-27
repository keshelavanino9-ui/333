import React, { useState, useContext, useEffect } from 'react';
import { 
  Cpu, Save, RefreshCw, Sliders, Zap, ShieldCheck, Activity, 
  BrainCircuit, Sparkles, Network, Fingerprint, Info, History,
  Microscope, Database, Landmark, Gauge
} from 'lucide-react';
import { LanguageContext, TuningContext } from '../App';

const BrainTuningPage: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const tuningCtx = useContext(TuningContext);
  
  const [localConfig, setLocalConfig] = useState(tuningCtx?.config || {
    reasoningDepth: 85,
    creativity: 40,
    strictness: 92,
    ethicalGuardrails: true
  });
  
  const [saving, setSaving] = useState(false);
  const [learningLog, setLearningLog] = useState<string[]>([]);

  const t = {
    en: { 
      title: "Neural Calibration", 
      sub: "Self-Learning Lab V3.6", 
      save: "Sync Synapses",
      desc: "Fine-tune the cognitive weight matrices of the Nyx Inference engine. Changes directly influence reasoning budget and logical constraints.",
      parameters: "Cognitive Parameters",
      impact: "Neuro-Index Projection",
      logs: "Synaptic Feedback Loop",
      labels: ["Reasoning Depth", "Creativity Quotient", "Constraint Strictness"]
    },
    ka: { 
      title: "ნეირალური კალიბრაცია", 
      sub: "თვით-სწავლის ლაბორატორია V3.6", 
      save: "სინაფსების სინქრონიზაცია",
      desc: "მოახდინეთ Nyx-ის შემეცნებითი წონების მატრიცების კალიბრაცია. ცვლილებები პირდაპირ აისახება აზროვნების ბიუჯეტზე.",
      parameters: "კოგნიტური პარამეტრები",
      impact: "ნეირო-ინდექსის პროექცია",
      logs: "სინაფსური უკუკავშირი",
      labels: ["აზროვნების სიღრმე", "კრეატიულობის კოეფიციენტი", "შეზღუდვების სიმკაცრე"]
    }
  }[lang];

  useEffect(() => {
    const mockLogs = [
      "Optimizing synaptic pruning for Q4 fiscal load...",
      "Re-weighting logical deduction gates...",
      "Normalizing cross-entity inference clusters...",
      "Reinforcing compliance guardrails @ 99.98%."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLearningLog(prev => [mockLogs[i % mockLogs.length], ...prev.slice(0, 12)]);
      i++;
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = () => {
    setSaving(true);
    setLearningLog(prev => ["Applying new neural weights to master cluster...", ...prev]);
    setTimeout(() => {
      tuningCtx?.setConfig(localConfig);
      setSaving(false);
      setLearningLog(prev => ["Master cluster synchronization complete. Core optimized.", ...prev]);
    }, 2500);
  };

  const neuralIndex = (localConfig.reasoningDepth * 0.65 + localConfig.strictness * 0.25 + localConfig.creativity * 0.1).toFixed(1);

  return (
    <div className="space-y-16 pb-40 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pt-6">
        <div>
          <div className="flex items-center gap-6 mb-10">
             <div className="h-px w-20 bg-fuchsia-500 shadow-glow"></div>
             <span className="text-micro text-fuchsia-400 font-black uppercase tracking-[0.7em]">{t.sub}</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none uppercase">
            Brain <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-indigo-400 to-cyan-400">Tuning</span>
          </h1>
          <p className="text-slate-500 mt-8 text-xl font-medium max-w-4xl leading-relaxed opacity-70 uppercase tracking-tight">
            {t.desc}
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="h-24 px-12 bg-indigo-600 text-white rounded-[3rem] font-black uppercase text-[12px] tracking-[0.4em] flex items-center gap-6 hover:bg-indigo-500 transition-all shadow-glow shadow-indigo-600/30 disabled:opacity-50 border border-white/10 group"
        >
          {saving ? <RefreshCw className="animate-spin" size={24} /> : <Save size={24} className="group-hover:scale-110 transition-transform" />}
          {saving ? 'Synchronizing...' : t.save}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-1 glass p-14 rounded-[5rem] border-white/5 space-y-16 bg-black/40 shadow-3xl">
          <h3 className="text-2xl font-black text-white uppercase flex items-center gap-8 tracking-tighter border-b border-white/5 pb-10">
            <Sliders className="text-indigo-400" size={32} /> {t.parameters}
          </h3>

          <div className="space-y-12">
             {[
               { label: t.labels[0], val: localConfig.reasoningDepth, key: 'reasoningDepth', color: 'accent-indigo-500', icon: <Microscope size={18} /> },
               { label: t.labels[1], val: localConfig.creativity, key: 'creativity', color: 'accent-fuchsia-500', icon: <Zap size={18} /> },
               { label: t.labels[2], val: localConfig.strictness, key: 'strictness', color: 'accent-cyan-500', icon: <ShieldCheck size={18} /> }
             ].map(p => (
               <div key={p.key} className="space-y-8">
                  <div className="flex justify-between items-end text-[12px] font-black uppercase text-slate-300 tracking-widest leading-none">
                    <span className="flex items-center gap-5">{p.icon} {p.label}</span>
                    <span className="text-2xl font-black text-white font-mono">{p.val}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" 
                    value={p.val} 
                    onChange={e => setLocalConfig({...localConfig, [p.key as any]: parseInt(e.target.value)})}
                    className={`w-full h-2 bg-black/80 rounded-full appearance-none cursor-pointer ${p.color} shadow-inner border border-white/5`} 
                  />
               </div>
             ))}
             
             <div className="pt-10 border-t border-white/5 space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-5">
                      <BrainCircuit size={20} className="text-emerald-400" />
                      <span className="text-[12px] font-black uppercase text-slate-300 tracking-widest">Autonomous Loops</span>
                   </div>
                   <div className="w-16 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center p-1 cursor-pointer">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full shadow-glow"></div>
                   </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest leading-relaxed">Neural Core will autonomously refine weights based on successful execution patterns.</p>
             </div>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-12">
           <div className="glass p-14 rounded-[5rem] border-white/5 bg-black/40 shadow-3xl relative overflow-hidden flex flex-col min-h-[500px]">
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                 <Network size={600} className="absolute -right-40 -bottom-40 text-indigo-400 rotate-12" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase mb-16 flex items-center gap-8 tracking-tighter relative z-10">
                 <Activity size={32} className="text-fuchsia-400" /> {t.impact}
              </h3>
              <div className="flex-1 flex flex-col md:flex-row items-center gap-16 relative z-10">
                 <div className="w-64 h-64 rounded-full border-8 border-indigo-500/20 flex flex-col items-center justify-center relative bg-indigo-500/5 group">
                    <div className="absolute inset-0 bg-indigo-500/5 rounded-full animate-ping opacity-20"></div>
                    <div className="text-7xl font-black text-white tracking-tighter drop-shadow-glow font-mono">{neuralIndex}</div>
                    <div className="text-micro text-slate-700 font-black uppercase tracking-[0.5em] mt-3">Neuro-Index</div>
                 </div>
                 <div className="flex-1 grid grid-cols-2 gap-8 w-full">
                    {[
                      { label: "Synaptic Throughput", val: '1.42 GB/s', icon: <Database /> },
                      { label: "Decision Precision", val: '99.98%', icon: <Fingerprint /> },
                      { label: "Inference Entropy", val: '0.012 Δ', icon: <Zap /> },
                      { label: "Fiscal Consensus", val: 'High-P', icon: <Landmark /> }
                    ].map((m, i) => (
                      <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-4 group hover:bg-white/[0.04] transition-all">
                         <div className="flex items-center gap-4 text-slate-600 group-hover:text-indigo-400 transition-colors text-[10px] font-black uppercase tracking-widest">
                            {React.cloneElement(m.icon as any, { size: 18 })} {m.label}
                         </div>
                         <div className="text-2xl font-black text-white font-mono">{m.val}</div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="glass p-12 rounded-[4rem] border-white/5 bg-[#02020a]/80 shadow-3xl overflow-hidden h-[320px] flex flex-col">
              <h3 className="text-sm font-black text-white uppercase flex items-center gap-6 tracking-widest mb-8 border-b border-white/5 pb-8">
                <History className="text-cyan-400" size={24} /> {t.logs}
              </h3>
              <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar font-mono text-sm">
                 {learningLog.map((log, i) => (
                   <div key={i} className={`flex gap-8 animate-in slide-in-from-left-4 fade-in duration-500 ${i === 0 ? 'text-cyan-400 shadow-glow' : 'text-slate-700'}`}>
                      <span className="font-black shrink-0">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                      <span className="font-bold tracking-tight uppercase">{log}</span>
                   </div>
                 ))}
                 {learningLog.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center opacity-30 text-center gap-8">
                      <Sparkles size={48} className="text-slate-800" />
                      <p className="text-micro font-black text-slate-700 uppercase tracking-[0.8em]">Awaiting Synaptic Activity...</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BrainTuningPage;