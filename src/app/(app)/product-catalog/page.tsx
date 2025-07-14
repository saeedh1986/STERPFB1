
"use client";

import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { getMockData, getColumns } from '@/lib/data';

export default function ProductCatalogPage() {
  const pageTitle = "Product Catalog";
  const data = getMockData('product-catalog');
  const columns = getColumns('product-catalog');

  // Note: The "Add to Inventory" functionality is not present in the generic DataTable.
  // This can be re-introduced with a custom action column if needed in the future.
  // For now, this page will have standard CRUD, import, and export.

  return (
    <>
      <PageHeader title={pageTitle} />
      <main className="flex-1 p-4 md:p-6">
        <DataTable data={data} columns={columns} pageTitle={pageTitle} />
      </main>
    </>
  );
}
