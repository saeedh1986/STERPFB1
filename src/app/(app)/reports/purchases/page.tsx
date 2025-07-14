
"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMockData } from '@/lib/data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ShoppingCart, DollarSign, Building } from 'lucide-react';

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

export default function PurchasesReportPage() {
    const reportData = useMemo(() => {
        const purchasesData = getMockData('purchases');
        
        const totalCost = purchasesData.reduce((sum, item) => sum + (item.totalCost || 0), 0);
        const totalOrders = purchasesData.length;

        const purchasesByMonth: Record<string, number> = {};
        purchasesData.forEach(item => {
            const month = new Date(item.purchaseDate).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!purchasesByMonth[month]) {
                purchasesByMonth[month] = 0;
            }
            purchasesByMonth[month] += item.totalCost || 0;
        });
        
        const chartData = Object.entries(purchasesByMonth).map(([name, purchases]) => ({ name, purchases })).reverse();

        const purchasesBySupplier: Record<string, { quantity: number; cost: number }> = {};
        purchasesData.forEach(item => {
            if (!purchasesBySupplier[item.supplier]) {
                purchasesBySupplier[item.supplier] = { quantity: 0, cost: 0 };
            }
            purchasesBySupplier[item.supplier].quantity += item.quantity || 0;
            purchasesBySupplier[item.supplier].cost += item.totalCost || 0;
        });

        const supplierTableData = Object.entries(purchasesBySupplier).map(([supplier, data]) => ({
            supplier,
            ...data,
        })).sort((a,b) => b.cost - a.cost);

        return {
            totalCost,
            totalOrders,
            chartData,
            supplierTableData,
        };
    }, []);
    
    const chartConfig = {
      purchases: { label: "Purchases", color: "hsl(var(--chart-2))" },
    };

    return (
        <>
            <PageHeader title="Purchases Report" />
            <main className="flex-1 p-4 md:p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Purchase Cost</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">{aedSymbol} {currencyFormatter(reportData.totalCost)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Purchase Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{numberFormatter(reportData.totalOrders)}</div>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="grid gap-6 lg:grid-cols-2">
                     <Card>
                        <CardHeader>
                            <CardTitle>Purchases Over Time</CardTitle>
                            <CardDescription>Monthly purchase costs.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={chartConfig} className="h-80 w-full">
                                <BarChart data={reportData.chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis tickFormatter={(value) => `AED ${value/1000}k`} />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent 
                                            formatter={(value) => currencyFormatter(value as number)} 
                                        />} 
                                    />
                                    <Bar dataKey="purchases" fill="var(--color-purchases)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Purchases by Supplier</CardTitle>
                            <CardDescription>Breakdown of spending across suppliers.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead className="text-right">Items Purchased</TableHead>
                                        <TableHead className="text-right">Total Cost</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData.supplierTableData.slice(0, 10).map((item) => (
                                        <TableRow key={item.supplier}>
                                            <TableCell>
                                                <div className="font-medium">{item.supplier}</div>
                                            </TableCell>
                                            <TableCell className="text-right">{numberFormatter(item.quantity)}</TableCell>
                                            <TableCell className="text-right flex items-center justify-end gap-1">{aedSymbol} {currencyFormatter(item.cost)}</TableCell>
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
