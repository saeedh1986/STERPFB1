"use client";

import React from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getDashboardSummaryData } from '@/lib/data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Tooltip } from 'recharts';

const aedSymbol = <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UAE_Dirham_Symbol.svg/1377px-UAE_Dirham_Symbol.svg.png" alt="AED" width={14} height={14} className="inline-block" />;

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


const SummaryRow = ({ category, description, amount }: { category?: string; description: string; amount: number; }) => {
    const isNegative = amount < 0;
    const isCategoryRow = !!category;

    return (
        <TableRow className={isCategoryRow ? 'bg-muted/50 font-semibold' : ''}>
            <TableCell className="font-semibold">{category}</TableCell>
            <TableCell>{description}</TableCell>
            <TableCell className={`text-right font-mono ${isNegative ? 'text-red-500' : ''}`}>
                 <div className="flex items-center justify-end gap-1">
                    {aedSymbol} {currencyFormatter(amount)}
                </div>
            </TableCell>
        </TableRow>
    );
};

const InventoryRow = ({ description, amount }: { description: string; amount: number; }) => (
    <TableRow>
        <TableCell></TableCell>
        <TableCell>{description}</TableCell>
        <TableCell className="text-right font-mono">{numberFormatter(amount)}</TableCell>
    </TableRow>
);


export default function DashboardPage() {
    const summaryData = React.useMemo(() => getDashboardSummaryData(), []);

    const allFinancials = [
        ...summaryData.financials,
        ...summaryData.shipping,
        ...summaryData.fees,
        ...summaryData.combinedRevenue,
    ].filter(item => item.category !== 'Sales' && item.category !== 'Net Sales' && item.category !== 'Net Total');

    const chartConfig = {
      value: { label: "Value" },
      purchases: { label: "Purchases", color: "hsl(var(--chart-1))" },
      sales: { label: "Sales", color: "hsl(var(--chart-2))" },
    };

    return (
        <>
            <PageHeader title="Dashboard" />
            <main className="flex-1 p-4 md:p-6 space-y-6">
                 <div className="grid gap-6 lg:grid-cols-5">
                    <Card className="shadow-lg lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Financial Summary</CardTitle>
                            <CardDescription>An overview of your key financial metrics.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[120px]">Category</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <SummaryRow {...summaryData.financials.find(f => f.category === 'Sales')!} />
                                    <SummaryRow {...summaryData.financials.find(f => f.category === 'Purchases')!} />
                                    <SummaryRow {...summaryData.financials.find(f => f.category === 'Net Sales')!} />
                                    <SummaryRow {...summaryData.financials.find(f => f.category === 'Expenses')!} />
                                    <SummaryRow {...summaryData.financials.find(f => f.category === 'Net Total')!} />
                                    
                                    <TableRow className="bg-muted/50 font-semibold"><TableCell>Inventory</TableCell><TableCell></TableCell><TableCell></TableCell></TableRow>
                                    {summaryData.inventory.map(item => <InventoryRow key={item.description} {...item} />)}
                                    
                                    <TableRow className="bg-muted/50 font-semibold"><TableCell>Returns</TableCell><TableCell></TableCell><TableCell></TableCell></TableRow>
                                    {summaryData.returns.map(item => <InventoryRow key={item.description} {...item} />)}

                                    <TableRow className="bg-muted/50 font-semibold"><TableCell>Sales Orders</TableCell><TableCell></TableCell><TableCell></TableCell></TableRow>
                                    {summaryData.salesOrders.map(item => <InventoryRow key={item.description} {...item} />)}
                                    
                                    <TableRow className="bg-muted/50 font-semibold"><TableCell>Shipping</TableCell><TableCell></TableCell><TableCell></TableCell></TableRow>
                                    {summaryData.shipping.map(item => <SummaryRow key={item.description} {...item} />)}

                                    <TableRow className="bg-muted/50 font-semibold"><TableCell>Fees</TableCell><TableCell></TableCell><TableCell></TableCell></TableRow>
                                    {summaryData.fees.map(item => <SummaryRow key={item.description} {...item} />)}
                                    
                                    <TableRow className="bg-muted/50 font-semibold"><TableCell>Combined Revenue</TableCell><TableCell></TableCell><TableCell></TableCell></TableRow>
                                     <SummaryRow {...summaryData.combinedRevenue[0]} />

                                    <TableRow className="bg-muted/50 font-semibold"><TableCell>Cost of Sales</TableCell><TableCell></TableCell><TableCell></TableCell></TableRow>
                                    <SummaryRow {...summaryData.financials.find(f => f.category === 'Cost of Sales')!} />
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2 space-y-6">
                        <Card className="shadow-lg">
                             <CardHeader>
                                <CardTitle>Sales Performance</CardTitle>
                                <CardDescription>Key revenue and expense figures.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-64 w-full">
                                    <BarChart data={summaryData.chartData.barChart} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                        <YAxis />
                                        <Tooltip
                                            cursor={false}
                                            content={<ChartTooltipContent 
                                                formatter={(value) => currencyFormatter(value as number)} 
                                            />} 
                                        />
                                        <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                         <Card className="shadow-lg">
                             <CardHeader>
                                <CardTitle>Inventory Distribution</CardTitle>
                                <CardDescription>Current state of your inventory items.</CardDescription>
                            </CardHeader>
                           <CardContent>
                                <ChartContainer config={{}} className="h-64 w-full">
                                    <PieChart>
                                        <Tooltip
                                            cursor={false}
                                            content={<ChartTooltipContent
                                                formatter={(value, name) => `${name}: ${numberFormatter(value as number)}`}
                                                hideIndicator
                                            />}
                                        />
                                        <Pie
                                            data={summaryData.chartData.pieChart}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            labelLine={false}
                                            label={({ percent, name }) => `${name.split(' ').pop()}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                           {summaryData.chartData.pieChart.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                 </div>
            </main>
        </>
    );
}
