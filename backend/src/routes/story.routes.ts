import { Router } from 'express';
import storyController from '../controllers/story.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All story routes require authentication
router.use(authenticate);

// Story CRUD
router.post('/', storyController.createStory.bind(storyController));
router.get('/', storyController.getStories.bind(storyController));
router.get('/:id', storyController.getStoryById.bind(storyController));
router.put('/:id', storyController.updateStory.bind(storyController));
router.delete('/:id', storyController.deleteStory.bind(storyController));

// Checkpoints
router.post('/:id/checkpoints', storyController.createCheckpoint.bind(storyController));
router.get('/:id/checkpoints', storyController.getCheckpoints.bind(storyController));
router.get('/:id/checkpoints/:checkpointId', storyController.getCheckpointById.bind(storyController));

export default router;
