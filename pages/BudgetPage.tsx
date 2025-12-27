
import React, { useContext } from 'react';
import { History, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { LanguageContext } from '../App';
import { FinancialStatementRow } from '../types';

const mockVarianceData: FinancialStatementRow[] = [
  { label: 'Logistics Operations', budget: 1200000, actual: 1250000, variance: 50000, variancePct: 4.1 },
  { label: 'Fleet Maintenance', budget: 450000, actual: 420000, variance: -30000, variancePct: -6.7 },
  { label: 'Warehouse Energy', budget: 180000, actual: 195000, variance: 15000, variancePct: 8.3 },
  { label: 'Staff Training', budget: 60000, actual: 55000, variance: -5000, variancePct: -8.3 },
  { label: 'IT Infrastructure', budget: 320000, actual: 325000, variance: 5000, variancePct: 1.6 },
];

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
};

const BudgetPage: React.FC = () => {
  const { lang } = useContext(LanguageContext);

  const t = {
    en: {
      title: "Budget Overview",
      subtitle: "Fiscal Year 2025",
      varianceTitle: "Budget Variance Heatmap",
      totalBudget: "Total Budget",
      actualSpend: "Actual Spend",
      netVariance: "Net Variance",
    },
    ka: {
      title: "ბიუჯეტის მიმოხილვა",
      subtitle: "ფისკალური წელი 2025",
      varianceTitle: "ბიუჯეტის გადახრის რუკა",
      totalBudget: "მთლიანი ბიუჯეტი",
      actualSpend: "ფაქტიური ხარჯი",
      netVariance: "წმინდა გადახრა",
    }
  }[lang];

  const totalBudget = mockVarianceData.reduce((acc, curr) => acc + curr.budget, 0);
  const totalActual = mockVarianceData.reduce((acc, curr) => acc + curr.actual, 0);
  const netVariance = totalActual - totalBudget;
  const netVariancePct = (netVariance / totalBudget) * 100;

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-700">
       {/* Header */}
       <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-4">
          <div>
            <div className="flex items-center gap-6 mb-8">
               <div className="h-px w-20 bg-emerald-500 shadow-glow shadow-emerald-500/50"></div>
               <span className="text-micro text-emerald-400 uppercase tracking-[0.6em] font-black">{t.subtitle}</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
              {t.title}
            </h1>
          </div>
       </div>

       {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-10 rounded-[3rem] border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
             <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20"><DollarSign size={24} /></div>
             </div>
             <div className="relative z-10">
                <div className="text-4xl font-black text-white font-mono mb-2">{formatMoney(totalBudget)}</div>
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{t.totalBudget}</div>
             </div>
          </div>

           <div className="glass p-10 rounded-[3rem] border-white/5 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
             <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20"><Activity size={24} /></div>
             </div>
             <div className="relative z-10">
                <div className="text-4xl font-black text-white font-mono mb-2">{formatMoney(totalActual)}</div>
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{t.actualSpend}</div>
             </div>
          </div>

           <div className="glass p-10 rounded-[3rem] border-white/5 relative overflow-hidden group hover:border-rose-500/30 transition-all">
             <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`p-4 rounded-2xl border shadow-inner ${netVariance > 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                   {netVariance > 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${netVariance > 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                   {netVariancePct > 0 ? '+' : ''}{netVariancePct.toFixed(1)}%
                </div>
             </div>
             <div className="relative z-10">
                <div className="text-4xl font-black text-white font-mono mb-2">{formatMoney(netVariance)}</div>
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{t.netVariance}</div>
             </div>
          </div>
       </div>

       {/* Budget Variance Heatmap Section */}
       <div className="glass p-14 rounded-[5rem] bg-[#02020a]/60 shadow-3xl overflow-hidden relative border-white/5 mb-16">
          <div className="flex items-center justify-between mb-16">
             <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-8">
               <History className="text-fuchsia-500" size={32} /> {t.varianceTitle}
             </h3>
             <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400 shadow-glow shadow-emerald-400"></div> Surplus</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500 shadow-glow shadow-rose-500"></div> Deficit</div>
             </div>
          </div>
          
          <div className="space-y-4">
             {mockVarianceData.map((row, i) => {
               const varPct = row.variancePct;
               const isPos = varPct >= 0;
               // Map variance percentage to width (visual representation)
               const widthPct = Math.min(Math.abs(varPct) / 10 * 50, 50); 
               
               let colorClass = '';
               if (varPct > 8) colorClass = 'bg-gradient-to-r from-emerald-500 to-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]';
               else if (varPct > 4) colorClass = 'bg-gradient-to-r from-emerald-600 to-emerald-400';
               else if (varPct > 0) colorClass = 'bg-emerald-500/40';
               else if (varPct < -8) colorClass = 'bg-gradient-to-l from-rose-500 to-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.5)]';
               else if (varPct < -4) colorClass = 'bg-gradient-to-l from-rose-600 to-rose-400';
               else colorClass = 'bg-rose-500/40';
               
               return (
                 <div key={i} className="flex items-center gap-6 p-6 rounded-[2rem] bg-black/40 border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="w-1/3 relative z-10">
                       <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors truncate">{row.label}</div>
                       <div className="flex gap-4 mt-2">
                         <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Target: {formatMoney(row.budget)}</span>
                       </div>
                    </div>
                    
                    {/* Variance Heatmap Bar */}
                    <div className="flex-1 h-14 bg-[#050510] rounded-2xl overflow-hidden border border-white/5 relative flex items-center shadow-inner z-10">
                       {/* Center Line */}
                       <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/10 z-20"></div>
                       
                       {/* Grid Lines */}
                       <div className="absolute left-[35%] top-0 bottom-0 w-[1px] bg-white/5 border-l border-dashed border-white/10"></div>
                       <div className="absolute left-[65%] top-0 bottom-0 w-[1px] bg-white/5 border-l border-dashed border-white/10"></div>

                       {/* The Bar */}
                       <div 
                         className={`absolute top-4 bottom-4 ${isPos ? 'left-1/2 rounded-r-lg' : 'right-1/2 rounded-l-lg'} ${colorClass} transition-all duration-1000 backdrop-blur-md`} 
                         style={{ width: `${Math.max(widthPct, 1)}%` }}
                       ></div>
                    </div>

                    <div className="w-1/5 text-right relative z-10">
                       <div className="text-xl font-black text-white font-mono">{formatMoney(row.actual)}</div>
                       <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPos ? '+' : ''}{varPct.toFixed(1)}% Var
                       </div>
                    </div>
                 </div>
               );
             })}
          </div>
       </div>
    </div>
  );
};

export default BudgetPage;
