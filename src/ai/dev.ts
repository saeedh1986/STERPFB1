import { config } from 'dotenv';
config();

import '@/ai/flows/logistics-optimization.ts';
import '@/ai/flows/categorize-transaction.ts';
import '@/ai/flows/scan-purchase-invoice.ts';
