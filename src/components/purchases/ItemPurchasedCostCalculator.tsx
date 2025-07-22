
"use client";

import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { getMockData, getColumns } from '@/lib/data';

export function ItemPurchasedCostCalculator() {
  const pageTitle = "Item Purchased Cost Calculator";
  const data = getMockData('ipcc');
  const columns = getColumns('ipcc');

  return (
    <>
      <DataTable data={data} columns={columns} pageTitle={pageTitle} />
    </>
  );
}
