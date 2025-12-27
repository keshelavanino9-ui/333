
import React, { useContext, useState, useMemo } from 'react';
import { 
  Search, Filter, MapPin, UserPlus, TrendingUp, TrendingDown, 
  BrainCircuit, Activity, Sparkles, Zap, Loader2, X, Briefcase, 
  DollarSign, UserCheck, LayoutGrid, ClipboardCheck, History, Workflow, 
  Users, ShieldCheck, FileText, ChevronRight, CheckCircle2, ArrowRight,
  Clock, Calendar, Star, LogIn, LogOut, UserMinus, Plus, RefreshCw, Landmark, Download
} from 'lucide-react';
import { Employee, Position } from '../types';
import { LanguageContext, CompanyContext, NotificationContext } from '../App';
import { gemini } from '../services/geminiService';
import { exportToCSV, fuzzySearch } from '../utils/helpers';

const EmployeesPage: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const { addNotification } = useContext(NotificationContext);
  const companyCtx = useContext(CompanyContext);
  const [activeTab, setActiveTab] = useState<'directory' | 'recruitment' | 'onboarding' | 'attendance' | 'payroll'>('directory');
  const [isSyncing, setIsSyncing] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);
  const [analysisRes, setAnalysisRes] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const employees: Employee[] = [
    { 
      id: 1, nameEn: 'Giorgi Beridze', nameKa: 'გიორგი ბერიძე', 
      currentRoleEn: 'Supply Chain Architect', currentRoleKa: 'მომარაგების არქიტექტორი', 
      departmentEn: 'Logistics Core', departmentKa: 'ლოგისტიკის ბირთვი', 
      performanceScore: 97, hireDate: '2022-03-01', location: 'Central Hub', 
      skills: [{name: 'Network Flow', level: 94, category: 'Technical'}], 
      performanceHistory: [92, 97], grade: 'S', salary: 11500, insurance: 750, allowances: 1800, status: 'active', contractType: 'Full-time'
    },
    { 
      id: 2, nameEn: 'Maya Kobakhidze', nameKa: 'მაია კობახიძე', 
      currentRoleEn: 'Fleet Performance Lead', currentRoleKa: 'ფლოტის ეფექტურობის ლიდი', 
      departmentEn: 'Operations', departmentKa: 'ოპერაციები', 
      performanceScore: 89, hireDate: '2021-11-12', location: 'Regional Hub East', 
      skills: [{name: 'Resource Sync', level: 90, category: 'Technical'}], 
      performanceHistory: [84, 89], grade: 'A', salary: 5800, insurance: 520, allowances: 700, status: 'active', contractType: 'Full-time'
    },
    {
      id: 3, nameEn: 'Alex Rivera', nameKa: 'ალექს რივერა',
      currentRoleEn: 'AI Systems Strategist', currentRoleKa: 'AI სისტემების სტრატეგი',
      departmentEn: 'R&D Hub', departmentKa: 'R&D ჰაბი',
      performanceScore: 99, hireDate: '2023-01-15', location: 'Remote / Virtual',
      skills: [{name: 'Neural Architecture', level: 99, category: 'Technical'}],
      performanceHistory: [95, 99], grade: 'S', salary: 14200, insurance: 800, allowances: 0, status: 'active', contractType: 'Contractor'
    }
  ];

  // Fuzzy Search Implementation
  const filteredEmployees = useMemo(() => {
    return fuzzySearch(employees, searchQuery, ['nameEn', 'nameKa', 'currentRoleEn', 'departmentEn', 'location']);
  }, [searchQuery, employees]);

  const candidates = [
    { name: 'Nika Tskitishvili', role: 'Fleet Manager', status: 'Technical Interview', match: 92 },
    { name: 'Sophie Dvali', role: 'Ops Analyst', status: 'Culture Fit', match: 88 },
    { name: 'David Lomsadze', role: 'Warehouse Lead', status: 'Offer Pending', match: 95 }
  ];

  const attendanceData = [
    { name: 'Giorgi Beridze', shift: '09:00 - 18:00', status: 'In', time: '08:54', variance: '-6m' },
    { name: 'Maya Kobakhidze', shift: '09:00 - 18:00', status: 'Out', time: '18:12', variance: '+12m' },
    { name: 'Alex Rivera', shift: '10:00 - 19:00', status: 'In', time: '10:02', variance: '+2m' }
  ];

  const handleSync = async () => {
    setIsSyncing(true);
    await gemini.executeN8NWorkflow('hr_lifecycle_sync', {}, () => {});
    addNotification('HRIS Sync Complete', 'Employee registry updated from master record.', 'success');
    setIsSyncing(false);
  };

  const handleAnalyze = async (emp: Employee) => {
    setAnalyzingId(emp.id);
    const res = await gemini.chat([{ id: '1', role: 'user', content: `Analyze potential for ${emp.nameEn}`, timestamp: Date.now() }], lang);
    setAnalysisRes(res.response);
    setAnalyzingId(null);
  };

  const handleExport = () => {
    exportToCSV(filteredEmployees.map(e => ({
      ID: e.id,
      Name: e.nameEn,
      Role: e.currentRoleEn,
      Dept: e.departmentEn,
      Grade: e.grade,
      Status: e.status
    })), 'NYX_Employee_Registry');
    addNotification('Export Initiated', 'Registry data compiled and downloaded.', 'info');
  };

  const t = {
    en: {
      title: "HR Lifecycle", sub: "Enterprise Hub", 
      tabs: ["Employee Registry", "Recruitment", "Onboarding", "Time & Attendance", "Payroll Services"],
      stats: ["Headcount", "Vacancies", "Avg. Yield", "Retension"],
      onboardingTasks: ["IT Setup", "Safety Orientation", "Payroll Registration", "Entity Synchronization"]
    },
    ka: {
      title: "HR ციკლი", sub: "კორპორატიული ჰაბი", 
      tabs: ["თანამშრომლები", "რეკრუტინგი", "ონბორდინგი", "დასწრება", "ხელფასები"],
      stats: ["რაოდენობა", "ვაკანსია", "საშ. შემოსავალი", "შენარჩუნება"],
      onboardingTasks: ["IT მოწყობა", "უსაფრთხოება", "ხელფასის რეგისტრაცია", "სინქრონიზაცია"]
    }
  }[lang];

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-4">
        <div className="animate-in slide-in-from-left-10 duration-1000">
          <div className="flex items-center gap-6 mb-8">
             <div className="h-px w-20 bg-indigo-500 shadow-glow shadow-indigo-500/50"></div>
             <span className="text-micro text-indigo-400 uppercase tracking-[0.6em] font-black">{t.sub}</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-fuchsia-400">Core</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSync}
            className="glass border-white/10 text-slate-400 px-10 py-5 rounded-[2.5rem] text-[13px] font-black uppercase tracking-widest flex items-center gap-4 hover:bg-white/5 transition-all shadow-xl"
          >
            {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <Workflow size={18} />}
            Synchronize HRIS
          </button>
          <button className="bg-indigo-600 text-white px-12 py-5 rounded-[2.5rem] text-[13px] font-black uppercase tracking-widest flex items-center gap-4 hover:bg-indigo-500 shadow-glow shadow-indigo-600/20 transition-all active:scale-95 border border-white/10">
            <UserPlus size={18} /> New Requisition
          </button>
        </div>
      </div>

      <div className="flex gap-2 glass p-2 rounded-[3rem] border-white/5 shadow-3xl overflow-x-auto no-scrollbar scroll-smooth">
        {t.tabs.map((tab, i) => {
          const ids = ['directory', 'recruitment', 'onboarding', 'attendance', 'payroll'];
          return (
            <button 
              key={ids[i]}
              onClick={() => setActiveTab(ids[i] as any)}
              className={`px-12 py-5 text-[12px] uppercase font-black rounded-[2.5rem] transition-all whitespace-nowrap ${activeTab === ids[i] ? 'bg-indigo-600 text-white shadow-glow shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 animate-in slide-in-from-bottom-8 duration-1000">
        <StatCard label={t.stats[0]} val="582" icon={Users} color="text-indigo-400" trend="+4%" />
        <StatCard label={t.stats[1]} val="18" icon={Briefcase} color="text-cyan-400" trend="-2" />
        <StatCard label={t.stats[2]} val="94.8%" icon={Activity} color="text-emerald-400" trend="+0.5%" />
        <StatCard label={t.stats[3]} val="92.1%" icon={ShieldCheck} color="text-fuchsia-400" trend="Stable" />
      </div>

      {/* Main Content Area */}
      <div className="min-h-[600px]">
        {activeTab === 'directory' && (
          <div className="glass rounded-[4rem] border-white/5 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-700 bg-[#02020a]/40">
            <div className="p-12 border-b border-white/5 flex gap-8 items-center bg-white/[0.01]">
              <div className="flex-1 relative group focus-within:scale-[1.01] transition-transform">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-400 transition-colors" size={24} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search organizational registry (fuzzy match)..." 
                  className="w-full bg-black/40 border-2 border-white/5 rounded-[2rem] pl-20 pr-10 py-6 text-white focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-800 font-bold uppercase text-base tracking-widest" 
                />
              </div>
              <button onClick={handleExport} className="flex items-center gap-4 px-10 py-6 glass rounded-[2rem] text-micro uppercase text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all font-black tracking-[0.3em] border border-white/5">
                 <Download size={20} /> Export CSV
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-white/5 text-micro text-slate-700 uppercase font-black tracking-widest border-b border-white/5">
                <tr>
                  <th className="px-16 py-10">Entity Name</th>
                  <th className="px-16 py-10">Role & Department</th>
                  <th className="px-16 py-10">Performance Grade</th>
                  <th className="px-16 py-10 text-right">Cognitive Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEmployees.length > 0 ? filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-white/[0.03] transition-all group cursor-pointer border-l-4 border-transparent hover:border-indigo-500">
                    <td className="px-16 py-12">
                      <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-[1.8rem] bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-3xl border border-indigo-500/20 group-hover:scale-110 transition-transform shadow-inner">{lang === 'en' ? emp.nameEn[0] : emp.nameKa[0]}</div>
                        <div>
                          <div className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-indigo-400 transition-colors">{lang === 'en' ? emp.nameEn : emp.nameKa}</div>
                          <div className="text-[13px] text-slate-600 font-black flex items-center gap-3 mt-2 tracking-widest"><MapPin size={14} /> {emp.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-16 py-12">
                      <div className="text-lg font-black text-slate-300 uppercase tracking-tight">{lang === 'en' ? emp.departmentEn : emp.departmentKa}</div>
                      <div className="text-[12px] text-slate-700 mt-2 uppercase tracking-[0.2em] font-black">{lang === 'en' ? emp.currentRoleEn : emp.currentRoleKa}</div>
                    </td>
                    <td className="px-16 py-12">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl font-black text-white drop-shadow-glow font-mono">{emp.grade}</span>
                        <div className="flex gap-1.5">
                           {[...Array(5)].map((_, i) => <div key={i} className={`h-2 w-5 rounded-full ${i < (emp.performanceScore / 20) ? 'bg-indigo-500 shadow-glow shadow-indigo-500/40' : 'bg-slate-900'}`}></div>)}
                        </div>
                      </div>
                    </td>
                    <td className="px-16 py-12 text-right">
                      <button onClick={() => handleAnalyze(emp)} className="p-6 glass rounded-2xl text-slate-600 hover:text-indigo-400 transition-all hover:shadow-2xl border border-white/5 active:scale-90">
                        {analyzingId === emp.id ? <Loader2 size={24} className="animate-spin" /> : <BrainCircuit size={24} />}
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                       <div className="flex flex-col items-center gap-6 opacity-30">
                          <Search size={64} className="text-slate-500" />
                          <div className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em]">No entities found matching query</div>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'recruitment' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 animate-in slide-in-from-bottom-8 duration-1000">
             <div className="xl:col-span-2 glass rounded-[4rem] border-white/5 p-16 shadow-2xl bg-[#02020a]/40">
                <h3 className="text-3xl font-black text-white mb-16 uppercase tracking-tighter flex items-center gap-6">
                  <UserCheck className="text-cyan-400" size={32} /> Active Candidate Pipeline
                </h3>
                <div className="space-y-8">
                  {candidates.map((can, i) => (
                    <div key={i} className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] flex items-center justify-between group hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all cursor-pointer">
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-black text-xl border border-cyan-500/20">{can.name[0]}</div>
                        <div>
                           <div className="text-2xl font-black text-white uppercase tracking-tight">{can.name}</div>
                           <div className="text-[12px] text-slate-600 font-black uppercase tracking-widest mt-1">{can.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-12">
                         <div className="text-right">
                           <div className="text-[12px] font-black text-slate-500 uppercase tracking-widest">Inference Match</div>
                           <div className="text-3xl font-black text-emerald-400 font-mono">{can.match}%</div>
                         </div>
                         <div className="px-6 py-3 rounded-2xl bg-indigo-500/10 text-indigo-400 text-[12px] font-black uppercase tracking-widest border border-indigo-500/20">
                           {can.status}
                         </div>
                         <ArrowRight className="text-slate-800 group-hover:text-indigo-400 group-hover:translate-x-2 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
             </div>
             <div className="glass rounded-[4rem] border-white/5 p-12 shadow-2xl bg-black/40 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 scale-150"><Zap size={140} /></div>
                <h3 className="text-2xl font-black text-white mb-10 uppercase tracking-tighter flex items-center gap-6 border-b border-white/5 pb-8 relative z-10">
                  <Star className="text-fuchsia-400" size={24} /> Talent Insights
                </h3>
                <div className="space-y-10 relative z-10">
                   <div className="p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/5 space-y-4">
                      <div className="text-[12px] font-black text-fuchsia-400 uppercase tracking-widest">Urgent Requirement</div>
                      <div className="text-xl font-black text-white uppercase leading-none">Global Supply Analyst</div>
                      <p className="text-[13px] text-slate-500 uppercase tracking-widest font-bold leading-relaxed">Neural Core suggests high churn risk in APAC hub. Proactive backfilling required.</p>
                   </div>
                   <button className="w-full py-6 bg-fuchsia-600 text-white rounded-3xl text-[12px] font-black uppercase tracking-[0.4em] shadow-glow shadow-fuchsia-600/20">Analyze Market Benchmarks</button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'onboarding' && (
          <div className="glass rounded-[4rem] border-white/5 p-16 shadow-2xl bg-[#02020a]/60 animate-in slide-in-from-bottom-8 duration-1000">
             <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-20 gap-10">
                <div className="max-w-2xl">
                   <h3 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-8 mb-4">
                      <LogIn className="text-indigo-400" size={48} /> Entity Onboarding Protocol
                   </h3>
                   <p className="text-xl text-slate-500 font-medium uppercase tracking-tight opacity-70">Managing the transition of high-impact talent into organizational knowledge graphs.</p>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-right">
                      <div className="text-[12px] font-black text-slate-700 uppercase tracking-widest">Active Transits</div>
                      <div className="text-5xl font-black text-white font-mono">08</div>
                   </div>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {t.onboardingTasks.map((task, i) => (
                  <div key={i} className="p-10 glass rounded-[3rem] border-white/5 bg-black/40 space-y-8 group hover:border-indigo-500/30 transition-all relative overflow-hidden">
                     <div className="absolute -top-4 -right-4 text-white/5 font-black text-9xl leading-none">0{i+1}</div>
                     <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 w-fit group-hover:scale-110 transition-transform">
                        {i === 0 ? <Plus size={24} /> : i === 1 ? <ShieldCheck size={24} /> : i === 2 ? <DollarSign size={24} /> : <RefreshCw size={24} />}
                     </div>
                     <div className="relative z-10">
                        <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">{task}</h4>
                        <div className="flex items-center gap-4">
                           <div className="h-2 flex-1 bg-black/60 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 w-[75%] rounded-full shadow-glow"></div>
                           </div>
                           <span className="text-[13px] font-black text-emerald-500 font-mono">75%</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="glass rounded-[4rem] border-white/5 p-16 shadow-2xl bg-[#02020a]/60 animate-in slide-in-from-bottom-8 duration-1000">
             <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-12">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-8">
                  <Clock className="text-cyan-400" size={40} /> Real-Time Attendance Matrix
                </h3>
                <div className="flex gap-4">
                   <div className="px-8 py-4 glass rounded-2xl border-white/10 text-[12px] text-slate-500 uppercase tracking-widest font-black flex items-center gap-4 cursor-pointer hover:text-white transition-all"><Calendar size={18} /> Cycle History</div>
                   <div className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[12px] uppercase tracking-widest font-black flex items-center gap-4 shadow-xl shadow-indigo-600/20">Today: {new Date().toLocaleDateString([], { month: 'long', day: 'numeric' })}</div>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {attendanceData.map((att, i) => (
                  <div key={i} className="p-10 bg-white/[0.01] border border-white/5 rounded-[3.5rem] space-y-8 group hover:border-cyan-500/40 transition-all relative overflow-hidden">
                     <div className={`absolute top-0 right-0 p-6 ${att.status === 'In' ? 'text-emerald-500' : 'text-slate-800'} opacity-10`}><Activity size={100} /></div>
                     <div className="flex justify-between items-start relative z-10">
                        <div>
                           <div className="text-2xl font-black text-white uppercase tracking-tight mb-1">{att.name}</div>
                           <div className="text-[12px] text-slate-600 font-black uppercase tracking-widest">{att.shift}</div>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border ${att.status === 'In' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-black/40 text-slate-600 border-white/5'}`}>
                           {att.status}
                        </div>
                     </div>
                     <div className="flex items-end justify-between relative z-10 pt-4 border-t border-white/5">
                        <div>
                           <div className="text-[12px] font-black text-slate-800 uppercase tracking-widest mb-1">Last Timestamp</div>
                           <div className="text-3xl font-black text-white font-mono">{att.time}</div>
                        </div>
                        <div className={`text-lg font-black font-mono ${att.variance.startsWith('-') ? 'text-emerald-400' : 'text-rose-400'}`}>
                           {att.variance}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'payroll' && (
          <div className="glass p-16 rounded-[4rem] border-white/5 bg-[#02020a]/60 shadow-3xl animate-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-12">
              <h3 className="text-3xl font-black text-white flex items-center gap-8 uppercase tracking-tighter">
                <DollarSign className="text-emerald-500" size={40} /> Global Payroll Allotment
              </h3>
              <button className="px-12 py-6 bg-emerald-600 text-white rounded-[2.5rem] text-base font-black uppercase tracking-[0.4em] shadow-glow shadow-emerald-500/30 active:scale-95 transition-all border border-white/10 hover:bg-emerald-500">Dispatch Hub-Level Disbursement</button>
            </div>
            <div className="space-y-16">
              {[
                { label: 'Gross Functional Payroll', budget: 1450000, actual: 1412000, color: 'bg-indigo-500', icon: <Landmark size={24} /> },
                { label: 'Mandatory Social Benefits', budget: 185000, actual: 172000, color: 'bg-cyan-500', icon: <ShieldCheck size={24} /> },
                { label: 'Field-Level Incentives', budget: 95000, actual: 112500, color: 'bg-fuchsia-500', icon: <Zap size={24} /> }
              ].map((p, i) => (
                <div key={i} className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-6">
                       <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400`}>{p.icon}</div>
                       <div>
                          <div className="text-2xl font-black text-slate-200 uppercase tracking-tight">{p.label}</div>
                          <div className="text-[12px] text-slate-800 mt-2 uppercase font-black tracking-widest">Allotted Forecast: ${p.budget.toLocaleString()}</div>
                       </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Consumed</div>
                      <div className="text-4xl font-black text-white font-mono tracking-tighter">${p.actual.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                    <div className={`h-full ${p.color} rounded-full shadow-glow transition-all duration-1500`} style={{ width: `${(p.actual / p.budget) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {analysisRes && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-8 bg-[#02020a]/95 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="glass w-full max-w-5xl rounded-[5rem] p-20 border-white/10 relative shadow-[0_64px_256px_-12px_rgba(0,0,0,1)] overflow-hidden">
            <div className="absolute top-0 right-0 p-24 opacity-[0.03] rotate-12 scale-150"><Sparkles size={400} /></div>
            <button onClick={() => setAnalysisRes(null)} className="absolute top-12 right-12 p-5 glass rounded-full text-slate-500 hover:text-white transition-all border-white/10 active:scale-90"><X size={32} /></button>
            <div className="flex items-center gap-10 mb-16 relative z-10">
              <div className="p-8 bg-indigo-500/10 text-indigo-400 rounded-[3rem] border-2 border-indigo-500/20 shadow-glow shadow-indigo-500/10"><Sparkles size={64} /></div>
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Strategic Talent Synthesis</h2>
            </div>
            <div className="prose prose-invert max-w-none relative z-10">
              <div className="bg-black/60 p-16 rounded-[4rem] border border-white/10 text-slate-300 text-2xl font-medium leading-[1.8] font-mono whitespace-pre-wrap shadow-2xl">{analysisRes}</div>
            </div>
            <div className="mt-16 flex justify-end gap-6 relative z-10">
               <button className="px-12 py-6 glass border-white/10 rounded-[2.5rem] text-base font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-all">Audit Raw Data</button>
               <button className="px-12 py-6 bg-indigo-600 text-white rounded-[2.5rem] text-base font-black uppercase tracking-[0.4em] shadow-glow shadow-indigo-600/20">Commit to Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, val, icon: Icon, color, trend }: any) => (
  <div className="glass p-12 rounded-[4rem] border-white/5 relative group hover:border-white/15 transition-all shadow-2xl bg-gradient-to-br from-white/[0.01] to-transparent overflow-hidden">
     <div className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.06] transition-all duration-1000 transform group-hover:rotate-12 group-hover:scale-150"><Icon size={180} /></div>
     <div className="flex items-center justify-between mb-10 relative z-10">
        <div className={`p-5 rounded-[1.8rem] bg-white/5 border border-white/10 ${color} shadow-inner group-hover:scale-110 transition-transform`}><Icon size={28} /></div>
        <div className="text-right">
           <span className={`text-[12px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/5 bg-white/5 ${trend.startsWith('+') ? 'text-emerald-400' : trend === 'Stable' ? 'text-slate-500' : 'text-rose-400'}`}>{trend}</span>
        </div>
     </div>
     <div className="text-5xl font-black text-white tracking-tighter mb-2 relative z-10 drop-shadow-glow uppercase leading-none font-mono">{val}</div>
     <div className="text-[12px] text-slate-600 font-black uppercase tracking-[0.5em] relative z-10">{label}</div>
     <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </div>
);

export default EmployeesPage;
