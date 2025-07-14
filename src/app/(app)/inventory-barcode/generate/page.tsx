
"use client";

import React, { useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { inventoryItemsPool } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Printer, AlertTriangle } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import QRCode from 'qrcode.react';
import Barcode from 'react-barcode';

// Component to be printed
const PrintableLabel = React.forwardRef<HTMLDivElement, { item: any }>(({ item }, ref) => {
    return (
        <div ref={ref} className="p-4 border border-dashed border-gray-400 rounded-lg">
            <h3 className="text-center font-bold text-lg mb-2">{item.itemName}</h3>
            <p className="text-center text-sm mb-4">{item.sku}</p>
            <div className="flex justify-center items-center gap-4">
                 <div className="text-center">
                    <p className="font-semibold mb-1">Barcode (Code 128)</p>
                    <Barcode value={item.sku} width={1.5} height={50} fontSize={12} />
                </div>
                <div className="text-center">
                    <p className="font-semibold mb-1">QR Code</p>
                    <QRCode value={item.sku} size={100} level="H" />
                </div>
            </div>
        </div>
    );
});
PrintableLabel.displayName = 'PrintableLabel';

export default function GenerateBarcodePage() {
  const searchParams = useSearchParams();
  const sku = searchParams.get('sku');
  const printableRef = useRef<HTMLDivElement>(null);

  const item = useMemo(() => {
    return inventoryItemsPool.find(p => p.sku === sku);
  }, [sku]);

  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
    documentTitle: `${item?.sku || 'label'}-barcode-qr`,
    onAfterPrint: () => alert('Print job sent!'),
  });

  if (!item) {
    return (
      <>
        <PageHeader title="Error" />
        <main className="flex-1 p-4 md:p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Product Not Found</AlertTitle>
            <AlertDescription>
              The product with SKU `{sku}` could not be found. Please go back and select a valid product.
            </AlertDescription>
          </Alert>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/inventory-barcode">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Generator
            </Link>
          </Button>
        </main>
      </>
    );
  }

  return (
    <>
      <PageHeader title={`Generate Code for ${item.itemName}`} />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Generated Codes for {item.itemName}</CardTitle>
            <CardDescription>
              Here are the generated barcode and QR code for SKU: <strong>{item.sku}</strong>. You can print this label for your inventory.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6">
            <div className="w-full max-w-lg">
               <PrintableLabel item={item} ref={printableRef} />
            </div>
            
            <div className="flex gap-4">
                <Button asChild variant="outline">
                    <Link href="/inventory-barcode">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Link>
                </Button>
                <Button onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" /> Print Label
                </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
