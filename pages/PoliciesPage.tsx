
import React, { useState, useContext } from 'react';
import { Search, FileText, ShieldCheck, HelpCircle, ExternalLink, RefreshCw, Terminal, Globe } from 'lucide-react';
import { gemini } from '../services/geminiService';
import { LanguageContext } from '../App';

const PoliciesPage: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [answer, setAnswer] = useState<any>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const result = await gemini.queryPolicy(query, lang);
      setAnswer(result);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const policies = [
    { title: 'Code of Conduct V4', category: 'Ethics', date: 'Oct 2023', status: 'Compliant' },
    { title: 'Remote Work Protocol', category: 'Ops', date: 'Jan 2024', status: 'Reviewing' },
    { title: 'Equitable Comp Policy', category: 'Finance', date: 'Dec 2023', status: 'Compliant' },
    { title: 'AI Usage Standards', category: 'Tech', date: 'Mar 2024', status: 'Compliant' },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="h-px w-8 bg-indigo-500"></div>
             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Governance & Compliance</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">Policy Hub <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">& Guard</span></h1>
          <p className="text-slate-500 mt-4 text-xl font-medium max-w-2xl leading-relaxed">Intelligent policy retrieval grounded in real-time labor law and organizational standards.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-[#050510] border border-white/5 px-6 py-4 rounded-3xl flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-inner">
                <ShieldCheck size={20} />
              </div>
              <div>
                 <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Guard</div>
                 <div className="text-xs font-bold text-slate-200">100% Compliant</div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-[#050510]/60 backdrop-blur-xl rounded-[4rem] border border-white/5 overflow-hidden shadow-[0_48px_128px_-12px_rgba(0,0,0,0.8)]">
        <div className="p-12 bg-gradient-to-br from-indigo-900/20 via-transparent to-transparent border-b border-white/5">
          <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-4 uppercase tracking-tight">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 border border-white/10">
                <Globe size={24} />
             </div>
             Ask PolicyAI Terminal
          </h2>
          <div className="flex gap-4">
            <div className="flex-1 bg-[#0a0a20] border-2 border-white/5 rounded-[2rem] px-8 py-5 flex items-center backdrop-blur-3xl focus-within:border-indigo-500/40 transition-all shadow-inner group">
              <Search size={22} className="text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Ex: Hybrid work protocol synthesis..."
                className="bg-transparent border-none focus:outline-none ml-5 w-full placeholder:text-slate-800 text-white font-bold tracking-tight text-lg"
              />
            </div>
            <button 
              onClick={handleSearch}
              disabled={searching}
              className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-indigo-500 transition-all disabled:opacity-30 shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-3"
            >
              {searching ? <RefreshCw className="animate-spin" size={24} /> : <Terminal size={24} />}
              {searching ? 'REASONING...' : 'QUERY CORE'}
            </button>
          </div>
        </div>

        <div className="p-12">
          {answer ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 shadow-inner">
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 leading-[1.8] text-xl font-medium whitespace-pre-wrap tracking-tight">
                    {answer.text}
                  </p>
                </div>
              </div>
              
              {answer.sources && answer.sources.length > 0 && (
                <div className="pt-10 border-t border-white/5">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">Grounding Context Identities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {answer.sources.map((source: any, i: number) => (
                      <div key={i} className="flex items-center gap-6 p-6 bg-[#0a0a20] border border-white/5 rounded-[2rem] hover:border-indigo-500/30 transition-all group cursor-pointer">
                        <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-inner">
                          <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-black text-slate-200 group-hover:text-white transition-colors truncate">{source.web?.title || 'Neural Memory Node'}</div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 truncate">{source.web?.uri || 'NYX-V2-GROUNDING'}</div>
                        </div>
                        <ExternalLink size={18} className="text-slate-800 group-hover:text-indigo-400 transition-colors ml-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-[#0a0a20] rounded-[2rem] flex items-center justify-center text-slate-700 border border-white/5 mb-8 shadow-inner group overflow-hidden relative">
                 <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-all"></div>
                <HelpCircle size={48} className="relative z-10 opacity-30 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Search Knowledge Graph</h3>
              <p className="text-lg text-slate-500 max-w-lg font-medium leading-relaxed">
                PolicyAI synthesizes internal protocol and real-world labor law to provide grounded, compliant responses.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {policies.map((p, i) => (
          <div key={i} className="bg-[#050510]/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all group shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-all">
                <FileText size={80} />
             </div>
            <div className="flex items-center justify-between mb-8 relative z-10">
               <div className="p-3 bg-white/5 text-slate-500 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-inner">
                 <FileText size={20} />
               </div>
               <div className={`text-[9px] font-black tracking-widest px-3 py-1 rounded-full uppercase border ${
                 p.status === 'Compliant' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
               }`}>
                 {p.status}
               </div>
            </div>
            <h3 className="text-base font-black text-slate-200 mb-2 group-hover:text-white transition-colors relative z-10">{p.title}</h3>
            <div className="flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest relative z-10 pt-4 border-t border-white/5">
              <span>{p.category}</span>
              <span>SYNT {p.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoliciesPage;
