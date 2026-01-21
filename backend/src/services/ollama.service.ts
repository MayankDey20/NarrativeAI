import { Ollama } from 'ollama';
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

export class OllamaService {
  private client: Ollama;
  private model: string;

  constructor() {
    this.client = new Ollama({ 
      host: config.ollama.host 
    });
    this.model = config.ollama.model;
  }

  async generateStory(params: GenerateStoryParams): Promise<AIResponse> {
    const startTime = Date.now();
    const systemPrompt = buildSystemPrompt(params.genre, params.pov);
    const temperature = mapCreativityToTemperature(params.creativity);
    
    try {
      const response = await this.client.chat({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: params.prompt }
        ],
        options: {
          temperature: temperature,
          top_p: 0.9,
          num_predict: params.maxTokens || config.ollama.maxTokens,
        },
      });
      
      const generationTime = Date.now() - startTime;
      const content = response.message.content;
      
      return {
        content,
        metadata: {
          tokensUsed: response.eval_count || 0,
          generationTime,
          model: this.model,
        },
      };
    } catch (error: any) {
      throw new Error(`Ollama error: ${error.message}`);
    }
  }

  async continueStory(currentStory: string, params: GenerateStoryParams): Promise<AIResponse> {
    const startTime = Date.now();
    const systemPrompt = buildSystemPrompt(params.genre, params.pov);
    const continuationPrompt = buildContinuationPrompt(currentStory);
    const temperature = mapCreativityToTemperature(params.creativity);
    
    try {
      const response = await this.client.chat({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: continuationPrompt }
        ],
        options: {
          temperature: temperature,
          top_p: 0.9,
          num_predict: params.maxTokens || config.ollama.maxTokens,
        },
      });
      
      const generationTime = Date.now() - startTime;
      const content = response.message.content;
      
      return {
        content,
        metadata: {
          tokensUsed: response.eval_count || 0,
          generationTime,
          model: this.model,
        },
      };
    } catch (error: any) {
      throw new Error(`Ollama error: ${error.message}`);
    }
  }

  async generateSummary(storyContent: string): Promise<AIResponse> {
    const startTime = Date.now();
    const summaryPrompt = buildSummaryPrompt(storyContent);
    
    try {
      const response = await this.client.chat({
        model: this.model,
        messages: [
          { role: 'user', content: summaryPrompt }
        ],
        options: {
          temperature: 0.5,
          num_predict: 500,
        },
      });
      
      const generationTime = Date.now() - startTime;
      const content = response.message.content;
      
      return {
        content,
        metadata: {
          tokensUsed: response.eval_count || 0,
          generationTime,
          model: this.model,
        },
      };
    } catch (error: any) {
      throw new Error(`Ollama error: ${error.message}`);
    }
  }

  async refinePrompt(originalPrompt: string, genre: string): Promise<AIResponse> {
    const startTime = Date.now();
    const refinePrompt = buildRefinePrompt(originalPrompt, genre);
    
    try {
      const response = await this.client.chat({
        model: this.model,
        messages: [
          { role: 'user', content: refinePrompt }
        ],
        options: {
          temperature: 0.7,
          num_predict: 300,
        },
      });
      
      const generationTime = Date.now() - startTime;
      const content = response.message.content;
      
      return {
        content,
        metadata: {
          tokensUsed: response.eval_count || 0,
          generationTime,
          model: this.model,
        },
      };
    } catch (error: any) {
      // Return original prompt as fallback
      return {
        content: originalPrompt,
        metadata: {
          tokensUsed: 0,
          generationTime: Date.now() - startTime,
          model: this.model,
        },
      };
    }
  }

  async rewriteContent(content: string, instruction: string, creativity: number): Promise<AIResponse> {
    const startTime = Date.now();
    const rewritePrompt = buildRewritePrompt(content, instruction);
    const temperature = mapCreativityToTemperature(creativity);
    
    try {
      const response = await this.client.chat({
        model: this.model,
        messages: [
          { role: 'user', content: rewritePrompt }
        ],
        options: {
          temperature: temperature,
          num_predict: Math.min(content.length * 2, config.ollama.maxTokens),
        },
      });
      
      const generationTime = Date.now() - startTime;
      const rewrittenContent = response.message.content;
      
      return {
        content: rewrittenContent,
        metadata: {
          tokensUsed: response.eval_count || 0,
          generationTime,
          model: this.model,
        },
      };
    } catch (error: any) {
      throw new Error(`Ollama error: ${error.message}`);
    }
  }

  async expandContent(content: string, creativity: number): Promise<AIResponse> {
    const startTime = Date.now();
    const expandPrompt = buildExpandPrompt(content);
    const temperature = mapCreativityToTemperature(creativity);
    
    try {
      const response = await this.client.chat({
        model: this.model,
        messages: [
          { role: 'user', content: expandPrompt }
        ],
        options: {
          temperature: temperature,
          num_predict: Math.min(content.length * 3, config.ollama.maxTokens),
        },
      });
      
      const generationTime = Date.now() - startTime;
      const expandedContent = response.message.content;
      
      return {
        content: expandedContent,
        metadata: {
          tokensUsed: response.eval_count || 0,
          generationTime,
          model: this.model,
        },
      };
    } catch (error: any) {
      throw new Error(`Ollama error: ${error.message}`);
    }
  }

  async generateChoices(storyContext: string, genre: string, pov: string, creativity: number): Promise<string[]> {
    const startTime = Date.now();
    const choicesPrompt = buildChoicesPrompt(storyContext);
    const temperature = mapCreativityToTemperature(creativity);
    
    try {
      const response = await this.client.chat({
        model: this.model,
        messages: [
          { role: 'user', content: choicesPrompt }
        ],
        options: {
          temperature: temperature,
          num_predict: 500,
        },
      });
      
      const content = response.message.content;
      
      // Parse choices from response
      const choices = content
        .split('\n')
        .filter((line: string) => /^\d+\./.test(line.trim()))
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((choice: string) => choice.length > 0);
      
      return choices.slice(0, 4); // Ensure exactly 4 choices
    } catch (error: any) {
      throw new Error(`Ollama error: ${error.message}`);
    }
  }
}

export default new OllamaService();
