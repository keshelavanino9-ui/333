
import React, { useState, useMemo, useContext, useEffect } from 'react';
import { 
  BarChart4, Upload, FileText, TrendingUp, DollarSign, ArrowRight, 
  CheckCircle2, PieChart, Calculator, Zap, FileSpreadsheet, Activity, X, Loader2,
  Layers, Database, Globe, Filter, ChevronDown, Download, Sparkles, Plus, Search,
  TrendingDown, ShieldCheck, Terminal, Users, Cpu, LineChart, Wallet, CreditCard,
  Scale, ArrowUpRight, BarChart, History, Landmark, Briefcase, TrendingUp as TrendingIcon,
  Flame, Boxes, Landmark as Bank, Settings2, Truck, Package, Factory, HardHat, Box,
  BarChart3, PieChart as PieIcon, LineChart as LineIcon, Target, FileSearch, Trash2,
  FileCode, FileUp, ClipboardList, Gauge, Milestone, Map, Calendar, Play, Mail, BrainCircuit
} from 'lucide-react';
import { gemini } from '../services/geminiService';
import { LanguageContext, CompanyContext, NotificationContext } from '../App';
import { FinancialTemplate, ROIInputs, FinancialStatementRow, CapexProject } from '../types';
import { exportToPDF } from '../utils/helpers';

const reportTemplates: FinancialTemplate[] = [
  { 
    id: 'lps', 
    name: 'Logistics Performance Synthesis', 
    category: 'Strategic', 
    description: 'Autonomous executive review of supply chain margins and capital velocity.',
    prompt: 'Conduct an executive synthesis of logistics performance based on the provided data. Focus on hub-level margins and OpEx variances.'
  },
  { 
    id: 'fba', 
    name: 'Fleet Burn Analysis', 
    category: 'Operational', 
    description: 'Detailed projection of fleet maintenance and fuel efficiency patterns.',
    prompt: 'Analyze fleet operational data. Identify high-burn clusters and suggest maintenance stagger protocols to optimize EBITDA.'
  },
  { 
    id: 'hms', 
    name: 'Hub Margin Synthesis', 
    category: 'Financial', 
    description: 'Regional comparison of yield vs fixed infrastructure burden.',
    prompt: 'Compare regional hubs. Identify geographic dependency risks and yield intensity per square meter of storage.'
  }
];

const mockPandL: FinancialStatementRow[] = [
  { label: 'Standard Logistics Revenue', budget: 14200000, actual: 14550000, variance: 350000, variancePct: 2.5 },
  { label: 'Priority Fleet Services', budget: 8400000, actual: 8150000, variance: -250000, variancePct: -2.9 },
  { label: 'Hub Storage Yield', budget: 3200000, actual: 3350000, variance: 150000, variancePct: 4.6 },
  { label: 'Fleet Maintenance COGS', budget: -5400000, actual: -5200000, variance: 200000, variancePct: 3.7 },
  { label: 'Logistics Staff Payroll', budget: -4200000, actual: -4180000, variance: 20000, variancePct: 0.5 },
  { label: 'Network Energy Costs', budget: -1200000, actual: -1350000, variance: -150000, variancePct: -12.5 },
  { label: 'Corporate Overheads', budget: -1800000, actual: -1800000, variance: 0, variancePct: 0 },
];

const mockCapex: CapexProject[] = [
  { id: '1', title: "Hub Automation V3", budget: "$12.5M", status: "Executing", progress: 45, iconType: 'cpu', color: 'indigo' },
  { id: '2', title: "Fleet Electrification", budget: "$8.2M", status: "Planned", progress: 12, iconType: 'zap', color: 'emerald' },
  { id: '3', title: "Drone Distribution Unit", budget: "$4.4M", status: "Approved", progress: 0, iconType: 'box', color: 'fuchsia' },
  { id: '4', title: "Infrastructure Hardening", budget: "$2.8M", status: "Audit", progress: 88, iconType: 'shield', color: 'cyan' },
];

const FinanceIntelligencePage: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const companyCtx = useContext(CompanyContext);
  const { addNotification } = useContext(NotificationContext);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report-gen' | 'roi-calculator' | 'scenario' | 'capex'>('dashboard');
  
  // Data Ingestion / Report Generator State
  const [ingesting, setIngesting] = useState(false);
  const [ingestionLogs, setIngestionLogs] = useState<string[]>([]);
  const [ingestedData, setIngestedData] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<FinancialTemplate | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [finalReport, setFinalReport] = useState<string | null>(null);
  const [adhocQuery, setAdhocQuery] = useState('');

  // ROI Calculator State
  const [capEx, setCapEx] = useState(1200000);
  const [annualSavings, setAnnualSavings] = useState(350000);
  const [yieldGains, setYieldGains] = useState(8);
  const [horizon, setHorizon] = useState(5);
  const [roiAnalyzing, setRoiAnalyzing] = useState(false);
  const [roiAnalysis, setRoiAnalysis] = useState<string | null>(null);

  // Simulation drivers
  const [unitOutputAlpha, setUnitOutputAlpha] = useState(100); 
  const [unitYieldBeta, setUnitYieldBeta] = useState(1.15); 
  const [localCurrencyRate, setLocalCurrencyRate] = useState(2.68);
  const [simulating, setSimulating] = useState(false);
  const [simOutput, setSimOutput] = useState<string | null>(null);

  const triggerSimulation = async () => {
    setSimulating(true);
    try {
      const out = await gemini.runFinancialSimulation({
        unitOutputAlpha,
        unitYieldBeta,
        localCurrencyRate,
        entities: companyCtx?.currentCompany.nameEn
      }, lang);
      setSimOutput(out);
      addNotification('Simulation Completed', 'Neural scenario modeling finished successfully.', 'success');
    } catch (e) {
      setSimOutput(lang === 'en' ? "Neural Simulation Timeout." : "ნეირალური სიმულაციის შეცდომა.");
      addNotification('Simulation Error', 'Failed to generate scenario model.', 'error');
    } finally {
      setSimulating(false);
    }
  };

  const runRoiAnalysis = async () => {
    setRoiAnalyzing(true);
    try {
      const result = await gemini.chat([{
        id: 'roi',
        role: 'user',
        content: `As an ROI Architect, evaluate this project: CapEx: $${capEx}, Annual Savings: $${annualSavings}, Yield Gains: ${yieldGains}%, Horizon: ${horizon} years. Suggest optimizations for faster payback.`,
        timestamp: Date.now()
      }], lang);
      setRoiAnalysis(result.response);
      addNotification('ROI Analysis Ready', 'Strategic yield optimization insights generated.', 'ai');
    } catch (e) {
      console.error(e);
    } finally {
      setRoiAnalyzing(false);
    }
  };

  const handleIngestion = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIngesting(true);
    setIngestionLogs([lang === 'en' ? "Initializing Ingestion Layer..." : "ინფორმაციის მიღების ფენის ინიციალიზაცია..."]);
    
    const steps = [
      lang === 'en' ? "Detecting source encoding..." : "კოდირების იდენტიფიცირება...",
      lang === 'en' ? "Normalizing currency headers..." : "ვალუტის ჰედერების ნორმალიზაცია...",
      lang === 'en' ? "Reconciling intercompany offsets..." : "შიდაკომპანიური ტრანზაქციების რეზონანსი...",
      lang === 'en' ? "Structuring foundation for AI..." : "AI-სთვის სტრუქტურული ბაზის მომზადება..."
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 600));
      setIngestionLogs(prev => [...prev, step]);
    }

    setIngestedData({
      filename: file.name,
      rows: 1240,
      confidence: 0.98,
      status: 'Ready'
    });
    setIngesting(false);
    addNotification('File Ingested', `${file.name} normalized and ready for synthesis.`, 'success');
  };

  const handleGenerateReport = async () => {
    if (!ingestedData || !selectedTemplate) return;
    setGeneratingReport(true);
    try {
      const report = await gemini.analyzeFinancialData(
        `File: ${ingestedData.filename}, Rows: ${ingestedData.rows}. Adhoc: ${adhocQuery}`,
        selectedTemplate,
        lang
      );
      setFinalReport(report);
      addNotification('Report Generated', `${selectedTemplate.name} successfully synthesized.`, 'ai');
    } catch (e) {
      setFinalReport("Synthesis protocol error.");
      addNotification('Synthesis Failed', 'AI model encountered a logic gate error.', 'error');
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleExportPDF = () => {
    if (finalReport) {
      exportToPDF('Nyx_Financial_Synthesis', finalReport);
      addNotification('PDF Exported', 'Financial report downloaded successfully.', 'info');
    }
  };

  const handleDispatch = () => {
    addNotification('Dispatch Initiated', 'Report sent to secure regional hub channels.', 'success');
  };

  const calculateROI = useMemo(() => {
    const totalCapEx = capEx;
    const totalGains = (annualSavings + (capEx * (yieldGains / 100))) * horizon;
    const roi = ((totalGains - totalCapEx) / totalCapEx) * 100;
    const payback = totalCapEx / (annualSavings + (capEx * (yieldGains / 100)));
    return { roi, payback, totalGains };
  }, [capEx, annualSavings, yieldGains, horizon]);

  const t = {
    en: {
      budgeting: "Fiscal Orchestration",
      hub: "Intelligence",
      tabs: ["Performance Dashboard", "Report Generator", "ROI Architect", "Neural Scenario", "CAPEX Roadmap"],
      pnl: "Fiscal Variance Synthesis",
      ingestionTitle: "Automated Data Ingestion",
      ingestionDesc: "Upload Excel, PDF, or CSV sources for Nyx to structure and analyze.",
      roiTitle: "ROI Architect",
      roiSubtitle: "Project Yield Optimization",
      scenarioTitle: "Neural Scenario Planning",
      scenarioSubtitle: "Predictive 'What-If' Simulation",
      capexTitle: "CAPEX Strategic Roadmap",
      capexSubtitle: "Multi-Year Capital Expenditure Planning"
    },
    ka: {
      budgeting: "ფისკალური მართვა",
      hub: "ინტელექტი",
      tabs: ["დესკტოპი", "რეპორტინგის გენერატორი", "ROI არქიტექტორი", "ნეირალური სცენარი", "CAPEX საგზაო რუკა"],
      pnl: "ფისკალური ვარიაციის სინთეზი",
      ingestionTitle: "მონაცემთა ავტომატური იმპორტი",
      ingestionDesc: "ატვირთეთ Excel, PDF, ან CSV ფაილები სტრუქტურირებისთვის.",
      roiTitle: "ROI არქიტექტორი",
      roiSubtitle: "პროექტის მომგებიანობის ოპტიმიზაცია",
      scenarioTitle: "ნეირალური სცენარის დაგეგმვა",
      scenarioSubtitle: "პროგნოზული 'რა მოხდება თუ' სიმულაცია",
      capexTitle: "CAPEX სტრატეგიული რუკა",
      capexSubtitle: "მრავალწლიანი კაპიტალური დანახარჯების დაგეგმვა"
    }
  }[lang];

  return (
    <div className="space-y-16 pb-40 fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pt-6">
        <div className="animate-in slide-in-from-left-12 duration-1000">
          <div className="flex items-center gap-8 mb-10">
             <div className="h-px w-24 bg-emerald-500 shadow-glow shadow-emerald-500/50"></div>
             <span className="text-micro text-emerald-400 font-black uppercase tracking-[0.6em]">{t.budgeting}</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none uppercase">
            Finance <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500">{t.hub}</span>
          </h1>
        </div>
        
        <div className="flex gap-2 glass p-2 rounded-[3rem] shadow-2xl overflow-x-auto no-scrollbar max-w-full animate-in slide-in-from-right-12 duration-1000 border-white/5">
           {['dashboard', 'report-gen', 'roi-calculator', 'scenario', 'capex'].map((id, i) => (
             <button 
               key={id}
               onClick={() => setActiveTab(id as any)}
               className={`px-10 py-5 text-[10px] uppercase font-black rounded-[2.5rem] transition-all whitespace-nowrap ${activeTab === id ? 'bg-indigo-600 text-white shadow-glow shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
             >
               {t.tabs[i]}
             </button>
           ))}
        </div>
      </div>

      <div className="transition-all duration-700 transform">
        {activeTab === 'dashboard' && (
          <div className="space-y-16 animate-in slide-in-from-bottom-12 duration-1000">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <KPIItem label="Group EBITDA" val="$142.8M" trend="+4.5%" icon={<TrendingUp size={24}/>} color="text-emerald-400" />
              <KPIItem label="Cash Reserve" val="$32.4M" trend="+12.1%" icon={<Landmark size={24}/>} color="text-cyan-400" />
              <KPIItem label="Burn Velocity" val="0.14x" trend="Stable" icon={<Activity size={24}/>} color="text-indigo-400" />
              <KPIItem label="Hub Efficiency" val="94.2%" trend="+2.1%" icon={<Factory size={24}/>} color="text-fuchsia-400" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
              <div className="xl:col-span-2 glass p-14 rounded-[5rem] bg-black/40 shadow-3xl overflow-hidden relative border-white/5">
                 <div className="flex items-center justify-between mb-16">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-8">
                      <History className="text-emerald-500" size={32} /> {t.pnl}
                    </h3>
                 </div>
                 
                 <div className="space-y-4">
                    {mockPandL.map((row, i) => {
                      const isPos = row.variancePct >= 0;
                      const intensity = Math.min(Math.abs(row.variancePct) * 5, 50); // Cap width scale
                      // Generate heatmap-style color classes based on variance intensity
                      const colorClass = isPos 
                        ? (row.variancePct > 5 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-emerald-500/50')
                        : (row.variancePct < -5 ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'bg-rose-500/50');
                      
                      return (
                        <div key={i} className="flex items-center gap-6 p-6 rounded-[2rem] bg-black/40 border border-white/5 hover:border-white/10 transition-all group">
                           <div className="w-1/3">
                              <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{row.label}</div>
                              <div className="flex gap-4 mt-2">
                                <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Target: ${row.budget.toLocaleString()}</span>
                              </div>
                           </div>
                           
                           {/* Variance Heatmap Bar */}
                           <div className="flex-1 h-12 bg-[#050510] rounded-2xl overflow-hidden border border-white/5 relative flex items-center shadow-inner">
                              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/10 z-10"></div>
                              <div className={`absolute top-3 bottom-3 ${isPos ? 'left-1/2 rounded-r-lg' : 'right-1/2 rounded-l-lg'} ${colorClass} transition-all duration-1000`} style={{ width: `${intensity}%` }}></div>
                           </div>

                           <div className="w-1/5 text-right">
                              <div className="text-xl font-black text-white font-mono">${row.actual.toLocaleString()}</div>
                              <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                                 {isPos ? '+' : ''}{row.variancePct}% Var
                              </div>
                           </div>
                        </div>
                      );
                    })}
                 </div>
              </div>

              <div className="xl:col-span-1 space-y-12">
                 <div className="glass p-12 rounded-[4rem] shadow-3xl relative overflow-hidden group border-white/10 bg-black/40">
                    <h3 className="text-xl font-black text-white uppercase flex items-center gap-6 relative z-10 tracking-tighter">
                      <Scale className="text-indigo-400" size={28} /> Yield Intensity Matrix
                    </h3>
                    <div className="mt-16 space-y-12 relative z-10">
                      <ProgressBar label="Fleet Utilization" val={84} color="bg-emerald-500" />
                      <ProgressBar label="Storage Capacity" val={62} color="bg-cyan-500" />
                      <ProgressBar label="Tech Debt Coverage" val={45} color="bg-fuchsia-500" />
                      <ProgressBar label="Regional Scaling" val={78} color="bg-indigo-500" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'report-gen' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-16 animate-in slide-in-from-bottom-12 duration-1000">
            <div className="xl:col-span-1 space-y-12">
               <div className="glass p-12 rounded-[4rem] border-white/5 bg-black/40 shadow-3xl">
                  <h3 className="text-xl font-black text-white uppercase mb-10 flex items-center gap-6">
                    <FileUp className="text-indigo-400" size={24} /> {t.ingestionTitle}
                  </h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold leading-relaxed mb-10">{t.ingestionDesc}</p>
                  
                  {!ingestedData && !ingesting && (
                    <label className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01] hover:bg-white/[0.03] hover:border-indigo-500/30 transition-all cursor-pointer group">
                       <Upload className="text-slate-800 mb-4 group-hover:text-indigo-400 transition-colors" size={48} />
                       <span className="text-micro text-slate-700 font-black tracking-[0.4em] group-hover:text-slate-500">Dispatch File</span>
                       <input type="file" className="hidden" onChange={handleIngestion} />
                    </label>
                  )}

                  {ingesting && (
                    <div className="h-56 bg-black/60 rounded-[3rem] border border-white/5 p-8 flex flex-col justify-center gap-6 shadow-inner">
                       <div className="flex items-center gap-4">
                          <Loader2 className="text-indigo-500 animate-spin" size={20} />
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Autonomous Handshake...</span>
                       </div>
                       <div className="space-y-2">
                         {ingestionLogs.slice(-2).map((log, i) => (
                           <div key={i} className="text-[9px] font-mono text-indigo-400 opacity-60 flex items-center gap-2">
                             <ArrowRight size={10} /> {log}
                           </div>
                         ))}
                       </div>
                    </div>
                  )}

                  {ingestedData && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[3rem] p-8 space-y-6 shadow-inner">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                             <CheckCircle2 className="text-emerald-500" size={24} />
                             <span className="text-sm font-black text-white uppercase truncate max-w-[120px]">{ingestedData.filename}</span>
                          </div>
                          <button onClick={() => setIngestedData(null)} className="text-slate-600 hover:text-white transition-colors"><X size={18} /></button>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="text-[9px] font-black text-slate-500 uppercase">Confidence: <span className="text-emerald-400">{(ingestedData.confidence * 100).toFixed(0)}%</span></div>
                          <div className="text-[9px] font-black text-slate-500 uppercase">Rows: <span className="text-white">{ingestedData.rows}</span></div>
                       </div>
                    </div>
                  )}
               </div>

               <div className="glass p-12 rounded-[4rem] border-white/5 bg-black/40 shadow-3xl">
                  <h3 className="text-xl font-black text-white uppercase mb-10 flex items-center gap-6">
                    <Sparkles className="text-fuchsia-400" size={24} /> Synthesis Protocol
                  </h3>
                  <div className="space-y-4">
                    {reportTemplates.map(tmpl => (
                      <button 
                        key={tmpl.id}
                        onClick={() => setSelectedTemplate(tmpl)}
                        className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all group ${
                          selectedTemplate?.id === tmpl.id 
                           ? 'bg-fuchsia-600/15 border-fuchsia-600 text-white shadow-glow shadow-fuchsia-600/20' 
                           : 'bg-white/[0.02] border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-200'
                        }`}
                      >
                         <div className="text-[12px] font-black uppercase tracking-widest mb-2">{tmpl.name}</div>
                         <div className="text-[10px] opacity-60 font-medium leading-relaxed uppercase">{tmpl.description}</div>
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="xl:col-span-2 space-y-12">
               <div className="glass min-h-[600px] rounded-[5rem] border-white/5 bg-black/60 shadow-3xl overflow-hidden relative flex flex-col">
                  <div className="p-12 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                     <div className="flex items-center gap-8">
                        <Terminal className="text-indigo-400" size={32} />
                        <div>
                           <h4 className="text-2xl font-black text-white uppercase tracking-tighter">AI Synthesis Node</h4>
                           <div className="text-micro text-slate-700 uppercase tracking-widest mt-1">Status: {generatingReport ? 'Processing Inference' : 'Standby'}</div>
                        </div>
                     </div>
                     <button 
                       disabled={!ingestedData || !selectedTemplate || generatingReport}
                       onClick={handleGenerateReport}
                       className="px-10 py-5 bg-indigo-600 text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] shadow-glow shadow-indigo-600/20 disabled:opacity-20 hover:bg-indigo-500 active:scale-95 transition-all flex items-center gap-4"
                     >
                       {generatingReport ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                       Initiate Synthesis
                     </button>
                  </div>
                  
                  <div className="flex-1 p-16 overflow-y-auto custom-scrollbar">
                    {finalReport ? (
                      <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-8 duration-700">
                         <div className="text-slate-300 font-mono text-lg leading-[1.8] whitespace-pre-wrap">{finalReport}</div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                         <FileSearch size={120} className="text-slate-800 mb-10" />
                         <p className="text-[12px] font-black text-slate-700 uppercase tracking-[0.8em]">Select manifest and template to proceed</p>
                      </div>
                    )}
                  </div>

                  {finalReport && (
                    <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-end gap-6">
                       <button onClick={handleExportPDF} className="flex items-center gap-4 text-micro font-black text-slate-600 hover:text-white transition-all uppercase tracking-[0.4em]"><Download size={16} /> Export PDF</button>
                       <button onClick={handleDispatch} className="flex items-center gap-4 text-micro font-black text-slate-600 hover:text-white transition-all uppercase tracking-[0.4em]"><Mail size={16} /> Dispatch Hubs</button>
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'roi-calculator' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 animate-in slide-in-from-bottom-12 duration-1000">
            <div className="glass p-16 rounded-[5rem] border-white/5 bg-black/40 shadow-3xl space-y-16">
               <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{t.roiTitle}</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-2">{t.roiSubtitle}</p>
                  </div>
                  <div className="p-5 bg-emerald-500/10 text-emerald-500 rounded-3xl border border-emerald-500/20"><Calculator size={32} /></div>
               </div>

               <div className="space-y-12">
                 <RoiSlider label="Capital Expenditure (CapEx)" val={capEx} setVal={setCapEx} min={100000} max={10000000} step={50000} prefix="$" />
                 <RoiSlider label="Annual OpEx Savings" val={annualSavings} setVal={setAnnualSavings} min={10000} max={2000000} step={10000} prefix="$" />
                 <RoiSlider label="Projected Yield Gain" val={yieldGains} setVal={setYieldGains} min={0} max={50} step={0.5} suffix="%" />
                 <RoiSlider label="Evaluation Horizon" val={horizon} setVal={setHorizon} min={1} max={10} step={1} suffix=" Years" />
               </div>

               <button 
                onClick={runRoiAnalysis}
                disabled={roiAnalyzing}
                className="w-full py-7 bg-emerald-600 text-white rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.5em] flex items-center justify-center gap-6 shadow-glow shadow-emerald-600/20 hover:bg-emerald-500 active:scale-95 transition-all"
               >
                 {roiAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
                 Synthesize AI Optimization
               </button>
            </div>

            <div className="space-y-12">
               <div className="glass p-16 rounded-[5rem] border-white/5 bg-gradient-to-br from-emerald-950/20 shadow-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-16 opacity-[0.05]"><Target size={240} className="text-emerald-500" /></div>
                  <h3 className="text-2xl font-black text-white uppercase mb-14 tracking-tighter flex items-center gap-8 relative z-10">
                    <Gauge className="text-emerald-400" size={32} /> Real-Time Projections
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                     <div className="space-y-4">
                        <div className="text-micro text-slate-500 font-black uppercase tracking-widest">Calculated ROI</div>
                        <div className="text-6xl font-black text-emerald-400 drop-shadow-glow font-mono">{calculateROI.roi.toFixed(1)}%</div>
                     </div>
                     <div className="space-y-4">
                        <div className="text-micro text-slate-500 font-black uppercase tracking-widest">Payback Period</div>
                        <div className="text-6xl font-black text-white font-mono">{calculateROI.payback.toFixed(1)} <span className="text-lg opacity-40">YRS</span></div>
                     </div>
                     <div className="md:col-span-2 pt-10 border-t border-white/5">
                        <div className="text-micro text-slate-500 font-black uppercase tracking-widest mb-4">Net Fiscal Gain ({horizon}Y)</div>
                        <div className="text-5xl font-black text-white font-mono">${calculateROI.totalGains.toLocaleString()}</div>
                     </div>
                  </div>
               </div>

               {roiAnalysis ? (
                 <div className="glass p-16 rounded-[5rem] border-indigo-500/20 bg-indigo-500/5 shadow-3xl animate-in fade-in slide-in-from-right-8 duration-700">
                    <h3 className="text-xl font-black text-white uppercase mb-8 flex items-center gap-6">
                      <Sparkles className="text-indigo-400" size={24} /> Architect Insights
                    </h3>
                    <p className="text-base text-slate-300 font-medium leading-[1.8] italic font-mono uppercase tracking-tight">
                       {roiAnalysis}
                    </p>
                 </div>
               ) : (
                 <div className="glass p-16 rounded-[5rem] border-white/5 bg-black/30 flex flex-col items-center justify-center text-center opacity-40 h-[320px]">
                    <ShieldCheck size={80} className="text-slate-800 mb-8" />
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.6em]">Awaiting Simulation Dispatch</p>
                 </div>
               )}
            </div>
          </div>
        )}

        {activeTab === 'scenario' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-16 animate-in slide-in-from-bottom-12 duration-1000">
            <div className="xl:col-span-1 glass p-16 rounded-[5rem] border-white/5 bg-black/40 shadow-3xl space-y-16">
               <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{t.scenarioTitle}</h3>
                  <LineChart className="text-indigo-400" size={32} />
               </div>
               
               <div className="space-y-12">
                  <RoiSlider label="Unit Output Alpha" val={unitOutputAlpha} setVal={setUnitOutputAlpha} min={50} max={200} step={1} suffix=" Units/H" />
                  <RoiSlider label="Unit Yield Beta" val={unitYieldBeta} setVal={setUnitYieldBeta} min={0.5} max={2.0} step={0.01} suffix=" Multiplier" />
                  <RoiSlider label="Market Currency Delta" val={localCurrencyRate} setVal={setLocalCurrencyRate} min={2.0} max={4.0} step={0.05} prefix="₾" />
               </div>

               <button 
                onClick={triggerSimulation}
                disabled={simulating}
                className="w-full py-7 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.5em] flex items-center justify-center gap-6 shadow-glow shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all"
               >
                 {simulating ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
                 Execute Neural Simulation
               </button>
            </div>

            <div className="xl:col-span-2 glass min-h-[500px] rounded-[5rem] border-white/5 bg-black/60 shadow-3xl overflow-hidden relative">
               <div className="p-12 border-b border-white/5 bg-white/[0.02] flex items-center gap-8">
                  <Cpu className="text-indigo-400" size={32} />
                  <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Simulation Narrative</h4>
               </div>
               <div className="p-16 overflow-y-auto custom-scrollbar h-[520px]">
                 {simOutput ? (
                   <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="text-slate-300 font-mono text-xl leading-[2] whitespace-pre-wrap">{simOutput}</div>
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                      <Layers size={140} className="text-slate-800 mb-10" />
                      <p className="text-[12px] font-black text-slate-700 uppercase tracking-[0.8em]">Input drivers and trigger neural handshake</p>
                   </div>
                 )}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'capex' && (
          <div className="space-y-16 animate-in slide-in-from-bottom-12 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
               <div className="animate-in slide-in-from-left-10 duration-1000">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{t.capexTitle}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-2">{t.capexSubtitle}</p>
               </div>
               <div className="flex gap-4">
                  <button className="px-10 py-5 glass border-white/10 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-white/5 transition-all">
                     <Calendar size={18} /> Schedule Audit
                  </button>
                  <button className="px-10 py-5 bg-fuchsia-600 text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-glow shadow-fuchsia-600/20 flex items-center gap-4 hover:bg-fuchsia-500 active:scale-95 transition-all">
                     <Plus size={18} /> Propose Project
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
               {mockCapex.map((proj) => (
                 <div key={proj.id} className="glass p-12 rounded-[4rem] border-white/5 bg-black/40 shadow-3xl relative group hover:border-fuchsia-500/30 transition-all overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                       {proj.iconType === 'cpu' && <Cpu size={120} />}
                       {proj.iconType === 'zap' && <Zap size={120} />}
                       {proj.iconType === 'box' && <Box size={120} />}
                       {proj.iconType === 'shield' && <ShieldCheck size={120} />}
                    </div>
                    
                    <div className="flex items-center justify-between mb-10 relative z-10">
                       <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 text-${proj.color}-400 shadow-inner`}>
                          {proj.iconType === 'cpu' && <Cpu size={28} />}
                          {proj.iconType === 'zap' && <Zap size={28} />}
                          {proj.iconType === 'box' && <Box size={28} />}
                          {proj.iconType === 'shield' && <ShieldCheck size={28} />}
                       </div>
                       <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 bg-white/5 ${proj.status === 'Executing' ? 'text-cyan-400' : 'text-slate-600'}`}>
                          {proj.status}
                       </div>
                    </div>

                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 leading-tight group-hover:text-fuchsia-400 transition-colors">{proj.title}</h4>
                    <div className="text-3xl font-black text-white font-mono mb-10">{proj.budget}</div>
                    
                    <div className="space-y-3">
                       <div className="flex justify-between text-[10px] font-black text-slate-700 uppercase tracking-widest">
                          <span>Progress</span>
                          <span>{proj.progress}%</span>
                       </div>
                       <div className="h-2 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                          <div className={`h-full bg-${proj.color}-500 rounded-full shadow-glow shadow-${proj.color}-500/40 transition-all duration-1500`} style={{ width: `${proj.progress}%` }}></div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            <div className="glass p-16 rounded-[5rem] border-white/5 bg-[#02020a]/40 shadow-3xl overflow-hidden relative">
               <div className="flex items-center gap-8 mb-16">
                  <Map className="text-indigo-400" size={32} />
                  <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Strategic Roadmap View (2025-2027)</h4>
               </div>
               
               <div className="relative h-[400px] border-l-2 border-white/5 ml-12 space-y-24 py-10">
                  <div className="absolute top-0 bottom-0 left-[-2px] w-0.5 bg-gradient-to-b from-fuchsia-500 via-indigo-500 to-cyan-500 opacity-30"></div>
                  
                  {[
                    { year: '2025', title: 'Phase I: Automation Core', items: ['Hub Robotics Tier 1', 'Network Backbone Upgrade'], color: 'fuchsia' },
                    { year: '2026', title: 'Phase II: Sustainable Fleet', items: ['EV Fleet Integration', 'Solar Grid Installation'], color: 'indigo' },
                    { year: '2027', title: 'Phase III: Autonomous Edge', items: ['Drone Swarm Deployment', 'Predictive Mesh Logic'], color: 'cyan' },
                  ].map((phase, i) => (
                    <div key={i} className="relative pl-16 group">
                       <div className={`absolute left-[-11px] top-1 w-5 h-5 rounded-full bg-black border-4 border-${phase.color}-500 shadow-glow shadow-${phase.color}-500/50 group-hover:scale-150 transition-all duration-500`}></div>
                       <div className="flex flex-col md:flex-row md:items-center gap-10">
                          <div className="text-4xl font-black text-white font-mono leading-none">{phase.year}</div>
                          <div className="flex-1 glass p-8 rounded-[3rem] border-white/5 bg-black/20 group-hover:bg-black/40 transition-all">
                             <div className="text-xl font-black text-white uppercase tracking-tight mb-4">{phase.title}</div>
                             <div className="flex flex-wrap gap-4">
                                {phase.items.map(item => (
                                  <span key={item} className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-white/5">{item}</span>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const KPIItem = ({ label, val, trend, icon, color }: any) => (
  <div className="glass p-10 rounded-[4rem] border-white/5 bg-gradient-to-br from-white/[0.01] to-transparent relative group hover:border-white/10 transition-all shadow-3xl overflow-hidden">
     <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 ${color} shadow-inner group-hover:scale-110 transition-transform`}>{icon}</div>
        <span className={`text-[10px] font-black px-4 py-1.5 rounded-full bg-white/5 border border-white/5 tracking-widest shadow-inner ${trend.startsWith('+') ? 'text-emerald-400' : 'text-slate-600'}`}>{trend}</span>
     </div>
     <div className="text-4xl font-black text-white tracking-tighter mb-2 relative z-10 drop-shadow-glow uppercase leading-none">{val}</div>
     <div className="text-micro text-slate-600 font-black uppercase tracking-[0.4em] relative z-10">{label}</div>
     <div className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.1] transition-opacity duration-1000 pointer-events-none transform group-hover:scale-150 rotate-12">
       {React.cloneElement(icon as any, { size: 140 })}
     </div>
  </div>
);

const ProgressBar = ({ label, val, color, sub }: any) => (
  <div className="space-y-4 group">
    <div className="flex justify-between items-end">
       <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] group-hover:text-slate-300 transition-colors">{label}</span>
       <span className="text-sm font-black text-white font-mono">{sub || `${val}%`}</span>
    </div>
    <div className="h-2.5 w-full bg-black/80 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
       <div className={`h-full ${color} rounded-full shadow-glow transition-all duration-1500 ease-out`} style={{ width: `${val}%` }}></div>
    </div>
  </div>
);

const RoiSlider = ({ label, val, setVal, min, max, step, prefix = "", suffix = "" }: any) => (
  <div className="space-y-6">
     <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
        <div className="text-base font-black text-white font-mono">{prefix}{val.toLocaleString()}{suffix}</div>
     </div>
     <input 
        type="range" min={min} max={max} step={step} 
        value={val} 
        onChange={e => setVal(parseFloat(e.target.value))}
        className="w-full h-2 bg-black/80 rounded-full appearance-none cursor-pointer accent-indigo-500 shadow-inner border border-white/5" 
     />
  </div>
);

export default FinanceIntelligencePage;
