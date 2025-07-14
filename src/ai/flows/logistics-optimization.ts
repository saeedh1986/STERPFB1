// Logistics Optimization Genkit Flow

'use server';

/**
 * @fileOverview A logistics route optimization and forecasting AI agent.
 *
 * - logisticsOptimization - A function that handles the logistics analysis process.
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
  demandForecast: z
    .string()
    .describe('A forecast of future demand based on historical data and time of year.'),
  trendAnalysis: z
    .string()
    .describe('An analysis of key trends identified in the historical data.'),
  recommendations: z
    .string()
    .describe('Actionable recommendations for inventory, routing, and cost management.'),
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
  prompt: `You are an expert logistics and supply chain analyst. Your task is to analyze historical data, current conditions, and business goals to provide a comprehensive logistics strategy.

Analyze the provided information:
Historical Data: {{media url=historicalData}}
Time of Year: {{{timeOfYear}}}
Current Traffic Conditions: {{{currentTrafficConditions}}}
Optimization Goals: {{{optimizationGoals}}}

Based on your analysis, provide the following:
1.  **Suggested Routes**: A list of optimal delivery routes.
2.  **Estimates**: Estimated costs, times, and reliability scores for each route.
3.  **Demand Forecast**: A forecast of future product demand based on historical patterns and the time of year.
4.  **Trend Analysis**: Identify key trends from the data (e.g., most profitable routes, common delays, seasonal demand spikes).
5.  **Actionable Recommendations**: Suggest concrete actions for inventory management, route planning, and cost reduction.
6.  **Notes**: Any other important considerations.

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
