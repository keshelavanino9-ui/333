
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileText, ShieldCheck, BrainCircuit, 
  TrendingUp, Database, LayoutGrid, Workflow, LogIn, Award, Landmark
} from 'lucide-react';

export const NyxCoreLogo = ({ size = 32, className = "" }: { size?: number, className?: string }) => (
  <svg 
    viewBox="0 0 400 400" 
    width={size} 
    height={size} 
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
  >
    <defs>
      <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#00e5ff', stopOpacity: 1}} />
        <stop offset="50%" style={{stopColor: '#818cf8', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#f472b6', stopOpacity: 1}} />
      </linearGradient>
      
      <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#00e5ff', stopOpacity: 0.25}} />
        <stop offset="100%" style={{stopColor: '#f472b6', stopOpacity: 0.25}} />
      </linearGradient>
      
      <filter id="logoGlow">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <polygon points="200,40 320,110 320,250 200,320 80,250 80,110" 
             fill="none" 
             stroke="url(#hexGradient)" 
             strokeWidth="8" 
             filter="url(#logoGlow)"/>
    
    <polygon points="200,80 280,130 280,230 200,280 120,230 120,130" 
             fill="url(#innerGradient)" 
             stroke="url(#hexGradient)" 
             strokeWidth="2"/>
    
    <circle cx="200" cy="180" r="8" fill="#00e5ff" filter="url(#logoGlow)"/>
    <circle cx="160" cy="150" r="5" fill="#818cf8"/>
    <circle cx="240" cy="150" r="5" fill="#818cf8"/>
    <circle cx="160" cy="210" r="5" fill="#f472b6"/>
    <circle cx="240" cy="210" r="5" fill="#f472b6"/>
    
    <path d="M 170 165 L 170 195 L 175 195 L 175 175 L 220 195 L 225 195 L 225 165 L 220 165 L 220 185 L 175 165 Z" 
          fill="url(#hexGradient)" 
          filter="url(#logoGlow)"/>

    <circle cx="200" cy="180" r="8" fill="none" stroke="#00e5ff" strokeWidth="2" opacity="0.6">
      <animate attributeName="r" from="8" to="28" dur="2.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.6" to="0" dur="2.5s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={22} />, label: 'Mainframe', path: '/' },
    { icon: <LogIn size={22} />, label: 'HR Lifecycle', path: '/employees' },
    { icon: <LayoutGrid size={22} />, label: 'Talent Architecture', path: '/hr-analytics' },
    { icon: <Medal size={22} />, label: 'Competency Hub', path: '/talent' },
    { icon: <TrendingUp size={22} />, label: 'Budgeting', path: '/budgeting' },
    { icon: <Landmark size={22} />, label: 'Finance Intel', path: '/finance' },
    { icon: <Workflow size={22} />, label: 'N8N Operations', path: '/operations' },
    { icon: <FileText size={22} />, label: 'Logic Protocols', path: '/policies' },
    { icon: <BrainCircuit size={22} />, label: 'Cognitive Tuning', path: '/brain-tuning' },
  ];

  return (
    <aside className="w-72 bg-[#020206]/90 backdrop-blur-3xl text-slate-400 hidden lg:flex flex-col border-r border-white/5 relative z-30 shadow-[40px_0_100px_-20px_rgba(0,0,0,0.8)]">
      <div className="py-12 px-8 flex flex-col items-center gap-8">
        <div className="relative group cursor-pointer active:scale-95 transition-transform">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
          <NyxCoreLogo size={88} className="relative z-10" />
        </div>
        <div className="text-center">
          <div className="font-black text-2xl tracking-[0.25em] text-white uppercase flex flex-col leading-none">
            <span className="text-white drop-shadow-glow">NYX</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 text-[10px] tracking-[0.5em] mt-3 ml-1">CORE MATRIX</span>
          </div>
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mt-6 opacity-50">System Release V3.6.0</div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative
              ${isActive 
                ? 'bg-white/5 text-white shadow-[0_0_30px_-5px_rgba(99,102,241,0.2)] border border-white/5' 
                : 'hover:bg-white/[0.03] hover:text-slate-200'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`${isActive ? 'text-cyan-400 drop-shadow-glow' : 'text-slate-600 group-hover:text-slate-400'} transition-all duration-300`}>
                  {item.icon}
                </div>
                <span className={`text-[12px] font-bold uppercase tracking-[0.2em] ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full shadow-glow shadow-cyan-400/50"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-8 mt-auto">
        <div className="glass p-6 rounded-[2rem] bg-gradient-to-br from-indigo-500/5 to-transparent border border-white/5 relative overflow-hidden group hover:border-indigo-500/20 transition-all cursor-pointer shadow-2xl">
          <div className="flex items-center gap-4 mb-4 relative z-10">
             <div className="p-3 bg-emerald-500/15 rounded-xl text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={22} />
             </div>
             <div>
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Integrity</div>
                <div className="text-[11px] font-black text-emerald-400 uppercase mt-0.5 tracking-wider">State: Secure</div>
             </div>
          </div>
          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
             <div className="h-full bg-emerald-500 w-[99%] shadow-glow shadow-emerald-500/50 rounded-full transition-all duration-1000"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const Medal = ({ size, className }: { size: number, className?: string }) => (
  <Award size={size} className={className} />
);

export default Sidebar;
