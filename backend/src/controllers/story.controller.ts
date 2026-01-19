import { Request, Response } from 'express';
import storyService from '../services/story.service';

export class StoryController {
  async createStory(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { title, content, genre, pov, mode, creativityLevel } = req.body;

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'Title and content are required',
        });
      }

      const story = await storyService.createStory({
        userId,
        title,
        content,
        genre,
        pov,
        mode,
        creativityLevel,
      });

      res.status(201).json({
        success: true,
        story,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getStories(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await storyService.getUserStories(userId, limit, offset);

      res.json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getStoryById(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;

      const story = await storyService.getStoryById(id, userId);

      res.json({
        success: true,
        story,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateStory(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const updateData = req.body;

      const story = await storyService.updateStory(id, userId, updateData);

      res.json({
        success: true,
        story,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteStory(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;

      await storyService.deleteStory(id, userId);

      res.json({
        success: true,
        message: 'Story deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createCheckpoint(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const { content, label } = req.body;

      if (!content) {
        return res.status(400).json({
          success: false,
          message: 'Content is required',
        });
      }

      const checkpoint = await storyService.createCheckpoint(id, userId, content, label);

      res.status(201).json({
        success: true,
        checkpoint,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getCheckpoints(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;

      const checkpoints = await storyService.getCheckpoints(id, userId);

      res.json({
        success: true,
        checkpoints,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getCheckpointById(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { checkpointId } = req.params;

      const checkpoint = await storyService.getCheckpointById(checkpointId, userId);

      res.json({
        success: true,
        checkpoint,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new StoryController();
