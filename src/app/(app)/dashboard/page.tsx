
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getDashboardSummaryData } from '@/lib/data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowRight, DollarSign, Package, TrendingUp, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const aedSymbol = <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UAE_Dirham_Symbol.svg/1377px-UAE_Dirham_Symbol.svg.png" alt="AED" width={14} height={14} className="inline-block dark:invert" />;

const currencyFormatter = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const numberFormatter = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
};


export default function DashboardPage() {
    const summaryData = React.useMemo(() => getDashboardSummaryData(), []);

    const barChartConfig = {
      sales: { label: "Sales", color: "hsl(var(--chart-2))" },
      expenses: { label: "Expenses", color: "hsl(var(--chart-4))" },
    };
    
    const pieChartConfig = summaryData.chartData.pieChart.reduce((acc, item) => {
        acc[item.name] = { label: item.name, color: item.fill };
        return acc;
    }, {} as any);


    return (
        <>
            <PageHeader title="Dashboard" />
            <main className="flex-1 p-4 md:p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">{aedSymbol} {currencyFormatter(summaryData.financials.totalRevenue)}</div>
                            <p className="text-xs text-muted-foreground">Based on all completed sales</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">{aedSymbol} {currencyFormatter(summaryData.financials.netProfit)}</div>
                            <p className="text-xs text-muted-foreground">Revenue minus costs & expenses</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sales</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{numberFormatter(summaryData.orders.totalOrders)}</div>
                            <p className="text-xs text-muted-foreground">{numberFormatter(summaryData.orders.itemsSold)} total items sold</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                             <div className="text-2xl font-bold flex items-center gap-2">{aedSymbol} {currencyFormatter(summaryData.financials.totalExpenses)}</div>
                            <p className="text-xs text-muted-foreground">Includes COGS and operating expenses</p>
                        </CardContent>
                    </Card>
                </div>
                
                 <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="shadow-lg lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Revenue and Expenses Overview</CardTitle>
                            <CardDescription>Comparison of sales vs. expenses over the last few months.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <ChartContainer config={barChartConfig}>
                                <BarChart data={summaryData.chartData.barChart}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `AED ${value/1000}k`} />
                                    <ChartTooltip
                                        content={<ChartTooltipContent
                                            formatter={(value) => currencyFormatter(value as number)} 
                                        />} 
                                    />
                                    <Legend />
                                    <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Inventory Distribution</CardTitle>
                            <CardDescription>Current state of your top inventory items by quantity.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                           <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[250px]">
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent
                                            formatter={(value) => numberFormatter(value as number)}
                                            hideIndicator
                                        />}
                                    />
                                    <Pie
                                        data={summaryData.chartData.pieChart}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        labelLine={false}
                                        label={({ percent, name }) => `${name.split(' ').pop()}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                       {summaryData.chartData.pieChart.map((entry) => (
                                            <Cell key={entry.name} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                 </div>

                 <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center">
                            <div className="grid gap-2">
                                <CardTitle>Recent Sales</CardTitle>
                                <CardDescription>The last five sales made.</CardDescription>
                            </div>
                            <Button asChild size="sm" className="ml-auto gap-1">
                                <Link href="/sales">View All <ArrowRight /></Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Item</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {summaryData.recentSales.map((sale) => (
                                        <TableRow key={sale.orderId}>
                                            <TableCell>
                                                <div className="font-medium">{sale.customerName}</div>
                                                <div className="hidden text-sm text-muted-foreground md:inline">{sale.orderId}</div>
                                            </TableCell>
                                            <TableCell>{sale.itemName}</TableCell>
                                            <TableCell className="text-right flex items-center justify-end gap-1">
                                                {aedSymbol} {currencyFormatter(sale.totalSales)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center">
                             <div className="grid gap-2">
                                <CardTitle>Low Stock Items</CardTitle>
                                <CardDescription>Products that are running low in stock.</CardDescription>
                            </div>
                            <Button asChild size="sm" className="ml-auto gap-1">
                                <Link href="/inventory">View All <ArrowRight /></Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-right">Quantity Left</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {summaryData.lowStockItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="font-medium">{item.itemName}</div>
                                                <div className="text-sm text-muted-foreground">{item.sku}</div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="destructive">{item.quantity}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                 </div>

            </main>
        </>
    );
}
