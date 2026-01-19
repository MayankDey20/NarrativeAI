import { Router } from 'express';
import authRoutes from './auth.routes';
import storyRoutes from './story.routes';
import aiRoutes from './ai.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/stories', storyRoutes);
router.use('/ai', aiRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

export default router;
