import React, { useState } from 'react';
import { UploadCloud, Play, BarChart2, Plus, Sparkles, BookOpen } from 'lucide-react';

export default function Dashboard({ onStartInterview }: { onStartInterview: (id: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [atsScore, setAtsScore] = useState<number | null>(null);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setAtsScore(82);
    }, 2000);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Column */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
          <p className="text-slate-400">Track your progress, manage resumes, and start new mock interviews.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-morphism flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Interviews Done</span>
            <span className="text-3xl font-bold text-white">12</span>
          </div>
          <div className="p-6 rounded-2xl glass-morphism flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Avg Score</span>
            <span className="text-3xl font-bold text-emerald-400">76%</span>
          </div>
          <div className="p-6 rounded-2xl glass-morphism flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Target Matches</span>
            <span className="text-3xl font-bold text-blue-400">89%</span>
          </div>
        </div>

        {/* Start Interview Panel */}
        <div className="p-8 rounded-2xl bg-gradient-to-tr from-blue-900/40 to-indigo-900/20 border border-blue-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-blue-400" /> Start AI Interview Simulation</h3>
            <p className="text-slate-300 text-sm max-w-md">Launch a tailored interview session mimicking Google, Amazon, Microsoft, or high-growth startup loops.</p>
          </div>
          <button 
            onClick={() => onStartInterview('session_uuid')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition"
          >
            <Play className="w-4 h-4 fill-white" /> Launch Session
          </button>
        </div>
      </div>

      {/* Sidebar Panel - Resume Upload */}
      <div className="flex flex-col gap-8">
        <div className="p-8 rounded-2xl glass-morphism flex flex-col gap-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><UploadCloud className="w-5 h-5 text-slate-400" /> Resume Intelligence</h3>
          
          {!atsScore ? (
            <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-blue-500/50 transition cursor-pointer" onClick={handleUpload}>
              <UploadCloud className="w-10 h-10 text-slate-500 animate-pulse" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-slate-300">Click to upload resume</span>
                <span className="text-xs text-slate-500">PDF, DOCX up to 10MB</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">ATS Match Score</span>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold">{atsScore}% Compatibility</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-400 h-2 rounded-full" style={{ width: `${atsScore}%` }} />
              </div>
              <div className="mt-2 border-t border-slate-800/60 pt-4 flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-400">Missing Key Technologies</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs font-mono">Redis</span>
                  <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs font-mono">System Design</span>
                  <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs font-mono">Docker</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
