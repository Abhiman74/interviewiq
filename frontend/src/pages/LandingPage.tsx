import React from 'react';
import { Shield, Cpu, Mic, BarChart4, ChevronRight } from 'lucide-react';

export default function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden flex flex-col items-center text-center px-6">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs font-semibold tracking-wider uppercase text-blue-400 mb-6">
            Next-Gen AI Mock Interview Platform
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-tight">
            Nail Your Next Interview With <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">InterviewIQ</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
            Upload your resume, paste a job description, and conduct hyper-realistic AI voice interviews tailored to industry giants like Google, Amazon, and Stripe.
          </p>
          <button 
            onClick={onStart}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold text-lg text-white shadow-xl shadow-blue-900/30 transition-all transform hover:-translate-y-0.5"
          >
            Start Your Mock Interview <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-900/30 border-t border-slate-900 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white">Features Built for High-Performance prep</h2>
            <p className="text-slate-400 mt-4">Every detail optimized to mimic real-world evaluation pipelines.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl glass-morphism flex gap-6 items-start">
              <div className="p-4 bg-blue-500/10 rounded-xl text-blue-400"><Cpu className="w-6 h-6" /></div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Resume Intelligence Parsing</h3>
                <p className="text-slate-400 text-sm">Upload PDF resumes to extract skills, experience levels, and projects. Match against direct JDs to find keyword gaps before applying.</p>
              </div>
            </div>
            <div className="p-8 rounded-2xl glass-morphism flex gap-6 items-start">
              <div className="p-4 bg-indigo-500/10 rounded-xl text-indigo-400"><Mic className="w-6 h-6" /></div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Interactive Voice Mode</h3>
                <p className="text-slate-400 text-sm">Experience interactive flow with Speech-to-Text and Text-to-Speech voice prompts. AI listens, analyzes pause thresholds, and responds seamlessly.</p>
              </div>
            </div>
            <div className="p-8 rounded-2xl glass-morphism flex gap-6 items-start">
              <div className="p-4 bg-cyan-500/10 rounded-xl text-cyan-400"><Shield className="w-6 h-6" /></div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Adaptive Follow-Up Engine</h3>
                <p className="text-slate-400 text-sm">AI queries technical decisions based on your responses. Say "I used Redis" and it immediately probes cache hit rates, cluster scaling, and eviction strategies.</p>
              </div>
            </div>
            <div className="p-8 rounded-2xl glass-morphism flex gap-6 items-start">
              <div className="p-4 bg-emerald-500/10 rounded-xl text-emerald-400"><BarChart4 className="w-6 h-6" /></div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Deep Performance Reports</h3>
                <p className="text-slate-400 text-sm">Get scored across technical depth, problem-solving speed, behavioral attributes, and communication clarity with an actionable learning roadmap.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
