import { Request, Response } from 'express';
export const getProfile = async (req: Request, res: Response) => { res.json({ profile: {} }); };