'use server';
/**
 * @fileOverview An AI agent that assesses the local disaster risk for a given location.
 *
 * - assessLocalDisasterRisk - A function that handles the disaster risk assessment process.
 * - LocalDisasterRiskAssessmentInput - The input type for the assessLocalDisasterRisk function.
 * - LocalDisasterRiskAssessmentOutput - The return type for the assessLocalDisasterRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LocalDisasterRiskAssessmentInputSchema = z.object({
  location: z
    .string()
    .describe(
      'The general location for which to assess disaster risk (e.g., city, postal code).'
    ),
});
export type LocalDisasterRiskAssessmentInput = z.infer<
  typeof LocalDisasterRiskAssessmentInputSchema
>;

const LocalDisasterRiskAssessmentOutputSchema = z.object({
  riskLevel: z
    .union([z.literal('Low'), z.literal('Medium'), z.literal('High')])
    .describe('The assessed disaster risk level for the location.'),
  reason: z
    .string()
    .describe(
      'A brief explanation for the determined risk level, mentioning potential hazards.'
    ),
});
export type LocalDisasterRiskAssessmentOutput = z.infer<
  typeof LocalDisasterRiskAssessmentOutputSchema
>;

export async function assessLocalDisasterRisk(
  input: LocalDisasterRiskAssessmentInput
): Promise<LocalDisasterRiskAssessmentOutput> {
  return localDisasterRiskAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'localDisasterRiskAssessmentPrompt',
  input: {schema: LocalDisasterRiskAssessmentInputSchema},
  output: {schema: LocalDisasterRiskAssessmentOutputSchema},
  prompt: `You are an AI assistant specialized in assessing local disaster risks.
Given a user's general location, provide a simple, personalized disaster risk level (Low, Medium, or High).
Also, provide a brief explanation for the determined risk level, mentioning potential hazards specific to that area.

Location: {{{location}}}`,
});

const localDisasterRiskAssessmentFlow = ai.defineFlow(
  {
    name: 'localDisasterRiskAssessmentFlow',
    inputSchema: LocalDisasterRiskAssessmentInputSchema,
    outputSchema: LocalDisasterRiskAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
