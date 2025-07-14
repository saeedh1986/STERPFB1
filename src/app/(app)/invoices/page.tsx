
import { PageHeader } from '@/components/PageHeader';
import { CreateInvoiceForm } from '@/components/invoice/CreateInvoiceForm';

export default function InvoicesPage() {
  return (
    <>
      <PageHeader title="Create Invoice" />
      <main className="flex-1 p-4 md:p-6">
        <CreateInvoiceForm />
      </main>
    </>
  );
}
