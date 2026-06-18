import { Router } from 'express';
import multer from 'multer';
import { uploadResume, matchJobDescription } from '../controllers/resumeController';

const router = Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

router.post('/upload', upload.single('file'), uploadResume);
router.post('/match-jd', matchJobDescription);

export default router;
