
"use client";

import React, { useState, useRef } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { bankTransactionsData as initialTransactions, bankAccountDetails as initialAccountDetails, chartOfAccountsData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Download, FileUp, FilePlus, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { categorizeTransaction } from '@/ai/flows/categorize-transaction';
import { Badge } from '@/components/ui/badge';


const aedSymbol = <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UAE_Dirham_Symbol.svg/1377px-UAE_Dirham_Symbol.svg.png" alt="AED" width={14} height={14} className="inline-block" />;

const currencyFormatter = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};


export default function BankStatementPage() {
    const [accountDetails, setAccountDetails] = useState(initialAccountDetails);
    const [transactions, setTransactions] = useState(initialTransactions);
    const [isCategorizing, setIsCategorizing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            setIsCategorizing(true);
            try {
                const text = e.target?.result as string;
                const lines = text.split('\n').filter(line => line.trim() !== '').slice(1); // Skip header
                if (lines.length === 0) {
                    throw new Error("CSV file is empty or has no data rows.");
                }

                const firstRowCols = lines[0].split(',').map(c => c.trim());
                const newAccountDetails = {
                    accountName: firstRowCols[0] || accountDetails.accountName,
                    accountType: firstRowCols[1] || accountDetails.accountType,
                    accountIban: firstRowCols[2] || accountDetails.accountIban,
                    accountNumber: firstRowCols[3] || accountDetails.accountNumber,
                    cardNumber: firstRowCols[4] || accountDetails.cardNumber,
                    accountCurrency: firstRowCols[5] || accountDetails.accountCurrency,
                };
                setAccountDetails(newAccountDetails);
                
                const accountNames = chartOfAccountsData.map(acc => acc.name);

                const transactionPromises = lines.map(async (line, index) => {
                    const columns = line.split(',').map(c => c.trim());
                    const amount = parseFloat(columns[10]);
                    const debit = amount < 0 ? Math.abs(amount) : 0;
                    const credit = amount >= 0 ? amount : 0;
                    const description = columns[9];
                    
                    const dateStr = columns[7];
                    let formattedDate = dateStr;
                    try {
                        const dateObj = new Date(dateStr.split(' ')[0].split('/').reverse().join('-'));
                        if (!isNaN(dateObj.getTime())) {
                            formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
                        }
                    } catch(e) {
                        // Keep original date if parsing fails
                    }
                    
                    let suggestedCategory = columns[6]; // Default to original type
                    try {
                        const result = await categorizeTransaction({ description, accounts: accountNames });
                        suggestedCategory = result.category;
                    } catch (aiError) {
                        console.error("AI categorization failed for:", description, aiError);
                    }


                    return {
                        id: `imported-txn-${Date.now()}-${index}`,
                        date: formattedDate,
                        transactionType: suggestedCategory,
                        refNumber: columns[8],
                        description: description,
                        debit: debit,
                        credit: credit,
                        balance: parseFloat(columns[11]),
                        isAiCategorized: suggestedCategory !== columns[6],
                    };
                });
                
                const newTransactions = (await Promise.all(transactionPromises)).filter(t => !isNaN(t.balance));

                setTransactions(newTransactions.reverse()); // Reverse to show latest first

                toast({
                    title: "Import Successful",
                    description: `${newTransactions.length} transaction(s) have been imported and categorized.`,
                });

            } catch (error) {
                toast({
                    title: "Import Failed",
                    description: error instanceof Error ? error.message : "Could not parse the CSV file.",
                    variant: "destructive",
                });
            } finally {
                setIsCategorizing(false);
                if(fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        };
        reader.readAsText(file);
    };


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
                                <p className="font-medium">{accountDetails.accountName}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Account Number</p>
                                <p className="font-medium">{accountDetails.accountNumber}</p>
                            </div>
                             <div className="space-y-1">
                                <p className="text-muted-foreground">Account Type</p>
                                <p className="font-medium">{accountDetails.accountType}</p>
                            </div>
                             <div className="space-y-1">
                                <p className="text-muted-foreground">Card Number</p>
                                <p className="font-medium">{accountDetails.cardNumber}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                                <p className="text-muted-foreground">Account IBAN</p>
                                <p className="font-medium">{accountDetails.accountIban}</p>
                            </div>
                             <div className="space-y-1">
                                <p className="text-muted-foreground">Account Currency</p>
                                <p className="font-medium">{accountDetails.accountCurrency}</p>
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
                            <Button variant="outline" onClick={handleFileImportClick} disabled={isCategorizing}>
                               {isCategorizing ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2" />}
                               {isCategorizing ? 'Categorizing...' : 'Import from CSV'}
                            </Button>
                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".csv" />
                            <Button><FilePlus className="mr-2" /> Add Transaction</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Suggested Category</TableHead>
                                    <TableHead>Ref. Number</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Debit</TableHead>
                                    <TableHead className="text-right">Credit</TableHead>
                                    <TableHead className="text-right">Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>
                                            {item.isAiCategorized ? (
                                                 <Badge variant="outline" className="bg-accent/50 border-accent text-accent-foreground">
                                                    <Sparkles className="mr-2 h-3 w-3" />
                                                    {item.transactionType}
                                                 </Badge>
                                            ) : (
                                                item.transactionType
                                            )}
                                        </TableCell>
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
