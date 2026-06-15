import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Code2, Play, Sparkles, RefreshCw, Terminal, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface CodeSandboxProps {
  initialCode?: string;
  onChange: (value: string) => void;
  onRunCode?: (code: string, language: string) => Promise<{ success: boolean; output: string; error?: string }>;
  onRequestHint?: () => Promise<string>;
}

const templates: Record<string, string> = {
  python: `def solve(nums):\n    # Write your solution here\n    print("Hello from Python!")\n    return 0\n`,
  typescript: `function solve(nums: number[]): number {\n    // Write your solution here\n    console.log("Hello from TypeScript!");\n    return 0;\n}\n`,
  javascript: `function solve(nums) {\n    // Write your solution here\n    console.log("Hello from JavaScript!");\n    return 0;\n}\n`,
  cpp: `#include <iostream>\n#include <vector>\n\nclass Solution {\npublic:\n    int solve(std::vector<int>& nums) {\n        // Write your solution here\n        std::cout << "Hello from C++!" << std::endl;\n        return 0;\n    }\n};\n`,
  java: `import java.util.*;\n\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        System.out.println("Hello from Java!");\n        return 0;\n    }\n}\n`
};

export default function CodeSandbox({ 
  initialCode = '', 
  onChange, 
  onRunCode, 
  onRequestHint 
}: CodeSandboxProps) {
  const [language, setLanguage] = useState('typescript');
  const [code, setCode] = useState(initialCode || templates.typescript);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'hint'>('console');
  
  // Console Outputs
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [consoleError, setConsoleError] = useState('');
  
  // Hint Output
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [hintText, setHintText] = useState('');

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    const newCode = templates[lang] || '';
    setCode(newCode);
    onChange(newCode);
  };

  const handleEditorChange = (value: string | undefined) => {
    const val = value || '';
    setCode(val);
    onChange(val);
  };

  const resetTemplate = () => {
    const newCode = templates[language] || '';
    setCode(newCode);
    onChange(newCode);
  };

  const handleRun = async () => {
    if (!onRunCode) return;
    setIsRunning(true);
    setConsoleOpen(true);
    setActiveTab('console');
    setConsoleOutput('Executing code...');
    setConsoleError('');

    try {
      const res = await onRunCode(code, language);
      if (res.success) {
        setConsoleOutput(res.output);
      } else {
        setConsoleOutput('');
        setConsoleError(res.error || 'Execution failed.');
      }
    } catch (err: any) {
      setConsoleOutput('');
      setConsoleError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleGetHint = async () => {
    if (!onRequestHint) return;
    setIsHintLoading(true);
    setConsoleOpen(true);
    setActiveTab('hint');
    setHintText('Asking AI Interview Copilot for a hint...');

    try {
      const hint = await onRequestHint();
      setHintText(hint || 'No hint available at this moment.');
    } catch (err: any) {
      setHintText('Failed to fetch hint: ' + (err.message || 'Connection error'));
    } finally {
      setIsHintLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#111827]/80 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0B0F19] border-b border-slate-900 shrink-0">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">Coding Sandbox</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Action buttons */}
          {onRequestHint && (
            <button
              onClick={handleGetHint}
              disabled={isHintLoading}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 text-xs font-semibold transition disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Hint</span>
            </button>
          )}

          {onRunCode && (
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 text-xs font-semibold transition disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-emerald-400/20" />
              <span>Run Code</span>
            </button>
          )}

          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-[#111827] border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 outline-none focus:border-indigo-500 transition font-semibold"
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>

          <button
            onClick={resetTemplate}
            title="Reset Template"
            className="p-1.5 hover:bg-[#111827] border border-slate-800 rounded-lg text-slate-400 hover:text-white transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 min-h-0 bg-[#1e1e1e]">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8
            },
            fontFamily: 'Fira Code, Menlo, Monaco, Courier New, monospace',
            fontLigatures: true,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 }
          }}
        />
      </div>

      {/* Console Console/Hints drawer */}
      <div className={`border-t border-slate-900 bg-[#0B0F19] transition-all flex flex-col shrink-0 ${
        consoleOpen ? 'h-48' : 'h-10'
      }`}>
        {/* Drawer Header/Toggles */}
        <div className="flex items-center justify-between px-4 h-10 border-b border-slate-900/60 select-none cursor-pointer"
             onClick={() => setConsoleOpen(!consoleOpen)}>
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setConsoleOpen(true);
                setActiveTab('console');
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold transition ${
                activeTab === 'console' && consoleOpen ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Console Console
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setConsoleOpen(true);
                setActiveTab('hint');
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold transition ${
                activeTab === 'hint' && consoleOpen ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Copilot Hints
            </button>
          </div>
          
          <button className="text-slate-500 hover:text-white transition">
            {consoleOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Drawer Content */}
        {consoleOpen && (
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed scrollbar-thin">
            {activeTab === 'console' ? (
              consoleError ? (
                <div className="flex gap-2 text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <pre className="whitespace-pre-wrap">{consoleError}</pre>
                </div>
              ) : (
                <pre className="text-emerald-400 whitespace-pre-wrap">{consoleOutput}</pre>
              )
            ) : (
              <div className="flex gap-2 text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p className="whitespace-pre-wrap leading-relaxed">{hintText}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
