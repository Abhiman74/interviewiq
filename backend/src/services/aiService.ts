import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Heuristic fallback response if Gemini key is missing
const mockAICall = async (promptType: string, context: any) => {
  console.log(`[AI Mock Service] Key missing. Generating mock responses for ${promptType}`);
  if (promptType === 'parse_resume') {
    return JSON.stringify({
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Express', 'Docker', 'System Design'],
      projects: [
        { title: 'AgriCycle', description: 'A microservices-based agricultural trade network.' },
        { title: 'Portfolio CRM', description: 'Real-time dashboard using WebSockets and caching.' }
      ],
      experience: ['Software Engineer Intern', 'Open Source Contributor'],
      atsScore: 82
    });
  }
  if (promptType === 'match_jd') {
    return JSON.stringify({
      matchPercentage: 78,
      matchingSkills: ['React', 'TypeScript', 'Node.js'],
      missingKeywords: ['Redis', 'Kubernetes', 'CI/CD'],
      suggestions: 'Incorporate clear metrics about caching optimization and container orchestration.',
      questions: [
        'How do you manage cluster caching eviction limits in Redis?',
        'Describe your strategy for setting up pod nodes inside a Kubernetes namespace.'
      ]
    });
  }
  if (promptType === 'generate_question') {
    return 'Why did you choose a microservices architecture over a monolithic design for the AgriCycle project?';
  }
  if (promptType === 'evaluate_answer') {
    return JSON.stringify({
      score: {
        technicalDepth: 75,
        communication: 80,
        problemSolving: 78,
        confidence: 82,
        behavioral: 80,
        overall: 79
      },
      feedback: 'Good overview of system boundaries, but could improve details on caching tradeoffs and cluster sharding limits.',
      strengths: ['Clear pacing', 'Demonstrates system boundary awareness'],
      weaknesses: ['Lack of concrete caching load stats'],
      complexity: {
        time: 'O(N)',
        space: 'O(1)',
        explanation: 'The loop executes N times and operates on fixed variables.'
      },
      progression: {
        detected: true,
        description: 'Successfully discussed a basic iterative approach before optimizing the loop.'
      }
    });
  }
  if (promptType === 'generate_hint') {
    return 'Consider how you can optimize the search complexity using a Hash Map instead of nested loops.';
  }
  return '';
};

export const parseResumeWithAI = async (text: string): Promise<any> => {
  if (!genAI) {
    const res = await mockAICall('parse_resume', null);
    return JSON.parse(res);
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are an expert resume parsing engine. Analyze the following raw text from a resume and extract the key details into structured JSON. Format: { "skills": ["string"], "projects": [{"title":"string","description":"string"}], "experience": ["string"], "atsScore": number (0-100) }.\n\nRaw Resume Text:\n${text}`;
    
    const result = await model.generateContent(prompt);
    const resultText = result.response.text();
    // Clean JSON response
    const jsonStr = resultText.substring(resultText.indexOf('{'), resultText.lastIndexOf('}') + 1);
    return JSON.parse(jsonStr);
  } catch (error: any) {
    console.error('[Gemini Parser Error]', error);
    return JSON.parse(await mockAICall('parse_resume', null));
  }
};

export const matchResumeToJD = async (resumeText: string, jdText: string): Promise<any> => {
  if (!genAI) {
    const res = await mockAICall('match_jd', null);
    return JSON.parse(res);
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Compare this candidate's resume text against this job description (JD). Identify matching technologies, missing keywords, and suggest improvements. Return JSON: { "matchPercentage": number, "matchingSkills": ["string"], "missingKeywords": ["string"], "suggestions": "string", "questions": ["string"] }.\n\nResume:\n${resumeText}\n\nJob Description:\n${jdText}`;
    
    const result = await model.generateContent(prompt);
    const resultText = result.response.text();
    const jsonStr = resultText.substring(resultText.indexOf('{'), resultText.lastIndexOf('}') + 1);
    return JSON.parse(jsonStr);
  } catch (error: any) {
    console.error('[Gemini JD Matcher Error]', error);
    return JSON.parse(await mockAICall('match_jd', null));
  }
};

export const generateNextQuestion = async (
  role: string,
  difficulty: string,
  style: string,
  history: { question: string; answer: string }[],
  resumeText: string,
  companyContext?: string
): Promise<string> => {
  if (!genAI) {
    return mockAICall('generate_question', null);
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are a Principal Software Engineer conducting a mock interview for the role of ${role} (${difficulty} level) in a ${style} format.\n` +
      (companyContext ? `Target Company Context & Style Guidelines:\n${companyContext}\n\n` : '') +
      `Candidate Resume Context:\n${resumeText}\n\n` +
      `Previous Questions and Answers Thread:\n${JSON.stringify(history)}\n\n` +
      `Generate the next interview question. It should feel adaptive, challenging key claims made in previous answers. Do not repeat previous questions. Return only the question text.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('[Gemini Question Error]', error);
    return mockAICall('generate_question', null);
  }
};

export const evaluateResponseText = async (
  question: string,
  answer: string
): Promise<any> => {
  if (!genAI) {
    const res = await mockAICall('evaluate_answer', null);
    return JSON.parse(res);
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Evaluate the candidate's answer to the following interview question. Rate their scores (0-100) across technical depth, communication, problem solving, confidence, and behavioral attributes. Provide concrete feedback, strengths, and weaknesses.\n` +
      `Note: The answer text may contain code output under '[Candidate Code Sandbox Output]' and speech pacing metrics under '[Speech Performance Metrics]'. Use these to evaluate their coding quality (efficiency, complexity, clean code practices) and verbal pacing/hesitation metrics. Also analyze time/space complexity and check for progression from brute-force to optimal coding methods.\n` +
      `Return JSON: { "score": { "technicalDepth": number, "communication": number, "problemSolving": number, "confidence": number, "behavioral": number, "overall": number }, "feedback": "string", "strengths": ["string"], "weaknesses": ["string"], "complexity": { "time": "string", "space": "string", "explanation": "string" }, "progression": { "detected": boolean, "description": "string" } }.\n\nQuestion:\n${question}\n\nAnswer:\n${answer}`;

    const result = await model.generateContent(prompt);
    const resultText = result.response.text();
    const jsonStr = resultText.substring(resultText.indexOf('{'), resultText.lastIndexOf('}') + 1);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('[Gemini Evaluator Error]', error);
    return JSON.parse(await mockAICall('evaluate_answer', null));
  }
};

export const generateAIHint = async (
  question: string,
  history: { question: string; answer: string }[],
  currentCode: string
): Promise<string> => {
  if (!genAI) {
    return mockAICall('generate_hint', null);
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are a helpful AI Interview Copilot. The candidate is solving the following DSA question and requested a hint.\n` +
      `Question: ${question}\n` +
      `Interview Thread History: ${JSON.stringify(history)}\n` +
      `Candidate's Current Monaco Code Sandbox State:\n${currentCode}\n\n` +
      `Generate a short, strategic hint that guides the candidate in the right direction without spoiling the complete solution. Keep it to 1-2 sentences.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('[Gemini Hint Generator Error]', error);
    return mockAICall('generate_hint', null);
  }
};
