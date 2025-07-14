
"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMockData } from '@/lib/data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';

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

export default function SalesReportPage() {
    const reportData = useMemo(() => {
        const salesData = getMockData('sales');
        
        const totalRevenue = salesData.reduce((sum, item) => sum + (item.totalSales || 0), 0);
        const totalOrders = salesData.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const salesByMonth: Record<string, number> = {};
        salesData.forEach(item => {
            const month = new Date(item.saleDate).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!salesByMonth[month]) {
                salesByMonth[month] = 0;
            }
            salesByMonth[month] += item.totalSales || 0;
        });
        
        const chartData = Object.entries(salesByMonth).map(([name, sales]) => ({ name, sales })).reverse();

        const salesByProduct: Record<string, { quantity: number; revenue: number }> = {};
        salesData.forEach(item => {
            if (!salesByProduct[item.sku]) {
                salesByProduct[item.sku] = { quantity: 0, revenue: 0 };
            }
            salesByProduct[item.sku].quantity += item.qtySold || 0;
            salesByProduct[item.sku].revenue += item.totalSales || 0;
        });

        const productTableData = Object.entries(salesByProduct).map(([sku, data]) => {
            const productInfo = getMockData('inventory').find(p => p.sku === sku);
            return {
                sku,
                itemName: productInfo?.itemName || 'Unknown',
                ...data,
            };
        }).sort((a,b) => b.revenue - a.revenue);

        return {
            totalRevenue,
            totalOrders,
            averageOrderValue,
            chartData,
            productTableData
        };
    }, []);
    
    const chartConfig = {
      sales: { label: "Sales", color: "hsl(var(--chart-1))" },
    };

    return (
        <>
            <PageHeader title="Sales Report" />
            <main className="flex-1 p-4 md:p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">{aedSymbol} {currencyFormatter(reportData.totalRevenue)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{numberFormatter(reportData.totalOrders)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">{aedSymbol} {currencyFormatter(reportData.averageOrderValue)}</div>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                     <Card>
                        <CardHeader>
                            <CardTitle>Sales Over Time</CardTitle>
                            <CardDescription>Monthly sales revenue.</CardDescription>
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
                                    <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales by Product</CardTitle>
                            <CardDescription>Performance of individual products.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-right">Quantity Sold</TableHead>
                                        <TableHead className="text-right">Total Revenue</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData.productTableData.slice(0, 10).map((item) => (
                                        <TableRow key={item.sku}>
                                            <TableCell>
                                                <div className="font-medium">{item.itemName}</div>
                                                <div className="text-sm text-muted-foreground">{item.sku}</div>
                                            </TableCell>
                                            <TableCell className="text-right">{numberFormatter(item.quantity)}</TableCell>
                                            <TableCell className="text-right flex items-center justify-end gap-1">{aedSymbol} {currencyFormatter(item.revenue)}</TableCell>
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
