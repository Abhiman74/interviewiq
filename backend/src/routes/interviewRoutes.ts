import { Router } from 'express';
import { startInterview, submitAnswer } from '../controllers/interviewController';

const router = Router();

router.post('/start', startInterview);
router.post('/submit-answer', submitAnswer);

export default router;
