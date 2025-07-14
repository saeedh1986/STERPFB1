
"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { inventoryItemsPool } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Printer, AlertTriangle, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import QRCode from 'qrcode.react';
import Barcode from 'react-barcode';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// QZ Tray integration
import qz from 'qz-tray';

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
  const { toast } = useToast();
  
  const item = useMemo(() => {
    return inventoryItemsPool.find(p => p.sku === sku);
  }, [sku]);
  
  const [codeValue, setCodeValue] = useState(item?.sku || '');
  const [printCount, setPrintCount] = useState(1);
  const [printType, setPrintType] = useState<PrintType>("both");

  // QZ Tray State
  const [qzConnected, setQzConnected] = useState(false);
  const [qzLoading, setQzLoading] = useState(false);
  const [printers, setPrinters] = useState<string[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string>('');

  useEffect(() => {
      if(item) {
          setCodeValue(item.sku);
      }
  }, [item]);
  
  const connectToQz = async () => {
    setQzLoading(true);
    try {
      await qz.websocket.connect();
      setQzConnected(true);
      toast({ title: "QZ Tray Connected", description: "Successfully connected to the QZ Tray service." });
      const printerList = await qz.printers.find();
      setPrinters(printerList);
      if (printerList.length > 0) {
        setSelectedPrinter(printerList[0]);
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "QZ Tray Connection Failed",
        description: err.message || "Please ensure QZ Tray is installed and running.",
        variant: "destructive",
      });
      setQzConnected(false);
    } finally {
      setQzLoading(false);
    }
  };

  const printWithQz = async () => {
    if (!selectedPrinter) {
        toast({ title: "No Printer Selected", description: "Please select a printer first.", variant: "destructive"});
        return;
    }
     if (!item) {
        toast({ title: "Item not found", description: "Cannot print without item data.", variant: "destructive"});
        return;
    }

    try {
        const config = qz.configs.create(selectedPrinter);
        
        // Assuming 8 dots/mm (203 dpi)
        const labelWidthDots = 40 * 8; // 320
        const labelHeightDots = 25 * 8; // 200

        // Generate ZPL commands for a 40mm x 25mm label
        const zplData = [
            '^XA', // Start
            `^LL${labelHeightDots}`, // Label Length (height)
            `^PW${labelWidthDots}`, // Label Width
            '^CI28', // UTF-8 Character Set
            
            // Item Name (centered) - Fit up to ~25 chars
            `^FO0,15,^FB${labelWidthDots},1,0,C,0^A0N,22,22^FD${item.itemName.substring(0, 25)}^FS`,
            
            // Barcode (centered, below item name)
            `^FO20,50^BY2,2,45^BCN,45,N,N,N,A^FD${codeValue}^FS`,
            
            // SKU text (below barcode)
            `^FO0,105,^FB${labelWidthDots},1,0,C,0^A0N,18,18^FD${codeValue}^FS`,
            
            // QR Code (right aligned)
            `^FO${labelWidthDots - 100},125^BQN,2,4^FDQA,${codeValue}^FS`,
            
            '^XZ' // End
        ];
        
        await qz.print(config, zplData);
        toast({ title: "Print Successful", description: `Label sent to printer: ${selectedPrinter}`});
    } catch (err: any) {
        console.error(err);
        toast({ title: "Print Failed", description: err.message, variant: "destructive"});
    }
  };


  const handleBrowserPrint = useReactToPrint({
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Label Customization</CardTitle>
                <CardDescription>
                Customize the value, print type, and quantity for your label.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="space-y-2">
                        <Label htmlFor="code-value">Barcode/QR Code Value</Label>
                        <Input 
                            id="code-value"
                            value={codeValue}
                            onChange={(e) => setCodeValue(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="print-count">Number of Labels (for browser print)</Label>
                        <Input 
                            id="print-count"
                            type="number"
                            value={printCount}
                            onChange={(e) => setPrintCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                            min="1"
                        />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                        <Label>Print Type (for browser print)</Label>
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

                <div className="w-full p-4 border rounded-md bg-muted/50">
                <h3 className="text-center font-semibold mb-4">Preview</h3>
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
            </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Printing Options</CardTitle>
                    <CardDescription>
                        Choose your preferred printing method. For direct label printing, use QZ Tray.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Direct Label Printing (QZ Tray)</CardTitle>
                            <CardDescription>
                                Connect to QZ Tray to print directly to a label printer (e.g., Zebra). Requires QZ Tray software to be running on your computer.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Button onClick={connectToQz} disabled={qzLoading || qzConnected}>
                                    {qzLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {qzConnected ? 'Connected' : 'Connect to QZ Tray'}
                                </Button>
                                <div className="flex items-center gap-2 text-sm">
                                    {qzConnected ? <CheckCircle className="h-5 w-5 text-green-500"/> : <XCircle className="h-5 w-5 text-red-500" />}
                                    <span className={qzConnected ? 'text-green-600' : 'text-red-600'}>
                                        {qzConnected ? 'Connected' : 'Not Connected'}
                                    </span>
                                </div>
                            </div>
                            {qzConnected && (
                                <div className="space-y-2">
                                <Label>Select Printer</Label>
                                <Select value={selectedPrinter} onValueChange={setSelectedPrinter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a printer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {printers.map(p => (
                                            <SelectItem key={p} value={p}>{p}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button onClick={printWithQz} disabled={!qzConnected || !selectedPrinter || !codeValue}>
                                <Printer className="mr-2 h-4 w-4" /> Print with QZ Tray (40mm x 25mm)
                            </Button>
                        </CardFooter>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Standard Browser Print</CardTitle>
                             <CardDescription>
                                Generates a printable sheet for standard A4/Letter printers.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                             <Button onClick={handleBrowserPrint} disabled={!codeValue || printCount < 1} variant="outline">
                                <Printer className="mr-2 h-4 w-4" /> Print with Browser
                            </Button>
                        </CardFooter>
                    </Card>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                    <Button asChild variant="link" className="p-0 h-auto">
                        <Link href="/inventory-barcode">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Product Selection
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>


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

    