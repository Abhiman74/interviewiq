import { Router } from 'express';
import { startInterview } from '../controllers/interviewController';
const router = Router();
router.post('/start', startInterview);
export default router;