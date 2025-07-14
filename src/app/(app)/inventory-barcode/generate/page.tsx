
"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type PrintType = "both" | "barcode" | "qrcode";

// Component for a single label in the printable sheet
const LabelContent: React.FC<{ item: any, codeValue: string, printType: PrintType }> = ({ item, codeValue, printType }) => (
    <div className="p-2 border border-dashed border-gray-400 rounded-lg bg-white text-black break-inside-avoid">
        <h3 className="text-center font-bold text-base mb-1 truncate">{item.itemName}</h3>
        <p className="text-center text-xs mb-2">{codeValue}</p>
        <div className="flex justify-center items-center gap-4">
            {(printType === 'both' || printType === 'barcode') && (
                <div className="text-center">
                    <p className="font-semibold text-xs mb-1">Barcode</p>
                    <Barcode value={codeValue} width={1.2} height={40} fontSize={10} margin={2} />
                </div>
            )}
            {(printType === 'both' || printType === 'qrcode') && (
                <div className="text-center">
                    <p className="font-semibold text-xs mb-1">QR Code</p>
                    <QRCode value={codeValue} size={64} level="H" />
                </div>
            )}
        </div>
    </div>
);


// Component to be printed, which now handles multiple labels
const PrintableSheet = React.forwardRef<HTMLDivElement, { item: any; codeValue: string; printCount: number; printType: PrintType }>(({ item, codeValue, printCount, printType }, ref) => {
    return (
        <div ref={ref}>
            <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: printCount }).map((_, i) => (
                    <LabelContent key={i} item={item} codeValue={codeValue} printType={printType} />
                ))}
            </div>
        </div>
    );
});
PrintableSheet.displayName = 'PrintableSheet';


export default function GenerateBarcodePage() {
  const searchParams = useSearchParams();
  const sku = searchParams.get('sku');
  const printableRef = useRef<HTMLDivElement>(null);
  
  const item = useMemo(() => {
    return inventoryItemsPool.find(p => p.sku === sku);
  }, [sku]);
  
  const [codeValue, setCodeValue] = useState(item?.sku || '');
  const [printCount, setPrintCount] = useState(1);
  const [printType, setPrintType] = useState<PrintType>("both");

  useEffect(() => {
      if(item) {
          setCodeValue(item.sku);
      }
  }, [item]);


  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
    documentTitle: `${item?.sku || 'label'}-barcode-qr`,
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
              Customize the value, print type, and quantity, then print the label for your inventory.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                <div className="space-y-2">
                    <Label htmlFor="code-value">Barcode/QR Code Value</Label>
                    <Input 
                        id="code-value"
                        value={codeValue}
                        onChange={(e) => setCodeValue(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="print-count">Number of Labels to Print</Label>
                    <Input 
                        id="print-count"
                        type="number"
                        value={printCount}
                        onChange={(e) => setPrintCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        min="1"
                    />
                </div>
                <div className="space-y-3 md:col-span-2">
                     <Label>Print Type</Label>
                     <RadioGroup 
                        value={printType} 
                        onValueChange={(value: PrintType) => setPrintType(value)}
                        className="flex items-center space-x-4"
                     >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="both" id="r-both" />
                            <Label htmlFor="r-both">Both</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <RadioGroupItem value="barcode" id="r-barcode" />
                            <Label htmlFor="r-barcode">Barcode Only</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <RadioGroupItem value="qrcode" id="r-qrcode" />
                            <Label htmlFor="r-qrcode">QR Code Only</Label>
                        </div>
                     </RadioGroup>
                </div>
            </div>

            <div className="w-full max-w-lg p-4 border rounded-md bg-muted/50">
               <h3 className="text-center font-semibold mb-4">Preview (Both Codes Shown)</h3>
               <div className="p-4 border border-dashed border-gray-400 rounded-lg bg-white text-black">
                    <h3 className="text-center font-bold text-lg mb-2">{item.itemName}</h3>
                    <p className="text-center text-sm mb-4">{codeValue}</p>
                    <div className="flex justify-center items-center gap-4">
                        <div className="text-center">
                            <p className="font-semibold mb-1">Barcode</p>
                            <Barcode value={codeValue} width={1.5} height={50} fontSize={12} />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold mb-1">QR Code</p>
                            <QRCode value={codeValue} size={100} level="H" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-4">
                <Button asChild variant="outline">
                    <Link href="/inventory-barcode">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Link>
                </Button>
                <Button onClick={handlePrint} disabled={!codeValue || printCount < 1}>
                    <Printer className="mr-2 h-4 w-4" /> Print Labels
                </Button>
            </div>
          </CardContent>
        </Card>

        {/* Hidden component for printing */}
        <div className="absolute -left-[9999px] -top-[9999px]">
            <PrintableSheet 
                ref={printableRef} 
                item={item} 
                codeValue={codeValue}
                printCount={printCount}
                printType={printType}
             />
        </div>
      </main>
    </>
  );
}
