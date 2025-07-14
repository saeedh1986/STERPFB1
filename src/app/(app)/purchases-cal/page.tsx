
"use client";

import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { purchasesCalSummaryData, purchasesCalDetailsData } from '@/lib/data';

const currencyFormatter = (value: number, fractionDigits = 3) => {
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(value);
};

const PurchasesCalPage = () => {
    return (
        <>
            <PageHeader title="Purchases Calculator" />
            <main className="flex-1 p-4 md:p-6 space-y-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center text-blue-800">Purchases Cal.</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader className="bg-blue-600">
                                <TableRow>
                                    <TableHead className="text-white">Date</TableHead>
                                    <TableHead className="text-white">Invoice No.</TableHead>
                                    <TableHead className="text-white text-right">Price USD</TableHead>
                                    <TableHead className="text-white text-right">Price AED</TableHead>
                                    <TableHead className="text-white text-right">QTY</TableHead>
                                    <TableHead className="text-white text-right">Shipping</TableHead>
                                    <TableHead className="text-white text-right">Bank Charges</TableHead>
                                    <TableHead className="text-white text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchasesCalSummaryData.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.invoiceNo}</TableCell>
                                        <TableCell className="text-right font-medium">{currencyFormatter(item.priceUsd, 0)}</TableCell>
                                        <TableCell className="text-right font-medium">{currencyFormatter(item.priceAed, 3)}</TableCell>
                                        <TableCell className="text-right font-medium">{item.qty}</TableCell>
                                        <TableCell className="text-right font-medium">{currencyFormatter(item.shipping, 0)}</TableCell>
                                        <TableCell className="text-right font-medium">{currencyFormatter(item.bankCharges, 1)}</TableCell>
                                        <TableCell className="text-right font-medium">{currencyFormatter(item.total, 3)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center text-orange-600">Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader className="bg-orange-500">
                                <TableRow>
                                    <TableHead className="text-white">Date</TableHead>
                                    <TableHead className="text-white">SKU</TableHead>
                                    <TableHead className="text-white text-right">Price USD</TableHead>
                                    <TableHead className="text-white text-right">Price AED</TableHead>
                                    <TableHead className="text-white text-right">QTY</TableHead>
                                    <TableHead className="text-white text-right">Price + QTY</TableHead>
                                    <TableHead className="text-white text-right">Shipping Fees</TableHead>
                                    <TableHead className="text-white text-right">Total Cost</TableHead>
                                    <TableHead className="text-white text-right">Unit Cost</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchasesCalDetailsData.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.sku}</TableCell>
                                        <TableCell className="text-right font-medium">{currencyFormatter(item.priceUsd, 1)}</TableCell>
                                        <TableCell className="text-right font-medium">{currencyFormatter(item.priceAed, 3)}</TableCell>
                                        <TableCell className="text-right font-medium">{item.qty}</TableCell>
                                        <TableCell className="text-right font-medium">{currencyFormatter(item.priceQty, 2)}</TableCell>
                                        <TableCell className="text-right font-medium">{currencyFormatter(item.shippingFees, 2)}</TableCell>
                                        <TableCell className="text-right font-medium">{currencyFormatter(item.totalCost, 2)}</TableCell>
                                        <TableCell className="text-right font-medium">{currencyFormatter(item.unitCost, 3)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </>
    );
};

export default PurchasesCalPage;

    