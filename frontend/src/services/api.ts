const API_BASE_URL = 'http://localhost:5001/api';

// Check if server is running
let isServerOnline = true;

const checkServerStatus = async (): Promise<boolean> => {
  try {
    const res = await fetch('http://localhost:5001/health', { method: 'GET' });
    isServerOnline = res.ok;
    return res.ok;
  } catch {
    isServerOnline = false;
    return false;
  }
};

// Periodic status check
checkServerStatus();
setInterval(checkServerStatus, 10000);

// Helper to handle requests with transparent mock fallbacks
const executeRequest = async <T>(
  endpoint: string,
  options: RequestInit,
  mockFallback: () => T
): Promise<T> => {
  try {
    // Probe server
    if (!isServerOnline) {
      const online = await checkServerStatus();
      if (!online) {
        console.warn(`[API Client] Server offline. Using simulated data for ${endpoint}`);
        return mockFallback();
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`[API Client] Request to ${endpoint} failed. Falling back to simulated data. Error:`, err);
    isServerOnline = false;
    return mockFallback();
  }
};

export const uploadResumeFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return executeRequest(
    '/resume/upload',
    {
      method: 'POST',
      body: formData,
    },
    () => ({
      resumeId: 'mock_resume_' + Math.random().toString(36).substring(2, 9),
      parsedData: {
        fileName: file.name,
        atsScore: 84,
        skills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'REST APIs', 'System Design', 'Docker', 'Redis', 'Git'],
        projects: [
          { title: 'AgriCycle Platform', description: 'Architected a microservices-based agricultural trade pipeline utilizing Redis cluster caching.' },
          { title: 'Portfolio CRM Hub', description: 'Designed real-time lead sync systems using WebSockets and PostgreSQL indexing.' }
        ],
        experience: [
          'Software Engineer Intern at stripe-like startup (3 months)',
          'Open Source Contributor at Prisma ORM'
        ]
      }
    })
  );
};

export const matchResumeToJDText = async (resumeId: string | null, jdText: string) => {
  return executeRequest(
    '/resume/match-jd',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeId, jdText })
    },
    () => ({
      matchPercentage: 84,
      matchingSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Express'],
      missingKeywords: ['Redis', 'Docker', 'Kubernetes', 'CI/CD Pipelines'],
      suggestions: 'Incorporate detailed metrics in your projects section showing how you scaled databases or optimized server endpoints.',
      questions: [
        'How would you manage cluster configurations inside Kubernetes deployment pods?',
        'What strategy do you use for caching invalidated queries using Redis?'
      ]
    })
  );
};

export const startNewInterview = async (role: string, difficulty: string, style: string, resumeId?: string, companyContext?: string) => {
  return executeRequest(
    '/interview/start',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, difficulty, style, resumeId, companyContext })
    },
    () => ({
      sessionId: 'mock_session_' + Math.random().toString(36).substring(2, 11),
      nextQuestion: `Tell me about yourself and your experience working with web applications as a ${role}.`
    })
  );
};

export const submitInterviewAnswer = async (sessionId: string, answerText: string) => {
  return executeRequest(
    '/interview/submit-answer',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, answerText })
    },
    () => {
      // Mock progression / evaluation
      const mockQuestions = [
        'In your opinion, what are the primary architectural differences between designing a monolithic application versus microservices?',
        'How would you design a rate-limiting middleware for a public API that receives 10,000 requests per minute?',
        'Explain the concept of inheritance and polymorphism in OOP, and how you have used it in your projects.'
      ];

      // Use a simple session counter in sessionStorage to mock progression
      const currentCountKey = `mock_session_count_${sessionId}`;
      const count = parseInt(sessionStorage.getItem(currentCountKey) || '0', 10);
      
      if (count >= 3) {
        sessionStorage.removeItem(currentCountKey);
        // Return finish evaluation report
        return {
          isFinished: true,
          score: 83,
          feedback: 'Excellent dynamic structure explanation. Highly analytical breakdown of DB indexing, but could improve metrics around cache cluster eviction limits.',
          strengths: [
            'Demonstrates a strong analytical architecture understanding of microservices.',
            'Clear verbal communication speed; low hesitation threshold.',
            'Good query index planning and normalization explanations.'
          ],
          weaknesses: [
            'Could improve in dynamic memory caching tradeoffs details.',
            'System Design details lacked explicit load balancer sizing.'
          ],
          roadmapSteps: [
            'Study Redis Caching LRU eviction policies & cluster sharding',
            'Solve 15 Graph DFS/BFS topological sorting scenarios',
            'Incorporate concrete metrics using the STAR behavioral framework'
          ]
        };
      }

      sessionStorage.setItem(currentCountKey, (count + 1).toString());
      return {
        isFinished: false,
        nextQuestion: mockQuestions[count],
        evaluation: {
          score: 75 + Math.floor(Math.random() * 15),
          feedback: 'Solid explanation, but try to bring in more specific metrics of scale or performance impact.'
        }
      };
    }
  );
};

export const submitCodeForExecution = async (code: string, language: string) => {
  return executeRequest(
    '/interview/run-code',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language })
    },
    () => ({
      success: true,
      output: `[Mock Execution Output for ${language}]:\nCode executed successfully (simulated environment).\nInput length: ${code.length} characters.`
    })
  );
};

export const requestAIHint = async (sessionId: string, currentCode: string) => {
  return executeRequest(
    '/interview/hint',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, currentCode })
    },
    () => ({
      hint: 'Consider how you can optimize the search complexity using a Hash Map instead of nested loops. This will reduce time complexity to O(N).'
    })
  );
};
