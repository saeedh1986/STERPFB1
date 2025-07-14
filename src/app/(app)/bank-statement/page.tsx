
"use client";

import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { bankTransactionsData, bankAccountDetails } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Download, FilePlus } from 'lucide-react';
import Image from 'next/image';

const aedSymbol = <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UAE_Dirham_Symbol.svg/1377px-UAE_Dirham_Symbol.svg.png" alt="AED" width={14} height={14} className="inline-block" />;

const currencyFormatter = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};


export default function BankStatementPage() {
    return (
        <>
            <PageHeader title="Bank Statement" />
            <main className="flex-1 p-4 md:p-6 space-y-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Account Details</CardTitle>
                        <CardDescription>Summary of your bank account information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Account Name</p>
                                <p className="font-medium">{bankAccountDetails.accountName}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Account Number</p>
                                <p className="font-medium">{bankAccountDetails.accountNumber}</p>
                            </div>
                             <div className="space-y-1">
                                <p className="text-muted-foreground">Account Type</p>
                                <p className="font-medium">{bankAccountDetails.accountType}</p>
                            </div>
                             <div className="space-y-1">
                                <p className="text-muted-foreground">Card Number</p>
                                <p className="font-medium">{bankAccountDetails.cardNumber}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                                <p className="text-muted-foreground">Account IBAN</p>
                                <p className="font-medium">{bankAccountDetails.accountIban}</p>
                            </div>
                             <div className="space-y-1">
                                <p className="text-muted-foreground">Account Currency</p>
                                <p className="font-medium">{bankAccountDetails.accountCurrency}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between">
                         <div>
                            <CardTitle className="text-xl font-bold">Transactions</CardTitle>
                            <CardDescription>Your recent transaction history.</CardDescription>
                        </div>
                         <div className="flex gap-2">
                            <Button variant="outline"><Download className="mr-2" /> Download CSV</Button>
                            <Button><FilePlus className="mr-2" /> Add Transaction</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Transaction Type</TableHead>
                                    <TableHead>Ref. Number</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Debit</TableHead>
                                    <TableHead className="text-right">Credit</TableHead>
                                    <TableHead className="text-right">Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bankTransactionsData.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.transactionType}</TableCell>
                                        <TableCell>{item.refNumber}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell className="text-right font-medium text-red-500">
                                            {item.debit > 0 ? (
                                                <div className="flex items-center justify-end gap-1">
                                                    {aedSymbol} {currencyFormatter(item.debit)}
                                                </div>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-green-500">
                                            {item.credit > 0 ? (
                                                <div className="flex items-center justify-end gap-1">
                                                    {aedSymbol} {currencyFormatter(item.credit)}
                                                </div>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            <div className="flex items-center justify-end gap-1">
                                                {aedSymbol} {currencyFormatter(item.balance)}
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

