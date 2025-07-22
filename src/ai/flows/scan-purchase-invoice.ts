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

const LineItemSchema = z.object({
    sku: z.string().optional().describe('The SKU or item number of the product.'),
    itemName: z.string().describe('The name or description of the item.'),
    quantity: z.number().describe('The quantity of this item.'),
    unitCost: z.number().describe('The cost per unit of this item.'),
});

const ScanPurchaseInvoiceOutputSchema = z.object({
    purchaseDate: z.string().describe('The date of the purchase in DD-MMM-YYYY format. e.g., 24-Jul-2024.'),
    supplier: z.string().describe('The name of the supplier or vendor.'),
    lineItems: z.array(LineItemSchema).describe('An array of all line items found on the invoice.'),
    shippingFee: z.number().optional().describe('The shipping fee, if listed separately.'),
    otherFees: z.number().optional().describe('Any other fees (like bank charges or customs) listed separately.'),
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
- All line items from the invoice. For each item, extract its SKU/item number, description, quantity, and unit price.
- Any separate fees, such as 'Shipping fee' or other charges.
- The grand total of the invoice.
- The type of purchase. If the items are hardware, equipment, printers, or other devices, classify it as 'Asset'. If the items are for resale, classify as 'Inventory'. If it's for a service or consumable, classify as 'Expense'.

Return the extracted data as a JSON object matching the schema. If a value is not found, omit it or use a sensible default (e.g., 0 for fees).`,
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
