import { Request, Response, NextFunction } from 'express';

const requestCounts: Record<string, { count: number; resetTime: number }> = {};

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const limitWindow = 15 * 60 * 1000; // 15 mins
  const limitCount = 100;

  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, resetTime: now + limitWindow };
    return next();
  }

  const record = requestCounts[ip];
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + limitWindow;
    return next();
  }

  record.count += 1;
  if (record.count > limitCount) {
    return res.status(429).json({ error: 'Too many requests. Please try again after 15 minutes.' });
  }

  next();
};
