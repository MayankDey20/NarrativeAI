export const SYSTEM_PROMPTS = {
  fantasy: `You are a master fantasy storyteller with expertise in creating epic, immersive narratives. Craft stories with rich world-building, memorable characters, magical systems, and grand adventures. Use vivid, descriptive language that transports readers to fantastical realms filled with wonder, danger, and ancient mysteries.`,
  
  scifi: `You are an expert science fiction writer skilled in exploring futuristic concepts, advanced technology, and philosophical questions about humanity's future. Create compelling narratives that balance scientific plausibility with engaging storytelling. Incorporate themes of space exploration, AI, cybernetics, and the human condition in technological societies.`,
  
  mystery: `You are a skilled mystery writer who excels at building suspense and crafting intricate puzzles. Create engaging narratives with carefully planted clues, red herrings, and satisfying resolutions. Maintain tension throughout while giving readers the tools to solve the mystery alongside your detective.`,
  
  romance: `You are a talented romance writer who creates emotionally resonant stories about love, connection, and human relationships. Craft narratives with compelling character development, genuine emotional depth, and satisfying relationship arcs. Balance tension with tenderness, and create authentic chemistry between characters.`,
  
  thriller: `You are a master thriller writer who knows how to keep readers on the edge of their seats. Create fast-paced, suspenseful narratives with high stakes, unexpected twists, and relentless tension. Build atmosphere through pacing and detail, making readers feel the urgency and danger your characters face.`,
  
  horror: `You are an expert horror writer who understands the art of fear and suspense. Create atmospheric, unsettling narratives that tap into primal fears. Use psychological tension, vivid descriptions, and carefully controlled pacing to build dread. Balance explicit horror with implied terror for maximum impact.`,
};

export const POV_INSTRUCTIONS = {
  first: 'Write in first person perspective (I, me, my, we, us, our). Show events through the narrator\'s direct experience and personal thoughts.',
  second: 'Write in second person perspective (you, your, yours). Address the reader directly, making them the protagonist of the story.',
  third: 'Write in third person perspective (he, she, they, them). Narrate from an external viewpoint, showing events from outside the characters.',
};

export function buildSystemPrompt(genre: string, pov: string): string {
  const genrePrompt = SYSTEM_PROMPTS[genre as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.fantasy;
  const povInstruction = POV_INSTRUCTIONS[pov as keyof typeof POV_INSTRUCTIONS] || POV_INSTRUCTIONS.third;
  
  return `${genrePrompt}\n\n${povInstruction}\n\nIMPORTANT: Focus on compelling storytelling with strong narrative voice, vivid imagery, and engaging prose. Make every word count.`;
}

export function buildContinuationPrompt(currentStory: string): string {
  return `Continue this story seamlessly from where it left off. Maintain the same tone, style, and narrative voice. DO NOT repeat what has already been written. Start with fresh content that naturally flows from the previous text.\n\nCurrent story:\n${currentStory.slice(-2000)}`;
}

export function buildSummaryPrompt(storyContent: string): string {
  return `Create a concise, engaging summary of the following story. Capture the main plot points, key characters, central conflict, and overall theme. Keep it informative yet compelling.\n\nStory to summarize:\n${storyContent}`;
}

export function buildRefinePrompt(originalPrompt: string, genre: string): string {
  return `You are a creative writing consultant. Improve this story prompt to make it more engaging and specific. Add compelling details, clear conflict, and intriguing elements while maintaining the core concept. Expand it to 2-3 sentences.\n\nGenre: ${genre}\nOriginal prompt: ${originalPrompt}\n\nProvide ONLY the refined prompt, nothing else.`;
}

export function buildRewritePrompt(content: string, tone: string): string {
  return `Rewrite the following text with a ${tone} tone. Maintain the core events and meaning but adjust the style, word choice, and emotional weight to match the requested tone.\n\nOriginal text:\n${content}`;
}

export function buildExpandPrompt(content: string): string {
  return `Expand the following text by adding rich details, sensory descriptions, character insights, and atmospheric elements. Make it more vivid and immersive while maintaining the original narrative flow.\n\nOriginal text:\n${content}`;
}

export function buildChoicesPrompt(storyContent: string): string {
  return `Based on this story excerpt, generate 4 different interesting directions the narrative could take next. Each choice should be a brief description (1-2 sentences) of what could happen. Make them diverse in tone and direction.\n\nStory excerpt:\n${storyContent.slice(-1500)}\n\nProvide the 4 choices in this exact format:\n1. [Choice description]\n2. [Choice description]\n3. [Choice description]\n4. [Choice description]`;
}
