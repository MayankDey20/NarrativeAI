import mistralClient from '../config/mistral';
import { config } from '../config/environment';
import {
  buildSystemPrompt,
  buildContinuationPrompt,
  buildSummaryPrompt,
  buildRefinePrompt,
  buildRewritePrompt,
  buildExpandPrompt,
  buildChoicesPrompt,
} from './prompts';

export interface GenerateStoryParams {
  prompt: string;
  genre: string;
  pov: string;
  creativity: number;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  metadata: {
    tokensUsed: number;
    generationTime: number;
    model: string;
  };
}

function mapCreativityToTemperature(creativity: number): number {
  // Map 1-10 scale to 0.3-1.0 temperature range
  return Math.max(0.3, Math.min(1.0, 0.3 + (creativity - 1) * 0.078));
}

export class MistralService {
  async generateStory(params: GenerateStoryParams): Promise<AIResponse> {
    if (!mistralClient) {
      throw new Error('Mistral AI is not configured. Please add MISTRAL_API_KEY to .env file.');
    }

    const startTime = Date.now();
    const systemPrompt = buildSystemPrompt(params.genre, params.pov);
    const temperature = mapCreativityToTemperature(params.creativity);
    
    try {
      const response = await mistralClient.chat.complete({
        model: config.mistral.modelPrimary,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: params.prompt }
        ],
        temperature: temperature,
        maxTokens: params.maxTokens || config.mistral.maxTokens,
        topP: 0.9,
      });
      
      const generationTime = Date.now() - startTime;
      const content = response.choices?.[0]?.message?.content || '';
      
      return {
        content,
        metadata: {
          tokensUsed: response.usage?.totalTokens || 0,
          generationTime,
          model: config.mistral.modelPrimary,
        },
      };
    } catch (error: any) {
      throw new Error(`Mistral API error: ${error.message}`);
    }
  }

  async continueStory(currentStory: string, params: GenerateStoryParams): Promise<AIResponse> {
    if (!mistralClient) {
      throw new Error('Mistral AI is not configured. Please add MISTRAL_API_KEY to .env file.');
    }

    const startTime = Date.now();
    const systemPrompt = buildSystemPrompt(params.genre, params.pov);
    const continuationPrompt = buildContinuationPrompt(currentStory);
    const temperature = mapCreativityToTemperature(params.creativity);
    
    try {
      const response = await mistralClient.chat.complete({
        model: config.mistral.modelPrimary,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: continuationPrompt }
        ],
        temperature: temperature,
        maxTokens: params.maxTokens || config.mistral.maxTokens,
        topP: 0.9,
      });
      
      const generationTime = Date.now() - startTime;
      const content = response.choices?.[0]?.message?.content || '';
      
      return {
        content,
        metadata: {
          tokensUsed: response.usage?.totalTokens || 0,
          generationTime,
          model: config.mistral.modelPrimary,
        },
      };
    } catch (error: any) {
      throw new Error(`Mistral API error: ${error.message}`);
    }
  }

  async generateSummary(storyContent: string): Promise<AIResponse> {
    if (!mistralClient) {
      throw new Error('Mistral AI is not configured. Please add MISTRAL_API_KEY to .env file.');
    }

    const startTime = Date.now();
    const summaryPrompt = buildSummaryPrompt(storyContent);
    
    try {
      const response = await mistralClient.chat.complete({
        model: config.mistral.modelSecondary,
        messages: [
          { role: 'user', content: summaryPrompt }
        ],
        temperature: 0.5,
        maxTokens: 500,
      });
      
      const generationTime = Date.now() - startTime;
      const content = response.choices?.[0]?.message?.content || '';
      
      return {
        content,
        metadata: {
          tokensUsed: response.usage?.totalTokens || 0,
          generationTime,
          model: config.mistral.modelSecondary,
        },
      };
    } catch (error: any) {
      throw new Error(`Mistral API error: ${error.message}`);
    }
  }

  async refinePrompt(originalPrompt: string, genre: string): Promise<AIResponse> {
    if (!mistralClient) {
      throw new Error('Mistral AI is not configured. Please add MISTRAL_API_KEY to .env file.');
    }

    const startTime = Date.now();
    const refinePromptText = buildRefinePrompt(originalPrompt, genre);
    
    try {
      const response = await mistralClient.chat.complete({
        model: config.mistral.modelSecondary,
        messages: [
          { role: 'user', content: refinePromptText }
        ],
        temperature: 0.7,
        maxTokens: 300,
      });
      
      const generationTime = Date.now() - startTime;
      const content = response.choices?.[0]?.message?.content || '';
      
      return {
        content,
        metadata: {
          tokensUsed: response.usage?.totalTokens || 0,
          generationTime,
          model: config.mistral.modelSecondary,
        },
      };
    } catch (error: any) {
      throw new Error(`Mistral API error: ${error.message}`);
    }
  }

  async rewriteContent(content: string, tone: string, creativity: number): Promise<AIResponse> {
    if (!mistralClient) {
      throw new Error('Mistral AI is not configured. Please add MISTRAL_API_KEY to .env file.');
    }

    const startTime = Date.now();
    const rewritePromptText = buildRewritePrompt(content, tone);
    const temperature = mapCreativityToTemperature(creativity);
    
    try {
      const response = await mistralClient.chat.complete({
        model: config.mistral.modelPrimary,
        messages: [
          { role: 'user', content: rewritePromptText }
        ],
        temperature: temperature,
        maxTokens: Math.min(content.length * 2, config.mistral.maxTokens),
      });
      
      const generationTime = Date.now() - startTime;
      const rewrittenContent = response.choices?.[0]?.message?.content || '';
      
      return {
        content: rewrittenContent,
        metadata: {
          tokensUsed: response.usage?.totalTokens || 0,
          generationTime,
          model: config.mistral.modelPrimary,
        },
      };
    } catch (error: any) {
      throw new Error(`Mistral API error: ${error.message}`);
    }
  }

  async expandContent(content: string, creativity: number): Promise<AIResponse> {
    if (!mistralClient) {
      throw new Error('Mistral AI is not configured. Please add MISTRAL_API_KEY to .env file.');
    }

    const startTime = Date.now();
    const expandPromptText = buildExpandPrompt(content);
    const temperature = mapCreativityToTemperature(creativity);
    
    try {
      const response = await mistralClient.chat.complete({
        model: config.mistral.modelPrimary,
        messages: [
          { role: 'user', content: expandPromptText }
        ],
        temperature: temperature,
        maxTokens: Math.min(content.length * 3, config.mistral.maxTokens),
      });
      
      const generationTime = Date.now() - startTime;
      const expandedContent = response.choices?.[0]?.message?.content || '';
      
      return {
        content: expandedContent,
        metadata: {
          tokensUsed: response.usage?.totalTokens || 0,
          generationTime,
          model: config.mistral.modelPrimary,
        },
      };
    } catch (error: any) {
      throw new Error(`Mistral API error: ${error.message}`);
    }
  }

  async generateChoices(storyContent: string, genre: string, pov: string, creativity: number): Promise<string[]> {
    if (!mistralClient) {
      throw new Error('Mistral AI is not configured. Please add MISTRAL_API_KEY to .env file.');
    }

    const choicesPrompt = buildChoicesPrompt(storyContent);
    const temperature = mapCreativityToTemperature(creativity);
    
    try {
      const response = await mistralClient.chat.complete({
        model: config.mistral.modelSecondary,
        messages: [
          { role: 'user', content: choicesPrompt }
        ],
        temperature: temperature,
        maxTokens: 500,
      });
      
      const content = response.choices?.[0]?.message?.content || '';
      
      // Parse the numbered list
      const choices = content
        .split('\n')
        .filter((line: string) => /^\d+\./.test(line.trim()))
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((choice: string) => choice.length > 0);
      
      return choices.slice(0, 4); // Ensure exactly 4 choices
    } catch (error: any) {
      throw new Error(`Mistral API error: ${error.message}`);
    }
  }
}

export default new MistralService();
