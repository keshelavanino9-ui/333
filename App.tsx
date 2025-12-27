
import React, { useState, createContext, useMemo, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import EmployeesPage from './pages/EmployeesPage';
import TalentPage from './pages/TalentPage';
import PoliciesPage from './pages/PoliciesPage';
import BudgetPage from './pages/BudgetPage';
import FinanceIntelligencePage from './pages/FinanceIntelligencePage';
import HRAnalyticsPage from './pages/HRAnalyticsPage';
import BrainTuningPage from './pages/BrainTuningPage';
import OperationsPage from './pages/OperationsPage';
import FloatingAssistant from './components/ai/FloatingAssistant';
import Notifications from './components/ui/Notifications';
import { Company, TuningConfig, Notification } from './types';

interface LanguageContextType {
  lang: 'en' | 'ka';
  setLang: (lang: 'en' | 'ka') => void;
}

interface CompanyContextType {
  currentCompany: Company;
  setCurrentCompany: (c: Company) => void;
  currentDept: string;
  setCurrentDept: (d: string) => void;
}

interface TuningContextType {
  config: TuningConfig;
  setConfig: (c: TuningConfig) => void;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (title: string, message: string, type?: Notification['type']) => void;
  removeNotification: (id: string) => void;
}

export const LanguageContext = createContext<LanguageContextType>({ lang: 'en', setLang: () => {} });
export const CompanyContext = createContext<CompanyContextType | null>(null);
export const TuningContext = createContext<TuningContextType | null>(null);
export const NotificationContext = createContext<NotificationContextType>({ notifications: [], addNotification: () => {}, removeNotification: () => {} });

const companies: Company[] = [
  { id: '1', nameEn: 'Global HQ', nameKa: 'გლობალური სათაო ოფისი', departments: ['Engineering', 'Finance', 'HR', 'Core R&D'] },
  { id: '2', nameEn: 'EMEA Ops', nameKa: 'EMEA ოპერაციები', departments: ['Logistics', 'Regional HR', 'Compliance'] },
  { id: '3', nameEn: 'R&D Hub', nameKa: 'R&D ჰაბი', departments: ['AI Lab', 'Hardware', 'Prototyping'] },
];

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ka'>('en');
  const [currentCompany, setCurrentCompany] = useState<Company>(companies[0]);
  const [currentDept, setCurrentDept] = useState<string>(companies[0].departments[0]);
  const [tuning, setTuning] = useState<TuningConfig>({
    reasoningDepth: 85,
    creativity: 45,
    strictness: 90,
    ethicalGuardrails: true
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((title: string, message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, title, message, type, timestamp: Date.now() }]);
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 8000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Simulate real-time system events
  useEffect(() => {
    const events = [
      { title: "Task Complete", msg: "Payroll batch 9942 processed successfully.", type: "success" },
      { title: "Security Alert", msg: "Unusual login attempt detected from IP 192.168.1.104.", type: "warning" },
      { title: "AI Insight", msg: "Competency matrix update available for EMEA region.", type: "ai" },
      { title: "System Health", msg: "Latency spike detected in Vector Database.", type: "error" }
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 15s
        const evt = events[Math.floor(Math.random() * events.length)];
        addNotification(evt.title, evt.msg, evt.type as any);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [addNotification]);

  const tuningValue = useMemo(() => ({ config: tuning, setConfig: setTuning }), [tuning]);
  const notifValue = useMemo(() => ({ notifications, addNotification, removeNotification }), [notifications, addNotification, removeNotification]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <CompanyContext.Provider value={{ currentCompany, setCurrentCompany, currentDept, setCurrentDept }}>
        <TuningContext.Provider value={tuningValue}>
          <NotificationContext.Provider value={notifValue}>
            <Router>
              <div className="flex min-h-screen bg-[#050510] text-slate-100 selection:bg-indigo-500/30">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0 relative z-10">
                  <Header companies={companies} />
                  <Notifications />
                  <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/employees" element={<EmployeesPage />} />
                        <Route path="/budgeting" element={<BudgetPage />} />
                        <Route path="/finance" element={<FinanceIntelligencePage />} />
                        <Route path="/hr-analytics" element={<HRAnalyticsPage />} />
                        <Route path="/talent" element={<TalentPage />} />
                        <Route path="/policies" element={<PoliciesPage />} />
                        <Route path="/operations" element={<OperationsPage />} />
                        <Route path="/brain-tuning" element={<BrainTuningPage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                      </Routes>
                    </div>
                  </main>
                </div>
                <FloatingAssistant />
              </div>
            </Router>
          </NotificationContext.Provider>
        </TuningContext.Provider>
      </CompanyContext.Provider>
    </LanguageContext.Provider>
  );
};

export default App;
