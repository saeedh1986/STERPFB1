
"use client";

import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { getMockData, getColumns, getPageTitle, moduleSlugs } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import InventoryBarcodePage from '../inventory-barcode/page';
import PurchasesCalPage from '../purchases-cal/page';
import BankStatementPage from '../bank-statement/page';

export default function ModulePage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  // Special handling for pages with custom layouts
  if (slug === 'inventory-barcode') {
    return <InventoryBarcodePage />;
  }
  if (slug === 'purchases-cal') {
    return <PurchasesCalPage />;
  }
  if (slug === 'bank-statement') {
    return <BankStatementPage />;
  }

  const data = getMockData(slug);
  const columns = getColumns(slug);
  const title = getPageTitle(slug);

  if (!slug || !moduleSlugs.includes(slug) || columns.length === 0) {
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

  return (
    <>
      <PageHeader title={title} />
      <main className="flex-1 p-4 md:p-6">
        <DataTable data={data} columns={columns} pageTitle={title} />
      </main>
    </>
  );
}
