import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LiveInterview from './pages/LiveInterview';
import InterviewResults from './pages/InterviewResults';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard' | 'interview' | 'results'>('landing');
  const [activeInterviewId, setActiveInterviewId] = useState<string | null>(null);

  const navigateTo = (page: 'landing' | 'dashboard' | 'interview' | 'results', interviewId: string | null = null) => {
    if (interviewId) setActiveInterviewId(interviewId);
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('landing')}>
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-lg">I</div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">InterviewIQ</span>
        </div>
        <nav className="flex items-center gap-6">
          <button className="text-sm font-medium hover:text-blue-400 transition" onClick={() => navigateTo('landing')}>Features</button>
          <button className="text-sm font-medium hover:text-blue-400 transition" onClick={() => navigateTo('dashboard')}>Dashboard</button>
          <button className="px-4 py-2 bg-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-500 transition shadow-lg shadow-blue-900/20" onClick={() => navigateTo('dashboard')}>Get Started</button>
        </nav>
      </header>
      <main className="flex-1 flex flex-col">
        {currentPage === 'landing' && <LandingPage onStart={() => navigateTo('dashboard')} />}
        {currentPage === 'dashboard' && <Dashboard onStartInterview={(id) => navigateTo('interview', id)} />}
        {currentPage === 'interview' && <LiveInterview interviewId={activeInterviewId} onFinish={() => navigateTo('results')} />}
        {currentPage === 'results' && <InterviewResults interviewId={activeInterviewId} onBack={() => navigateTo('dashboard')} />}
      </main>
    </div>
  );
}
