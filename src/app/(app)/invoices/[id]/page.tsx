
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useReactToPrint } from 'react-to-print';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Printer, AlertTriangle, FileDown, Loader2 } from 'lucide-react';
import QRCode from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const aedSymbol = <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UAE_Dirham_Symbol.svg/1377px-UAE_Dirham_Symbol.svg.png" alt="AED" width={14} height={14} className="inline-block" />;

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
        <div ref={ref} className="bg-white text-black p-10 font-sans printable-content">
            <header className="flex justify-between items-start mb-10">
                <div className="flex items-start gap-4">
                    <Image src={invoice.logo} alt="Saeed Store Logo" width={80} height={80} className="object-contain" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Saeed Store Electronics</h2>
                        <p className="text-sm text-gray-600">Dubai, United Arab Emirates</p>
                        <p className="text-sm text-gray-600">Website: S3eed.ae</p>
                        <p className="text-sm text-gray-600">Email: info@s3eed.ae</p>
                        <p className="text-sm text-gray-600">WhatsApp: +971553813831</p>
                    </div>
                </div>
                <div className="text-right">
                    <h1 className="text-4xl font-extrabold uppercase text-gray-800 tracking-wider">Invoice</h1>
                    <p className="text-sm text-gray-500 mt-1">Invoice #: {invoice.invoiceNumber}</p>
                </div>
            </header>
            
             <section className="grid grid-cols-3 gap-6 mb-10 border-t border-b border-gray-200 py-4">
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
                    <p className="font-medium text-gray-800">{invoice.billTo}</p>
                </div>
                 <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ship To</h3>
                    <p className="font-medium text-gray-800">{invoice.shipTo}</p>
                </div>
                <div className="text-right">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Invoice Date</h3>
                    <p className="font-medium text-gray-800">{invoice.invoiceDate}</p>
                </div>
             </section>
             
             <section className="mb-10">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Instructions</h3>
                <p className="text-sm text-gray-700">{invoice.instructions}</p>
             </section>

             <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-gray-200 hover:bg-gray-50">
                    <TableHead className="w-[50%] text-gray-600 font-semibold">DESCRIPTION</TableHead>
                    <TableHead className="text-right text-gray-600 font-semibold">QTY</TableHead>
                    <TableHead className="text-right text-gray-600 font-semibold">UNIT PRICE</TableHead>
                    <TableHead className="text-right text-gray-600 font-semibold">TOTAL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.lineItems.map((item: any, index: number) => (
                    <TableRow key={index} className="border-gray-200">
                      <TableCell className="font-medium py-3">{item.description}</TableCell>
                      <TableCell className="text-right py-3">{item.quantity}</TableCell>
                      <TableCell className="text-right py-3 flex items-center justify-end gap-1">{aedSymbol} {currencyFormatter(item.unitPrice)}</TableCell>
                      <TableCell className="text-right py-3 font-medium flex items-center justify-end gap-1">{aedSymbol} {currencyFormatter(item.quantity * item.unitPrice)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            <div className="flex justify-end mt-10">
                <div className="w-full max-w-sm space-y-3 text-sm">
                    <div className="flex justify-between items-center"><span className="text-gray-600">Subtotal</span><span className="font-medium flex items-center gap-1">{aedSymbol} {currencyFormatter(invoice.subtotal)}</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-600">VAT (5%)</span><span className="font-medium flex items-center gap-1">{aedSymbol} {currencyFormatter(invoice.vat)}</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-600">Shipping & Handling</span><span className="font-medium flex items-center gap-1">{aedSymbol} {currencyFormatter(invoice.shipping)}</span></div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200"><span className="text-gray-600">Collect on Delivery Fees</span><span className="font-medium flex items-center gap-1">{aedSymbol} {currencyFormatter(invoice.codFees)}</span></div>
                    <div className="flex justify-between items-center pt-2"><span className="font-bold text-base text-gray-800">Total Due</span><span className="font-bold text-base text-gray-800 flex items-center gap-1">{aedSymbol} {currencyFormatter(invoice.total)}</span></div>
                </div>
            </div>
             <div className="flex justify-between items-end mt-16">
                <div className="text-center">
                    <p className="font-semibold text-lg">Thank You!</p>
                    <p className="text-xs text-gray-500">We appreciate your business.</p>
                </div>
                <div className="p-2 border rounded-md">
                     <QRCode value={getQrCodeValue()} size={64} level="H" />
                  </div>
             </div>

        </div>
    );
});
PrintableInvoice.displayName = 'PrintableInvoice';


export default function ViewInvoicePage() {
    const params = useParams();
    const id = params.id as string;
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
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
    
    const handleSaveAsPdf = () => {
        const input = printRef.current;
        if (!input) return;

        setIsGeneratingPdf(true);
        html2canvas(input, {
            scale: 4, // Increased scale for better quality
            useCORS: true, 
            logging: false, // Suppress logging for cleaner console
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            
            // Maintain aspect ratio
            const ratio = canvasWidth / canvasHeight;
            let newCanvasWidth = pdfWidth;
            let newCanvasHeight = newCanvasWidth / ratio;
            
            // If the calculated height is greater than the page height, scale down
            if (newCanvasHeight > pdfHeight) {
                newCanvasHeight = pdfHeight;
                newCanvasWidth = newCanvasHeight * ratio;
            }

            const x = (pdfWidth - newCanvasWidth) / 2;
            const y = (pdfHeight - newCanvasHeight) / 2;
            
            pdf.addImage(imgData, 'PNG', x, y, newCanvasWidth, newCanvasHeight);
            pdf.save(`Invoice-${invoice?.invoiceNumber}.pdf`);
            setIsGeneratingPdf(false);
        }).catch(err => {
            console.error("Failed to generate PDF", err);
            setIsGeneratingPdf(false);
        });
    };

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
      <main className="flex-1 p-4 md:p-6 bg-muted/30">
        <div className="flex justify-end gap-2 mb-4">
             <Button asChild variant="outline">
                <Link href="/invoices">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                </Link>
            </Button>
            <Button onClick={handleSaveAsPdf} disabled={isGeneratingPdf}>
                {isGeneratingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                {isGeneratingPdf ? 'Saving...' : 'Save as PDF'}
            </Button>
            <Button onClick={handlePrint} variant="outline">
                <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
        </div>
        <Card className="shadow-lg max-w-4xl mx-auto">
            <CardContent className="p-0">
               <PrintableInvoice invoice={invoice} ref={printRef} />
            </CardContent>
        </Card>
      </main>
    </>
  );
}
