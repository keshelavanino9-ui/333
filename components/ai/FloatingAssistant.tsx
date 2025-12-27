import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  X, Send, BrainCircuit, Terminal, Workflow, ShieldCheck,
  CheckCircle2, Loader2, ChevronDown, Command, ArrowRight, Sparkles,
  Activity, Layers
} from 'lucide-react';
import { gemini } from '../../services/geminiService';
import { Message } from '../../types';
import { LanguageContext } from '../../App';
import { NyxCoreLogo } from '../layout/Sidebar';

const FloatingAssistant: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStepIdx, setThinkingStepIdx] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: lang === 'en' 
        ? 'Nyx Entity online. Strategic matrix synchronized. Systems ready for command.' 
        : 'Nyx ბირთვი გააქტიურებულია. სტრატეგიული მატრიცა სინქრონიზებულია. სისტემები მზად არის.',
      timestamp: Date.now()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  const defaultThinkingSteps = [
    lang === 'en' ? "Accessing logistics graph..." : "ლოგისტიკური გრაფის წვდომა...",
    lang === 'en' ? "Synthesizing strategic move..." : "სტრატეგიული სვლის სინთეზი...",
    lang === 'en' ? "Checking ethical logic gates..." : "ეთიკური ლოგიკის კარიბჭეების შემოწმება...",
    lang === 'en' ? "Finalizing inference manifest..." : "ინფერენციის მანიფესტის დასრულება..."
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  useEffect(() => {
    let interval: any;
    if (isThinking) {
      interval = setInterval(() => {
        setThinkingStepIdx(prev => (prev + 1) % defaultThinkingSteps.length);
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isThinking, lang]);

  const handleSend = async () => {
    if (!inputValue.trim() || isThinking) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    try {
      const result = await gemini.chat([...messages, userMsg], lang);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        timestamp: Date.now(),
        thinkingSteps: result.thinkingSteps
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: 'err',
        role: 'assistant',
        content: lang === 'en' ? "Neural handshake fault detected." : "ნეირალური კავშირის ხარვეზი.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed bottom-12 right-12 z-[100] flex flex-col items-end pointer-events-none">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center pointer-events-auto transition-all duration-700 hover:scale-110 active:scale-95"
        >
          <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-3xl group-hover:bg-cyan-500/50 transition-all"></div>
          <div className="glass p-4 rounded-full border border-white/10 hover:border-cyan-500/50 transition-all duration-700 shadow-[0_0_80px_-10px_rgba(0,229,255,0.4)] bg-black/80 relative">
            <NyxCoreLogo size={60} />
          </div>
          <div className="absolute -left-56 top-1/2 -translate-y-1/2 px-8 py-4 glass rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-700 border-white/10 pointer-events-none shadow-3xl translate-x-6 group-hover:translate-x-0">
            <span className="text-[12px] font-black text-white uppercase tracking-[0.5em]">Invoke Core</span>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="glass w-[90vw] sm:w-[520px] h-[820px] max-h-[85vh] rounded-[4.5rem] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-700 shadow-[0_80px_200px_-30px_rgba(0,0,0,0.9)] border-white/10 pointer-events-auto">
          <div className="px-12 py-12 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-8">
              <div className="relative">
                <div className={`w-4 h-4 rounded-full absolute -top-1 -right-1 z-10 ${isThinking ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'} border-2 border-black shadow-glow shadow-current`}></div>
                <div className="w-16 h-16 glass rounded-[2rem] flex items-center justify-center text-cyan-400 border-white/10">
                  <NyxCoreLogo size={42} />
                </div>
              </div>
              <div>
                <div className="font-black text-2xl text-white tracking-tighter uppercase leading-none">NYX <span className="text-cyan-400">CORE</span></div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4 leading-none flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${isThinking ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>
                  {isThinking ? 'Thinking...' : 'Active System Handshake'}
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-5 glass border-white/5 rounded-3xl text-slate-500 hover:text-white transition-all active:scale-90 hover:bg-white/5">
              <ChevronDown size={32} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-12 space-y-14 bg-[#020208]/80 custom-scrollbar scroll-smooth">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-6 duration-700`}>
                <div className={`
                  max-w-[92%] px-12 py-8 rounded-[3.5rem] text-[1.05rem] leading-relaxed font-medium shadow-3xl relative
                  ${m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none border border-white/10' 
                    : 'glass-dark border-white/5 text-slate-200 rounded-tl-none border-l-4 border-l-indigo-500/50'}
                `}>
                  {m.role === 'assistant' && (
                    <div className="absolute -top-10 left-0 flex items-center gap-4 opacity-40">
                       <Sparkles size={16} className="text-cyan-400" />
                       <span className="text-micro tracking-[0.6em]">System Synthesis</span>
                    </div>
                  )}
                  {m.content}
                </div>
                <div className="text-[10px] font-black text-slate-800 uppercase mt-5 px-8 tracking-[0.3em] opacity-40">
                   {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            
            {isThinking && (
              <div className="flex flex-col items-start gap-6 animate-in fade-in duration-1000">
                <div className="glass-dark px-12 py-9 rounded-[3.5rem] rounded-tl-none border-indigo-500/20 flex flex-col gap-6 w-[85%] shadow-3xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>
                  <div className="flex items-center gap-6">
                    <Loader2 size={24} className="text-indigo-400 animate-spin" />
                    <span className="text-base font-black text-slate-400 uppercase tracking-widest italic leading-none">
                      {defaultThinkingSteps[thinkingStepIdx]}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-12 bg-white/[0.01] border-t border-white/5">
            <div className="flex items-end gap-6 bg-[#05050f] rounded-[3.5rem] px-10 py-8 border border-white/10 focus-within:border-indigo-500/40 transition-all shadow-inner group">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder={lang === 'en' ? "Query organizational matrix..." : "ჰკითხეთ ნეირალურ ბირთვს..."}
                className="bg-transparent border-none focus:outline-none w-full text-lg text-slate-100 resize-none py-2 placeholder:text-slate-800 font-medium max-h-48 custom-scrollbar"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isThinking}
                className="bg-indigo-600 text-white h-16 w-16 rounded-[2rem] hover:bg-indigo-500 transition-all duration-500 disabled:opacity-10 flex items-center justify-center shadow-2xl shadow-indigo-600/40 flex-shrink-0 active:scale-90 border border-white/10"
              >
                <ArrowRight size={32} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingAssistant;