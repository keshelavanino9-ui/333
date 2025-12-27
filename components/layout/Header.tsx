
import React, { useContext } from 'react';
import { Search, Bell, Menu, ChevronDown, Command, Activity, Building2, Layers } from 'lucide-react';
import { LanguageContext, CompanyContext } from '../../App';
import { Company } from '../../types';

interface Props {
  companies: Company[];
}

const Header: React.FC<Props> = ({ companies }) => {
  const { lang, setLang } = useContext(LanguageContext);
  const companyCtx = useContext(CompanyContext);

  if (!companyCtx) return null;

  const t = {
    search: lang === 'en' ? 'Search Core Memory...' : 'მოთხოვნა ნეირალურ ბირთვს...',
    role: lang === 'en' ? 'Architect' : 'არქიტექტორი',
    userName: lang === 'en' ? 'Nino Keshelava' : 'ნინო კეშელავა'
  };

  return (
    <header className="h-16 bg-transparent border-b border-white/5 flex items-center justify-between px-6 relative z-40 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 border-r border-white/10 pr-4 mr-2">
          <div className="p-1.5 glass rounded-lg text-indigo-400"><Building2 size={14} /></div>
          <select 
            value={companyCtx.currentCompany.id}
            onChange={(e) => {
              const c = companies.find(comp => comp.id === e.target.value);
              if (c) {
                companyCtx.setCurrentCompany(c);
                companyCtx.setCurrentDept(c.departments[0]);
              }
            }}
            className="bg-transparent border-none text-white font-black uppercase text-[9px] tracking-tight focus:ring-0 cursor-pointer"
          >
            {companies.map(c => (
              <option key={c.id} value={c.id} className="bg-[#050510]">{lang === 'en' ? c.nameEn : c.nameKa}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-1.5 glass rounded-lg text-cyan-400"><Layers size={14} /></div>
          <select 
            value={companyCtx.currentDept}
            onChange={(e) => companyCtx.setCurrentDept(e.target.value)}
            className="bg-transparent border-none text-slate-500 font-black uppercase text-[8px] tracking-[0.15em] focus:ring-0 cursor-pointer"
          >
            {companyCtx.currentCompany.departments.map(d => (
              <option key={d} value={d} className="bg-[#050510]">{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="hidden md:flex items-center bg-black/40 border border-white/5 rounded-lg px-4 py-1.5 w-full max-w-[320px] group focus-within:border-indigo-500/40 transition-all shadow-inner mx-6">
        <Search size={12} className="text-slate-700 group-focus-within:text-indigo-400 transition-colors" />
        <input 
          type="text" 
          placeholder={t.search} 
          className="bg-transparent border-none focus:outline-none ml-2 w-full text-[0.7rem] text-slate-200 placeholder:text-slate-800 font-bold tracking-tight"
        />
        <div className="bg-white/5 text-slate-700 text-[6px] font-black px-1 py-0.5 rounded border border-white/5 tracking-tighter flex items-center gap-1">
          <Command size={6} /> K
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center glass p-0.5 rounded-lg border-white/10">
          <button 
            onClick={() => setLang('en')}
            className={`px-2 py-0.5 text-[0.5rem] font-black rounded transition-all ${lang === 'en' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-300'}`}
          >EN</button>
          <button 
            onClick={() => setLang('ka')}
            className={`px-2 py-0.5 text-[0.5rem] font-black rounded transition-all ${lang === 'ka' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-300'}`}
          >KA</button>
        </div>

        <div className="flex items-center gap-3 cursor-pointer group pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{t.userName}</div>
            <div className="text-[0.5rem] font-black text-slate-700 uppercase tracking-[0.2em] flex items-center justify-end gap-1 mt-0.5">
               <Activity size={6} className="text-emerald-500" /> {t.role}
            </div>
          </div>
          <div className="relative">
             <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-fuchsia-600 rounded-lg flex items-center justify-center font-black text-[10px] text-white shadow-xl border border-white/20 transform group-hover:rotate-6 transition-transform uppercase">
                NK
             </div>
             <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-black shadow-glow shadow-emerald-500/50"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
