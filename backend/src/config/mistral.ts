import { Mistral } from '@mistralai/mistralai';
import { config } from './environment';

let mistralClient: Mistral | null = null;

if (config.mistral.apiKey) {
  mistralClient = new Mistral({
    apiKey: config.mistral.apiKey,
  });
} else {
  console.warn('Warning: Mistral API key not configured. AI features will not work.');
}

export default mistralClient;