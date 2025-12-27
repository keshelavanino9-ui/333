
import React, { useState, useContext, useEffect, useRef } from 'react';
import { 
  Workflow, Database, Cpu, Zap, Terminal, Search, Mail, ShieldCheck, 
  Activity, CheckCircle2, RotateCw, RefreshCw, Layers, History, HeartPulse, 
  Clock, ArrowUpRight, ExternalLink, Filter, ChevronRight, Loader2,
  Lock, AlertTriangle, Eye, Play, ClipboardList, ShieldAlert, X, FileCode,
  Table2, Key, Type, Hash, AlignLeft, Calendar
} from 'lucide-react';
import { gemini } from '../services/geminiService';
import { LanguageContext, TuningContext } from '../App';
import { WorkflowExecution, SystemHealth, AdHocQueryProposal, AuditLog } from '../types';
import N8NVisualizer from '../components/ai/N8NVisualizer';

const OperationsPage: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const tuningCtx = useContext(TuningContext);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'history' | 'explorer' | 'health' | 'adhoc'>('adhoc');
  
  const [executing, setExecuting] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<string | null>(null);
  
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [health, setHealth] = useState<SystemHealth[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedTable, setSelectedTable] = useState('employees');
  const [tableData, setTableData] = useState<any[]>([]);

  // Ad-hoc Query State
  const [adhocQueryInput, setAdhocQueryInput] = useState('');
  const [adhocProposal, setAdhocProposal] = useState<AdHocQueryProposal | null>(null);
  const [adhocExecuting, setAdhocExecuting] = useState(false);
  const [adhocResult, setAdhocResult] = useState<any>(null);
  const [adhocSchemaTable, setAdhocSchemaTable] = useState('employees');
  const [adhocAudit, setAdhocAudit] = useState<AuditLog[]>([
    { id: 'aud_1', timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(), actor: 'nino_keshelava', intent: 'OPS.ADHOC.QUERY', status: 'COMMITTED', table: 'employees' }
  ]);

  // Enhanced Mock Schemas
  const tableSchemas: Record<string, { col: string; type: string; key?: string; desc?: string }[]> = {
    employees: [
      { col: 'id', type: 'INT', key: 'PK', desc: 'Unique Identifier' },
      { col: 'full_name_en', type: 'VARCHAR(255)', desc: 'Legal Name (EN)' },
      { col: 'department_id', type: 'VARCHAR(50)', key: 'FK', desc: 'Dept Link' },
      { col: 'salary_base', type: 'DECIMAL(10,2)', desc: 'Gross Monthly' },
      { col: 'active_status', type: 'BOOLEAN', desc: 'Employment State' },
      { col: 'hire_date', type: 'DATE', desc: 'Onboarding Date' }
    ],
    workflow_executions: [
      { col: 'execution_id', type: 'UUID', key: 'PK', desc: 'Trace ID' },
      { col: 'workflow_name', type: 'VARCHAR(100)', desc: 'Pipeline Name' },
      { col: 'trigger_source', type: 'VARCHAR(50)', desc: 'Event Origin' },
      { col: 'duration_ms', type: 'INT', desc: 'Latency' },
      { col: 'status_code', type: 'VARCHAR(20)', desc: 'Exit State' }
    ],
    expenses: [
      { col: 'expense_id', type: 'UUID', key: 'PK', desc: 'Record ID' },
      { col: 'category', type: 'VARCHAR(50)', desc: 'Cost Center' },
      { col: 'amount_usd', type: 'DECIMAL(12,2)', desc: 'Value' },
      { col: 'approver_id', type: 'INT', key: 'FK', desc: 'Manager Link' },
      { col: 'date_incurred', type: 'TIMESTAMP', desc: 'Transaction Time' }
    ],
    payroll_audit: [
      { col: 'audit_id', type: 'BIGINT', key: 'PK', desc: 'Log Entry' },
      { col: 'employee_id', type: 'INT', key: 'FK', desc: 'Payee' },
      { col: 'net_payout', type: 'DECIMAL', desc: 'Final Transfer' },
      { col: 'tax_deduction', type: 'DECIMAL', desc: 'Gov. Withholding' },
      { col: 'cycle_date', type: 'DATE', desc: 'Fiscal Period' }
    ]
  };

  const tableMetadata: Record<string, { rows: string; size: string; updated: string }> = {
    employees: { rows: '582', size: '1.2 MB', updated: '2m ago' },
    workflow_executions: { rows: '14.2k', size: '48 MB', updated: 'Live' },
    expenses: { rows: '8.4k', size: '12 MB', updated: '1h ago' },
    payroll_audit: { rows: '22.1k', size: '35 MB', updated: '6h ago' }
  };

  useEffect(() => {
    loadOperationalData();
  }, []);

  const loadOperationalData = async () => {
    setLoading(true);
    const [execs, status] = await Promise.all([
      gemini.fetchWorkflowExecutions(),
      gemini.fetchSystemHealth()
    ]);
    setExecutions(execs);
    setHealth(status);
    setLoading(false);
  };

  const handleRun = async () => {
    setExecuting(true);
    setLogs([]);
    setResults(null);
    setActiveTab('visualizer');
    
    await gemini.simulateAdvancedWorkflow((step) => {
      setActiveNode(step.id);
      setLogs(prev => [...prev, step.msg]);
    });

    const finalRes = await gemini.dispatchIntent('OPERATIONS.CYCLE.PRODUCTION', { hub: 'Central' }, lang, tuningCtx?.config);
    setResults(finalRes.response);
    setExecuting(false);
    setActiveNode(null);
    loadOperationalData();
  };

  const handleExploreTable = async (tableName: string) => {
    setSelectedTable(tableName);
    const data = await gemini.fetchTableData(tableName);
    setTableData(data);
  };

  const handleGenerateAdhoc = async () => {
    if (!adhocQueryInput.trim()) return;
    setAdhocExecuting(true);
    setAdhocResult(null); // Clear previous result
    
    try {
      const proposal = await gemini.generateAdHocProposal(adhocQueryInput, lang);
      setAdhocProposal(proposal);
    } catch (e) {
      setAdhocProposal(null);
    }
    setAdhocExecuting(false);
  };

  const handleExecuteAdhoc = async () => {
    if (!adhocProposal) return;
    setAdhocExecuting(true);
    
    // Simulate n8n webhook dispatch for Ad-Hoc
    await gemini.dispatchIntent('OPS.ADHOC.QUERY', {
      actor: { id: 'nino_keshelava', role: 'admin' },
      query: adhocProposal,
      reason: "Ad-hoc investigation"
    }, lang, tuningCtx?.config);

    // Mock result based on proposal
    setAdhocResult({
      request_id: `req_${Math.random().toString(36).substr(2, 9)}`,
      rows: [
        { id: 1, full_name: "Giorgi Beridze", department: "Operations", salary: 11500, status: "Active" },
        { id: 2, full_name: "Maya Kobakhidze", department: "Operations", salary: 5800, status: "Active" },
        { id: 3, full_name: "Alex Rivera", department: "Finance", salary: 9200, status: "Onboarding" }
      ].slice(0, adhocProposal.limit || 3),
      row_count: 3,
      audit_id: `aud_${Date.now()}`
    });

    setAdhocAudit(prev => [{
      id: `aud_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      intent: 'OPS.ADHOC.QUERY',
      table: adhocProposal.table || 'unknown',
      actor: 'nino_keshelava',
      status: 'COMMITTED'
    }, ...prev]);

    setAdhocExecuting(false);
  };

  const t = {
    en: {
      title: "Control Plane",
      sub: "Neural Operations",
      tabs: ["Ad-Hoc Console", "Pipeline View", "Execution Logs", "DB Governance", "Service Health"],
      run: "Execute Production Cycle"
    },
    ka: {
      title: "მართვის პანელი",
      sub: "ნეირალური ოპერაციები",
      tabs: ["Ad-Hoc კონსოლი", "ხაზის ხედი", "ლოგები", "მონაცემთა ბაზა", "სერვისის სტატუსი"],
      run: "წარმოების ციკლის გაშვება"
    }
  }[lang];

  return (
    <div className="space-y-12 pb-40 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pt-4">
        <div>
          <div className="flex items-center gap-4 mb-6">
             <div className="h-px w-16 bg-cyan-500 shadow-glow"></div>
             <span className="text-micro text-cyan-400 font-black uppercase tracking-[0.6em]">{t.sub}</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            NYX <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">OPERATIONS</span>
          </h1>
        </div>
        <button 
          onClick={handleRun} 
          disabled={executing}
          className="h-16 px-12 bg-indigo-600 text-white rounded-[2rem] text-base font-black uppercase tracking-[0.3em] flex items-center gap-6 hover:bg-indigo-500 transition-all shadow-glow active:scale-95 disabled:opacity-40 border border-white/10 group"
        >
          {executing ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} />}
          {executing ? 'Executing...' : t.run}
        </button>
      </div>

      <div className="flex gap-2 glass p-2 rounded-[3rem] border-white/5 shadow-3xl overflow-x-auto no-scrollbar">
        {t.tabs.map((tab, i) => {
          const ids = ['adhoc', 'visualizer', 'history', 'explorer', 'health'];
          return (
            <button 
              key={ids[i]}
              onClick={() => setActiveTab(ids[i] as any)}
              className={`px-12 py-5 text-[12px] uppercase font-black rounded-[2.5rem] transition-all whitespace-nowrap ${activeTab === ids[i] ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab === 'adhoc' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 animate-in slide-in-from-bottom-8">
          
          {/* Left Column: Query Builder & Schema */}
          <div className="xl:col-span-1 space-y-8">
            <div className="glass p-10 rounded-[3.5rem] border-white/5 bg-black/40 shadow-3xl space-y-8">
              <h3 className="text-xl font-black text-white uppercase flex items-center gap-6 border-b border-white/5 pb-8 tracking-tighter">
                 <Terminal className="text-cyan-400" size={24} /> DB Console
              </h3>
              
              <div className="p-6 glass-dark rounded-[2rem] border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 leading-relaxed">
                 <ShieldAlert size={24} className="shrink-0" /> Gov-Mode: Active. Only SELECT/UPDATE role-gated.
              </div>
              
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Search size={12} /> Natural Language Query
                 </label>
                 <textarea 
                   value={adhocQueryInput}
                   onChange={(e) => setAdhocQueryInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleGenerateAdhoc()}
                   placeholder="e.g. 'Show me average salary by department for active staff'"
                   className="w-full h-40 bg-[#050510] border border-white/10 rounded-3xl p-6 text-white text-base focus:border-cyan-500/50 outline-none placeholder:text-slate-700 font-medium resize-none shadow-inner"
                 />
                 <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest text-right">Ctrl + Enter to Generate</div>
              </div>
              
              <button 
               onClick={handleGenerateAdhoc}
               disabled={adhocExecuting || !adhocQueryInput.trim()}
               className="w-full py-6 bg-cyan-600 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-cyan-500 shadow-glow shadow-cyan-600/20 disabled:opacity-30 active:scale-95 transition-all"
              >
                {adhocExecuting ? <Loader2 className="animate-spin" size={18} /> : <Cpu size={18} />}
                Synthesize Proposal
              </button>
            </div>

            {/* Enhanced Schema Explorer Widget */}
            <div className="glass p-10 rounded-[3.5rem] border-white/5 bg-[#0a0a12]/80 shadow-3xl relative overflow-hidden flex flex-col h-[520px]">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                   <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-4">
                      <Table2 size={16} className="text-fuchsia-400" /> Schema Explorer
                   </h4>
                   <select 
                      value={adhocSchemaTable}
                      onChange={(e) => setAdhocSchemaTable(e.target.value)}
                      className="bg-black/40 border border-white/10 text-slate-300 text-[10px] font-bold uppercase rounded-xl px-3 py-2 outline-none focus:border-fuchsia-500 cursor-pointer"
                   >
                      {Object.keys(tableSchemas).map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                   <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                      <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Rows</div>
                      <div className="text-sm font-mono font-bold text-white">{tableMetadata[adhocSchemaTable]?.rows || '-'}</div>
                   </div>
                   <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                      <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Size</div>
                      <div className="text-sm font-mono font-bold text-white">{tableMetadata[adhocSchemaTable]?.size || '-'}</div>
                   </div>
                   <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                      <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Sync</div>
                      <div className="text-sm font-mono font-bold text-emerald-400">{tableMetadata[adhocSchemaTable]?.updated || '-'}</div>
                   </div>
                </div>
                
                <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
                   {tableSchemas[adhocSchemaTable]?.map((field, idx) => {
                      const getTypeColor = (t: string) => {
                         if (t.includes('INT') || t.includes('DECIMAL')) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
                         if (t.includes('VARCHAR') || t.includes('TEXT')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                         if (t.includes('DATE') || t.includes('TIME')) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                         return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
                      };

                      return (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 group hover:border-fuchsia-500/30 transition-all hover:bg-white/[0.05]">
                           <div className="flex items-center gap-3">
                              <div className={`p-1.5 rounded-lg ${field.key === 'PK' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                                {field.key === 'PK' ? <Key size={10} /> : field.type.includes('INT') ? <Hash size={10} /> : field.type.includes('DATE') ? <Calendar size={10} /> : <AlignLeft size={10} />}
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-xs font-mono font-bold text-slate-300 group-hover:text-white transition-colors">{field.col}</span>
                                 {field.desc && <span className="text-[8px] text-slate-600 font-bold uppercase tracking-wider">{field.desc}</span>}
                              </div>
                           </div>
                           <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${getTypeColor(field.type)}`}>
                              {field.type}
                           </span>
                        </div>
                      );
                   })}
                </div>
            </div>
          </div>

          {/* Right Column: Execution & Results */}
          <div className="xl:col-span-2 space-y-10">
             
             {/* Proposal Area */}
             <div className="glass p-12 rounded-[4rem] border-white/5 bg-[#02020a]/80 shadow-3xl min-h-[350px] flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8 relative z-10">
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-6">
                      <FileCode className="text-indigo-400" size={24} /> Query Proposal
                   </h3>
                   {adhocProposal && (
                     <div className="flex items-center gap-4">
                        <button 
                           onClick={() => setAdhocProposal(null)}
                           className="px-6 py-3 glass rounded-2xl text-[10px] font-black text-rose-400 uppercase tracking-widest hover:bg-rose-500/10 transition-all"
                        >
                           Reject
                        </button>
                        <button 
                         onClick={handleExecuteAdhoc}
                         disabled={adhocExecuting}
                         className="px-8 py-3 bg-emerald-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-glow shadow-emerald-600/30 flex items-center gap-3 hover:bg-emerald-500 active:scale-95 transition-all"
                        >
                          {adhocExecuting ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} Execute Intent
                        </button>
                     </div>
                   )}
                </div>
                
                <div className="flex-1 relative z-10">
                   {adhocProposal ? (
                     <div className="bg-black/80 p-10 rounded-[2.5rem] border border-white/10 font-mono text-cyan-300 text-sm overflow-auto shadow-inner h-full max-h-[400px]">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(adhocProposal, null, 2)}</pre>
                     </div>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center opacity-20 text-center gap-8 py-10">
                        <Eye size={80} className="text-slate-700" />
                        <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.6em]">Waiting for AI Synthesis</p>
                     </div>
                   )}
                </div>
             </div>

             {/* Results Area */}
             {adhocResult && (
               <div className="glass p-12 rounded-[4rem] border-white/5 bg-[#02020a]/80 shadow-3xl animate-in slide-in-from-bottom-12">
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-6">
                        <CheckCircle2 className="text-emerald-400" size={24} /> Result Set
                     </h3>
                     <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest font-mono bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                        REQ_ID: {adhocResult.request_id}
                     </span>
                  </div>
                  <div className="overflow-x-auto custom-scrollbar">
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
                           <tr>
                              {Object.keys(adhocResult.rows[0] || {}).map(k => (
                                <th key={k} className="px-8 py-5 border-b border-white/5 first:rounded-tl-2xl last:rounded-tr-2xl">{k}</th>
                              ))}
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {adhocResult.rows.map((row: any, i: number) => (
                             <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                {Object.values(row).map((v: any, j) => (
                                  <td key={j} className="px-8 py-6 font-mono text-[12px] text-slate-300 font-bold">{String(v)}</td>
                                ))}
                             </tr>
                           ))}
                        </tbody>
                     </table>
                     <div className="mt-6 text-[10px] font-black text-slate-700 uppercase tracking-widest text-right">
                        Rows Returned: {adhocResult.row_count}
                     </div>
                  </div>
               </div>
             )}
          </div>
        </div>
      )}

      {activeTab === 'visualizer' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 animate-in slide-in-from-bottom-8">
          <N8NVisualizer activeNodeId={activeNode} logs={logs} />
          <div className="glass p-12 rounded-[4rem] border-white/5 bg-[#020208]/60 shadow-3xl flex flex-col relative overflow-hidden">
             <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-8 relative z-10">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-6">
                  <Layers className="text-indigo-400" size={28} /> Intent Synthesis Result
                </h3>
             </div>
             <div className="flex-1 relative z-10">
               {results ? (
                 <div className="bg-black/60 p-12 rounded-[3.5rem] border border-white/5 text-slate-300 text-xl font-medium leading-[1.8] font-mono whitespace-pre-wrap animate-in fade-in">
                   {results}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center opacity-30 text-center gap-8">
                    <Activity size={80} className="text-slate-800" />
                    <p className="text-lg font-black text-slate-700 uppercase tracking-[0.8em]">Awaiting Command Execution</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="glass p-1 border-white/5 rounded-[4rem] bg-[#02020a]/40 shadow-3xl overflow-hidden animate-in slide-in-from-bottom-8">
           <div className="p-14 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-6">
                 <History className="text-indigo-400" size={32} /> Central Intent Registry
              </h3>
              <div className="flex gap-4">
                 <div className="px-6 py-3 glass rounded-2xl text-[12px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-4"><Filter size={18} /> Filter</div>
                 <button className="px-6 py-3 bg-white/5 rounded-2xl text-[12px] font-black text-slate-300 uppercase tracking-widest border border-white/10 flex items-center gap-3"><ExternalLink size={16} /> Open Sheets</button>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-white/5 text-[12px] font-black text-slate-700 uppercase tracking-widest border-b border-white/5">
                    <tr>
                       <th className="px-14 py-8">Execution ID</th>
                       <th className="px-14 py-8">Intent Signature</th>
                       <th className="px-14 py-8 text-center">Status</th>
                       <th className="px-14 py-8 text-right">Duration</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {executions.map(ex => (
                      <tr key={ex.id} className="group hover:bg-white/[0.03] transition-all border-l-4 border-transparent hover:border-indigo-500">
                         <td className="px-14 py-10 font-mono text-base text-slate-600 group-hover:text-indigo-400 transition-colors uppercase">{ex.id}</td>
                         <td className="px-14 py-10">
                            <div className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-1.5">{ex.intent || ex.workflowName}</div>
                            <div className="text-[12px] font-black text-slate-700 uppercase tracking-widest">{ex.trigger} Triggered</div>
                         </td>
                         <td className="px-14 py-10 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase border ${ex.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>{ex.status}</span>
                         </td>
                         <td className="px-14 py-10 text-right font-mono text-2xl font-black text-white">{ex.duration}s</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'explorer' && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 animate-in slide-in-from-bottom-8">
           <div className="xl:col-span-1 glass p-10 rounded-[3.5rem] border-white/5 bg-black/40 h-fit">
              <h3 className="text-lg font-black text-white uppercase mb-10 flex items-center gap-6 border-b border-white/5 pb-8">
                 <Database className="text-indigo-400" size={24} /> Matrix Schema
              </h3>
              <div className="space-y-4">
                 {['workflow_executions', 'analysis_cache', 'error_events', 'employees'].map(table => (
                   <button 
                     key={table}
                     onClick={() => handleExploreTable(table)}
                     className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all group ${selectedTable === table ? 'border-indigo-600 bg-indigo-600/15 text-white shadow-glow' : 'border-white/5 bg-white/[0.02] text-slate-600 hover:border-white/20'}`}
                   >
                      <span className="text-[13px] font-black uppercase tracking-widest">{table.replace('_', ' ')}</span>
                      <ChevronRight size={18} className={selectedTable === table ? 'text-indigo-400' : 'text-slate-800'} />
                   </button>
                 ))}
              </div>
           </div>
           
           <div className="xl:col-span-3 glass p-1 border-white/5 rounded-[4rem] bg-[#02020a]/40 shadow-3xl overflow-hidden flex flex-col min-h-[600px]">
              <div className="p-12 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-6">
                    <Database className="text-cyan-400" size={28} /> Entity Explorer :: {selectedTable}
                 </h3>
              </div>
              <div className="flex-1 p-10 overflow-auto custom-scrollbar">
                 {tableData.length > 0 ? (
                   <table className="w-full text-left">
                      <thead className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] border-b border-white/5">
                         <tr>
                            {Object.keys(tableData[0]).map(key => <th key={key} className="pb-6 px-6">{key}</th>)}
                         </tr>
                      </thead>
                      <tbody>
                         {tableData.map((row, i) => (
                           <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                              {Object.values(row).map((val: any, j) => (
                                <td key={j} className="py-6 px-6 text-[14px] font-mono font-bold text-slate-400 group-hover:text-white transition-colors">{JSON.stringify(val).replace(/"/g, '')}</td>
                              ))}
                           </tr>
                         ))}
                      </tbody>
                   </table>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-center gap-8">
                       <Database size={80} className="text-slate-800" />
                       <p className="text-base font-black text-slate-700 uppercase tracking-[0.8em]">Select table matrix to decode</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'health' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 animate-in slide-in-from-bottom-8">
           <div className="glass p-12 rounded-[4rem] border-white/5 bg-[#050510]/60 shadow-3xl">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-8 mb-16 border-b border-white/5 pb-10">
                 <HeartPulse className="text-rose-500" size={32} /> Service Integrity
              </h3>
              <div className="space-y-8">
                 {health.map((svc, i) => (
                   <div key={i} className="p-8 bg-black/40 rounded-[3rem] border border-white/5 flex items-center justify-between group hover:border-indigo-500/20 transition-all">
                      <div className="flex items-center gap-8">
                         <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${svc.status === 'OPERATIONAL' ? 'text-emerald-400' : 'text-rose-400'} shadow-inner`}>
                            <ShieldCheck size={28} />
                         </div>
                         <div>
                            <div className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1.5">{svc.service}</div>
                            <div className="text-[12px] font-black uppercase tracking-widest text-emerald-500">{svc.status}</div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-[12px] text-slate-700 font-black uppercase tracking-widest mb-1.5">Breaker</div>
                         <div className={`px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest border ${svc.breakerState === 'CLOSED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                            {svc.breakerState}
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="glass p-12 rounded-[4rem] border-white/5 bg-black/40 shadow-2xl relative overflow-hidden group">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-6 mb-12 relative z-10">
                 <Activity className="text-indigo-400" size={28} /> Throughput Metrics
              </h3>
              <div className="h-48 flex items-end justify-between gap-3 relative z-10">
                 {[45, 62, 85, 42, 94, 58, 72, 88, 34, 52, 91, 76].map((h, i) => (
                   <div key={i} className="flex-1 bg-gradient-to-t from-indigo-950 via-indigo-600 to-cyan-400 rounded-t-xl transition-all duration-1000" style={{ height: `${h}%` }}></div>
                 ))}
              </div>
              <div className="mt-10 flex justify-between items-center text-[12px] font-black text-slate-700 uppercase tracking-[0.4em] relative z-10 border-t border-white/5 pt-8">
                 <span>Inference Velocity</span>
                 <span className="text-indigo-400 font-mono">1.84x // Optimal</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default OperationsPage;
