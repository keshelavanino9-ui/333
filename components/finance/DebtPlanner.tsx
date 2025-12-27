
import React, { useState, useMemo, useContext, useEffect } from 'react';
import { X, Plus, Trash2, Wallet, Info, Zap, Flame, ShieldCheck, Calculator, AlertCircle, Target, BarChart3 } from 'lucide-react';
import { Debt, DebtSimulationResult } from '../../types';
import { LanguageContext } from '../../App';

interface Props {
  onClose: () => void;
  currency?: 'USD' | 'GEL';
  rate?: number;
}

// Extended simulation result to include specific dates
interface AdvancedSimulationResult extends DebtSimulationResult {
  payoffDates: Record<string, Date>;
  finalDate: Date;
}

const DebtPlanner: React.FC<Props> = ({ onClose, currency = 'USD', rate = 1 }) => {
  const { lang } = useContext(LanguageContext);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [extraPayment, setExtraPayment] = useState(200);
  const [activeStrategy, setActiveStrategy] = useState<'Snowball' | 'Avalanche'>('Avalanche');
  const [targetDate, setTargetDate] = useState('');
  const [suggestedPayment, setSuggestedPayment] = useState<number | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [interest, setInterest] = useState('');
  const [minPay, setMinPay] = useState('');
  
  // Validation State
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const symbol = currency === 'GEL' ? '₾' : '$';

  // Real-time Validation Effect
  useEffect(() => {
    const newErrors: {[key: string]: string} = {};
    let valid = true;
    const nameTrimmed = name.trim();

    // Validate Name
    if (nameTrimmed) {
      if (debts.some(d => d.name.toLowerCase() === nameTrimmed.toLowerCase())) {
        newErrors.name = "Duplicate name";
        valid = false;
      }
    }

    // Validate Balance
    const bal = parseFloat(balance);
    if (balance && (isNaN(bal) || bal <= 0)) {
      newErrors.balance = "Must be > 0";
      valid = false;
    }

    // Validate Interest
    const intRate = parseFloat(interest);
    if (interest && (isNaN(intRate) || intRate < 0)) {
      newErrors.interest = "Invalid rate";
      valid = false;
    }

    // Validate Minimum Payment
    const pay = parseFloat(minPay);
    if (minPay) {
      if (isNaN(pay) || pay <= 0) {
        newErrors.minPay = "Must be > 0";
        valid = false;
      } else if (!isNaN(bal) && pay > bal) {
        newErrors.minPay = "Exceeds balance";
        valid = false;
      }
    }

    setErrors(newErrors);
    
    // Form is strictly valid only if all fields are filled correctly and no errors exist
    const hasValues = nameTrimmed && balance && interest && minPay;
    const hasNoErrors = Object.keys(newErrors).length === 0;
    
    setIsFormValid(!!hasValues && hasNoErrors && valid);
  }, [name, balance, interest, minPay, debts]);

  const addDebt = () => {
    if (!isFormValid) return;

    const newDebt: Debt = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      balance: parseFloat(balance) / rate,
      interestRate: parseFloat(interest),
      minPayment: parseFloat(minPay) / rate
    };
    setDebts([...debts, newDebt]);
    
    // Reset form
    setName(''); 
    setBalance(''); 
    setInterest(''); 
    setMinPay('');
    setErrors({});
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const totalDebt = useMemo(() => debts.reduce((sum, d) => sum + (d.balance * rate), 0), [debts, rate]);

  // Enhanced Simulation Engine with Date Accuracy
  const simulate = (strategy: 'Snowball' | 'Avalanche', overrideExtra?: number): AdvancedSimulationResult => {
    if (debts.length === 0) return { months: 0, totalInterest: 0, strategy, payoffLog: {}, payoffDates: {}, finalDate: new Date() };
    
    // Deep copy to avoid mutating state
    let currentDebts = debts.map(d => ({ ...d }));
    
    if (strategy === 'Snowball') currentDebts.sort((a, b) => a.balance - b.balance);
    else currentDebts.sort((a, b) => b.interestRate - a.interestRate);

    let months = 0;
    let totalInterestPaid = 0;
    const payoffLog: Record<string, number> = {};
    const payoffDates: Record<string, Date> = {};
    
    // Check for pre-cleared
    currentDebts.forEach(d => { 
        if (d.balance <= 0) {
            payoffLog[d.id] = 0;
            payoffDates[d.id] = new Date();
        }
    });

    const currentDate = new Date(); // Start from today
    const baseExtra = (overrideExtra !== undefined ? overrideExtra : extraPayment) / rate;

    // Safety break at 50 years (600 months)
    while (currentDebts.some(d => d.balance > 0.01) && months < 600) {
      months++;
      const prevDate = new Date(currentDate);
      // Advance date by 1 month to get next payment date
      currentDate.setMonth(currentDate.getMonth() + 1);
      
      // Calculate exact days for interest (handles 28/29/30/31 days)
      const daysInPeriod = (currentDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);

      let monthlyBudget = baseExtra + currentDebts.reduce((sum, d) => sum + (d.balance > 0 ? d.minPayment : 0), 0);
      
      // 1. Accrue Interest (Daily Compounding approximation for the month)
      currentDebts.forEach(d => {
        if (d.balance > 0) {
          // Daily Rate * Days
          const interestCharge = d.balance * (d.interestRate / 100 / 365) * daysInPeriod;
          d.balance += interestCharge;
          totalInterestPaid += interestCharge;
        }
      });

      // 2. Pay Minimums
      currentDebts.forEach(d => {
        if (d.balance > 0) {
          const payment = Math.min(d.balance, d.minPayment);
          d.balance -= payment;
          monthlyBudget -= payment;
        }
      });

      // 3. Apply Accelerator (Extra Payment)
      const target = currentDebts.find(d => d.balance > 0);
      if (target && monthlyBudget > 0) {
        const extraApplied = Math.min(target.balance, monthlyBudget);
        target.balance -= extraApplied;
      }

      // 4. Log Payoffs
      currentDebts.forEach(d => {
        if (d.balance <= 0.01 && payoffLog[d.id] === undefined) {
          payoffLog[d.id] = months;
          payoffDates[d.id] = new Date(currentDate);
        }
      });
    }

    return { 
        months, 
        totalInterest: totalInterestPaid * rate, 
        strategy, 
        payoffLog, 
        payoffDates,
        finalDate: new Date(currentDate)
    };
  };

  const snowballRes = useMemo(() => simulate('Snowball'), [debts, extraPayment, rate]);
  const avalancheRes = useMemo(() => simulate('Avalanche'), [debts, extraPayment, rate]);
  
  const activeSimulation = activeStrategy === 'Avalanche' ? avalancheRes : snowballRes;

  // Target Date Solver (Binary Search)
  useEffect(() => {
    if (!targetDate || debts.length === 0) {
        setSuggestedPayment(null);
        return;
    }

    const target = new Date(targetDate);
    const now = new Date();
    
    // Basic check if target is in past
    if (target <= now) {
        setSuggestedPayment(null);
        return;
    }

    // Binary Search for required payment
    // We want to find the minimal 'extraPayment' that results in finalDate <= targetDate
    let low = 0;
    let high = totalDebt; // Reasonable upper bound: paying off everything in 1 month is roughly totalDebt
    let found = null;
    let iterations = 0;

    // 25 iterations gives sufficient precision for currency
    while (iterations < 25) {
        const mid = (low + high) / 2;
        // Simulate with 'mid' as extra payment
        // Note: we must scale mid by rate if it was in display currency, 
        // but simulate expects base currency logic. Let's assume mid is display currency for simplicity here,
        // so we pass it into simulate (which divides by rate).
        const res = simulate(activeStrategy, mid); 
        
        if (res.finalDate <= target) {
            found = mid;
            high = mid; // Try to pay less
        } else {
            low = mid; // Need to pay more
        }
        iterations++;
    }

    // If we found a solution within reasonable bounds
    setSuggestedPayment(found !== null ? Math.ceil(found) : null);

  }, [targetDate, debts, activeStrategy, totalDebt]);

  const t = {
    en: {
      title: "Debt Reduction Strategist",
      inputTitle: `Register Liabilities (${currency})`,
      extraTitle: `Payment Accelerator (${currency})`,
      listTitle: `Obligations Timeline (${activeStrategy})`,
      comparison: "Strategy Benchmark",
      timeline: "Projected Payoff Horizon",
      goalSeek: "Target Payoff Date",
      goalSeekDesc: "Calculate required accelerator to be debt-free by date."
    },
    ka: {
      title: "ვალის შემცირების სტრატეგი",
      inputTitle: `ვალდებულებების რეგისტრაცია (${currency})`,
      extraTitle: `დაჩქარებული გადახდა (${currency})`,
      listTitle: `ვალდებულებების ქრონოლოგია (${activeStrategy})`,
      comparison: "სტრატეგიების შედარება",
      timeline: "დაფარვის ჰორიზონტი",
      goalSeek: "მიზნობრივი თარიღი",
      goalSeekDesc: "გამოთვალეთ საჭირო დამატებითი გადახდა თარიღისთვის."
    }
  }[lang as 'en' | 'ka'];

  return (
    <div className="fixed inset-0 z-[110] bg-[#02020a]/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="glass w-full max-w-[90vw] h-[92vh] rounded-[4rem] border-white/10 flex flex-col overflow-hidden relative shadow-[0_128px_256px_-64px_rgba(0,0,0,1)]">
        
        {/* Header */}
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-8">
            <div className="p-6 bg-indigo-600/20 text-indigo-400 rounded-[2rem] border-2 border-indigo-500/30 shadow-glow shadow-indigo-500/10">
              <Wallet size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{t.title}</h2>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-glow shadow-emerald-500"></div>
                Simulation Engine V3.7 // Date-Aware
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 glass rounded-full text-slate-500 hover:text-white transition-all active:scale-90 hover:bg-white/5"><X size={32} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="grid grid-cols-1 2xl:grid-cols-12 gap-12">
            
            {/* Left Column: Inputs (4 cols) */}
            <div className="2xl:col-span-4 space-y-10">
              <div className="p-10 bg-black/40 rounded-[3rem] border border-white/5 space-y-8 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12"><Calculator size={120} /></div>
                <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-4 border-b border-white/5 pb-6 relative z-10">
                  <Plus size={20} className="text-indigo-400" /> {t.inputTitle}
                </h3>
                <div className="space-y-6 relative z-10">
                  <Input 
                    label="Liability Name" 
                    value={name} 
                    onChange={setName} 
                    placeholder="Ex: Credit Line Alpha" 
                    error={errors.name}
                  />
                  <div className="grid grid-cols-2 gap-6">
                    <Input 
                      label={`Balance (${symbol})`}
                      value={balance} 
                      onChange={setBalance} 
                      placeholder="12500" 
                      type="number" 
                      error={errors.balance}
                    />
                    <Input 
                      label="Yield (APR %)" 
                      value={interest} 
                      onChange={setInterest} 
                      placeholder="18.5" 
                      type="number" 
                      error={errors.interest}
                    />
                  </div>
                  <Input 
                    label={`Min Payment (${symbol})`}
                    value={minPay} 
                    onChange={setMinPay} 
                    placeholder="250" 
                    type="number" 
                    error={errors.minPay}
                  />
                </div>
                <button 
                  onClick={addDebt}
                  disabled={!isFormValid}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-glow shadow-indigo-600/30 hover:bg-indigo-500 active:scale-95 transition-all group disabled:opacity-30 disabled:cursor-not-allowed relative z-10"
                >
                  <Plus className="inline mr-3 group-hover:rotate-90 transition-transform" size={16} /> Append Node
                </button>
              </div>

              <div className="p-10 bg-black/40 rounded-[3rem] border border-white/5 space-y-8 shadow-inner">
                <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-4 border-b border-white/5 pb-6">
                  <Zap size={20} className="text-cyan-400" /> {t.extraTitle}
                </h3>
                <div className="space-y-8">
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Monthly Accelerator</span>
                     <span className="text-3xl font-black text-white font-mono drop-shadow-glow">{symbol}{extraPayment}</span>
                   </div>
                   <input 
                    type="range" min="0" max="5000" step="50"
                    value={extraPayment} onChange={e => setExtraPayment(parseInt(e.target.value))}
                    className="w-full h-2 bg-black rounded-full appearance-none accent-indigo-500 shadow-inner cursor-pointer"
                   />
                </div>

                {/* Target Date Goal Seek */}
                <div className="pt-8 border-t border-white/5 space-y-6">
                    <div className="flex items-center gap-4">
                        <Target size={18} className="text-fuchsia-400" />
                        <div>
                            <div className="text-[10px] font-black text-white uppercase tracking-widest">{t.goalSeek}</div>
                            <div className="text-[9px] font-bold text-slate-600 uppercase tracking-tight">{t.goalSeekDesc}</div>
                        </div>
                    </div>
                    <input 
                        type="date" 
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold uppercase text-xs focus:outline-none focus:border-fuchsia-500/50 placeholder:text-slate-700"
                    />
                    {suggestedPayment !== null && (
                        <div className="p-4 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
                             <div className="text-[9px] font-black text-fuchsia-400 uppercase tracking-widest mb-1">Required Accelerator</div>
                             <div className="text-2xl font-black text-white font-mono">{symbol}{suggestedPayment} <span className="text-[10px] text-slate-500 font-bold">/ MO</span></div>
                        </div>
                    )}
                    {targetDate && suggestedPayment === null && debts.length > 0 && (
                         <div className="text-[9px] font-black text-rose-400 uppercase tracking-widest animate-in fade-in">Unattainable Date / Invalid Input</div>
                    )}
                </div>
              </div>
            </div>

            {/* Right Column: Visualization & List (8 cols) */}
            <div className="2xl:col-span-8 space-y-10">
              <div className="flex flex-col xl:flex-row gap-10">
                 {/* Stats Card */}
                 <div className="flex-1 p-10 bg-[#02020a] rounded-[3.5rem] border border-white/5 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05]"><Info size={180} /></div>
                    <h3 className="text-lg font-black text-white uppercase tracking-widest mb-8 flex items-center gap-4">
                        <ShieldCheck className="text-emerald-500" size={24} /> Liability Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-8 relative z-10">
                        <div>
                            <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Total Burden</div>
                            <div className="text-4xl font-black text-white font-mono tracking-tighter drop-shadow-glow">{symbol}{totalDebt.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Avg. Rate</div>
                            <div className="text-4xl font-black text-indigo-400 font-mono tracking-tighter">
                                {debts.length > 0 ? (debts.reduce((acc, d) => acc + d.interestRate, 0) / debts.length).toFixed(1) : 0}%
                            </div>
                        </div>
                    </div>
                 </div>
                 
                 {/* Strategy Comparison */}
                 <div className="flex-[2] grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StrategyCard 
                        res={avalancheRes} 
                        title="Avalanche" 
                        desc="Highest Rate First" 
                        icon={<Zap size={24} />} 
                        color="cyan"
                        symbol={symbol}
                        isActive={activeStrategy === 'Avalanche'}
                        onClick={() => setActiveStrategy('Avalanche')}
                    />
                    <StrategyCard 
                        res={snowballRes} 
                        title="Snowball" 
                        desc="Lowest Balance First" 
                        icon={<Flame size={24} />} 
                        color="fuchsia"
                        symbol={symbol}
                        isActive={activeStrategy === 'Snowball'}
                        onClick={() => setActiveStrategy('Snowball')}
                    />
                 </div>
              </div>

              {/* Timeline Visualization */}
              {debts.length > 0 && (
                <div className="p-10 bg-black/40 border border-white/5 rounded-[3.5rem] shadow-inner relative overflow-hidden animate-in slide-in-from-bottom-6">
                    <h3 className="text-lg font-black text-white uppercase tracking-widest mb-8 flex items-center gap-4">
                        <BarChart3 className="text-slate-400" size={20} /> {t.timeline}
                    </h3>
                    <div className="space-y-6 relative z-10">
                        {/* Time Axis (Simplified) */}
                        <div className="flex justify-between text-[9px] font-black text-slate-600 uppercase tracking-widest border-b border-white/5 pb-2">
                             <span>Today</span>
                             <span>{activeSimulation.finalDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                        </div>
                        {/* Gantt Bars */}
                        {debts.map(d => {
                            const payoffDate = activeSimulation.payoffDates[d.id];
                            const now = new Date();
                            const totalMs = activeSimulation.finalDate.getTime() - now.getTime();
                            const debtMs = (payoffDate?.getTime() || now.getTime()) - now.getTime();
                            // Calculate width percentage. Handle edge cases where totalMs is 0 or debtMs is negative.
                            const pct = totalMs > 0 ? Math.min(100, Math.max(1, (debtMs / totalMs) * 100)) : 100;

                            return (
                                <div key={d.id} className="group/bar">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase group-hover/bar:text-white transition-colors flex items-center gap-2">
                                          {d.name} <span className="opacity-50 text-[9px]">/ {symbol}{Math.round(d.balance * rate)}</span>
                                        </span>
                                        <span className="text-[9px] font-mono text-slate-600 group-hover/bar:text-indigo-400">{payoffDate?.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    <div className="h-3 bg-white/5 rounded-full overflow-hidden w-full flex">
                                         <div className={`h-full rounded-full transition-all duration-1000 ${activeStrategy === 'Avalanche' ? 'bg-cyan-500' : 'bg-fuchsia-500'} opacity-60 group-hover/bar:opacity-100 shadow-glow`} style={{ width: `${pct}%` }}></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
              )}

              {/* Debt List */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between px-4">
                     <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-4">
                        <Calculator size={20} /> {t.listTitle}
                     </h3>
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest border border-white/10 px-4 py-1.5 rounded-xl">{debts.length} Nodes</span>
                 </div>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {debts.map(d => (
                        <div key={d.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                             <div className="flex items-center gap-6">
                                 <div className="p-4 bg-black/40 rounded-2xl text-slate-500 group-hover:text-indigo-400 transition-colors border border-white/5"><Wallet size={20} /></div>
                                 <div>
                                     <div className="text-base font-black text-white uppercase tracking-tight">{d.name}</div>
                                     <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">
                                         {symbol}{(d.balance * rate).toLocaleString(undefined, {maximumFractionDigits: 0})} @ {d.interestRate}%
                                     </div>
                                 </div>
                             </div>
                             <div className="flex items-center gap-6">
                                 <div className="text-right hidden sm:block">
                                     <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Payoff</div>
                                     <div className="text-lg font-black text-white font-mono">
                                         {activeSimulation.payoffDates[d.id]?.toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                                     </div>
                                 </div>
                                 <button onClick={() => removeDebt(d.id)} className="p-3 text-slate-700 hover:text-rose-500 transition-colors bg-white/5 rounded-xl hover:bg-rose-500/10"><Trash2 size={18} /></button>
                             </div>
                        </div>
                    ))}
                    {debts.length === 0 && (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30">
                            <Info size={48} className="text-slate-500 mb-4" />
                            <span className="text-sm font-black text-slate-600 uppercase tracking-[0.4em]">No Liabilities Registered</span>
                        </div>
                    )}
                 </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder, type = 'text', error }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className={`text-[10px] font-black uppercase tracking-widest block transition-colors ${error ? 'text-rose-400' : 'text-slate-600'}`}>{label}</label>
      {error && <span className="text-[9px] font-bold text-rose-400 animate-in fade-in slide-in-from-right-2 flex items-center gap-1"><AlertCircle size={10} /> {error}</span>}
    </div>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder}
      className={`w-full bg-black/60 border rounded-2xl px-6 py-4 text-white text-base focus:outline-none placeholder:text-slate-800 transition-all font-bold shadow-inner ${error ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/5 focus:border-indigo-500/50'}`}
    />
  </div>
);

const StrategyCard = ({ res, title, desc, icon, color, isActive, onClick, symbol }: any) => {
  const isOptimal = res.strategy === 'Avalanche';
  return (
    <div 
      onClick={onClick}
      className={`
        p-8 glass rounded-[3rem] border-${color}-500/20 space-y-6 relative overflow-hidden group transition-all shadow-xl cursor-pointer
        ${isActive ? `bg-${color}-500/10 border-${color}-500/50 scale-[1.02]` : `bg-${color}-500/5 hover:bg-${color}-500/10 hover:border-${color}-500/30`}
      `}
    >
      <div className="flex justify-between items-start">
          <div className={`p-4 bg-${color}-500/10 text-${color}-400 rounded-2xl border border-${color}-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500`}>{icon}</div>
          {isOptimal && <div className="bg-cyan-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-glow shadow-cyan-600/40 border border-cyan-400/30">Optimal</div>}
      </div>
      <div>
        <h4 className={`text-xl font-black text-white uppercase tracking-tight group-hover:text-${color}-400 transition-colors`}>{title}</h4>
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-2 opacity-70">{desc}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
           <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1">Duration</div>
           <div className="text-2xl font-black text-white font-mono">{Math.floor(res.months / 12)}Y {res.months % 12}M</div>
        </div>
        <div>
           <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1">Interest</div>
           <div className="text-2xl font-black text-white font-mono">{symbol}{Math.round(res.totalInterest).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default DebtPlanner;
