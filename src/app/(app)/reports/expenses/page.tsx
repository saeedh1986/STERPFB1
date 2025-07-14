
"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMockData } from '@/lib/data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import { CreditCard, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

const PIE_CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#f59e0b", // amber-500
  "#84cc16", // lime-500
  "#10b981", // emerald-500
];

export default function ExpensesReportPage() {
    const reportData = useMemo(() => {
        const expensesData = getMockData('expenses');
        
        const totalExpenses = expensesData.reduce((sum, item) => sum + (item.amount || 0), 0);
        const totalTransactions = expensesData.length;

        const expensesByCategory: Record<string, { count: number; amount: number }> = {};
        expensesData.forEach(item => {
            const category = item.category || 'Uncategorized';
            if (!expensesByCategory[category]) {
                expensesByCategory[category] = { count: 0, amount: 0 };
            }
            expensesByCategory[category].count++;
            expensesByCategory[category].amount += item.amount || 0;
        });
        
        const categoryTableData = Object.entries(expensesByCategory).map(([category, data]) => ({
            category,
            ...data,
        })).sort((a,b) => b.amount - a.amount);

        const pieChartData = categoryTableData.map((item, index) => ({
            name: item.category,
            value: item.amount,
            fill: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
        }));

        return {
            totalExpenses,
            totalTransactions,
            categoryTableData,
            pieChartData,
        };
    }, []);
    

    return (
        <>
            <PageHeader title="Expenses Report" />
            <main className="flex-1 p-4 md:p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">{aedSymbol} {currencyFormatter(reportData.totalExpenses)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{numberFormatter(reportData.totalTransactions)}</div>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="grid gap-6 md:grid-cols-5">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Expense Breakdown</CardTitle>
                            <CardDescription>Spending by category.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-80 w-full">
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent
                                            formatter={(value) => currencyFormatter(value as number)}
                                            hideIndicator
                                        />}
                                    />
                                    <Pie
                                        data={reportData.pieChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        labelLine={false}
                                        label={({ percent, name }) => `${(percent * 100).toFixed(0)}%`}
                                    >
                                       {reportData.pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                     <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Expenses by Category</CardTitle>
                            <CardDescription>Detailed list of spending per category.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Transactions</TableHead>
                                        <TableHead className="text-right">Total Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData.categoryTableData.map((item, index) => (
                                        <TableRow key={item.category}>
                                            <TableCell>
                                                <Badge
                                                  variant="outline"
                                                  className="border-transparent"
                                                  style={{ backgroundColor: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length] + '33' }}
                                                >
                                                    {item.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">{numberFormatter(item.count)}</TableCell>
                                            <TableCell className="text-right flex items-center justify-end gap-1">{aedSymbol} {currencyFormatter(item.amount)}</TableCell>
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
