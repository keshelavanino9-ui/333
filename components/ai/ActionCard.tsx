
import React, { useContext, useState } from 'react';
import { Sparkles, ExternalLink, CheckCircle, XCircle, Workflow, Terminal, Activity, Zap, RefreshCw, BarChart4 } from 'lucide-react';
import { ActionCard as IActionCard } from '../../types';
import { LanguageContext } from '../../App';
import { gemini } from '../../services/geminiService';

interface Props {
  card: IActionCard;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

const ActionCard: React.FC<Props> = ({ card, onAccept, onDecline }) => {
  const { lang } = useContext(LanguageContext);
  const [isPushing, setIsPushing] = useState(false);
  const [currentStep, setCurrentStep] = useState('');

  const handleN8NPush = async () => {
    setIsPushing(true);
    try {
      await gemini.executeN8NWorkflow('hr_action_approval', card, (step) => setCurrentStep(step));
      onAccept(card.id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPushing(false);
      setCurrentStep('');
    }
  };

  const getPriorityColor = () => {
    switch (card.priority) {
      case 'high': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <div className={`
      relative glass border-white/5 rounded-[3.5rem] overflow-hidden transition-all duration-700
      ${card.status === 'ACCEPTED' ? 'opacity-40 grayscale scale-[0.98]' : 'hover:shadow-[0_32px_128px_-12px_rgba(0,0,0,0.8)] hover:border-indigo-500/30'}
      group bg-[#050510]/40
    `}>
      {isPushing && (
        <div className="absolute inset-0 z-20 bg-[#050510]/95 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
          <div className="relative mb-8">
            <Workflow className="text-indigo-400 animate-spin-slow" size={64} />
            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl animate-pulse"></div>
          </div>
          <div className="text-white font-black text-xl uppercase tracking-[0.4em] mb-4">Pipeline Executing</div>
          <div className="bg-black/60 p-6 rounded-2xl border border-white/10 w-full max-w-sm flex items-center gap-4">
            <Terminal size={18} className="text-indigo-400" />
            <div className="text-indigo-300 font-mono text-sm truncate uppercase tracking-widest">{currentStep}</div>
          </div>
        </div>
      )}

      <div className="p-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
           <Zap size={200} className="text-white" />
        </div>

        <div className="flex items-start justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 shadow-inner"><Sparkles size={24} /></div>
            <span className={`text-[12px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border ${getPriorityColor()}`}>
              {card.priority} Priority
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Activity size={18} className="text-emerald-500" />
            <span className="text-[12px] font-black text-slate-600 uppercase tracking-widest">{Math.round(card.confidence * 100)}% Match</span>
          </div>
        </div>

        <h3 className="font-black text-white mb-4 text-2xl tracking-tighter uppercase relative z-10 group-hover:text-indigo-400 transition-colors">
          {lang === 'en' ? card.titleEn : card.titleKa}
        </h3>
        <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium relative z-10 max-w-sm">
          {lang === 'en' ? card.descriptionEn : card.descriptionKa}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
           <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-1">
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Impact Score</span>
              <span className="text-2xl font-black text-white">{card.impactScore}/100</span>
           </div>
           <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-1">
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Entity Confidence</span>
              <span className="text-2xl font-black text-emerald-400">High</span>
           </div>
        </div>

        <div className="flex items-center gap-4 pt-10 border-t border-white/5 relative z-10">
          <button 
            onClick={() => onAccept(card.id)}
            disabled={card.status !== 'PENDING' || isPushing}
            className="flex-1 flex items-center justify-center gap-3 bg-indigo-600 text-white py-5 rounded-[2rem] text-[13px] font-black uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all shadow-glow shadow-indigo-600/20 disabled:opacity-20 active:scale-95"
          >
            <CheckCircle size={20} />
            {lang === 'en' ? 'Approve' : 'დადასტურება'}
          </button>
          
          <button 
            onClick={handleN8NPush}
            disabled={card.status !== 'PENDING' || isPushing}
            className="h-16 w-16 glass border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400 hover:text-white hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-20 group/btn"
            title="Trigger N8N Automation"
          >
            <Workflow size={24} className="group-hover/btn:rotate-12 transition-transform" />
          </button>

          <button 
            onClick={() => onDecline(card.id)}
            disabled={card.status !== 'PENDING' || isPushing}
            className="h-16 w-16 glass border-white/5 rounded-full flex items-center justify-center text-slate-800 hover:text-rose-500 hover:border-rose-500/30 transition-all disabled:opacity-20"
          >
            <XCircle size={24} />
          </button>
        </div>
      </div>
      
      {card.status === 'ACCEPTED' && (
        <div className="absolute inset-0 bg-[#050510]/60 flex items-center justify-center pointer-events-none backdrop-blur-[2px] animate-in fade-in duration-500">
          <div className="bg-emerald-600 text-white px-8 py-3 rounded-full text-sm font-black uppercase tracking-[0.5em] transform rotate-3 shadow-[0_0_50px_rgba(16,185,129,0.5)] border-2 border-emerald-400">
            SYNCED TO KNOWLEDGE GRAPH
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionCard;