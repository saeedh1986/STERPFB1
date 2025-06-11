
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { getMockData, getColumns, getPageTitle, moduleSlugs } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';

interface ModulePageProps {
  params: {
    slug: string;
  };
}

// This function can be used by Next.js to generate static pages for each module slug
export async function generateStaticParams() {
  return moduleSlugs.map((slug) => ({
    slug,
  }));
}

export default function ModulePage({ params }: ModulePageProps) {
  const { slug } = params;
  const data = getMockData(slug);
  const columns = getColumns(slug);
  const title = getPageTitle(slug);

  if (!moduleSlugs.includes(slug) || columns.length === 0) {
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
