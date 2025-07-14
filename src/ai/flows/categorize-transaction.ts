'use server';

/**
 * @fileOverview An AI agent for categorizing financial transactions.
 *
 * - categorizeTransaction - A function that suggests a category for a transaction.
 * - CategorizeTransactionInput - The input type for the categorizeTransaction function.
 * - CategorizeTransactionOutput - The return type for the categorizeTransaction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeTransactionInputSchema = z.object({
  description: z.string().describe('The description of the financial transaction from the bank statement.'),
  accounts: z.array(z.string()).describe('A list of possible account categories from the Chart of Accounts.'),
});
export type CategorizeTransactionInput = z.infer<typeof CategorizeTransactionInputSchema>;

const CategorizeTransactionOutputSchema = z.object({
  category: z.string().describe('The suggested category for the transaction from the provided list of accounts.'),
});
export type CategorizeTransactionOutput = z.infer<typeof CategorizeTransactionOutputSchema>;

export async function categorizeTransaction(
  input: CategorizeTransactionInput
): Promise<CategorizeTransactionOutput> {
  return categorizeTransactionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeTransactionPrompt',
  input: {schema: CategorizeTransactionInputSchema},
  output: {schema: CategorizeTransactionOutputSchema},
  prompt: `You are an expert accountant. Your task is to categorize a financial transaction based on its description.

Transaction Description: {{{description}}}

You must choose the single best category from the following list of accounts:
{{#each accounts}}
- {{{this}}}
{{/each}}

Analyze the description and select the most appropriate account. For example, a transaction for "AMAZON WEB SERVICES" should be categorized as "IT & Software Subscriptions". A payment from a customer marketplace like "Amazon AE" should be "Sales Revenue". A purchase from "AliExpress" should be "Cost of Goods Sold".

Output your response as a JSON object matching the schema.`,
});

const categorizeTransactionFlow = ai.defineFlow(
  {
    name: 'categorizeTransactionFlow',
    inputSchema: CategorizeTransactionInputSchema,
    outputSchema: CategorizeTransactionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
