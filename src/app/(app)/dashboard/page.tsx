
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Package, ShoppingCart, Users, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

const aedSymbol = <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UAE_Dirham_Symbol.svg/1377px-UAE_Dirham_Symbol.svg.png" alt="AED" width={16} height={16} className="inline-block" />;

const summaryData = [
  { title: 'Total Sales', value: '125,670', icon: Landmark, trend: '+12%', trendColor: 'text-green-500', change: 'from last month' },
  { title: 'Inventory Value', value: '85,300', icon: Package, trend: '-2%', trendColor: 'text-red-500', change: 'from last month' },
  { title: 'Total Purchases', value: '62,150', icon: ShoppingCart, trend: '+8%', trendColor: 'text-green-500', change: 'from last month' },
  { title: 'Active Customers', value: '1,280', icon: Users, trend: '+50', trendColor: 'text-green-500', change: 'new this month' },
];

const lowStockItems = [
  { name: 'Microcontroller XA-200', stock: 5, image: 'https://placehold.co/64x64.png', dataAiHint: 'microcontroller circuit' },
  { name: 'Resistor Pack 1K Ohm', stock: 12, image: 'https://placehold.co/64x64.png', dataAiHint: 'resistors electronics' },
  { name: 'LED Display Unit 7-Seg', stock: 8, image: 'https://placehold.co/64x64.png', dataAiHint: 'led display' },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryData.map((item) => (
            <Card key={item.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center gap-1">{aedSymbol} {item.value}</div>
                <p className={`text-xs ${item.trendColor} flex items-center`}>
                  {item.trend} <span className="text-muted-foreground ml-1">{item.change}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockItems.length > 0 ? (
                <ul className="space-y-3">
                  {lowStockItems.map((item) => (
                    <li key={item.name} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Image src={item.image} alt={item.name} width={40} height={40} className="rounded" data-ai-hint={item.dataAiHint} />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-destructive">Only {item.stock} units left</p>
                        </div>
                      </div>
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No low stock items. Well done!</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Sales Trends (Placeholder)</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64">
              <Image src="https://placehold.co/600x300.png" alt="Sales Trend Chart" width={600} height={300} className="rounded-md" data-ai-hint="sales chart" />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
