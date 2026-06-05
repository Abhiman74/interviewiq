import { Router } from 'express';
import { uploadResume } from '../controllers/resumeController';
const router = Router();
router.post('/upload', uploadResume);
export default router;// Added route GET /api/resume/:id/skills
