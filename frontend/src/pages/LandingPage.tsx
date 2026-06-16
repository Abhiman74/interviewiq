import React, { useState } from 'react';
import { Shield, Cpu, Mic, BarChart4, ChevronRight, Check, Star, MessageSquare, Play, HelpCircle, ArrowRight } from 'lucide-react';

export default function LandingPage({ onStart }: { onStart: () => void }) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const pricingPlans = [
    {
      name: 'Starter',
      price: billingPeriod === 'monthly' ? '$0' : '$0',
      period: 'forever free',
      desc: 'Perfect for students beginning their placement preparation tracks.',
      features: ['2 simulated interviews / month', 'Standard resume parsing', 'Text feedback reports', 'Standard difficulty scales'],
      cta: 'Start Free',
      highlighted: false
    },
    {
      name: 'Pro',
      price: billingPeriod === 'monthly' ? '$19' : '$15',
      period: 'per month',
      desc: 'Our most popular plan for active job-seekers switching careers.',
      features: ['Unlimited AI interviews', 'Speech-to-Text Voice Mode support', 'Gemini adaptive follow-ups', 'Missing keywords intelligence', 'STAR behavioral guides'],
      cta: 'Upgrade to Pro',
      highlighted: true
    },
    {
      name: 'Elite',
      price: billingPeriod === 'monthly' ? '$49' : '$39',
      period: 'per month',
      desc: 'Built for professionals aiming for Lead and Staff roles at Big Tech.',
      features: ['Everything in Pro', 'System Design specific scoring', 'Unlimited JD semantic matches', '1-on-1 performance metrics graphs', 'Unlimited custom avatars'],
      cta: 'Go Elite',
      highlighted: false
    }
  ];

  const faqItems = [
    {
      q: "How does the AI follow-up questioning work?",
      a: "Unlike typical chatbots that ask rigid questions, InterviewIQ parses your response text for architectural terms. If you say you used a specific database, our adaptive engine dynamically generates contextual questions checking your reasoning, eviction limits, or scaling alternatives."
    },
    {
      q: "Does the voice interview mode require special hardware?",
      a: "No! It runs completely in the browser using the native Web Speech API. You only need to allow microphone access. We recommend Google Chrome or Safari for the best voice experience."
    },
    {
      q: "How is the ATS resume score calculated?",
      a: "Our parser runs semantic chunk comparisons between your resume and standard target roles. It measures skill overlaps, layout readability, keyword frequency, and identifies missing technology terms that ATS screening filters often look for."
    },
    {
      q: "Can I paste custom job descriptions?",
      a: "Yes! Paste any JD inside the Matcher and our engine will perform a vector similarity search to map your resume overlap, calculate a match rating %, highlight keyword gaps, and list probable interview questions."
    }
  ];

  return (
    <div className="flex-1 flex flex-col mesh-overlay relative">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Sticky Header */}
      <header className="border-b border-slate-900 bg-[#0B0F19]/80 backdrop-blur sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-indigo-500/20">Q</div>
          <span className="font-extrabold text-xl tracking-tight text-white">InterviewIQ</span>
        </div>
        <button 
          onClick={onStart}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-pink-650 hover:from-indigo-550 hover:to-pink-550 active:scale-95 transition text-xs font-bold rounded-xl shadow-xl shadow-indigo-500/10 text-white"
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto px-6 w-full gap-12 z-10">
        <div className="flex-1 flex flex-col text-left items-start max-w-xl">
          <span className="px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-bold tracking-wider uppercase text-indigo-400 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
            AI Mock Simulator loop v1.0
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.15]">
            Redefining AI <br />
            <span className="bg-gradient-to-r from-indigo-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Mock Interviews</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mb-10 leading-relaxed">
            Upload your resume, paste a target job description, and run hyper-realistic voice simulations. Analyze technical depth, speech confidence, and grammar clarity in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={onStart}
              className="glow-button w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-pink-650 hover:from-indigo-550 hover:to-pink-550 rounded-xl font-extrabold text-sm text-white shadow-xl shadow-indigo-500/15 transition-all transform active:scale-95"
            >
              Start Free Simulation <ChevronRight className="w-4 h-4" />
            </button>
            <a href="#features" className="w-full sm:w-auto text-center px-6 py-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 font-bold rounded-xl transition text-sm">
              Explore Features
            </a>
          </div>
        </div>

        {/* Hero Illustration / Visual representation */}
        <div className="flex-1 relative w-full max-w-md lg:max-w-none flex items-center justify-center">
          <div className="absolute w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none animate-pulse-slow" />
          
          {/* Mockup layout */}
          <div className="w-full max-w-sm rounded-2xl border border-slate-900 bg-slate-950 p-6 flex flex-col gap-4 relative animate-float shadow-2xl shadow-indigo-950/20">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 text-[10px] font-bold text-slate-500">
              <span>GOOGLE SYSTEM DESIGN MOCK</span>
              <span className="text-emerald-400">ACTIVE</span>
            </div>
            
            {/* Visual AI bubble */}
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-850 text-xs text-slate-350 leading-relaxed">
              "Why choose a Redis distributed cache system over standard memory caches for this scaling threshold?"
            </div>

            {/* Visual audio wave representation */}
            <div className="h-12 bg-slate-950 rounded-xl flex items-center justify-center gap-1.5 px-6 border border-slate-900/80">
              {[2,4,7,5,3,6,8,5,2,4,6,7,3,2,5].map((h, i) => (
                <span key={i} className="w-0.5 bg-indigo-400/60 rounded" style={{ height: `${h * 4}px` }} />
              ))}
            </div>

            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Logos Strip */}
      <section className="py-8 border-y border-slate-900 bg-[#0B0F19]/60 text-center px-6">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">ACCEPTED BY ENGINEERS AT</span>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale contrast-200 text-sm font-black tracking-widest text-slate-400">
          <span>GOOGLE</span>
          <span>AMAZON</span>
          <span>MICROSOFT</span>
          <span>STRIPE</span>
          <span>NETFLIX</span>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-28 px-6 scroll-mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">CORE MODULES</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">Engineered for Technical Mastery</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm leading-relaxed">Every feature is modeled after actual assessment workflows used by principal staff loops.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl glass-panel premium-card flex gap-6 items-start">
              <div className="p-3 bg-blue-500/10 border border-blue-500/10 rounded-xl text-blue-400 shrink-0"><Cpu className="w-5.5 h-5.5" /></div>
              <div>
                <h3 className="text-base font-bold mb-2 text-slate-200">Resume Intelligence</h3>
                <p className="text-slate-450 text-xs leading-relaxed">Parsed extraction analyzes accomplishments, ratings, and structural errors, mapping compatibility checks dynamically.</p>
              </div>
            </div>
            <div className="p-8 rounded-2xl glass-panel premium-card flex gap-6 items-start">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/10 rounded-xl text-indigo-400 shrink-0"><Mic className="w-5.5 h-5.5" /></div>
              <div>
                <h3 className="text-base font-bold mb-2 text-slate-200">Interactive Voice Mocks</h3>
                <p className="text-slate-450 text-xs leading-relaxed">Experience voice interactions using STT/TTS loops. Custom response timers replicate high-pressure board environments.</p>
              </div>
            </div>
            <div className="p-8 rounded-2xl glass-panel premium-card flex gap-6 items-start">
              <div className="p-3 bg-pink-500/10 border border-pink-500/10 rounded-xl text-pink-400 shrink-0"><MessageSquare className="w-5.5 h-5.5" /></div>
              <div>
                <h3 className="text-base font-bold mb-2 text-slate-200">Adaptive Follow-Up Engine</h3>
                <p className="text-slate-450 text-xs leading-relaxed">AI probes decisions based on your text transcripts. Discuss scaling choices and the engine instantly questions limits.</p>
              </div>
            </div>
            <div className="p-8 rounded-2xl glass-panel premium-card flex gap-6 items-start">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/10 rounded-xl text-cyan-400 shrink-0"><BarChart4 className="w-5.5 h-5.5" /></div>
              <div>
                <h3 className="text-base font-bold mb-2 text-slate-200">Detailed Feedback Reports</h3>
                <p className="text-slate-450 text-xs leading-relaxed">Breaks down scores across technical depth, verbal confidence, behavioral matching, and communication pacing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works with connectors */}
      <section className="py-24 px-6 border-t border-slate-900 bg-slate-950/20">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="text-center mb-20">
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">PROCESS FLOW</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">How InterviewIQ Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative w-full">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#111827] border border-slate-800 flex items-center justify-center font-bold text-indigo-400 text-sm shadow-lg">1</div>
              <h4 className="font-bold text-slate-200 text-xs mt-4">Upload Resume</h4>
              <p className="text-[10px] text-slate-500 mt-2 max-w-[150px] leading-relaxed">Upload your PDF resume to extract skills and projects.</p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#111827] border border-slate-800 flex items-center justify-center font-bold text-indigo-400 text-sm shadow-lg">2</div>
              <h4 className="font-bold text-slate-200 text-xs mt-4">Match Job Role</h4>
              <p className="text-[10px] text-slate-500 mt-2 max-w-[150px] leading-relaxed">Paste your target job specs to map keyword gaps.</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#111827] border border-slate-800 flex items-center justify-center font-bold text-indigo-400 text-sm shadow-lg">3</div>
              <h4 className="font-bold text-slate-200 text-xs mt-4">Run Simulation</h4>
              <p className="text-[10px] text-slate-500 mt-2 max-w-[150px] leading-relaxed">Conduct voice mock loop with adaptive AI followups.</p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#111827] border border-slate-800 flex items-center justify-center font-bold text-indigo-400 text-sm shadow-lg">4</div>
              <h4 className="font-bold text-slate-200 text-xs mt-4">Obtain Roadmap</h4>
              <p className="text-[10px] text-slate-500 mt-2 max-w-[150px] leading-relaxed">Review strengths, weaknesses, and custom practice paths.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-28 px-6 border-t border-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">PRICING TIERS</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">Plans Built to Scale</h2>
            
            <div className="mt-8 flex bg-slate-900 border border-slate-850 p-1 rounded-xl">
              <button 
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${billingPeriod === 'monthly' ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-500/10' : 'text-slate-500'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingPeriod('annual')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${billingPeriod === 'annual' ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-500/10' : 'text-slate-500'}`}
              >
                Annual (20% Off)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.name}
                className={`p-8 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative ${
                  plan.highlighted 
                    ? 'bg-slate-900/40 border-indigo-500 shadow-2xl shadow-indigo-500/5 glow-card' 
                    : 'bg-slate-950/40 border-slate-900 glow-card'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-550 to-pink-550 rounded-full text-[9px] font-black uppercase tracking-wider text-white">
                    RECOMMENDED
                  </span>
                )}
                <div>
                  <span className="text-[10px] font-black tracking-wider uppercase text-slate-500">{plan.name}</span>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-slate-550">/ {plan.period}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-4 leading-relaxed">{plan.desc}</p>
                  
                  <div className="border-t border-slate-900 my-6" />
                  
                  <ul className="flex flex-col gap-3.5">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-350">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  onClick={onStart}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs mt-8 transition-all active:scale-95 ${
                    plan.highlighted 
                      ? 'bg-gradient-to-r from-indigo-650 to-pink-650 text-white shadow-lg shadow-indigo-500/10' 
                      : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-850'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordions Section */}
      <section className="py-24 px-6 border-t border-slate-900/60 bg-slate-950/10">
        <div className="max-w-3xl mx-auto flex flex-col gap-12">
          <div className="text-center">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">QUESTIONS</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">Frequently Asked Questions</h2>
          </div>

          <div className="flex flex-col gap-4">
            {faqItems.map((item, idx) => (
              <div 
                key={idx} 
                className="border border-slate-900 bg-slate-950/30 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-slate-200 text-xs sm:text-sm hover:bg-slate-900/40 transition"
                >
                  <span>{item.q}</span>
                  <ChevronRight className={`w-4 h-4 text-slate-500 transition-all ${activeFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-xs text-slate-450 leading-relaxed border-t border-slate-900/50 mt-1">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900/80 py-16 px-8 bg-slate-950/80 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-black text-sm text-white">Q</div>
              <span className="font-extrabold text-sm tracking-tight text-white">InterviewIQ</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">Elevating technical and behavioral candidate mock evaluations globally.</p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold text-slate-350 text-[10px] uppercase tracking-wider mb-2">Product</span>
            <a href="#" className="hover:text-slate-300 transition text-[11px]">Mock Simulator</a>
            <a href="#" className="hover:text-slate-300 transition text-[11px]">Resume Scoring</a>
            <a href="#" className="hover:text-slate-300 transition text-[11px]">Pricing Plans</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold text-slate-350 text-[10px] uppercase tracking-wider mb-2">Resources</span>
            <a href="#" className="hover:text-slate-300 transition text-[11px]">System Design Guides</a>
            <a href="#" className="hover:text-slate-300 transition text-[11px]">STAR Templates</a>
            <a href="#" className="hover:text-slate-300 transition text-[11px]">FAQ</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold text-slate-350 text-[10px] uppercase tracking-wider mb-2">Company</span>
            <a href="#" className="hover:text-slate-300 transition text-[11px]">Careers</a>
            <a href="#" className="hover:text-slate-300 transition text-[11px]">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition text-[11px]">Contact</a>
          </div>
        </div>
        <p className="text-center text-[10px] border-t border-slate-900/60 pt-8 text-slate-650">© 2026 InterviewIQ Platform. Built for Stripe, Linear, and Vercel level elegance.</p>
      </footer>
    </div>
  );
}
