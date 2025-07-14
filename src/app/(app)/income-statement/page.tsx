
"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { getMockData, chartOfAccountsData } from '@/lib/data';

const currencyFormatter = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const aedSymbol = <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UAE_Dirham_Symbol.svg/1377px-UAE_Dirham_Symbol.svg.png" alt="AED" width={14} height={14} className="inline-block" />;


const ReportRow: React.FC<{ label: string; amount: number; isTotal?: boolean; isHeader?: boolean; isNetIncome?: boolean }> = ({ label, amount, isTotal, isHeader, isNetIncome }) => (
    <TableRow className={isTotal ? "font-bold" : ""}>
        <TableCell className={`${isHeader ? "font-bold text-lg" : "pl-8"} ${isNetIncome ? "pl-0" : ""}`}>{label}</TableCell>
        <TableCell className={`text-right font-medium ${isTotal ? 'border-t-2 border-primary' : ''} ${isNetIncome ? 'border-t-4 border-b-4 border-double border-primary' : ''}`}>
             <div className="flex items-center justify-end gap-1">
                {aedSymbol} {currencyFormatter(amount)}
            </div>
        </TableCell>
    </TableRow>
);


export default function IncomeStatementPage() {
    const reportData = useMemo(() => {
        const salesData = getMockData('sales');
        const purchasesData = getMockData('purchases');
        const expensesData = getMockData('expenses');

        const revenues = salesData.reduce((sum, item) => sum + (parseFloat(item.totalSales) || 0), 0);
        const costOfGoodsSold = purchasesData.reduce((sum, item) => sum + (parseFloat(item.totalCost) || 0), 0);
        const grossProfit = revenues - costOfGoodsSold;

        const expenseTotals: Record<string, number> = {};
        expensesData.forEach(item => {
            const category = item.category || 'Uncategorized';
            if (!expenseTotals[category]) {
                expenseTotals[category] = 0;
            }
            expenseTotals[category] += parseFloat(item.amount) || 0;
        });

        const operatingExpenses = Object.entries(expenseTotals).map(([name, amount]) => ({ name, amount }));
        const totalOperatingExpenses = operatingExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        
        const netIncome = grossProfit - totalOperatingExpenses;
        
        return { revenues, costOfGoodsSold, grossProfit, operatingExpenses, totalOperatingExpenses, netIncome };
    }, []);

    return (
        <>
            <PageHeader title="Income Statement" />
            <main className="flex-1 p-4 md:p-6">
                <Card className="shadow-lg max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Income Statement</CardTitle>
                        <CardDescription>For the Period Ending {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                <ReportRow label="Revenue" amount={0} isHeader />
                                <ReportRow label="Sales Revenue" amount={reportData.revenues} />
                                <ReportRow label="Total Revenue" amount={reportData.revenues} isTotal />
                                
                                <TableRow><TableCell className="h-4"></TableCell></TableRow>
                                
                                <ReportRow label="Cost of Goods Sold" amount={0} isHeader />
                                <ReportRow label="Cost of Purchases" amount={reportData.costOfGoodsSold} />
                                <ReportRow label="Total Cost of Goods Sold" amount={reportData.costOfGoodsSold} isTotal />

                                <TableRow><TableCell className="h-4"></TableCell></TableRow>

                                <ReportRow label="Gross Profit" amount={reportData.grossProfit} isTotal />
                                
                                <TableRow><TableCell className="h-8"></TableCell></TableRow>

                                <ReportRow label="Operating Expenses" amount={0} isHeader />
                                {reportData.operatingExpenses.map(item => <ReportRow key={item.name} label={item.name} amount={item.amount} />)}
                                <ReportRow label="Total Operating Expenses" amount={reportData.totalOperatingExpenses} isTotal />

                                <TableRow><TableCell className="h-8"></TableCell></TableRow>
                                
                                <ReportRow label="Net Income" amount={reportData.netIncome} isTotal isNetIncome />
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
