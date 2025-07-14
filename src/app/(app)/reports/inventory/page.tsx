
"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMockData } from '@/lib/data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Package, DollarSign, Archive, AlertTriangle } from 'lucide-react';
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

const LOW_STOCK_THRESHOLD = 10;

export default function InventoryReportPage() {
    const reportData = useMemo(() => {
        const inventoryData = getMockData('inventory');
        
        const totalValue = inventoryData.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const totalUnits = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
        const uniqueSkus = inventoryData.length;

        const inventoryWithValue = inventoryData.map(item => ({
            ...item,
            value: item.quantity * item.unitPrice,
        }));
        
        const topByValue = [...inventoryWithValue].sort((a, b) => b.value - a.value).slice(0, 10);
        const topByQuantity = [...inventoryWithValue].sort((a, b) => b.quantity - a.quantity).slice(0, 10);
        const lowStockItems = inventoryWithValue.filter(item => item.quantity <= LOW_STOCK_THRESHOLD).sort((a,b) => a.quantity - b.quantity);

        const chartData = topByValue.map(item => ({
            name: item.sku,
            value: item.value,
        })).reverse();


        return {
            totalValue,
            totalUnits,
            uniqueSkus,
            chartData,
            topByQuantity,
            lowStockItems,
        };
    }, []);
    
    const chartConfig = {
      value: { label: "Value", color: "hsl(var(--chart-3))" },
    };

    return (
        <>
            <PageHeader title="Inventory Report" />
            <main className="flex-1 p-4 md:p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">{aedSymbol} {currencyFormatter(reportData.totalValue)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Units in Stock</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{numberFormatter(reportData.totalUnits)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unique SKUs</CardTitle>
                            <Archive className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{numberFormatter(reportData.uniqueSkus)}</div>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="grid gap-6 lg:grid-cols-5">
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Top 10 Products by Value</CardTitle>
                            <CardDescription>Value is calculated as (Quantity x Unit Price).</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={chartConfig} className="h-96 w-full">
                                <BarChart data={reportData.chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <CartesianGrid horizontal={false} />
                                    <XAxis type="number" tickFormatter={(value) => `AED ${value/1000}k`} />
                                    <YAxis dataKey="name" type="category" width={80} tickLine={false} axisLine={false} />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent 
                                            formatter={(value) => currencyFormatter(value as number)} 
                                        />} 
                                    />
                                    <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top 10 Products by Quantity</CardTitle>
                                <CardDescription>Highest quantity items currently in stock.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="text-right">Quantity</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData.topByQuantity.map((item) => (
                                            <TableRow key={item.sku}>
                                                <TableCell>
                                                    <div className="font-medium">{item.itemName}</div>
                                                    <div className="text-sm text-muted-foreground">{item.sku}</div>
                                                </TableCell>
                                                <TableCell className="text-right font-bold">{numberFormatter(item.quantity)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" /> Low Stock Items</CardTitle>
                                <CardDescription>Items with quantity at or below {LOW_STOCK_THRESHOLD}.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {reportData.lowStockItems.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead className="text-right">Quantity</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reportData.lowStockItems.map((item) => (
                                                <TableRow key={item.sku}>
                                                    <TableCell>
                                                        <div className="font-medium">{item.itemName}</div>
                                                        <div className="text-sm text-muted-foreground">{item.sku}</div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                         <Badge variant="destructive">{numberFormatter(item.quantity)}</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No items are currently low on stock.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </main>
        </>
    );
}
