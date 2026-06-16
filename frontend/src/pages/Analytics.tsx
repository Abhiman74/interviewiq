import React from 'react';
import { ArrowLeft, Activity, Calendar, Award, BarChart3, TrendingUp } from 'lucide-react';

interface AnalyticsProps {
  history: any[];
  onBack: () => void;
}

export default function Analytics({ history, onBack }: AnalyticsProps) {
  const averageScore = history.length > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length)
    : 0;

  const bestScore = history.length > 0
    ? Math.max(...history.map(h => h.score))
    : 0;

  return (
    <div className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full flex flex-col gap-8">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition self-start text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-white">Analytics & Trends</h1>
        <p className="text-slate-400">Track interview progress trends and technical scoring analytics over time.</p>
      </div>

      {/* Analytics Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-morphism flex flex-col gap-3 relative overflow-hidden">
          <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">Average IQ Rating</span>
          <span className="text-4xl font-black text-white">{averageScore}%</span>
          <p className="text-[11px] text-slate-500 leading-relaxed">Aggregated score based on historical technical and behavioral performance.</p>
        </div>

        <div className="p-6 rounded-2xl glass-morphism flex flex-col gap-3 relative overflow-hidden">
          <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">Best IQ Rating</span>
          <span className="text-4xl font-black text-emerald-400">{bestScore}%</span>
          <p className="text-[11px] text-slate-500 leading-relaxed">Your highest simulated interview score achieved to date.</p>
        </div>

        <div className="p-6 rounded-2xl glass-morphism flex flex-col gap-3 relative overflow-hidden">
          <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase">Interviews Finished</span>
          <span className="text-4xl font-black text-white">{history.length}</span>
          <p className="text-[11px] text-slate-500 leading-relaxed">Total count of completed AI interview loops on this account.</p>
        </div>
      </div>

      {/* simulated progress graph using SVGs for stunning premium design */}
      <div className="p-8 rounded-2xl glass-morphism border border-slate-800 flex flex-col gap-6">
        <h3 className="font-extrabold text-slate-200 text-base flex items-center gap-2 border-b border-slate-900 pb-3">
          <TrendingUp className="w-4.5 h-4.5 text-blue-400" /> Historic Progress Trend
        </h3>

        {/* SVG Sparkline Graph */}
        <div className="h-64 w-full bg-slate-950/40 rounded-xl border border-slate-900 p-4 relative flex items-end">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3" />

            {/* Sparkline curve */}
            <path
              d="M 10 70 Q 30 50 50 35 T 90 20"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Dots */}
            <circle cx="10" cy="70" r="2.5" fill="#3b82f6" />
            <circle cx="50" cy="35" r="2.5" fill="#6366f1" />
            <circle cx="90" cy="20" r="2.5" fill="#10b981" />

            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute top-2 left-4 text-[10px] text-slate-600 font-mono">100% -</div>
          <div className="absolute bottom-2 left-4 text-[10px] text-slate-600 font-mono">0% -</div>
          <div className="absolute bottom-1 right-4 text-[10px] text-slate-600 font-mono">Jun 2026</div>
        </div>
      </div>
    </div>
  );
}
