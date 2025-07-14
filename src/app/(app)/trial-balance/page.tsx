
"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMockData, chartOfAccountsData } from '@/lib/data';

const currencyFormatter = (value: number) => {
    if (value === 0) return '-';
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const aedSymbol = (amount: number) => amount > 0 ? <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UAE_Dirham_Symbol.svg/1377px-UAE_Dirham_Symbol.svg.png" alt="AED" width={14} height={14} className="inline-block dark:invert" /> : null;

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

export default function TrialBalancePage() {
    const trialBalanceData = useMemo(() => {
        const ledger = getLedgerData();
        const accounts: Record<string, { debit: number; credit: number }> = {};

        // Initialize all accounts from Chart of Accounts
        chartOfAccountsData.forEach(acc => {
            accounts[acc.name] = { debit: 0, credit: 0 };
        });

        // Add cash balance from bank statement as a starting point
        accounts['Cash and Bank'] = { debit: 25480.50, credit: 0 };

        ledger.forEach(entry => {
            // Find the account name, checking for category matches as a fallback
            const accountInfo = chartOfAccountsData.find(acc => acc.name === entry.account || acc.type === entry.account);
            const accountName = accountInfo ? accountInfo.name : entry.account;

            if (!accounts[accountName]) {
                accounts[accountName] = { debit: 0, credit: 0 };
            }
            accounts[accountName].debit += entry.debit;
            accounts[accountName].credit += entry.credit;
        });

        const balances = Object.entries(accounts).map(([name, { debit, credit }]) => {
            const accountInfo = chartOfAccountsData.find(acc => acc.name === name);
            const finalDebit = debit > credit ? debit - credit : 0;
            const finalCredit = credit > debit ? credit - debit : 0;
            return {
                code: accountInfo?.code || 'N/A',
                name,
                debit: finalDebit,
                credit: finalCredit,
            };
        }).sort((a, b) => (a.code || '').localeCompare(b.code || ''));

        const totals = balances.reduce(
            (acc, curr) => ({ debit: acc.debit + curr.debit, credit: acc.credit + curr.credit }),
            { debit: 0, credit: 0 }
        );

        return { balances, totals };
    }, []);

    return (
        <>
            <PageHeader title="Trial Balance" />
            <main className="flex-1 p-4 md:p-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Trial Balance</CardTitle>
                        <CardDescription>As of {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Account</TableHead>
                                    <TableHead className="text-right">Debit (Dr)</TableHead>
                                    <TableHead className="text-right">Credit (Cr)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {trialBalanceData.balances.map((item) => (
                                    <TableRow key={item.code}>
                                        <TableCell className="font-mono">{item.code}</TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell className="text-right font-medium text-red-500">
                                            <div className="flex items-center justify-end gap-1">
                                                {aedSymbol(item.debit)} {currencyFormatter(item.debit)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-green-500">
                                             <div className="flex items-center justify-end gap-1">
                                                {aedSymbol(item.credit)} {currencyFormatter(item.credit)}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableRow className="bg-muted font-bold border-t-2">
                                <TableCell colSpan={2} className="text-right">Totals</TableCell>
                                <TableCell className="text-right text-red-500">
                                     <div className="flex items-center justify-end gap-1">
                                        {aedSymbol(trialBalanceData.totals.debit)} {currencyFormatter(trialBalanceData.totals.debit)}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right text-green-500">
                                     <div className="flex items-center justify-end gap-1">
                                        {aedSymbol(trialBalanceData.totals.credit)} {currencyFormatter(trialBalanceData.totals.credit)}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
