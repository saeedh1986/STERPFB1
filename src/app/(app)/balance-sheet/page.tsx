
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

const aedSymbolPath = "https://s3eed.ae/wp-content/uploads/2025/07/AED-Symbol-for-parse-1-300x218.png";
const aedSymbol = <Image src={aedSymbolPath} alt="AED" width={14} height={14} className="inline-block dark:invert" />;

interface LedgerEntry {
    date: Date;
    type: 'Sale' | 'Purchase' | 'Expense';
    description: string;
    debit: number;
    credit: number;
    account: string;
}

const getLedgerData = () => {
    const salesData = getMockData('sales');
    const purchasesData = getMockData('purchases');
    const expensesData = getMockData('expenses');

    const combinedData: LedgerEntry[] = [];

    salesData.forEach(item => {
        combinedData.push({
            date: new Date(item.saleDate), type: 'Sale', description: `Sale to ${item.customerName}`,
            credit: parseFloat(item.totalSales) || 0, debit: 0, account: 'Sales Revenue'
        });
        // This is a simplified entry; a real system would have more splits (e.g., to Accounts Receivable)
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

    return combinedData;
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

        // This is a very simplified balance calculation
        // A real system would use double-entry bookkeeping.
        const totalRevenue = ledger.filter(e => e.account === 'Sales Revenue').reduce((sum, e) => sum + e.credit, 0);
        const totalCogs = ledger.filter(e => e.account === 'Cost of Goods Sold').reduce((sum, e) => sum + e.debit, 0);
        const totalOpEx = ledger.filter(e => chartOfAccountsData.find(a => a.name === e.account)?.type === 'Expense' && e.account !== 'Cost of Goods Sold').reduce((sum, e) => sum + e.debit, 0);
        
        const netIncome = totalRevenue - totalCogs - totalOpEx;

        accountBalances['Cash and Bank'] = 25480.50 + netIncome; // Simplified starting cash + profit
        accountBalances['Inventory Asset'] = totalCogs * 0.8; // Assume 80% of COGS is still in inventory (very rough estimate)
        accountBalances['Accounts Receivable'] = totalRevenue * 0.1; // Assume 10% of revenue is receivable

        accountBalances['Accounts Payable'] = totalCogs * 0.15; // Assume 15% of purchases are on credit
        
        accountBalances['Owner\'s Equity'] = 30000; // Initial investment
        accountBalances['Retained Earnings'] = netIncome; // Profit/Loss for the period

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
