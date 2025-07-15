
"use client";

import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { getMockData, getColumns, getPageTitle, moduleSlugs } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import InventoryBarcodePage from '../inventory-barcode/page';
import InventoryTransferPage from '../inventory-transfer/page';
import PurchasesCalPage from '../purchases-cal/page';
import BankStatementPage from '../bank-statement/page';
import GeneralJournalPage from '../general-journal/page';
import TrialBalancePage from '../trial-balance/page';
import BalanceSheetPage from '../balance-sheet/page';
import IncomeStatementPage from '../income-statement/page';

export default function ModulePage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  // Special handling for pages with custom layouts
  if (slug === 'inventory-barcode') {
    return <InventoryBarcodePage />;
  }
  if (slug === 'inventory-transfer') {
    return <InventoryTransferPage />;
  }
  if (slug === 'purchases-cal') {
    return <PurchasesCalPage />;
  }
  if (slug === 'bank-statement') {
    return <BankStatementPage />;
  }
   if (slug === 'general-journal') {
    return <GeneralJournalPage />;
  }
  if (slug === 'trial-balance') {
    return <TrialBalancePage />;
  }
  if (slug === 'balance-sheet') {
    return <BalanceSheetPage />;
  }
  if (slug === 'income-statement') {
    return <IncomeStatementPage />;
  }


  const data = getMockData(slug);
  const columns = getColumns(slug);
  const title = getPageTitle(slug);

  if (!slug || !moduleSlugs.includes(slug) || (columns.length === 0 && slug !== 'invoices')) { // Allow invoices page to be empty initially
    return (
      <>
        <PageHeader title="Error" />
        <main className="flex-1 p-4 md:p-6">
          <Card>
            <CardContent className="pt-6">
              <p>Module not found or not configured.</p>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  // The invoices page is handled by its own page.tsx now, so we can avoid rendering DataTable for it here.
  if (slug === 'invoices') {
    return null; 
  }

  return (
    <>
      <PageHeader title={title} />
      <main className="flex-1 p-4 md:p-6">
        <DataTable data={data} columns={columns} pageTitle={title} />
      </main>
    </>
  );
}
