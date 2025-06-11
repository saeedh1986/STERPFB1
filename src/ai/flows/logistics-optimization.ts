// Logistics Optimization Genkit Flow

'use server';

/**
 * @fileOverview A logistics route optimization AI agent.
 *
 * - logisticsOptimization - A function that handles the logistics route optimization process.
 * - LogisticsOptimizationInput - The input type for the logisticsOptimization function.
 * - LogisticsOptimizationOutput - The return type for the logisticsOptimization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LogisticsOptimizationInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical logistics data including routes, times, costs, and any relevant external factors such as weather or traffic incidents. Use a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  timeOfYear: z.string().describe('The current time of year.'),
  currentTrafficConditions: z.string().describe('The current traffic conditions.'),
  optimizationGoals: z
    .string()
    .describe(
      'Specific goals for route optimization, such as minimizing cost, minimizing time, or maximizing reliability.'
    ),
});
export type LogisticsOptimizationInput = z.infer<typeof LogisticsOptimizationInputSchema>;

const LogisticsOptimizationOutputSchema = z.object({
  suggestedRoutes: z
    .array(z.string())
    .describe('A list of suggested optimal delivery routes based on the input data.'),
  estimatedCosts: z
    .array(z.number())
    .describe('A list of estimated costs for each suggested route.'),
  estimatedTimes: z
    .array(z.string())
    .describe('A list of estimated delivery times for each suggested route.'),
  reliabilityScores: z
    .array(z.number())
    .describe('A list of reliability scores for each suggested route.'),
  notes: z.string().describe('Any additional notes or considerations for the suggested routes.'),
});
export type LogisticsOptimizationOutput = z.infer<typeof LogisticsOptimizationOutputSchema>;

export async function logisticsOptimization(
  input: LogisticsOptimizationInput
): Promise<LogisticsOptimizationOutput> {
  return logisticsOptimizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'logisticsOptimizationPrompt',
  input: {schema: LogisticsOptimizationInputSchema},
  output: {schema: LogisticsOptimizationOutputSchema},
  prompt: `You are an expert logistics optimizer. Analyze the historical data, time of year, and current traffic conditions to suggest optimal delivery routes.

Historical Data: {{media url=historicalData}}
Time of Year: {{{timeOfYear}}}
Current Traffic Conditions: {{{currentTrafficConditions}}}
Optimization Goals: {{{optimizationGoals}}}

Suggest optimal delivery routes, estimate costs and times, and provide reliability scores. Provide any additional notes or considerations.

Output your response as a JSON object matching the schema.`, 
});

const logisticsOptimizationFlow = ai.defineFlow(
  {
    name: 'logisticsOptimizationFlow',
    inputSchema: LogisticsOptimizationInputSchema,
    outputSchema: LogisticsOptimizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
