import { Request, Response } from 'express';
import ollamaService from '../services/ollama.service';
import prisma from '../config/database';

export class AIController {
  async generateStory(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { prompt, genre, pov, creativity, maxTokens } = req.body;

      if (!prompt || !genre || !pov) {
        return res.status(400).json({
          success: false,
          message: 'Prompt, genre, and pov are required',
        });
      }

      const result = await ollamaService.generateStory({
        prompt,
        genre,
        pov,
        creativity: creativity || 7,
        maxTokens,
      });

      // Log generation
      await prisma.aIGeneration.create({
        data: {
          userId,
          generationType: 'generate',
          prompt,
          generatedContent: result.content,
          modelUsed: result.metadata.model,
          tokensUsed: result.metadata.tokensUsed,
          generationTimeMs: result.metadata.generationTime,
          creativityLevel: creativity || 7,
          temperature: 0.3 + ((creativity || 7) - 1) * 0.078,
        },
      });

      // Update user stats
      await prisma.userStats.update({
        where: { userId },
        data: { totalGenerations: { increment: 1 } },
      });

      res.json({
        success: true,
        generatedStory: result.content,
        metadata: result.metadata,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async autoGenerate(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { storyId, currentContent, genre, pov, creativity } = req.body;

      if (!currentContent || !genre || !pov) {
        return res.status(400).json({
          success: false,
          message: 'Current content, genre, and pov are required',
        });
      }

      const result = await ollamaService.continueStory(currentContent, {
        prompt: '', // Not used for continuation
        genre,
        pov,
        creativity: creativity || 7,
      });

      // Log generation
      await prisma.aIGeneration.create({
        data: {
          userId,
          storyId: storyId || null,
          generationType: 'auto-generate',
          prompt: currentContent.slice(-500),
          generatedContent: result.content,
          modelUsed: result.metadata.model,
          tokensUsed: result.metadata.tokensUsed,
          generationTimeMs: result.metadata.generationTime,
          creativityLevel: creativity || 7,
        },
      });

      res.json({
        success: true,
        continuation: result.content,
        metadata: result.metadata,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async continueFromChoice(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { storyId, currentContent, selectedChoice, genre, pov, creativity } = req.body;

      if (!currentContent || !selectedChoice || !genre || !pov) {
        return res.status(400).json({
          success: false,
          message: 'Current content, selected choice, genre, and pov are required',
        });
      }

      const result = await ollamaService.continueFromChoice(currentContent, selectedChoice, {
        prompt: '',
        genre,
        pov,
        creativity: creativity || 7,
      });

      // Log generation
      await prisma.aIGeneration.create({
        data: {
          userId,
          storyId: storyId || null,
          generationType: 'choice-continuation',
          prompt: `Choice: ${selectedChoice}`,
          generatedContent: result.content,
          modelUsed: result.metadata.model,
          tokensUsed: result.metadata.tokensUsed,
          generationTimeMs: result.metadata.generationTime,
          creativityLevel: creativity || 7,
        },
      });

      res.json({
        success: true,
        continuation: result.content,
        metadata: result.metadata,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async generateSummary(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { storyId, content } = req.body;

      if (!content) {
        return res.status(400).json({
          success: false,
          message: 'Content is required',
        });
      }

      const result = await ollamaService.generateSummary(content);

      // Log generation
      await prisma.aIGeneration.create({
        data: {
          userId,
          storyId: storyId || null,
          generationType: 'summary',
          prompt: content.slice(0, 500),
          generatedContent: result.content,
          modelUsed: result.metadata.model,
          tokensUsed: result.metadata.tokensUsed,
          generationTimeMs: result.metadata.generationTime,
        },
      });

      res.json({
        success: true,
        summary: result.content,
        metadata: result.metadata,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async refinePrompt(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { originalPrompt, genre } = req.body;

      if (!originalPrompt || !genre) {
        return res.status(400).json({
          success: false,
          message: 'Original prompt and genre are required',
        });
      }

      const result = await ollamaService.refinePrompt(originalPrompt, genre);

      // Log generation
      await prisma.aIGeneration.create({
        data: {
          userId,
          generationType: 'refine',
          prompt: originalPrompt,
          generatedContent: result.content,
          modelUsed: result.metadata.model,
          tokensUsed: result.metadata.tokensUsed,
          generationTimeMs: result.metadata.generationTime,
        },
      });

      res.json({
        success: true,
        refinedPrompt: result.content,
        metadata: result.metadata,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async rewrite(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { content, tone, creativity } = req.body;

      if (!content || !tone) {
        return res.status(400).json({
          success: false,
          message: 'Content and tone are required',
        });
      }

      const result = await ollamaService.rewriteContent(content, tone, creativity || 7);

      // Log generation
      await prisma.aIGeneration.create({
        data: {
          userId,
          generationType: 'rewrite',
          prompt: `${tone}: ${content.slice(0, 200)}`,
          generatedContent: result.content,
          modelUsed: result.metadata.model,
          tokensUsed: result.metadata.tokensUsed,
          generationTimeMs: result.metadata.generationTime,
          creativityLevel: creativity || 7,
        },
      });

      res.json({
        success: true,
        rewrittenContent: result.content,
        metadata: result.metadata,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async expand(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { content, creativity } = req.body;

      if (!content) {
        return res.status(400).json({
          success: false,
          message: 'Content is required',
        });
      }

      const result = await ollamaService.expandContent(content, creativity || 7);

      // Log generation
      await prisma.aIGeneration.create({
        data: {
          userId,
          generationType: 'expand',
          prompt: content.slice(0, 200),
          generatedContent: result.content,
          modelUsed: result.metadata.model,
          tokensUsed: result.metadata.tokensUsed,
          generationTimeMs: result.metadata.generationTime,
          creativityLevel: creativity || 7,
        },
      });

      res.json({
        success: true,
        expandedContent: result.content,
        metadata: result.metadata,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async generateChoices(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { storyContent, genre, pov, creativity, numberOfChoices } = req.body;

      if (!storyContent || !genre || !pov) {
        return res.status(400).json({
          success: false,
          message: 'Story content, genre, and pov are required',
        });
      }

      const choices = await ollamaService.generateChoices(
        storyContent,
        genre,
        pov,
        creativity || 7
      );

      // Format choices for response
      const formattedChoices = choices.map((text, index) => ({
        id: index + 1,
        text,
        direction: 'continuation',
      }));

      res.json({
        success: true,
        choices: formattedChoices,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AIController();
