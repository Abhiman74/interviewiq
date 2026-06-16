import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import InterviewSetup from './pages/InterviewSetup';
import LiveInterview from './pages/LiveInterview';
import InterviewResults from './pages/InterviewResults';
import JobMatchDashboard from './pages/JobMatchDashboard';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import { User, Shield, Briefcase, BarChart3, Settings as SettingsIcon, LogOut, ChevronRight } from 'lucide-react';

export interface UserProfile {
  name: string;
  college: string;
  graduationYear: number;
  branch: string;
  experienceLevel: string;
  preferredRoles: string[];
}

export interface ParsedResume {
  fileName: string;
  atsScore: number;
  skills: string[];
  projects: { title: string; description: string }[];
  experience: string[];
}

export interface ActiveSession {
  role: string;
  difficulty: string;
  style: string;
  questions: { id: string; content: string; category: string }[];
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Abhiman Singh Saharan',
    college: 'Indian Institute of Technology',
    graduationYear: 2027,
    branch: 'Computer Science',
    experienceLevel: 'Student',
    preferredRoles: ['Software Engineer', 'Backend Engineer']
  });
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [completedInterviewId, setCompletedInterviewId] = useState<string | null>(null);
  
  // Historical Interviews Mock State
  const [history, setHistory] = useState<any[]>([
    { id: '1', role: 'Software Engineer', style: 'Google', date: '2026-06-10', score: 78, difficulty: 'Intermediate' },
    { id: '2', role: 'Backend Engineer', style: 'Amazon', date: '2026-06-14', score: 82, difficulty: 'Advanced' }
  ]);

  const handleStartInterview = (config: { role: string; difficulty: string; style: string }) => {
    // Generate questions based on selected role and parsed resume if available
    const resumeSkills = parsedResume ? parsedResume.skills : ['React', 'Node.js', 'PostgreSQL'];
    const mockQuestions = [
      { id: '1', content: `Tell me about yourself and your experience working with ${resumeSkills.slice(0, 3).join(', ')}.`, category: 'Behavioral' },
      { id: '2', content: `In your opinion, what are the primary architectural differences between designing a monolithic application versus microservices?`, category: 'System Design' },
      { id: '3', content: `How would you design a rate-limiting middleware for a public API that receives 10,000 requests per minute?`, category: 'Scenario' },
      { id: '4', content: `Explain the concept of inheritance and polymorphism in OOP, and how you have used it in your projects.`, category: 'OOP' }
    ];

    setActiveSession({
      ...config,
      questions: mockQuestions
    });
    setCurrentPage('live-interview');
  };

  const handleFinishInterview = (score: number, questionsWithAnswers: any[]) => {
    const newId = (history.length + 1).toString();
    const newHistoryItem = {
      id: newId,
      role: activeSession?.role || 'Software Engineer',
      style: activeSession?.style || 'Standard',
      date: new Date().toISOString().split('T')[0],
      score: score,
      difficulty: activeSession?.difficulty || 'Intermediate'
    };
    setHistory([newHistoryItem, ...history]);
    setCompletedInterviewId(newId);
    setCurrentPage('results');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600/30">
      {/* Top Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('landing')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20 text-white">Q</div>
          <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">InterviewIQ</span>
        </div>
        <nav className="flex items-center gap-6">
          {currentPage !== 'landing' && (
            <>
              <button className={`text-sm font-medium transition ${currentPage === 'dashboard' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`} onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
              <button className={`text-sm font-medium transition ${currentPage === 'jd-match' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`} onClick={() => setCurrentPage('jd-match')}>JD Match</button>
              <button className={`text-sm font-medium transition ${currentPage === 'analytics' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`} onClick={() => setCurrentPage('analytics')}>Analytics</button>
              <button className={`text-sm font-medium transition ${currentPage === 'profile' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`} onClick={() => setCurrentPage('profile')}>Profile</button>
            </>
          )}
          {currentPage === 'landing' ? (
            <button 
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 transition text-sm font-bold rounded-xl shadow-xl shadow-blue-900/30"
              onClick={() => setCurrentPage('dashboard')}
            >
              Get Started
            </button>
          ) : (
            <button 
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition"
              onClick={() => setCurrentPage('landing')}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </nav>
      </header>

      {/* App Content Window */}
      <main className="flex-1 flex flex-col">
        {currentPage === 'landing' && <LandingPage onStart={() => setCurrentPage('dashboard')} />}
        {currentPage === 'dashboard' && (
          <Dashboard 
            profile={userProfile} 
            parsedResume={parsedResume} 
            setParsedResume={setParsedResume}
            onStartInterview={() => setCurrentPage('setup')}
            history={history}
          />
        )}
        {currentPage === 'setup' && (
          <InterviewSetup 
            onBack={() => setCurrentPage('dashboard')}
            onStart={handleStartInterview}
          />
        )}
        {currentPage === 'live-interview' && activeSession && (
          <LiveInterview 
            session={activeSession}
            parsedResume={parsedResume}
            onFinish={handleFinishInterview}
            onCancel={() => setCurrentPage('dashboard')}
          />
        )}
        {currentPage === 'results' && (
          <InterviewResults 
            interviewId={completedInterviewId}
            history={history}
            onBack={() => setCurrentPage('dashboard')}
          />
        )}
        {currentPage === 'jd-match' && (
          <JobMatchDashboard 
            parsedResume={parsedResume}
            onBack={() => setCurrentPage('dashboard')}
          />
        )}
        {currentPage === 'profile' && (
          <Profile 
            profile={userProfile}
            setProfile={setUserProfile}
            onBack={() => setCurrentPage('dashboard')}
          />
        )}
        {currentPage === 'analytics' && (
          <Analytics 
            history={history}
            onBack={() => setCurrentPage('dashboard')}
          />
        )}
      </main>
    </div>
  );
}
