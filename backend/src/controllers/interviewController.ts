import { Request, Response } from 'express';
import { generateNextQuestion, evaluateResponseText, generateAIHint } from '../services/aiService';
import { runCode } from '../services/codeRunner';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Temporary memory store for active threads in case DB is bypassed
const activeSessions: Record<string, {
  role: string;
  difficulty: string;
  style: string;
  history: { question: string; answer: string }[];
  resumeText: string;
  companyContext?: string;
}> = {};

export const startInterview = async (req: Request, res: Response) => {
  try {
    const { role, difficulty, style, resumeId, companyContext } = req.body;
    const userId = (req as any).userId || 'default_user_id';

    let resumeText = 'Skills: React, TypeScript, Node.js, Express, PostgreSQL, Redis, Docker';
    try {
      if (resumeId) {
        const dbResume = await prisma.resume.findUnique({ where: { id: resumeId } });
        if (dbResume) resumeText = dbResume.parsedText;
      }
    } catch (dbErr) {
      console.log('[DB Offline Bypass] Using default resume text for question generation.');
    }

    const firstQuestion = await generateNextQuestion(role, difficulty, style, [], resumeText, companyContext);
    const sessionId = 'session_' + Math.random().toString(36).substring(2, 11);

    // Save session in local store
    activeSessions[sessionId] = {
      role,
      difficulty,
      style,
      history: [{ question: firstQuestion, answer: '' }],
      resumeText,
      companyContext
    };

    res.status(200).json({
      sessionId,
      nextQuestion: firstQuestion
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const submitAnswer = async (req: Request, res: Response) => {
  try {
    const { sessionId, answerText } = req.body;
    const session = activeSessions[sessionId];
    if (!session) {
      return res.status(404).json({ error: 'Active interview session not found' });
    }

    // Update answer to current question
    const currentQIdx = session.history.length - 1;
    session.history[currentQIdx].answer = answerText;

    // Evaluate answer text
    const evaluation = await evaluateResponseText(session.history[currentQIdx].question, answerText);

    // Generate next question or finish if limit reached (say 4 questions)
    if (session.history.length >= 4) {
      // Compile final report
      const scores = evaluation.score;
      const strengths = evaluation.strengths;
      const weaknesses = evaluation.weaknesses;

      // Clean up session
      delete activeSessions[sessionId];

      return res.status(200).json({
        isFinished: true,
        score: scores.overall,
        feedback: evaluation.feedback,
        strengths,
        weaknesses,
        complexity: evaluation.complexity,
        progression: evaluation.progression,
        roadmapSteps: ['Learn Redis Caching LRU policies', 'Solve 15 Graph DFS/BFS tasks', 'Use metrics in STAR behavioral stories']
      });
    }

    const nextQuestion = await generateNextQuestion(
      session.role,
      session.difficulty,
      session.style,
      session.history,
      session.resumeText,
      session.companyContext
    );

    // Add to history
    session.history.push({ question: nextQuestion, answer: '' });

    res.status(200).json({
      isFinished: false,
      nextQuestion,
      evaluation: {
        score: evaluation.score.overall,
        feedback: evaluation.feedback,
        complexity: evaluation.complexity,
        progression: evaluation.progression
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getHint = async (req: Request, res: Response) => {
  try {
    const { sessionId, currentCode } = req.body;
    const session = activeSessions[sessionId];
    if (!session) {
      return res.status(404).json({ error: 'Active interview session not found' });
    }

    const currentQuestion = session.history[session.history.length - 1].question;
    const history = session.history.slice(0, -1);

    const hint = await generateAIHint(currentQuestion, history, currentCode || '');
    res.status(200).json({ hint });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const executeCode = async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Code content is required' });
    }
    const result = await runCode(code, language || 'javascript');
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
