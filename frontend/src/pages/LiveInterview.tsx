import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, Timer, Volume2, VolumeX, ShieldAlert, CheckCircle, RefreshCw, BarChart2, ShieldCheck, ArrowRight, CornerDownLeft } from 'lucide-react';
import { ActiveSession, ParsedResume } from '../App';
import { submitInterviewAnswer, submitCodeForExecution, requestAIHint } from '../services/api';

import CodeSandbox from '../components/CodeSandbox';

interface LiveInterviewProps {
  session: ActiveSession;
  parsedResume: ParsedResume | null;
  onFinish: (score: number, answers: any[], evaluationDetails?: any) => void;
  onCancel: () => void;
}

export default function LiveInterview({ session, parsedResume, onFinish, onCancel }: LiveInterviewProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(session.questions[0]?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sandboxCode, setSandboxCode] = useState('');
  const [answers, setAnswers] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  
  // Timer States
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [questionSeconds, setQuestionSeconds] = useState(0);

  // Web Speech references
  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Overall Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalSeconds(prev => prev + 1);
      setQuestionSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      rec.onerror = (e: any) => {
        console.error('Speech recognition error', e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Text to Speech for questions
  const speakQuestion = (text: string) => {
    if (!voiceMode) return;
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const defaultVoice = voices.find(voice => voice.lang.startsWith('en') && (voice.name.includes('Google') || voice.name.includes('Natural')));
      if (defaultVoice) utterance.voice = defaultVoice;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        if (isRecording && recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        if (voiceMode && recognitionRef.current) {
          try {
            recognitionRef.current.start();
            setIsRecording(true);
          } catch (e) {
            console.log('Voice mode start recognition bypassed:', e);
          }
        }
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (voiceMode && currentQuestion) {
      speakQuestion(currentQuestion);
    } else if (!voiceMode && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [voiceMode]);

  const getBoilerplateCode = () => {
    const isDSA = session.style === 'DSA-style';
    if (!isDSA) return '';
    const qText = currentQuestion.toLowerCase();
    if (qText.includes('two sum') || qText.includes('target')) {
      return `function twoSum(nums: number[], target: number): number[] {\n    // Write your optimal O(N) solution here using a Map\n    const map = new Map<number, number>();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) {\n            return [map.get(diff)!, i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}\n`;
    }
    if (qText.includes('reverse') || qText.includes('string')) {
      return `function reverseString(s: string[]): void {\n    // Write your optimal O(1) space solution here\n    let left = 0, right = s.length - 1;\n    while (left < right) {\n        [s[left], s[right]] = [s[right], s[left]];\n        left++;\n        right--;\n    }\n}\n`;
    }
    return `function solve(nums: number[]): number {\n    // Write your solution here\n    return 0;\n}\n`;
  };

  // Setup first question
  useEffect(() => {
    if (session.questions.length > 0) {
      setAiTyping(true);
      setTimeout(() => {
        setAiTyping(false);
        const firstQ = session.questions[0].content;
        setChatHistory([{ sender: 'ai', text: firstQ }]);
        speakQuestion(firstQ);
      }, 1500);
    }
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      stopCamera();
    };
  }, [session]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition API not supported in this browser. Please use Chrome/Safari or type your answers.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setInputText('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraOn(true);
    } catch (err) {
      console.error("Camera access failed", err);
      alert("Could not access camera. Please check browser permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  };

  const toggleCamera = () => {
    if (cameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const handleNextQuestion = async () => {
    if (isSubmitting) return;

    const answerVal = inputText.trim() || '[No response text provided]';
    const currentQText = currentQuestion;

    // Calculate pacing metrics
    const words = answerVal.split(/\s+/).filter(w => w.length > 0);
    const wpm = questionSeconds > 3 ? Math.round((words.length / questionSeconds) * 60) : 110;
    const fillerMatches = answerVal.match(/\b(um|uh|like|basically|actually|you\s+know)\b/gi);
    const fillerCount = fillerMatches ? fillerMatches.length : 0;

    const newAnswers = [
      ...answers,
      {
        questionId: String(currentIdx + 1),
        question: currentQText,
        category: currentIdx === 0 ? 'Introductory' : 'Adaptive Follow-up',
        answerText: answerVal,
        timeSpentSeconds: questionSeconds,
        wpm,
        fillerCount,
        codeSnippet: sandboxCode || undefined
      }
    ];
    setAnswers(newAnswers);

    // Update Chat History
    const updatedHistory = [
      ...chatHistory,
      { sender: 'user', text: answerVal }
    ];
    setChatHistory(updatedHistory);
    setInputText('');
    setQuestionSeconds(0);
    setIsSubmitting(true);
    setAiTyping(true);

    // Append metadata for backend
    const fullAnswerText = `${answerVal}${sandboxCode ? `\n\n[Candidate Code Sandbox Output]:\n${sandboxCode}` : ''}\n\n[Speech Performance Metrics]: WPM: ${wpm}, Fillers: ${fillerCount}`;

    try {
      const result = await submitInterviewAnswer(session.sessionId, fullAnswerText);
      setAiTyping(false);

      if (result.isFinished) {
        onFinish(result.score || 80, newAnswers, result);
      } else {
        const nextQ = result.nextQuestion || '';
        setCurrentQuestion(nextQ);
        setCurrentIdx(prev => prev + 1);
        setChatHistory([...updatedHistory, { sender: 'ai', text: nextQ }]);
        speakQuestion(nextQ);
      }
    } catch (err) {
      console.error('[LiveInterview] Submit error', err);
      setAiTyping(false);
      const nextIdx = currentIdx + 1;
      if (nextIdx < 4) {
        const fallbacks = [
          'In your opinion, what are the primary architectural differences between designing a monolithic application versus microservices?',
          'How would you design a rate-limiting middleware for a public API that receives 10,000 requests per minute?',
          'Explain the concept of inheritance and polymorphism in OOP, and how you have used it in your projects.'
        ];
        const nextQ = fallbacks[nextIdx - 1] || 'Describe a difficult debugging challenge you resolved.';
        setCurrentQuestion(nextQ);
        setCurrentIdx(nextIdx);
        setChatHistory([...updatedHistory, { sender: 'ai', text: nextQ }]);
        speakQuestion(nextQ);
      } else {
        onFinish(82, newAnswers);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Dynamic indicators
  const currentCategory = currentIdx === 0 ? 'Introductory' : 'Adaptive Follow-up';
  const progressPct = Math.min(((currentIdx + 1) / 4) * 100, 100);

  const isTechnicalRole = ['Software Engineer', 'Backend Engineer', 'Frontend Engineer', 'Full Stack Engineer', 'Machine Learning Engineer'].includes(session.role) || session.style.includes('Google') || session.style.includes('Microsoft') || session.style.includes('Startup') || session.style.includes('DSA');

  const words = inputText.trim().split(/\s+/).filter(w => w.length > 0);
  const liveWpm = questionSeconds > 3 ? Math.round((words.length / questionSeconds) * 60) : 0;
  const fillerMatches = inputText.match(/\b(um|uh|like|basically|actually|you\s+know)\b/gi);
  const liveFillers = fillerMatches ? fillerMatches.length : 0;

  return (
    <div className="flex-1 bg-[#0B0F19] flex flex-col h-screen overflow-hidden">
      {/* Top Banner Status Info */}
      <div className="border-b border-slate-900 bg-[#111827]/30 px-6 py-4 flex items-center justify-between text-xs text-slate-400 sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 font-semibold"><Timer className="w-4 h-4 text-indigo-400" /> Active Session: {formatTime(totalSeconds)}</span>
          <span className="flex items-center gap-2 font-semibold text-slate-500">Company Format: {session.style}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-emerald-400 font-extrabold uppercase tracking-widest text-[10px]">LIVE EVALUATION PIPELINE</span>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Side: AI Interviewer Chat Loop */}
        <div className="flex-1 flex flex-col border-r border-slate-900/60 bg-[#0B0F19]/20 overflow-y-auto p-6 relative">
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto mb-20 scrollbar-thin">
            {chatHistory.map((chat, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3.5 max-w-lg ${chat.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  chat.sender === 'user' 
                    ? 'bg-gradient-to-tr from-pink-500 to-rose-500 text-white' 
                    : 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/10'
                }`}>
                  {chat.sender === 'user' ? 'U' : 'AI'}
                </div>

                {/* Bubble */}
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                  chat.sender === 'user'
                    ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-200'
                    : 'bg-[#111827]/80 border-slate-900 text-slate-200'
                }`}>
                  {chat.text}
                </div>
              </div>
            ))}

            {/* AI Typing Indicator */}
            {aiTyping && (
              <div className="flex gap-3.5 self-start items-center">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white">AI</div>
                <div className="px-4 py-3 rounded-2xl bg-[#111827]/80 border border-slate-900 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-typing-dot" style={{ animationDelay: '0s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-typing-dot" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-typing-dot" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Typing/Voice Input Bar absolute at bottom */}
          <div className="absolute bottom-4 left-6 right-6 p-3 bg-[#111827]/95 border border-slate-900 rounded-2xl flex items-center gap-4 shadow-xl z-20">
            {/* Wave Mic Container */}
            <div className="relative">
              <button 
                onClick={toggleRecording}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-900/10' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              {isRecording && (
                <>
                  <span className="absolute inset-0 rounded-xl border border-red-400/30 animate-wave" />
                  <span className="absolute inset-0 rounded-xl border border-red-400/25 animate-wave" style={{ animationDelay: '0.6s' }} />
                </>
              )}
            </div>

            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNextQuestion()}
              placeholder={isRecording ? "Listening to your response..." : "Type your answer or speak by pressing mic..."}
              className="flex-1 bg-transparent text-slate-200 outline-none placeholder-slate-650 text-xs sm:text-sm"
            />

            <button 
              onClick={handleNextQuestion}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition flex items-center gap-1.5 text-xs font-bold shrink-0"
            >
              Submit <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Side: Code Editor Sandbox */}
        {isTechnicalRole && (
          <div className="w-full lg:w-[48%] border-r border-slate-900 bg-[#0B0F19]/10 p-6 flex flex-col overflow-hidden shrink-0">
            <CodeSandbox 
              initialCode={getBoilerplateCode()}
              onChange={setSandboxCode}
              onRunCode={async (code, lang) => {
                const res = await submitCodeForExecution(code, lang);
                return res;
              }}
              onRequestHint={async () => {
                const res = await requestAIHint(session.sessionId, sandboxCode);
                return res.hint;
              }}
            />
          </div>
        )}

        {/* Right Side: Details & Live Camera Feeds */}
        <div className="w-full lg:w-80 bg-[#111827]/40 backdrop-blur-lg flex flex-col p-6 gap-6 overflow-y-auto shrink-0">
          {/* Question metrics circular progress */}
          <div className="p-5 rounded-2xl bg-[#111827]/60 border border-slate-900 flex flex-col items-center text-center gap-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Progress</span>
            
            {/* Circle progress mockup using SVG */}
            <div className="w-24 h-24 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#1F2937" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="48" cy="48" r="40" 
                  stroke="url(#progress-glow)" 
                  strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPct / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="progress-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col">
                <span className="text-xl font-black text-white">{currentIdx + 1}/4</span>
                <span className="text-[8px] text-slate-500 uppercase tracking-widest mt-0.5">Tasks</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full border-t border-slate-900/60 pt-3 text-left">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category Type</span>
              <span className="text-sm font-extrabold text-indigo-400">{currentCategory} Evaluation</span>
            </div>
          </div>

          {/* AI Voice Copilot Mode Toggle */}
          <div className="p-5 rounded-2xl bg-[#111827]/60 border border-slate-900 flex flex-col gap-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
              Voice Mode
              <span className={`w-1.5 h-1.5 rounded-full ${voiceMode ? 'bg-indigo-400 animate-pulse' : 'bg-slate-600'}`} />
            </span>
            <div className="flex items-center justify-between gap-3 text-left">
              <span className="text-[10px] text-slate-400 leading-normal">Hands-free automatic mic tracking and Text-to-Speech</span>
              <button 
                onClick={() => setVoiceMode(!voiceMode)}
                className={`p-2 rounded-xl border transition-all ${
                  voiceMode 
                    ? 'bg-indigo-600/10 border-indigo-500/35 text-indigo-400 animate-pulse' 
                    : 'bg-[#111827] border-slate-800 text-slate-505 hover:text-slate-205'
                }`}
              >
                {voiceMode ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Live Pacing & Filler metrics */}
          <div className="p-5 rounded-2xl bg-[#111827]/60 border border-slate-900 flex flex-col gap-3.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Speech Pacing Metrics</span>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1 text-left">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Pacing (WPM)</span>
                <span className={`text-lg font-black ${liveWpm > 160 || (liveWpm < 90 && liveWpm > 0) ? 'text-amber-400' : 'text-emerald-400'}`}>{liveWpm}</span>
                <span className="text-[8px] text-slate-500">{liveWpm > 160 ? 'Too Fast' : liveWpm < 90 && liveWpm > 0 ? 'Too Slow' : 'Normal'}</span>
              </div>
              <div className="flex flex-col gap-1 text-left">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Filler Words</span>
                <span className={`text-lg font-black ${liveFillers > 3 ? 'text-rose-400' : 'text-slate-200'}`}>{liveFillers}</span>
                <span className="text-[8px] text-slate-500">instances</span>
              </div>
            </div>
          </div>

          {/* Web Cam feed */}
          <div className={`rounded-2xl border bg-[#111827]/60 p-4 flex flex-col gap-3 transition-all ${cameraOn ? 'border-emerald-500/30' : 'border-slate-900'}`}>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Camera Monitor</span>
            <div className="w-full h-32 bg-[#0B0F19] rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-900/60">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover scale-x-[-1] ${cameraOn ? 'block' : 'hidden'}`} 
              />
              {!cameraOn && (
                <VideoOff className="w-8 h-8 text-slate-700" />
              )}
            </div>
            <button 
              onClick={toggleCamera}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border ${
                cameraOn 
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200' 
                  : 'bg-indigo-650/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-650/20'
              }`}
            >
              {cameraOn ? 'Stop Camera Feed' : 'Start Camera Feed'}
            </button>
          </div>

          {/* Live Tips Banner */}
          <div className="p-5 rounded-2xl bg-[#111827]/30 border border-slate-900 flex flex-col gap-2.5 text-xs">
            <span className="font-bold text-slate-350 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Interviewer Tips</span>
            <p className="text-slate-450 leading-relaxed text-[11px]">
              Speak clearly with normal conversational pacing. Try to frame situation-based answers using the STAR format (Situation, Task, Action, Result).
            </p>
          </div>

          <button 
            onClick={onCancel}
            className="w-full py-3.5 bg-red-650/5 hover:bg-red-650/10 text-red-400 border border-red-500/10 rounded-xl font-bold text-xs transition mt-auto active:scale-95"
          >
            Abort Session
          </button>
        </div>
      </div>
    </div>
  );
}
