
"use client";

import { PageHeader } from '@/components/PageHeader';
import { ItemPurchasedCostCalculator } from '@/components/purchases/ItemPurchasedCostCalculator';


export default function PurchasesCalPage() {
    return (
        <>
            <PageHeader title="Item Purchased Cost Calculator" />
            <main className="flex-1 p-4 md:p-6">
               <ItemPurchasedCostCalculator />
            </main>
        </>
    );
};
