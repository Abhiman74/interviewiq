import React from 'react';
import { ArrowLeft, Activity, Calendar, Award, BarChart3, TrendingUp } from 'lucide-react';

interface AnalyticsProps {
  history: any[];
  onBack: () => void;
}

export default function Analytics({ history, onBack }: AnalyticsProps) {
  const sortedHistory = [...history].reverse();

  const averageScore = history.length > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length)
    : 0;

  const bestScore = history.length > 0
    ? Math.max(...history.map(h => h.score))
    : 0;

  const points = sortedHistory.map((item, idx) => {
    const x = sortedHistory.length > 1 
      ? 10 + (idx / (sortedHistory.length - 1)) * 80 
      : 50;
    const y = 80 - (item.score / 100) * 60; // Map score 0-100 to Y=80 to Y=20
    return { x, y, score: item.score, date: item.date, role: item.role };
  });

  const pathD = points.length > 1
    ? `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`
    : '';

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
          <p className="text-[11px] text-slate-500 leading-relaxed">Aggregated score based on historical performance.</p>
        </div>

        <div className="p-6 rounded-2xl glass-morphism flex flex-col gap-3 relative overflow-hidden">
          <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">Best IQ Rating</span>
          <span className="text-4xl font-black text-emerald-400">{bestScore}%</span>
          <p className="text-[11px] text-slate-500 leading-relaxed">Your highest simulated interview score achieved to date.</p>
        </div>

        <div className="p-6 rounded-2xl glass-morphism flex flex-col gap-3 relative overflow-hidden">
          <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase">Interviews Finished</span>
          <span className="text-4xl font-black text-white">{history.length}</span>
          <p className="text-[11px] text-slate-500 leading-relaxed">Total count of completed AI mock interview loops.</p>
        </div>
      </div>

      {/* Dynamic progress graph */}
      <div className="p-8 rounded-2xl glass-morphism border border-slate-800 flex flex-col gap-6">
        <h3 className="font-extrabold text-slate-200 text-base flex items-center gap-2 border-b border-slate-900 pb-3">
          <TrendingUp className="w-4.5 h-4.5 text-blue-400" /> Historic Progress Trend
        </h3>

        <div className="h-64 w-full bg-[#0B0F19]/40 rounded-xl border border-slate-900 p-4 relative flex items-end">
          {points.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-505">
              No completed sessions yet. Finish an interview to see progress chart.
            </div>
          ) : (
            <>
              <svg className="w-full h-full pb-6" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Grid Lines */}
                <line x1="0" y1="20" x2="100" y2="20" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3" />
                <line x1="0" y1="80" x2="100" y2="80" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3" />

                {/* Sparkline curve */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                )}
                
                {/* Points */}
                {points.map((p, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle cx={p.x} cy={p.y} r="2.5" fill="#6366f1" className="fill-indigo-400 stroke-[#0B0F19] stroke-[1.5]" />
                    <text x={p.x} y={p.y - 6} fill="#e2e8f0" fontSize="4.5" fontWeight="bold" textAnchor="middle">
                      {p.score}%
                    </text>
                  </g>
                ))}

                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute top-2 left-4 text-[9px] text-slate-650 font-mono">100% -</div>
              <div className="absolute bottom-8 left-4 text-[9px] text-slate-650 font-mono">0% -</div>
              <div className="absolute bottom-2 left-10 right-10 flex justify-between text-[9px] text-slate-500 font-mono">
                {points.map((p, idx) => (
                  <span key={idx} className="w-12 text-center truncate" title={`${p.role} (${p.date})`}>
                    {p.date.substring(5)}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
