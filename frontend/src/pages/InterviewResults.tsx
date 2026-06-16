import React from 'react';
import { ArrowLeft, CheckCircle2, TrendingUp, AlertTriangle, BookOpen, ChevronRight, Award } from 'lucide-react';

interface ResultsProps {
  interviewId: string | null;
  history: any[];
  onBack: () => void;
}

export default function InterviewResults({ interviewId, history, onBack }: ResultsProps) {
  // Find current interview score or fallback
  const activeInterview = history.find(h => h.id === interviewId) || history[0];

  const scoresBreakdown = [
    { name: 'Technical Depth', value: activeInterview.score + 2, color: 'bg-blue-500' },
    { name: 'Communication Clarity', value: activeInterview.score - 4, color: 'bg-indigo-500' },
    { name: 'Problem Solving Speed', value: activeInterview.score + 1, color: 'bg-cyan-500' },
    { name: 'Speech Confidence', value: activeInterview.score - 2, color: 'bg-emerald-500' },
    { name: 'Behavioral Attributes', value: activeInterview.score + 3, color: 'bg-purple-500' }
  ];

  return (
    <div className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full flex flex-col gap-8">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition self-start text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      {/* Hero Header Results Card */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/10 border border-blue-800/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400"><Award className="w-8 h-8" /></div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-extrabold text-white">Interview Complete!</h1>
            <p className="text-slate-400 text-sm">Simulated {activeInterview.role} Loop ({activeInterview.style})</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-5xl font-black text-emerald-400">{activeInterview.score}%</span>
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 mt-1">Overall IQ Rating</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Scores Breakdown Column */}
        <div className="p-6 rounded-2xl glass-morphism flex flex-col gap-6">
          <h3 className="font-extrabold text-slate-200 text-base flex items-center gap-2 border-b border-slate-900 pb-3"><TrendingUp className="w-4.5 h-4.5 text-blue-400" /> Metric Scores</h3>
          
          <div className="flex flex-col gap-4">
            {scoresBreakdown.map(s => (
              <div key={s.name} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{s.name}</span>
                  <span className="text-slate-200 font-bold">{s.value}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div className={`${s.color} h-2 rounded-full`} style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="p-6 rounded-2xl glass-morphism flex flex-col gap-6">
          <h3 className="font-extrabold text-slate-200 text-base flex items-center gap-2 border-b border-slate-900 pb-3"><CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" /> AI Feedback Summary</h3>
          
          <div className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 shrink-0" /> Core Strengths</span>
              <ul className="list-disc list-inside text-slate-400 pl-2 leading-relaxed flex flex-col gap-1">
                <li>Demonstrates a strong analytical architecture understanding of microservices.</li>
                <li>Clear verbal communication speed; low hesitation threshold.</li>
                <li>Good query index planning and normalization explanations.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 mt-2 border-t border-slate-900 pt-4">
              <span className="font-semibold text-amber-500 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 shrink-0" /> Focus Weaknesses</span>
              <ul className="list-disc list-inside text-slate-400 pl-2 leading-relaxed flex flex-col gap-1">
                <li>Could improve in dynamic memory caching tradeoffs details.</li>
                <li>System Design details lacked explicit load balancer sizing.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Roadmap */}
      <div className="p-6 rounded-2xl glass-morphism flex flex-col gap-6">
        <h3 className="font-extrabold text-slate-200 text-base flex items-center gap-2 border-b border-slate-900 pb-3"><BookOpen className="w-4.5 h-4.5 text-indigo-400" /> Suggested Learning Roadmap</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/40 flex flex-col justify-between min-h-[140px]">
            <div>
              <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">Topic 1: System Design</span>
              <h4 className="font-bold text-slate-200 text-sm mt-1">Study Redis Caching Strategies</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">Focus on LRU eviction, cluster sharding, and latency vs consistent hashing techniques.</p>
            </div>
            <a href="#" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center mt-3 gap-1">Practice Guide <ChevronRight className="w-3.5 h-3.5" /></a>
          </div>

          <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/40 flex flex-col justify-between min-h-[140px]">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">Topic 2: Algorithmic</span>
              <h4 className="font-bold text-slate-200 text-sm mt-1">Solve 15 Graph DFS/BFS Tasks</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">Strengthen topological sorting, Dijkstra complexity, and recursive implementation patterns.</p>
            </div>
            <a href="#" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center mt-3 gap-1">Leetcode List <ChevronRight className="w-3.5 h-3.5" /></a>
          </div>

          <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/40 flex flex-col justify-between min-h-[140px]">
            <div>
              <span className="text-[10px] font-bold text-purple-400 tracking-wider uppercase">Topic 3: STAR Method</span>
              <h4 className="font-bold text-slate-200 text-sm mt-1">Behavioral STAR Framing</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">Practice formatting situational stories using concrete metric outcomes (e.g. "reduced latency by 40%").</p>
            </div>
            <a href="#" className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center mt-3 gap-1">STAR Templates <ChevronRight className="w-3.5 h-3.5" /></a>
          </div>
        </div>
      </div>
    </div>
  );
}
