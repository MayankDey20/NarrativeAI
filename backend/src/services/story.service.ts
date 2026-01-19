import prisma from '../config/database';

export interface CreateStoryData {
  userId: string;
  title: string;
  content: string;
  genre?: string;
  pov?: string;
  mode?: string;
  creativityLevel?: number;
}

export interface UpdateStoryData {
  title?: string;
  content?: string;
  genre?: string;
  pov?: string;
  mode?: string;
  creativityLevel?: number;
}

function calculateWordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export class StoryService {
  async createStory(data: CreateStoryData) {
    const wordCount = calculateWordCount(data.content);
    const characterCount = data.content.length;

    const story = await prisma.story.create({
      data: {
        userId: data.userId,
        title: data.title,
        content: data.content,
        genre: data.genre,
        pov: data.pov,
        mode: data.mode,
        wordCount,
        characterCount,
        creativityLevel: data.creativityLevel || 7,
      },
    });

    // Update user stats
    await this.updateUserStats(data.userId, wordCount, characterCount, data.genre);

    return story;
  }

  async getStoryById(storyId: string, userId: string) {
    const story = await prisma.story.findFirst({
      where: {
        id: storyId,
        userId,
        isDeleted: false,
      },
      include: {
        checkpoints: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!story) {
      throw new Error('Story not found');
    }

    return story;
  }

  async getUserStories(userId: string, limit: number = 10, offset: number = 0) {
    const [stories, total] = await Promise.all([
      prisma.story.findMany({
        where: {
          userId,
          isDeleted: false,
        },
        orderBy: { updatedAt: 'desc' },
        skip: offset,
        take: limit,
        select: {
          id: true,
          title: true,
          content: true,
          genre: true,
          wordCount: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.story.count({
        where: {
          userId,
          isDeleted: false,
        },
      }),
    ]);

    return {
      stories,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async updateStory(storyId: string, userId: string, data: UpdateStoryData) {
    // Verify ownership
    const existingStory = await prisma.story.findFirst({
      where: { id: storyId, userId },
    });

    if (!existingStory) {
      throw new Error('Story not found');
    }

    const updateData: any = { ...data };

    if (data.content) {
      updateData.wordCount = calculateWordCount(data.content);
      updateData.characterCount = data.content.length;
    }

    const story = await prisma.story.update({
      where: { id: storyId },
      data: updateData,
    });

    return story;
  }

  async deleteStory(storyId: string, userId: string) {
    // Verify ownership
    const story = await prisma.story.findFirst({
      where: { id: storyId, userId },
    });

    if (!story) {
      throw new Error('Story not found');
    }

    await prisma.story.update({
      where: { id: storyId },
      data: { isDeleted: true },
    });

    return { success: true };
  }

  async createCheckpoint(storyId: string, userId: string, content: string, label?: string) {
    // Verify ownership
    const story = await prisma.story.findFirst({
      where: { id: storyId, userId },
    });

    if (!story) {
      throw new Error('Story not found');
    }

    // Get checkpoint number
    const checkpointCount = await prisma.checkpoint.count({
      where: { storyId },
    });

    const checkpoint = await prisma.checkpoint.create({
      data: {
        storyId,
        content,
        label,
        wordCount: calculateWordCount(content),
        characterCount: content.length,
        checkpointNumber: checkpointCount + 1,
      },
    });

    return checkpoint;
  }

  async getCheckpoints(storyId: string, userId: string) {
    // Verify ownership
    const story = await prisma.story.findFirst({
      where: { id: storyId, userId },
    });

    if (!story) {
      throw new Error('Story not found');
    }

    const checkpoints = await prisma.checkpoint.findMany({
      where: { storyId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        label: true,
        wordCount: true,
        createdAt: true,
      },
    });

    return checkpoints;
  }

  async getCheckpointById(checkpointId: string, userId: string) {
    const checkpoint = await prisma.checkpoint.findFirst({
      where: {
        id: checkpointId,
        story: {
          userId,
        },
      },
    });

    if (!checkpoint) {
      throw new Error('Checkpoint not found');
    }

    return checkpoint;
  }

  private async updateUserStats(userId: string, wordCount: number, characterCount: number, genre?: string) {
    const genreField = genre ? `genre${genre.charAt(0).toUpperCase() + genre.slice(1)}` : null;

    await prisma.userStats.upsert({
      where: { userId },
      create: {
        userId,
        totalStories: 1,
        totalWords: wordCount,
        totalCharacters: characterCount,
        ...(genreField && { [genreField]: 1 }),
      },
      update: {
        totalStories: { increment: 1 },
        totalWords: { increment: wordCount },
        totalCharacters: { increment: characterCount },
        ...(genreField && { [genreField]: { increment: 1 } }),
      },
    });
  }
}

export default new StoryService();
