
import React, { useContext } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle, X, Sparkles } from 'lucide-react';
import { NotificationContext } from '../../App';

const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-24 right-6 z-[150] flex flex-col gap-4 pointer-events-none w-full max-w-sm">
      {notifications.map((notif) => (
        <div 
          key={notif.id}
          className="pointer-events-auto bg-[#050510]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-in slide-in-from-right-12 duration-500 relative overflow-hidden group"
        >
          {/* Progress bar simulation */}
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex gap-4">
             <div className={`p-3 rounded-2xl h-fit border shadow-inner ${
                notif.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                notif.type === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                notif.type === 'error' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                notif.type === 'ai' ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' :
                'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
             }`}>
                {notif.type === 'success' && <CheckCircle2 size={20} />}
                {notif.type === 'warning' && <AlertTriangle size={20} />}
                {notif.type === 'error' && <XCircle size={20} />}
                {notif.type === 'ai' && <Sparkles size={20} />}
                {notif.type === 'info' && <Info size={20} />}
             </div>
             <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                   <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">{notif.title}</h4>
                   <button onClick={() => removeNotification(notif.id)} className="text-slate-500 hover:text-white transition-colors"><X size={14} /></button>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{notif.message}</p>
                <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest mt-2 text-right">
                   {new Date(notif.timestamp).toLocaleTimeString()}
                </div>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
