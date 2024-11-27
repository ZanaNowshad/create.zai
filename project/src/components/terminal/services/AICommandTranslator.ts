import { Configuration, OpenAIApi } from 'openai';

export class AICommandTranslator {
  private static instance: AICommandTranslator;
  
  static getInstance(): AICommandTranslator {
    if (!AICommandTranslator.instance) {
      AICommandTranslator.instance = new AICommandTranslator();
    }
    return AICommandTranslator.instance;
  }

  async translateToCommand(input: string): Promise<string> {
    try {
      const response = await fetch('https://api.deepinfra.com/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'Qwen/Qwen2.5-72B-Instruct',
          messages: [
            {
              role: 'system',
              content: 'You are a command line interpreter. Convert natural language to appropriate shell commands. Only respond with the command, no explanations.'
            },
            {
              role: 'user',
              content: input
            }
          ],
          temperature: 0.3,
          max_tokens: 100
        })
      });

      const data = await response.json();
      const command = data.choices[0].message.content.trim();
      return command;
    } catch (error) {
      console.error('AI translation error:', error);
      throw new Error('Failed to translate command');
    }
  }
}
