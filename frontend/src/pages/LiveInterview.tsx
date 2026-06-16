import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, Timer, Volume2, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';
import { ActiveSession, ParsedResume } from '../App';

interface LiveInterviewProps {
  session: ActiveSession;
  parsedResume: ParsedResume | null;
  onFinish: (score: number, answers: any[]) => void;
  onCancel: () => void;
}

export default function LiveInterview({ session, parsedResume, onFinish, onCancel }: LiveInterviewProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
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
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a nice male/female English voice
      const voices = window.speechSynthesis.getVoices();
      const defaultVoice = voices.find(voice => voice.lang.startsWith('en') && voice.name.includes('Google'));
      if (defaultVoice) utterance.voice = defaultVoice;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speak first question on load
  useEffect(() => {
    if (session.questions.length > 0) {
      setTimeout(() => {
        speakQuestion(session.questions[0].content);
      }, 500);
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

  const handleNextQuestion = () => {
    // Save answer
    const currentQ = session.questions[currentIdx];
    const newAnswers = [
      ...answers,
      {
        questionId: currentQ.id,
        question: currentQ.content,
        category: currentQ.category,
        answerText: inputText || '[No transcribed text provided]',
        timeSpentSeconds: questionSeconds
      }
    ];
    setAnswers(newAnswers);
    setInputText('');
    setQuestionSeconds(0);

    const nextIdx = currentIdx + 1;
    if (nextIdx < session.questions.length) {
      setCurrentIdx(nextIdx);
      speakQuestion(session.questions[nextIdx].content);
    } else {
      // Finished all questions! Calculate mock score based on transcript content length and speed
      let totalTranscribedWords = newAnswers.reduce((acc, curr) => acc + curr.answerText.split(' ').length, 0);
      let overallMockScore = Math.min(65 + Math.floor(totalTranscribedWords / 15), 94);
      onFinish(overallMockScore, newAnswers);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex-1 bg-slate-950 flex flex-col">
      {/* Top Banner Status Info */}
      <div className="border-b border-slate-900 bg-slate-950/60 px-6 py-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><Timer className="w-3.5 h-3.5 text-blue-400" /> Session: {formatTime(totalSeconds)}</span>
          <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" /> Active: {session.style}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-emerald-400 font-semibold uppercase tracking-wider">Live Interviewing</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 p-6 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Columns - Avatar & Video feeds */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Avatar Panel */}
          <div className="flex-1 rounded-2xl glass-morphism border border-slate-800 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[300px]">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 to-transparent pointer-events-none" />
            
            {/* Visual Speaking Indicator */}
            <div className="flex items-center gap-1.5 mb-6 h-12">
              {isSpeaking ? (
                [1,2,3,4,5,6,5,4,3,2,1].map((h, i) => (
                  <span 
                    key={i} 
                    className="w-1 bg-gradient-to-t from-blue-500 to-indigo-400 rounded-full animate-bounce" 
                    style={{ height: `${h * 7}px`, animationDelay: `${i * 0.08}s` }} 
                  />
                ))
              ) : (
                <span className="text-xs text-slate-500 font-mono tracking-wider">AI IS WAITING FOR YOUR RESPONSE</span>
              )}
            </div>

            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center border-4 border-slate-900 shadow-2xl relative">
              <Volume2 className={`w-10 h-10 text-white ${isSpeaking ? 'animate-pulse scale-110' : ''}`} />
              {isSpeaking && <span className="absolute inset-0 rounded-full border-4 border-blue-400/30 animate-ping" />}
            </div>
            
            <h3 className="text-lg font-bold text-white mt-6">AI Interviewer</h3>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mt-1">Interpreting Response Metrics</p>

            <div className="mt-8 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 max-w-xl text-sm leading-relaxed text-slate-300">
              "{session.questions[currentIdx]?.content}"
            </div>
          </div>

          {/* User Video Frame / Listening status banner */}
          <div className="h-44 rounded-2xl border border-slate-900 bg-slate-950/60 p-4 flex gap-4 items-center justify-between">
            {/* Camera feed */}
            <div className="w-48 h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative flex items-center justify-center">
              {cameraOn ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              ) : (
                <VideoOff className="w-8 h-8 text-slate-600" />
              )}
              <span className="absolute bottom-2 left-2 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-950/80 uppercase text-slate-400">CAM PREVIEW</span>
            </div>

            {/* Speaking feedback */}
            <div className="flex-1 flex flex-col justify-center gap-1.5 px-2">
              <span className="text-xs font-semibold text-slate-400">Response Speed Monitoring</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-black text-white">{formatTime(questionSeconds)}</span>
                <span className="text-xs text-slate-500">elapsed on current question</span>
              </div>
              <div className="flex gap-4 items-center mt-3 text-xs">
                <button 
                  onClick={toggleCamera} 
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition ${
                    cameraOn 
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' 
                      : 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/20'
                  }`}
                >
                  {cameraOn ? <><VideoOff className="w-3.5 h-3.5" /> Stop Video</> : <><Video className="w-3.5 h-3.5" /> Start Video</>}
                </button>
                <button 
                  onClick={() => speakQuestion(session.questions[currentIdx]?.content)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 font-semibold"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Repeat Question
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Transcript & Actions */}
        <div className="flex flex-col gap-6">
          <div className="flex-1 rounded-2xl glass-morphism border border-slate-800 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h3 className="font-bold text-white text-sm">Response Transcript</h3>
              <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold uppercase">Web Speech API</span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Your answer will transcribe automatically here. Feel free to edit or type directly if you prefer..."
              className="flex-1 bg-slate-900 border border-slate-850 rounded-xl p-4 text-slate-300 placeholder-slate-600 outline-none focus:border-blue-500 transition text-sm resize-none leading-relaxed"
            />

            <button
              onClick={toggleRecording}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20 animate-pulse' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
              }`}
            >
              {isRecording ? <><MicOff className="w-5 h-5" /> Stop Transcribing</> : <><Mic className="w-5 h-5" /> Start Speaking</>}
            </button>
          </div>

          {/* Action Row */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold text-sm rounded-xl border border-slate-850 transition"
            >
              Abort Interview
            </button>
            <button
              onClick={handleNextQuestion}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg transition"
            >
              {currentIdx === session.questions.length - 1 ? 'Submit & Finish' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
