
"use client";

import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { getMockData, getColumns } from '@/lib/data';

export default function EmployeesPage() {
  const pageTitle = "Employees";
  const data = getMockData('employees');
  const columns = getColumns('employees');

  return (
    <>
      <PageHeader title={pageTitle} />
      <main className="flex-1 p-4 md:p-6">
        <DataTable data={data} columns={columns} pageTitle={pageTitle} />
      </main>
    </>
  );
}
