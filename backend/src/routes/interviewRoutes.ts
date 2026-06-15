import { Router } from 'express';
import { startInterview, submitAnswer, getHint, executeCode } from '../controllers/interviewController';

const router = Router();

router.post('/start', startInterview);
router.post('/submit-answer', submitAnswer);
router.post('/hint', getHint);
router.post('/run-code', executeCode);

export default router;
