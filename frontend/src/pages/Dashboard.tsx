import React, { useState } from 'react';
import { UploadCloud, Play, Sparkles, User, GraduationCap, Briefcase, Calendar, FileText, CheckCircle } from 'lucide-react';
import { UserProfile, ParsedResume } from '../App';

interface DashboardProps {
  profile: UserProfile;
  parsedResume: ParsedResume | null;
  setParsedResume: (resume: ParsedResume) => void;
  onStartInterview: () => void;
  history: any[];
}

export default function Dashboard({ profile, parsedResume, setParsedResume, onStartInterview, history }: DashboardProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleResumeSimulatedUpload = () => {
    setIsUploading(true);
    setUploadProgress(10);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setParsedResume({
              fileName: 'Resume_Abhiman.pdf',
              atsScore: 84,
              skills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'REST APIs', 'Git', 'Docker'],
              projects: [
                { title: 'AgriCycle Platform', description: 'Designed a microservices-based agricultural trade network handling local supply metrics.' },
                { title: 'Portfolio CRM', description: 'Built a real-time lead management dashboard utilizing WebSockets and caching schemas.' }
              ],
              experience: ['Software Engineer Intern at Stripe-like startup', 'Open Source Contributor at Prisma']
            });
          }, 300);
          return 100;
        }
        return prev + 30;
      });
    }, 300);
  };

  const getDifficultyColor = (diff: string) => {
    if (diff === 'Beginner') return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (diff === 'Intermediate') return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Stats and Sessions History */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        {/* Welcome Banner */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-white">Welcome Back, {profile.name}!</h1>
          <p className="text-slate-400 text-sm">Review your dashboard analytics, upload resumes, or launch mock interview runs.</p>
        </div>

        {/* Quick Performance Indicators */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl glass-morphism border border-slate-800/60 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Interviews Done</span>
            <span className="text-3xl font-extrabold text-white">{history.length}</span>
          </div>
          <div className="p-5 rounded-2xl glass-morphism border border-slate-800/60 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Average Rating</span>
            <span className="text-3xl font-extrabold text-emerald-400">
              {history.length > 0 ? `${Math.round(history.reduce((a, c) => a + c.score, 0) / history.length)}%` : 'N/A'}
            </span>
          </div>
          <div className="p-5 rounded-2xl glass-morphism border border-slate-800/60 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ATS Score</span>
            <span className="text-3xl font-extrabold text-blue-400">
              {parsedResume ? `${parsedResume.atsScore}%` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Start New Session CTA */}
        <div className="p-6 rounded-2xl bg-gradient-to-tr from-blue-900/40 via-indigo-900/20 to-transparent border border-blue-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" /> Start AI Interview Simulation
            </h3>
            <p className="text-slate-350 text-xs max-w-md">Launch a custom 1-on-1 interview loop mimicking actual corporate pipelines (Google, Amazon, Microsoft, or Startups).</p>
          </div>
          <button 
            onClick={onStartInterview}
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl shadow-lg transition shrink-0 text-sm"
          >
            <Play className="w-4 h-4 fill-white" /> Launch Interview Room
          </button>
        </div>

        {/* History Table */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-200">Historical Simulations</h3>
          {history.length === 0 ? (
            <div className="p-8 border border-slate-900 rounded-xl text-center text-slate-500 text-sm">
              No interview simulations completed yet. Launch a session to begin.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((h, i) => (
                <div key={h.id || i} className="p-4 rounded-xl glass-morphism border border-slate-850 flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-200 text-sm">{h.role}</span>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><Building2Icon className="w-3.5 h-3.5" /> {h.style}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {h.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${getDifficultyColor(h.difficulty)}`}>
                      {h.difficulty}
                    </span>
                    <span className="text-xl font-black text-slate-200">{h.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Profile & Resume Parser Card */}
      <div className="flex flex-col gap-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl glass-morphism border border-slate-800/60 flex flex-col gap-4">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2 border-b border-slate-900 pb-3">
            <User className="w-4 h-4 text-blue-400" /> Professional Persona
          </h3>
          <div className="flex flex-col gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-slate-500" /> <span>{profile.college} ({profile.graduationYear})</span></div>
            <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-slate-500" /> <span>{profile.branch}</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-slate-500" /> <span>{profile.experienceLevel} Tracking</span></div>
          </div>
        </div>

        {/* Resume Intelligence Card */}
        <div className="p-6 rounded-2xl glass-morphism border border-slate-800/60 flex flex-col gap-4">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2 border-b border-slate-900 pb-3">
            <FileText className="w-4 h-4 text-slate-400" /> Resume Intelligence
          </h3>

          {!parsedResume ? (
            <div className="flex flex-col gap-4">
              <div 
                onClick={handleResumeSimulatedUpload}
                className={`border-2 border-dashed border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-blue-500/50 transition cursor-pointer ${isUploading ? 'pointer-events-none' : ''}`}
              >
                <UploadCloud className={`w-10 h-10 text-slate-500 ${isUploading ? 'animate-bounce' : ''}`} />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-300">Click to upload resume</span>
                  <span className="text-[10px] text-slate-500">PDF, DOCX formats (Max 10MB)</span>
                </div>
              </div>

              {isUploading && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                    <span>Extracting Skills & Experience...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">{parsedResume.fileName}</span>
                <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">PARSED</span>
              </div>
              
              <div className="border-t border-slate-900 pt-3 flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Extracted Tech Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {parsedResume.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-slate-900 text-slate-350 border border-slate-850 rounded text-[10px] font-mono">{s}</span>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-900 pt-3 flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Recognized Projects</span>
                <div className="flex flex-col gap-2 text-xs">
                  {parsedResume.projects.map((p, idx) => (
                    <div key={idx} className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-300">{p.title}</span>
                      <span className="text-[10px] text-slate-500 leading-normal">{p.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setParsedResume(null as any)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-850 text-xs font-bold rounded-xl transition"
              >
                Clear Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline fallback for Building2 icon to avoid imports mismatch
function Building2Icon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
      <path d="M10 6h4"/>
      <path d="M10 10h4"/>
      <path d="M10 14h4"/>
      <path d="M10 18h4"/>
    </svg>
  );
}
