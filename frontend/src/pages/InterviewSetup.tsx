import React, { useState } from 'react';
import { ArrowLeft, Play, Sparkles, Building2, Sliders, ShieldCheck } from 'lucide-react';

interface SetupProps {
  onBack: () => void;
  onStart: (config: { role: string; difficulty: string; style: string; companyContext?: string }) => void;
}

export default function InterviewSetup({ onBack, onStart }: SetupProps) {
  const [role, setRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [style, setStyle] = useState('Google-style');
  const [customContext, setCustomContext] = useState('');

  const roles = [
    'Software Engineer', 'Backend Engineer', 'Frontend Engineer', 
    'Full Stack Engineer', 'Data Analyst', 'Data Scientist', 
    'Machine Learning Engineer', 'Product Manager', 'Behavioral Interview', 'HR Interview'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const styles = [
    { id: 'Google-style', name: 'Google Style', desc: 'Focuses heavily on algorithm complexity, system scalability, and core computing concepts.' },
    { id: 'DSA-style', name: 'DSA Coding Round', desc: 'Coding-focused round testing optimal algorithms, complexity analysis (Big-O), and brute-force optimizations.' },
    { id: 'Amazon-style', name: 'Amazon Style', desc: 'Evaluates behavioral responses strictly against the 16 Leadership Principles.' },
    { id: 'Microsoft-style', name: 'Microsoft Style', desc: 'Emphasizes direct problem-solving, structural OOP coding, and API design.' },
    { id: 'Startup-style', name: 'Startup Style', desc: 'Fast-paced, broad full-stack scenarios, rapid development tradeoffs, and deployment debugging.' }
  ];

  const companyPresets: Record<string, string> = {
    Google: "Focus heavily on time and space complexity. Ask classic algorithmic or graph traversal questions. Expect O(N log N) or optimal O(N) solutions.",
    Meta: "Speed and correctness are key. Focus on standard array, string, and sliding window problems. Candidates should optimize for space and time.",
    Amazon: "Focus heavily on customer obsession and ownership principles during the initial discussion, followed by an array/heap data structure problem.",
    Stripe: "Focus on clean coding, readability, API design, and robustness. Candidates must write functional code that handles edge cases cleanly.",
    Netflix: "Expect highly optimized microservice or system-oriented design, or advanced algorithmic concurrency issues."
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full flex flex-col gap-8">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition self-start text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-white">Configure Mock Interview</h1>
        <p className="text-slate-400">Tailor the AI simulator parameters to match your target role and target company loop.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Configurations Column */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" /> Target Job Role
            </label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-blue-500 transition"
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" /> Experience / Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {difficulties.map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-3 rounded-xl border font-semibold text-sm transition ${
                    difficulty === d 
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/5' 
                      : 'border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Company Style Selection */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Interview Format Style
          </label>
          <div className="flex flex-col gap-3">
            {styles.map(s => (
              <div
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`p-4 rounded-xl border cursor-pointer transition flex flex-col gap-1 ${
                  style === s.id 
                    ? 'bg-indigo-600/10 border-indigo-500 text-white' 
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-400'
                }`}
              >
                <span className="font-bold text-slate-200 text-sm flex items-center justify-between">
                  {s.name}
                  {style === s.id && <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />}
                </span>
                <span className="text-xs text-slate-400 leading-relaxed mt-1">{s.desc}</span>
              </div>
            ))}

            {/* Custom Context */}
            <div className="flex flex-col gap-2 mt-4 text-left">
              <label className="text-sm font-semibold text-slate-305 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" /> Target Company Context & Presets (Optional)
              </label>

              <div className="flex flex-wrap gap-2 mb-1">
                {Object.keys(companyPresets).map((comp) => (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => setCustomContext(companyPresets[comp])}
                    className="px-2.5 py-1 text-[10px] rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition"
                  >
                    {comp} Preset
                  </button>
                ))}
              </div>

              <textarea
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                placeholder="Paste specific engineering values, cultural guidelines, or coding styles of your target company to adapt the AI..."
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-blue-500 transition resize-none h-24 text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3 text-slate-400 text-xs max-w-md">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <span>Real-time speech analysis and camera parameters will initialize upon launching the interview. Ensure mic and speaker settings are ready.</span>
        </div>
        <button
          onClick={() => onStart({ role, difficulty, style, companyContext: customContext })}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold text-white shadow-xl shadow-blue-900/30 transition-all active:scale-95"
        >
          Start Simulation <Play className="w-4 h-4 fill-white" />
        </button>
      </div>
    </div>
  );
}
