import { Router } from 'express';
import aiController from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All AI routes require authentication
router.use(authenticate);

router.post('/generate', aiController.generateStory.bind(aiController));
router.post('/auto-generate', aiController.autoGenerate.bind(aiController));
router.post('/summary', aiController.generateSummary.bind(aiController));
router.post('/refine-prompt', aiController.refinePrompt.bind(aiController));
router.post('/rewrite', aiController.rewrite.bind(aiController));
router.post('/expand', aiController.expand.bind(aiController));
router.post('/choices', aiController.generateChoices.bind(aiController));

export default router;
