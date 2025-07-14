
"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMockData, chartOfAccountsData } from '@/lib/data';

const currencyFormatter = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const aedSymbol = <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UAE_Dirham_Symbol.svg/1377px-UAE_Dirham_Symbol.svg.png" alt="AED" width={14} height={14} className="inline-block dark:invert" />;

interface LedgerEntry {
    date: Date;
    type: 'Sale' | 'Purchase' | 'Expense';
    description: string;
    debit: number;
    credit: number;
    balance: number;
    account: string;
}

const getLedgerData = () => {
    const salesData = getMockData('sales');
    const purchasesData = getMockData('purchases');
    const expensesData = getMockData('expenses');

    const combinedData: Omit<LedgerEntry, 'balance'>[] = [];

    salesData.forEach(item => {
        combinedData.push({
            date: new Date(item.saleDate), type: 'Sale', description: `Sale to ${item.customerName}`,
            credit: parseFloat(item.totalSales) || 0, debit: 0, account: 'Sales Revenue'
        });
    });
    purchasesData.forEach(item => {
        combinedData.push({
            date: new Date(item.purchaseDate), type: 'Purchase', description: `Purchase from ${item.supplier}`,
            debit: parseFloat(item.totalCost) || 0, credit: 0, account: 'Cost of Goods Sold'
        });
    });
    expensesData.forEach(item => {
        combinedData.push({
            date: new Date(item.expenseDate), type: 'Expense', description: `${item.description}`,
            debit: parseFloat(item.amount) || 0, credit: 0, account: item.category
        });
    });

    combinedData.sort((a, b) => a.date.getTime() - b.date.getTime());

    let runningBalance = 0;
    return combinedData.map(entry => {
        runningBalance += entry.credit - entry.debit;
        return { ...entry, balance: runningBalance };
    });
};

const ReportRow: React.FC<{ label: string; amount: number; isTotal?: boolean; isHeader?: boolean }> = ({ label, amount, isTotal, isHeader }) => (
    <TableRow className={isTotal ? "font-bold border-t-2 border-primary" : ""}>
        <TableCell className={isHeader ? "font-bold text-lg" : "pl-8"}>{label}</TableCell>
        <TableCell className="text-right font-medium">
            {!isHeader && (
                 <div className="flex items-center justify-end gap-1">
                    {aedSymbol} {currencyFormatter(amount)}
                </div>
            )}
        </TableCell>
    </TableRow>
);


export default function BalanceSheetPage() {
    const reportData = useMemo(() => {
        const ledger = getLedgerData();
        const accountBalances: Record<string, number> = {};

        chartOfAccountsData.forEach(acc => accountBalances[acc.name] = 0);

        ledger.forEach(entry => {
            const accountInfo = chartOfAccountsData.find(acc => acc.name === entry.account || acc.type === entry.account);
            const accountName = accountInfo ? accountInfo.name : entry.account;

            if (accountName in accountBalances) {
                 const accountType = chartOfAccountsData.find(a => a.name === accountName)?.type;
                 if (accountType === 'Asset' || accountType === 'Expense') {
                    accountBalances[accountName] += entry.debit - entry.credit;
                 } else { // Liability, Equity, Revenue
                    accountBalances[accountName] += entry.credit - entry.debit;
                 }
            }
        });
        
        // Mock cash from bank statement for a more complete balance sheet
        accountBalances['Cash and Bank'] = 25480.50; 

        const assets = chartOfAccountsData.filter(a => a.type === 'Asset').map(a => ({ name: a.name, balance: accountBalances[a.name] || 0 }));
        const liabilities = chartOfAccountsData.filter(a => a.type === 'Liability').map(a => ({ name: a.name, balance: accountBalances[a.name] || 0 }));
        const equity = chartOfAccountsData.filter(a => a.type === 'Equity').map(a => ({ name: a.name, balance: accountBalances[a.name] || 0 }));

        const totalAssets = assets.reduce((sum, acc) => sum + acc.balance, 0);
        const totalLiabilities = liabilities.reduce((sum, acc) => sum + acc.balance, 0);
        const totalEquity = equity.reduce((sum, acc) => sum + acc.balance, 0);
        
        return { assets, liabilities, equity, totalAssets, totalLiabilities, totalEquity };
    }, []);

    return (
        <>
            <PageHeader title="Balance Sheet" />
            <main className="flex-1 p-4 md:p-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Balance Sheet</CardTitle>
                        <CardDescription>As of {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Assets */}
                            <div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-lg font-bold">Assets</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData.assets.map(item => <ReportRow key={item.name} label={item.name} amount={item.balance} />)}
                                        <ReportRow label="Total Assets" amount={reportData.totalAssets} isTotal />
                                    </TableBody>
                                </Table>
                            </div>

                             {/* Liabilities & Equity */}
                            <div className="space-y-8">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-lg font-bold">Liabilities</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData.liabilities.map(item => <ReportRow key={item.name} label={item.name} amount={item.balance} />)}
                                        <ReportRow label="Total Liabilities" amount={reportData.totalLiabilities} isTotal />
                                    </TableBody>
                                </Table>
                                <Table>
                                     <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-lg font-bold">Equity</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData.equity.map(item => <ReportRow key={item.name} label={item.name} amount={item.balance} />)}
                                        <ReportRow label="Total Equity" amount={reportData.totalEquity} isTotal />
                                    </TableBody>
                                </Table>
                                <Table>
                                     <TableBody>
                                        <ReportRow label="Total Liabilities and Equity" amount={reportData.totalLiabilities + reportData.totalEquity} isTotal />
                                     </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
