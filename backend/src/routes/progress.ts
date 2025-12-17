import { Router } from 'express';
import {
  getProgress,
  updateProgress,
  recordAnswer,
  getLeitnerData,
  syncData,
  getStats,
  addAchievement,
  addStudySession,
} from '../controllers/progressController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/progress
router.get('/', getProgress);

// PUT /api/progress
router.put('/', updateProgress);

// POST /api/progress/answer
router.post('/answer', recordAnswer);

// GET /api/progress/leitner
router.get('/leitner', getLeitnerData);

// POST /api/progress/sync
router.post('/sync', syncData);

// GET /api/progress/stats
router.get('/stats', getStats);

// POST /api/progress/achievement
router.post('/achievement', addAchievement);

// POST /api/progress/session
router.post('/session', addStudySession);

export default router;
