import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Code2, RefreshCw } from 'lucide-react';

interface CodeSandboxProps {
  initialCode?: string;
  onChange: (value: string) => void;
}

const templates: Record<string, string> = {
  python: `def solve(nums):\n    # Write your solution here\n    pass\n`,
  typescript: `function solve(nums: number[]): number {\n    // Write your solution here\n    return 0;\n}\n`,
  javascript: `function solve(nums) {\n    // Write your solution here\n    return 0;\n}\n`,
  cpp: `#include <vector>\n\nclass Solution {\npublic:\n    int solve(std::vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};\n`,
  java: `import java.util.*;\n\nclass Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}\n`
};

export default function CodeSandbox({ initialCode = '', onChange }: CodeSandboxProps) {
  const [language, setLanguage] = useState('typescript');
  const [code, setCode] = useState(initialCode || templates.typescript);

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

  return (
    <div className="w-full h-full flex flex-col bg-[#111827]/80 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0B0F19] border-b border-slate-900 shrink-0">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-350 tracking-wider uppercase">Coding Sandbox</span>
        </div>

        <div className="flex items-center gap-3">
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
            className="p-1 hover:bg-[#111827] border border-slate-800 rounded-lg text-slate-400 hover:text-white transition"
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
    </div>
  );
}
