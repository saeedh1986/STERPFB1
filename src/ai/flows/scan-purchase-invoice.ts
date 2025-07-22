'use server';

/**
 * @fileOverview An AI agent for scanning and extracting data from purchase invoices.
 *
 * - scanPurchaseInvoice - A function that handles the invoice scanning process.
 * - ScanPurchaseInvoiceInput - The input type for the scanPurchaseInvoice function.
 * - ScanPurchaseInvoiceOutput - The return type for the scanPurchaseInvoice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanPurchaseInvoiceInputSchema = z.object({
  invoiceImage: z
    .string()
    .describe(
      "A photo of a purchase invoice, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ScanPurchaseInvoiceInput = z.infer<typeof ScanPurchaseInvoiceInputSchema>;

const ScanPurchaseInvoiceOutputSchema = z.object({
    purchaseDate: z.string().describe('The date of the purchase in DD-MMM-YYYY format. e.g., 24-Jul-2024.'),
    supplier: z.string().describe('The name of the supplier or vendor.'),
    sku: z.string().optional().describe('The SKU or product code of the primary item, if available.'),
    itemName: z.string().describe('The name of the primary item purchased. If multiple items, list the most prominent one.'),
    quantity: z.number().describe('The total quantity of items purchased.'),
    unitCost: z.number().describe('The cost per unit of the primary item.'),
    totalCost: z.number().describe('The grand total amount of the invoice.'),
    purchaseType: z.enum(['Inventory', 'Asset', 'Expense']).describe('The type of purchase. Categorize as "Asset" for equipment, hardware, or devices. Categorize as "Inventory" for goods intended for resale. Categorize as "Expense" for services or consumables.')
});
export type ScanPurchaseInvoiceOutput = z.infer<typeof ScanPurchaseInvoiceOutputSchema>;

export async function scanPurchaseInvoice(
  input: ScanPurchaseInvoiceInput
): Promise<ScanPurchaseInvoiceOutput> {
  return scanPurchaseInvoiceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanPurchaseInvoicePrompt',
  input: {schema: ScanPurchaseInvoiceInputSchema},
  output: {schema: ScanPurchaseInvoiceOutputSchema},
  prompt: `You are an expert data entry specialist for an ERP system. Your task is to extract information from the provided purchase invoice image.

Analyze the invoice image carefully: {{media url=invoiceImage}}

Extract the following information:
- The supplier's name.
- The date of the invoice. Format it as DD-MMM-YYYY.
- The SKU of the main item, if listed.
- The name/description of the main item.
- The quantity of the main item.
- The unit price/cost of the main item.
- The grand total of the invoice.
- The type of purchase. If the items are hardware, equipment, printers, or other devices, classify it as 'Asset'. If the items are for resale, classify as 'Inventory'. If it's for a service or consumable, classify as 'Expense'.

Return the extracted data as a JSON object matching the schema. If a value is not found, omit it or use a sensible default (e.g., 1 for quantity).`,
});

const scanPurchaseInvoiceFlow = ai.defineFlow(
  {
    name: 'scanPurchaseInvoiceFlow',
    inputSchema: ScanPurchaseInvoiceInputSchema,
    outputSchema: ScanPurchaseInvoiceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
