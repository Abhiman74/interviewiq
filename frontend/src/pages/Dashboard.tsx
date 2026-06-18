import React, { useState, useRef } from 'react';
import { UploadCloud, Play, Sparkles, User, GraduationCap, Briefcase, Calendar, FileText, CheckCircle2, Award, ChevronRight, TrendingUp } from 'lucide-react';
import { UserProfile, ParsedResume } from '../App';
import { uploadResumeFile } from '../services/api';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(20);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => (prev < 90 ? prev + 10 : prev));
    }, 150);

    try {
      const result = await uploadResumeFile(file);
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setParsedResume({
          id: result.resumeId,
          fileName: result.parsedData.fileName || file.name,
          atsScore: result.parsedData.atsScore || 80,
          skills: result.parsedData.skills || [],
          projects: result.parsedData.projects || [],
          experience: result.parsedData.experience || []
        });
      }, 300);
    } catch (err) {
      clearInterval(interval);
      setIsUploading(false);
      console.error(err);
      alert('Failed to parse resume. Initializing fallback client state.');
    }
  };


  const getDifficultyColor = (diff: string) => {
    if (diff === 'Beginner') return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (diff === 'Intermediate') return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
  };

  const averageScore = history.length > 0
    ? Math.round(history.reduce((a, c) => a + c.score, 0) / history.length)
    : 0;

  return (
    <div className="flex-1 max-w-6xl mx-auto px-8 py-10 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Stats and Sessions History */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Overview</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Manage resume uploads and configure simulated interview rooms.</p>
        </div>

        {/* Quick Performance Indicators */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl glass-panel flex flex-col gap-2 relative overflow-hidden">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Completed Runs</span>
            <span className="text-3xl font-black text-white">{history.length}</span>
            <div className="absolute right-3 bottom-3 p-1.5 bg-slate-900/60 rounded-lg text-slate-500"><Calendar className="w-4 h-4" /></div>
          </div>
          <div className="p-6 rounded-2xl glass-panel flex flex-col gap-2 relative overflow-hidden">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Average IQ Score</span>
            <span className="text-3xl font-black text-emerald-400">
              {history.length > 0 ? `${averageScore}%` : 'N/A'}
            </span>
            <div className="absolute right-3 bottom-3 p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400"><Award className="w-4 h-4" /></div>
          </div>
          <div className="p-6 rounded-2xl glass-panel flex flex-col gap-2 relative overflow-hidden">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ATS Rating</span>
            <span className="text-3xl font-black text-blue-400">
              {parsedResume ? `${parsedResume.atsScore}%` : 'N/A'}
            </span>
            <div className="absolute right-3 bottom-3 p-1.5 bg-blue-500/10 rounded-lg text-blue-400"><FileText className="w-4 h-4" /></div>
          </div>
        </div>

        {/* Start New Session CTA */}
        <div className="p-8 rounded-2xl bg-gradient-to-tr from-indigo-950/40 via-pink-950/15 to-transparent border border-indigo-900/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-950/10">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> Start AI Interview Simulation
            </h3>
            <p className="text-slate-350 text-xs max-w-md">Launch a custom 1-on-1 interview loop mimicking actual corporate pipelines (Google, Amazon, Microsoft, or Startups).</p>
          </div>
          <button 
            onClick={onStartInterview}
            className="glow-button flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-pink-650 hover:from-indigo-550 hover:to-pink-550 text-white font-extrabold rounded-xl shadow-lg shadow-indigo-900/30 transition shrink-0 text-xs active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" /> Launch Session
          </button>
        </div>

        {/* SVG charts */}
        <div className="p-6 rounded-2xl glass-panel flex flex-col gap-6">
          <h3 className="font-extrabold text-slate-200 text-sm flex items-center gap-2 border-b border-slate-900 pb-3">
            <TrendingUp className="w-4.5 h-4.5 text-indigo-400" /> Score Progress Trend
          </h3>
          <div className="h-44 w-full bg-[#0B0F19]/40 rounded-xl border border-slate-900 p-4 relative flex items-end">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="0" y1="25" x2="100" y2="25" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3" />
              <line x1="0" y1="75" x2="100" y2="75" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3" />
              <path
                d="M 10 70 Q 30 50 50 35 T 90 20"
                fill="none"
                stroke="url(#chart-grad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="10" cy="70" r="3" fill="#6366f1" />
              <circle cx="50" cy="35" r="3" fill="#8b5cf6" />
              <circle cx="90" cy="20" r="3" fill="#ec4899" />
              <defs>
                <linearGradient id="chart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute top-2 left-4 text-[9px] text-slate-650 font-mono">100% -</div>
            <div className="absolute bottom-2 left-4 text-[9px] text-slate-650 font-mono">0% -</div>
            <div className="absolute bottom-1 right-4 text-[9px] text-slate-650 font-mono">Current Month</div>
          </div>
        </div>
      </div>

      {/* Sidebar Profile & Resume Parser Card */}
      <div className="flex flex-col gap-6">
        
        {/* Profile Card */}
        <div className="p-6 rounded-2xl glass-panel flex flex-col gap-4">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2 border-b border-slate-900 pb-3">
            <User className="w-4 h-4 text-blue-400" /> Candidate Persona
          </h3>
          <div className="flex flex-col gap-3 text-xs text-slate-400">
            <div className="flex items-start gap-2.5">
              <GraduationCap className="w-4.5 h-4.5 text-slate-500 shrink-0 mt-0.5" /> 
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-300 font-semibold">{profile.college}</span>
                <span className="text-[10px] text-slate-500">Graduating Year: {profile.graduationYear}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 border-t border-slate-900 pt-3">
              <Briefcase className="w-4.5 h-4.5 text-slate-500 shrink-0 mt-0.5" /> 
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-300 font-semibold">{profile.branch} Major</span>
                <span className="text-[10px] text-slate-500">Track: {profile.experienceLevel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Intelligence Card */}
        <div className="p-6 rounded-2xl glass-panel flex flex-col gap-4">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2 border-b border-slate-900 pb-3">
            <FileText className="w-4 h-4 text-pink-400" /> Resume Analyzer
          </h3>

          {!parsedResume ? (
            <div className="flex flex-col gap-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed border-slate-800 hover:border-indigo-500/30 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 hover:bg-indigo-500/5 transition cursor-pointer ${isUploading ? 'pointer-events-none' : ''}`}
              >
                <UploadCloud className={`w-8 h-8 text-slate-500 ${isUploading ? 'animate-bounce' : ''}`} />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-300">Click to upload resume</span>
                  <span className="text-[9px] text-slate-500">PDF, DOCX formats (Max 10MB)</span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleResumeUpload} 
                  accept=".pdf" 
                  className="hidden" 
                />
              </div>

              {isUploading && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                    <span>Extracting Skills & Experience...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                    <div className="bg-indigo-500 h-1 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">{parsedResume.fileName}</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[9px] font-bold">PARSED</span>
              </div>
              
              <div className="border-t border-slate-900 pt-3 flex flex-col gap-2">
                <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase">Extracted Tech Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {parsedResume.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-slate-900 text-slate-350 border border-slate-850 rounded text-[9px] font-mono">{s}</span>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-900 pt-3 flex flex-col gap-2">
                <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase">Recognized Projects</span>
                <div className="flex flex-col gap-2 text-xs">
                  {parsedResume.projects.map((p, idx) => (
                    <div key={idx} className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-350">{p.title}</span>
                      <span className="text-[9px] text-slate-500 leading-normal">{p.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setParsedResume(null as any)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-850 text-xs font-bold rounded-xl transition"
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
