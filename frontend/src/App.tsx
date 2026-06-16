import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import InterviewSetup from './pages/InterviewSetup';
import LiveInterview from './pages/LiveInterview';
import InterviewResults from './pages/InterviewResults';
import JobMatchDashboard from './pages/JobMatchDashboard';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import { 
  LayoutDashboard, User, Shield, Briefcase, BarChart3, Settings, 
  Menu, ChevronLeft, ChevronRight, LogOut, Bell, Search, Moon, Sun, Award
} from 'lucide-react';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Abhiman Singh Saharan',
    college: 'IIT Roorkee',
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
    { id: '1', role: 'Software Engineer', style: 'Google-style', date: '2026-06-10', score: 78, difficulty: 'Intermediate' },
    { id: '2', role: 'Backend Engineer', style: 'Amazon-style', date: '2026-06-14', score: 82, difficulty: 'Advanced' }
  ]);

  const handleStartInterview = (config: { role: string; difficulty: string; style: string }) => {
    const resumeSkills = parsedResume ? parsedResume.skills : ['React', 'TypeScript', 'Node.js', 'PostgreSQL'];
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

  // Sidebar Items Definition
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'setup', label: 'Setup Mock', icon: Shield },
    { id: 'jd-match', label: 'Job Matcher', icon: Briefcase },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex font-sans selection:bg-blue-600/30 mesh-overlay">
      {currentPage === 'landing' ? (
        // Plain view for landing page
        <LandingPage onStart={() => setCurrentPage('dashboard')} />
      ) : currentPage === 'live-interview' ? (
        // Split view for live interview to take maximum screen
        <LiveInterview 
          session={activeSession!}
          parsedResume={parsedResume}
          onFinish={handleFinishInterview}
          onCancel={() => setCurrentPage('dashboard')}
        />
      ) : (
        // Shell view with Collapsible Sidebar & Topbar
        <div className="flex-1 flex overflow-hidden h-screen">
          {/* Sidebar */}
          <aside className={`bg-[#111827]/80 backdrop-blur-xl border-r border-slate-900 transition-all duration-300 flex flex-col justify-between z-30 shrink-0 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
            <div>
              {/* Header Logo */}
              <div className="px-6 py-5 flex items-center justify-between border-b border-slate-900">
                {!sidebarCollapsed && (
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('landing')}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/25">Q</div>
                    <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">InterviewIQ</span>
                  </div>
                )}
                {sidebarCollapsed && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-black text-lg mx-auto">Q</div>
                )}
                <button 
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition"
                >
                  {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="p-4 flex flex-col gap-1.5 mt-4">
                {sidebarItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id || (item.id === 'setup' && currentPage === 'results');
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative ${
                        isActive 
                          ? 'bg-gradient-to-r from-indigo-600/25 to-pink-600/10 border border-indigo-500/20 text-white shadow-xl shadow-indigo-500/5' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                      {isActive && !sidebarCollapsed && <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-pink-500 shadow-md shadow-pink-500" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Logout footer */}
            <div className="p-4 border-t border-slate-900">
              <button
                onClick={() => setCurrentPage('landing')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 text-slate-500 hover:text-slate-350 hover:bg-red-500/5 hover:border-red-500/10 border border-transparent rounded-xl text-sm font-semibold transition-all`}
              >
                <LogOut className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && <span>Sign Out</span>}
              </button>
            </div>
          </aside>

          {/* Main workspace */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Topbar */}
            <header className="px-8 py-4 bg-[#0B0F19]/40 backdrop-blur-md border-b border-slate-900 sticky top-0 z-20 flex items-center justify-between">
              <div className="flex items-center gap-3 bg-[#111827]/60 border border-slate-900 px-4 py-2 rounded-xl text-xs text-slate-450 w-72 max-w-full">
                <Search className="w-4 h-4 text-slate-500 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search interview logs, roadmaps..." 
                  className="bg-transparent outline-none w-full text-slate-300 placeholder-slate-650"
                />
              </div>

              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white transition relative">
                  <Bell className="w-4.5 h-4.5" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-pink-500 shadow-sm shadow-pink-500" />
                </button>
                
                <div className="h-5 w-px bg-slate-900" />

                {/* User Info */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('profile')}>
                  <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1.5px] shadow-lg shadow-indigo-500/10">
                    <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center font-bold text-xs text-indigo-400">AS</div>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-200">{userProfile.name}</span>
                    <span className="text-[9px] text-slate-500 font-semibold">{userProfile.experienceLevel} Tier</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
