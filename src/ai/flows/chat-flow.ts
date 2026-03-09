'use server';
/**
 * @fileOverview A disaster preparedness AI chatbot flow.
 *
 * - chatWithAI - A function that handles the chat interaction.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatInputSchema = z.object({
  message: z.string().describe('The user message to the AI.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI generated response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chatWithAI(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  system: "You are SafeLearn AI, an assistant that teaches disaster preparedness for students. Give clear, short, educational answers about earthquakes, floods, fires, and emergency safety. Use bullet points for steps and keep a encouraging, helpful tone.",
  prompt: "{{{message}}}",
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await chatPrompt(input);
      if (!output) {
        return { response: "Sorry, I couldn't generate a response right now." };
      }
      return output;
    } catch (e) {
      console.error('Genkit Flow Error:', e);
      return { response: "Sorry, I couldn't generate a response right now." };
    }
  }
);
