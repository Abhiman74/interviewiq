import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Briefcase, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { ParsedResume } from '../App';

interface JDProps {
  parsedResume: ParsedResume | null;
  onBack: () => void;
}

export default function JobMatchDashboard({ parsedResume, onBack }: JDProps) {
  const [jdText, setJdText] = useState('');
  const [matching, setMatching] = useState(false);
  const [report, setReport] = useState<any | null>(null);

  const handleMatch = () => {
    if (!jdText.trim()) {
      alert("Please paste a Job Description first!");
      return;
    }
    setMatching(true);
    setTimeout(() => {
      setMatching(false);
      setReport({
        matchPercentage: 84,
        matchingSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Express'],
        missingKeywords: ['Redis', 'Docker', 'Kubernetes', 'CI/CD Pipelines'],
        suggestions: 'Incorporate detailed metrics in your projects section showing how you scaled databases or optimized server endpoints.',
        questions: [
          'How would you manage cluster configurations inside Kubernetes deployment pods?',
          'What strategy do you use for caching invalidated queries using Redis?'
        ]
      });
    }, 1500);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full flex flex-col gap-8">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition self-start text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-white">Job Description Matching</h1>
        <p className="text-slate-400">Paste a job specification text to run semantic comparisons against your resume.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Paste Box */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" /> Paste Job Specification
          </label>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste raw JD text from LinkedIn, Glassdoor, etc. here..."
            className="w-full h-80 bg-slate-900 border border-slate-850 rounded-2xl p-4 text-sm text-slate-350 outline-none focus:border-blue-500 transition resize-none leading-relaxed"
          />
          <button
            onClick={handleMatch}
            disabled={matching}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            {matching ? 'Running Semantic Match...' : <><Sparkles className="w-4 h-4" /> Analyze JD Match</>}
          </button>
        </div>

        {/* Results Block */}
        <div className="flex flex-col justify-center">
          {!report ? (
            <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center gap-4 text-slate-500 min-h-[300px] justify-center">
              <FileText className="w-12 h-12 text-slate-650" />
              <p className="text-sm">Provide job specification text to generate a compatibility rating and keywords comparison.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Match Rating Ring */}
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-blue-900/30 to-indigo-900/10 border border-blue-800/20 flex items-center justify-between">
                <span className="font-bold text-slate-300 text-sm">Role Compatibility Score</span>
                <span className="text-3xl font-black text-emerald-400">{report.matchPercentage}%</span>
              </div>

              {/* Skills Overlap */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase">Matching Tech Stack</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {report.matchingSkills.map((s: string) => (
                    <span key={s} className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/10 rounded text-xs font-mono">{s}</span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase">Identified Keyword Gaps</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {report.missingKeywords.map((s: string) => (
                    <span key={s} className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/10 rounded text-xs font-mono">{s}</span>
                  ))}
                </div>
              </div>

              {/* Probable Questions */}
              <div className="flex flex-col gap-3 border-t border-slate-900 pt-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Likely Interview Questions</span>
                <div className="flex flex-col gap-2 mt-1 text-xs">
                  {report.questions.map((q: string, i: number) => (
                    <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-850 text-slate-300 leading-relaxed">
                      "{q}"
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
