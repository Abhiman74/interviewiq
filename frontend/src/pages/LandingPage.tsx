import React, { useState } from 'react';
import { Shield, Cpu, Mic, BarChart4, ChevronRight, Check, Star, Play, MessageSquare } from 'lucide-react';

export default function LandingPage({ onStart }: { onStart: () => void }) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

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

  return (
    <div className="flex-1 flex flex-col mesh-gradient">
      {/* Hero Section */}
      <section className="relative py-28 overflow-hidden flex flex-col items-center text-center px-6">
        {/* Glow Spheres */}
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/4 left-3/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto flex flex-col items-center z-10">
          <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-semibold tracking-wider uppercase text-blue-400 mb-8 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            InterviewIQ v1.0 is Live
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[1.1]">
            Nail Your Tech loops with <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">InterviewIQ AI</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
            Upload your resume, compare against any Job Description, and experience hyper-realistic voice interviews tailored to Google, Amazon, Microsoft, and startups.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={onStart}
              className="glow-button flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-extrabold text-white shadow-xl shadow-blue-500/15 transition-all transform active:scale-95"
            >
              Start Free Simulation <ChevronRight className="w-5 h-5" />
            </button>
            <a href="#features" className="px-6 py-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 font-bold rounded-xl transition">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Trusted Logos Strip */}
      <section className="py-8 border-y border-slate-900/80 bg-slate-950/20 text-center px-6">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">ENGINEERS ON INTERVIEWIQ HAVE RECENTLY RECEIVED OFFERS FROM</span>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale contrast-200">
          <span className="font-extrabold text-lg tracking-wider text-slate-400">GOOGLE</span>
          <span className="font-extrabold text-lg tracking-wider text-slate-400">AMAZON</span>
          <span className="font-extrabold text-lg tracking-wider text-slate-400">MICROSOFT</span>
          <span className="font-extrabold text-lg tracking-wider text-slate-400">STRIPE</span>
          <span className="font-extrabold text-lg tracking-wider text-slate-400">NETFLIX</span>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 border-t border-slate-900/60 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Built for High-Stakes Technical Preparation</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm leading-relaxed">We went beyond basic chat templates. InterviewIQ scales responses dynamically based on real-time transcripts and your resume.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl glass-morphism glow-card flex gap-6 items-start">
              <div className="p-3.5 bg-blue-500/10 border border-blue-500/10 rounded-xl text-blue-400 shrink-0"><Cpu className="w-5.5 h-5.5" /></div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-slate-200">Resume Intelligence Parser</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Extracts achievements, technologies, and projects. Generates an ATS compatibility rating and highlights missing key technology terms.</p>
              </div>
            </div>
            <div className="p-8 rounded-2xl glass-morphism glow-card flex gap-6 items-start">
              <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/10 rounded-xl text-indigo-400 shrink-0"><Mic className="w-5.5 h-5.5" /></div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-slate-200">Interactive Voice Mode</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Uses Speech-to-Text and Text-to-Speech to conduct hands-free verbal mocks. Real-time response timer replicates actual pressure bounds.</p>
              </div>
            </div>
            <div className="p-8 rounded-2xl glass-morphism glow-card flex gap-6 items-start">
              <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/10 rounded-xl text-cyan-400 shrink-0"><Shield className="w-5.5 h-5.5" /></div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-slate-200">Adaptive Follow-Up Engine</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Challenges your implementation details. Mention you used Redis, and the AI immediately probes cluster replication, shards, and eviction limits.</p>
              </div>
            </div>
            <div className="p-8 rounded-2xl glass-morphism glow-card flex gap-6 items-start">
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/10 rounded-xl text-emerald-400 shrink-0"><BarChart4 className="w-5.5 h-5.5" /></div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-slate-200">Structured Analytical Rating</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Generates score breakdowns across technical depth, problem-solving, behavioral traits, and communication alongside a customized learning roadmap.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 border-t border-slate-900/60 bg-slate-950/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Plans for Every Level</h2>
            <p className="text-slate-400 mt-4 text-sm">Flexible subscription tiers. Save 20% on annual billing cycles.</p>
            
            {/* Toggle Billing */}
            <div className="mt-8 flex bg-slate-900 border border-slate-850 p-1 rounded-xl">
              <button 
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${billingPeriod === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingPeriod('annual')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${billingPeriod === 'annual' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
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
                    ? 'bg-slate-900/60 border-blue-500 shadow-2xl shadow-blue-500/5 glow-card' 
                    : 'bg-slate-950/40 border-slate-900 glow-card'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-[10px] font-black uppercase tracking-wider text-white">
                    Most Popular
                  </span>
                )}
                <div>
                  <span className="text-xs font-black tracking-wider uppercase text-slate-500">{plan.name}</span>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-slate-500">/ {plan.period}</span>
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
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' 
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-850'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-slate-900/60">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">SUCCESS STORIES</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">What candidates are saying</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="p-6 rounded-2xl glass-morphism flex flex-col gap-4">
              <div className="flex gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" />{Array(4).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
              <p className="text-slate-300 text-xs italic leading-relaxed">
                "The adaptive follow-up feature on Redis cluster sharding matched the exact question I got at Stripe! Got the offer."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs text-white">S</div>
                <div>
                  <h4 className="font-bold text-xs text-slate-200">Sanjay K.</h4>
                  <p className="text-[10px] text-slate-500">Incoming SWE at Stripe</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-morphism flex flex-col gap-4">
              <div className="flex gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" />{Array(4).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
              <p className="text-slate-300 text-xs italic leading-relaxed">
                "Voice mode made mock prep feel real. The AI scoring pinpointed my lack of metrics depth, which I corrected before my interviews."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs text-white">M</div>
                <div>
                  <h4 className="font-bold text-xs text-slate-200">Mia W.</h4>
                  <p className="text-[10px] text-slate-500">Data Analyst at Capital One</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900/60 py-12 px-6 bg-slate-950/80 text-center text-xs text-slate-500">
        <p>© 2026 InterviewIQ Platform. All rights reserved. Designed for elite preparation.</p>
      </footer>
    </div>
  );
}
