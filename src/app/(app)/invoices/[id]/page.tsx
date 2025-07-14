
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useReactToPrint } from 'react-to-print';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Printer, AlertTriangle } from 'lucide-react';
import QRCode from 'qrcode.react';

const aedSymbol = <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UAE_Dirham_Symbol.svg/1377px-UAE_Dirham_Symbol.svg.png" alt="AED" width={16} height={16} className="inline-block" />;

const currencyFormatter = (value: number) => {
    if (isNaN(value)) return '0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};


const PrintableInvoice = React.forwardRef<HTMLDivElement, { invoice: any }>(({ invoice }, ref) => {
    if (!invoice) return null;

     const getQrCodeValue = () => {
        return `Invoice No: ${invoice.invoiceNumber}\nDate: ${invoice.invoiceDate}\nTotal: AED ${currencyFormatter(invoice.total)}`;
    };

    return (
        <div ref={ref} className="bg-white text-black p-8">
            <header className="flex justify-between items-start gap-4">
               <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-2">
                    <Image src={invoice.logo} alt="Saeed Store Logo" width={100} height={100} className="object-contain" />
                </div>
                 <div>
                    <h2 className="text-2xl font-bold">Saeed Store Electronics</h2>
                    <p>Dubai, United Arab Emirates</p>
                    <p>Website: S3eed.ae</p>
                    <p>Email: info@s3eed.ae</p>
                    <p>WhatsApp: +971553813831</p>
                </div>
              </div>

              <div className="text-right">
                <h1 className="text-4xl font-bold uppercase">Invoice</h1>
                <div className="flex justify-end items-center gap-4 mt-2">
                  <div className="p-2 border rounded-md">
                     <QRCode value={getQrCodeValue()} size={80} level="H" />
                  </div>
                </div>
              </div>
            </header>
            
             <div className="bg-gray-800 text-white p-4 flex justify-between rounded-md my-8">
                <div><span className="font-bold text-lg">INVOICE NO. </span><span className="font-mono">{invoice.invoiceNumber}</span></div>
                <div><span className="font-bold text-lg">DATE </span><span>{invoice.invoiceDate}</span></div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div><p className="font-bold">BILL TO</p><p>{invoice.billTo}</p></div>
              <div><p className="font-bold">SHIP TO</p><p>{invoice.shipTo}</p></div>
              <div><p className="font-bold">INSTRUCTIONS</p><p>{invoice.instructions}</p></div>
            </div>

             <Table>
                <TableHeader className="bg-gray-800">
                  <TableRow>
                    <TableHead className="text-white w-[45%]">DESCRIPTION</TableHead>
                    <TableHead className="text-white text-right">QUANTITY</TableHead>
                    <TableHead className="text-white text-right">UNIT PRICE</TableHead>
                    <TableHead className="text-white text-right">TOTAL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.lineItems.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-1">{aedSymbol} {currencyFormatter(item.unitPrice)}</TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-1">{aedSymbol} {currencyFormatter(item.quantity * item.unitPrice)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            <div className="flex justify-end mt-8">
                <div className="w-full max-w-sm space-y-2">
                    <div className="flex justify-between items-center"><span className="text-gray-600">SUBTOTAL</span><span className="font-medium flex items-center gap-1">{aedSymbol} {currencyFormatter(invoice.subtotal)}</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-600">VAT</span><span className="font-medium flex items-center gap-1">{aedSymbol} {currencyFormatter(invoice.vat)}</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-600">SHIPPING & HANDLING</span><span className="font-medium flex items-center gap-1">{aedSymbol} {currencyFormatter(invoice.shipping)}</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-600">COLLECT ON DELIVERY FEES</span><span className="font-medium flex items-center gap-1">{aedSymbol} {currencyFormatter(invoice.codFees)}</span></div>
                    <div className="flex justify-between items-center border-t-2 border-black pt-2 mt-2"><span className="font-bold text-lg">TOTAL</span><span className="font-bold text-lg flex items-center gap-1">{aedSymbol} {currencyFormatter(invoice.total)}</span></div>
                </div>
            </div>

            <footer className="text-center text-gray-500 pt-16">
                <p>Thank You</p>
            </footer>

        </div>
    );
});
PrintableInvoice.displayName = 'PrintableInvoice';


export default function ViewInvoicePage() {
    const params = useParams();
    const id = params.id as string;
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (id) {
            const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
            const foundInvoice = savedInvoices.find((inv: any) => inv.invoiceNumber === id);
            setInvoice(foundInvoice);
        }
        setLoading(false);
    }, [id]);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `Invoice-${invoice?.invoiceNumber}`,
    });

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Loading invoice...</p>
            </div>
        );
    }
    
    if (!invoice) {
        return (
             <>
                <PageHeader title="Error" />
                <main className="flex-1 p-4 md:p-6">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Invoice Not Found</AlertTitle>
                    <AlertDescription>
                    The invoice with number `{id}` could not be found. It may have been deleted.
                    </AlertDescription>
                </Alert>
                <Button asChild variant="outline" className="mt-4">
                    <Link href="/invoices">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices List
                    </Link>
                </Button>
                </main>
            </>
        )
    }

  return (
    <>
      <PageHeader title={`Invoice ${invoice.invoiceNumber}`} />
      <main className="flex-1 p-4 md:p-6">
        <div className="flex justify-end gap-2 mb-4">
             <Button asChild variant="outline">
                <Link href="/invoices">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                </Link>
            </Button>
            <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print / Save as PDF
            </Button>
        </div>
        <Card className="shadow-lg">
            <CardContent className="p-0">
               {/* This is the visible component */}
               <PrintableInvoice invoice={invoice} />
            </CardContent>
        </Card>

        {/* This is the hidden component that will be used for printing */}
        <div className="absolute -left-[9999px] -top-[9999px]">
            <PrintableInvoice invoice={invoice} ref={printRef} />
        </div>

      </main>
    </>
  );
}
