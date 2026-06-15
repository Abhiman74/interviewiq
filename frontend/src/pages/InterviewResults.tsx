import React from 'react';
import { ArrowLeft, CheckCircle2, TrendingUp, AlertTriangle, BookOpen, ChevronRight, Award, HelpCircle, Sparkles } from 'lucide-react';

interface ResultsProps {
  interviewId: string | null;
  history: any[];
  onBack: () => void;
}

export default function InterviewResults({ interviewId, history, onBack }: ResultsProps) {
  const activeInterview = history.find(h => h.id === interviewId) || history[0];

  // Letter Grade Heuristic
  const getLetterGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    return 'C+';
  };

  const strengths = activeInterview.strengths || [
    'Demonstrates a strong analytical architecture understanding of microservices.',
    'Clear verbal communication speed; low hesitation threshold.',
    'Good query index planning and normalization explanations.'
  ];

  const weaknesses = activeInterview.weaknesses || [
    'Could improve in dynamic memory caching tradeoffs details.',
    'System Design details lacked explicit load balancer sizing.'
  ];

  const feedback = activeInterview.feedback || 'Good overall performance, but focus on the specific caching patterns and data distribution metrics.';

  const roadmapSteps = activeInterview.roadmapSteps || [
    'Study Redis Caching LRU eviction policies & cluster sharding',
    'Solve 15 Graph DFS/BFS topological sorting scenarios',
    'Incorporate concrete metrics using the STAR behavioral framework'
  ];

  const scoresBreakdown = [
    { name: 'Technical Depth', value: activeInterview.score + 2, color: 'bg-[#6366F1]' },
    { name: 'Communication Clarity', value: activeInterview.score - 4, color: 'bg-[#8B5CF6]' },
    { name: 'Problem Solving Speed', value: activeInterview.score + 1, color: 'bg-[#22D3EE]' },
    { name: 'Speech Confidence', value: activeInterview.score - 2, color: 'bg-[#10B981]' },
    { name: 'Behavioral Attributes', value: activeInterview.score + 3, color: 'bg-[#EC4899]' }
  ];

  // Calculate coordinates for SVG radar chart
  const radarMetrics = [
    { label: 'Technical', val: activeInterview.score + 2 },
    { label: 'Communication', val: activeInterview.score - 4 },
    { label: 'Problem Solving', val: activeInterview.score + 1 },
    { label: 'Confidence', val: activeInterview.score - 2 },
    { label: 'Behavioral', val: activeInterview.score + 3 }
  ];

  const getRadarPath = () => {
    const radius = 40;
    const center = 50;
    const angleStep = (2 * Math.PI) / 5;
    
    const points = radarMetrics.map((m, idx) => {
      const angle = idx * angleStep - Math.PI / 2; // Shift by 90deg to start at top
      const valPct = m.val / 100;
      const x = center + radius * valPct * Math.cos(angle);
      const y = center + radius * valPct * Math.sin(angle);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')} Z`;
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto px-8 py-12 w-full flex flex-col gap-8">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition self-start text-xs">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      {/* Hero Header Results Card */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-[#111827]/40 to-transparent border border-indigo-900/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-950/10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400"><Award className="w-8 h-8" /></div>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-black text-white tracking-tight">Evaluation Completed</h1>
            <p className="text-slate-450 text-xs sm:text-sm">Simulated {activeInterview.role} loop ({activeInterview.style})</p>
          </div>
        </div>
        
        {/* Circular Score Badge with Letter Grade */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="w-24 h-24 relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="#1F2937" strokeWidth="5" fill="transparent" />
              <circle 
                cx="48" cy="48" r="40" 
                stroke="#10B981" 
                strokeWidth="5" 
                fill="transparent" 
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - activeInterview.score / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-emerald-400 tracking-tighter">{activeInterview.score}%</span>
              <span className="text-[8px] font-black text-slate-500 tracking-widest uppercase">Score</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-4xl font-black text-white">{getLetterGrade(activeInterview.score)}</span>
            <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mt-1">Simulated Grade</span>
          </div>
        </div>
      </div>

      {/* AI Interviewer Feedback */}
      <div className="p-6 rounded-2xl glass-panel flex flex-col gap-3">
        <h3 className="font-extrabold text-slate-200 text-sm flex items-center gap-2 border-b border-slate-900 pb-3">
          <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" /> AI Feedback Summary
        </h3>
        <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
          {feedback}
        </p>
      </div>

      {/* Code Complexity & Progression Analysis */}
      {(activeInterview.complexity || activeInterview.progression) && (
        <div className="p-6 rounded-2xl glass-panel flex flex-col gap-5">
          <h3 className="font-extrabold text-slate-200 text-sm flex items-center gap-2 border-b border-slate-900 pb-3">
            <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400" /> Algorithmic Complexity & Progression
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeInterview.complexity && (
              <div className="p-5 rounded-xl border border-slate-900 bg-slate-950/20 flex flex-col gap-2 text-left">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Complexity Analysis</span>
                <div className="flex items-center gap-6 mt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Time Complexity</span>
                    <p className="font-mono text-sm font-black text-emerald-450 mt-0.5">{activeInterview.complexity.time || 'N/A'}</p>
                  </div>
                  <div className="border-l border-slate-800 pl-6">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Space Complexity</span>
                    <p className="font-mono text-sm font-black text-cyan-455 mt-0.5">{activeInterview.complexity.space || 'N/A'}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-450 mt-2 leading-relaxed">{activeInterview.complexity.explanation}</p>
              </div>
            )}

            {activeInterview.progression && (
              <div className="p-5 rounded-xl border border-slate-900 bg-slate-950/20 flex flex-col gap-2 text-left">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Brute Force to Optimal Progression</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    activeInterview.progression.detected 
                      ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-600/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {activeInterview.progression.detected ? 'Optimized Progression Cleared' : 'Standard Implementation'}
                  </span>
                </div>
                <p className="text-xs text-slate-450 mt-2 leading-relaxed">{activeInterview.progression.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Scores Breakdown Column */}
        <div className="p-6 rounded-2xl glass-panel flex flex-col gap-6">
          <h3 className="font-extrabold text-slate-200 text-sm flex items-center gap-2 border-b border-slate-900 pb-3"><TrendingUp className="w-4.5 h-4.5 text-indigo-400" /> Category Metrics</h3>
          
          <div className="flex flex-col gap-4">
            {scoresBreakdown.map(s => (
              <div key={s.name} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-450 font-semibold">{s.name}</span>
                  <span className="text-slate-250 font-bold">{s.value}%</span>
                </div>
                <div className="w-full bg-[#0B0F19] rounded-full h-1.5 overflow-hidden border border-slate-900/60">
                  <div className={`${s.color} h-1.5 rounded-full`} style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radar chart for skill analysis */}
        <div className="p-6 rounded-2xl glass-panel flex flex-col gap-6 items-center">
          <h3 className="font-extrabold text-slate-200 text-sm flex items-center gap-2 border-b border-slate-900 pb-3 w-full text-left"><HelpCircle className="w-4.5 h-4.5 text-pink-400" /> Skill Analysis Web</h3>
          
          {/* Custom SVG Radar chart */}
          <div className="w-48 h-48 relative flex items-center justify-center mt-2">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Radar Grid Circles */}
              <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="30" stroke="#1e293b" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="20" stroke="#1e293b" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="10" stroke="#1e293b" strokeWidth="0.5" fill="none" />
              
              {/* Radial Web Axis lines */}
              {[0, 72, 144, 216, 288].map((angle, idx) => {
                const rad = (angle * Math.PI) / 180 - Math.PI / 2;
                const x = 50 + 40 * Math.cos(rad);
                const y = 50 + 40 * Math.sin(rad);
                return <line key={idx} x1="50" y1="50" x2={x} y2={y} stroke="#1e293b" strokeWidth="0.5" />;
              })}

              {/* Polygon Path */}
              <path 
                d={getRadarPath()} 
                fill="rgba(99, 102, 241, 0.15)" 
                stroke="#8B5CF6" 
                strokeWidth="2" 
              />
            </svg>
            <span className="absolute top-1 text-[8px] font-black text-slate-500 uppercase tracking-widest">Tech</span>
            <span className="absolute right-1 text-[8px] font-black text-slate-500 uppercase tracking-widest">Comm</span>
            <span className="absolute bottom-1 text-[8px] font-black text-slate-500 uppercase tracking-widest">Problem</span>
            <span className="absolute left-1 text-[8px] font-black text-slate-500 uppercase tracking-widest">Solve</span>
          </div>
        </div>
      </div>

      {/* Strengths and weaknesses list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl glass-panel flex flex-col gap-4">
          <h3 className="font-extrabold text-slate-200 text-sm flex items-center gap-2 border-b border-slate-900 pb-3"><CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 animate-pulse" /> Core Strengths</h3>
          <ul className="list-disc list-inside text-slate-400 pl-2 text-xs leading-relaxed flex flex-col gap-2">
            {strengths.map((str: string, i: number) => (
              <li key={i}>{str}</li>
            ))}
          </ul>
        </div>
        <div className="p-6 rounded-2xl glass-panel flex flex-col gap-4">
          <h3 className="font-extrabold text-slate-200 text-sm flex items-center gap-2 border-b border-slate-900 pb-3"><AlertTriangle className="w-4.5 h-4.5 text-amber-500" /> Focus Weaknesses</h3>
          <ul className="list-disc list-inside text-slate-400 pl-2 text-xs leading-relaxed flex flex-col gap-2">
            {weaknesses.map((w: string, i: number) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggested Learning Roadmap */}
      <div className="p-6 rounded-2xl glass-panel flex flex-col gap-6">
        <h3 className="font-extrabold text-slate-200 text-sm flex items-center gap-2 border-b border-slate-900 pb-3"><BookOpen className="w-4.5 h-4.5 text-indigo-400" /> Custom Learning Roadmap</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roadmapSteps.map((step: string, idx: number) => {
            const colors = [
              { label: 'Technical', text: 'text-blue-400', border: 'hover:border-blue-500/20', link: 'Practice Guide' },
              { label: 'Algorithms', text: 'text-indigo-400', border: 'hover:border-indigo-500/20', link: 'Leetcode List' },
              { label: 'Behavioral', text: 'text-pink-400', border: 'hover:border-pink-500/20', link: 'STAR Templates' }
            ];
            const col = colors[idx % 3];
            return (
              <div key={idx} className={`p-5 rounded-xl border border-slate-900 bg-slate-950/30 ${col.border} transition flex flex-col justify-between min-h-[140px]`}>
                <div>
                  <span className={`text-[9px] font-bold ${col.text} tracking-wider uppercase`}>{col.label} Focus</span>
                  <h4 className="font-bold text-slate-200 text-sm mt-1 leading-snug">{step}</h4>
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">Personalized step to improve your interview performance based on evaluation feedback.</p>
                </div>
                <a href="#" className={`text-[11px] font-semibold ${col.text} hover:opacity-80 flex items-center mt-4 gap-1`}>{col.link} <ChevronRight className="w-3.5 h-3.5" /></a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
