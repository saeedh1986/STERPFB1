
import { PageHeader } from '@/components/PageHeader';
import { LogisticsOptimizationForm } from '@/components/logistics/LogisticsOptimizationForm';

export default function LogisticsInsightsPage() {
  return (
    <>
      <PageHeader title="Logistics Insights Tool" />
      <main className="flex-1 p-4 md:p-6">
        <LogisticsOptimizationForm />
      </main>
    </>
  );
}
