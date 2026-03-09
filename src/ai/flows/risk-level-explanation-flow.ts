'use server';
/**
 * @fileOverview Provides an AI tool that generates a concise explanation for a given disaster risk level and location.
 *
 * - riskLevelExplanation - A function that provides an explanation for a specific risk level based on location.
 * - RiskLevelExplanationInput - The input type for the riskLevelExplanation function.
 * - RiskLevelExplanationOutput - The return type for the riskLevelExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RiskLevelExplanationInputSchema = z.object({
  location: z
    .string()
    .describe('The general location for which to provide the risk explanation.'),
  riskLevel: z
    .enum(['Low', 'Medium', 'High'])
    .describe('The disaster risk level for the specified location.'),
});
export type RiskLevelExplanationInput = z.infer<
  typeof RiskLevelExplanationInputSchema
>;

const RiskLevelExplanationOutputSchema = z.object({
  conciseExplanation: z
    .string()
    .describe(
      'A concise explanation detailing the primary reasons or factors contributing to the given risk level for the specified location.'
    ),
});
export type RiskLevelExplanationOutput = z.infer<
  typeof RiskLevelExplanationOutputSchema
>;

export async function riskLevelExplanation(
  input: RiskLevelExplanationInput
): Promise<RiskLevelExplanationOutput> {
  return riskLevelExplanationFlow(input);
}

const riskLevelExplanationPrompt = ai.definePrompt({
  name: 'riskLevelExplanationPrompt',
  input: {schema: RiskLevelExplanationInputSchema},
  output: {schema: RiskLevelExplanationOutputSchema},
  prompt: `As an AI-powered local risk assessment tool, provide a concise explanation for the disaster risk level for the given location.

Highlight the primary reasons or factors contributing to the determined risk level, making the explanation actionable and easy to understand.

Location: {{{location}}}
Risk Level: {{{riskLevel}}}

Explanation:`,
});

const riskLevelExplanationFlow = ai.defineFlow(
  {
    name: 'riskLevelExplanationFlow',
    inputSchema: RiskLevelExplanationInputSchema,
    outputSchema: RiskLevelExplanationOutputSchema,
  },
  async input => {
    const {output} = await riskLevelExplanationPrompt(input);
    return output!;
  }
);
