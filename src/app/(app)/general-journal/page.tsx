
"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMockData, GenericItem } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const currencyFormatter = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const aedSymbol = <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UAE_Dirham_Symbol.svg/1377px-UAE_Dirham_Symbol.svg.png" alt="AED" width={14} height={14} className="inline-block" />;

interface LedgerEntry {
    date: Date;
    type: 'Sale' | 'Purchase' | 'Expense';
    description: string;
    debit: number;
    credit: number;
    balance: number;
}

export default function GeneralJournalPage() {

    const ledgerData = useMemo(() => {
        const salesData = getMockData('sales');
        const purchasesData = getMockData('purchases');
        const expensesData = getMockData('expenses');

        const combinedData: Omit<LedgerEntry, 'balance'>[] = [];

        salesData.forEach(item => {
            combinedData.push({
                date: new Date(item.saleDate),
                type: 'Sale',
                description: `Sale of ${item.itemName} (Order: ${item.orderId})`,
                credit: parseFloat(item.totalSales) || 0,
                debit: 0,
            });
        });

        purchasesData.forEach(item => {
            combinedData.push({
                date: new Date(item.purchaseDate),
                type: 'Purchase',
                description: `Purchase of ${item.quantity} x ${item.itemName} from ${item.supplier}`,
                debit: parseFloat(item.totalCost) || 0,
                credit: 0,
            });
        });

        expensesData.forEach(item => {
            combinedData.push({
                date: new Date(item.expenseDate),
                type: 'Expense',
                description: `${item.description} - ${item.category}`,
                debit: parseFloat(item.amount) || 0,
                credit: 0,
            });
        });

        // Sort by date ascending
        combinedData.sort((a, b) => a.date.getTime() - b.date.getTime());

        // Calculate running balance
        let runningBalance = 0;
        const finalLedger: LedgerEntry[] = combinedData.map(entry => {
            runningBalance += entry.credit - entry.debit;
            return {
                ...entry,
                balance: runningBalance,
            };
        });

        // Reverse for display (latest first)
        return finalLedger.reverse();

    }, []);

    const getBadgeVariant = (type: LedgerEntry['type']) => {
        switch (type) {
            case 'Sale': return 'bg-green-100 text-green-800 hover:bg-green-200';
            case 'Purchase': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
            case 'Expense': return 'bg-red-100 text-red-800 hover:bg-red-200';
            default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        }
    };

    return (
        <>
            <PageHeader title="General Journal" />
            <main className="flex-1 p-4 md:p-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>All Transactions</CardTitle>
                        <CardDescription>A chronological record of all financial activities from sales, purchases, and expenses.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="w-[40%]">Description</TableHead>
                                    <TableHead className="text-right">Debit</TableHead>
                                    <TableHead className="text-right">Credit</TableHead>
                                    <TableHead className="text-right">Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ledgerData.map((entry, index) => (
                                    <TableRow key={`${entry.date.toISOString()}-${index}`}>
                                        <TableCell>{entry.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("border-transparent", getBadgeVariant(entry.type))}>{entry.type}</Badge>
                                        </TableCell>
                                        <TableCell>{entry.description}</TableCell>
                                        <TableCell className="text-right font-medium text-red-500">
                                            {entry.debit > 0 ? (
                                                <div className="flex items-center justify-end gap-1">
                                                    {aedSymbol} {currencyFormatter(entry.debit)}
                                                </div>
                                            ) : '-'}
                                        </TableCell>
                                         <TableCell className="text-right font-medium text-green-500">
                                            {entry.credit > 0 ? (
                                                <div className="flex items-center justify-end gap-1">
                                                    {aedSymbol} {currencyFormatter(entry.credit)}
                                                </div>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                             <div className="flex items-center justify-end gap-1">
                                                {aedSymbol} {currencyFormatter(entry.balance)}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
