
"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { inventoryItemsPool, type LabelSize, labelSizes } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Printer, AlertTriangle, RefreshCw, CheckCircle, XCircle, Settings } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import QRCode from 'qrcode.react';
import Barcode from 'react-barcode';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PrintSettingsDialog } from '@/components/inventory/PrintSettingsDialog';


// QZ Tray integration
import qz from 'qz-tray';

type PrintType = "both" | "barcode" | "qrcode";

export interface PrintSettings {
    printer: string;
    labelSize: LabelSize;
    offsetX: number;
    offsetY: number;
}


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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    printer: '',
    labelSize: labelSizes[0],
    offsetX: 0,
    offsetY: 0,
  });


  useEffect(() => {
      if(item) {
          setCodeValue(item.sku);
      }
      // Load settings from localStorage
      const savedSettings = localStorage.getItem('saeedErpPrintSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        // Ensure the labelSize object is the one from our defined list
        const matchingLabelSize = labelSizes.find(s => s.name === parsed.labelSize?.name) || labelSizes[0];
        setPrintSettings({ ...parsed, labelSize: matchingLabelSize });
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
      if (printerList.length > 0 && !printSettings.printer) {
        handleSettingsChange({ printer: printerList[0] });
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

  const handleSettingsChange = (newSettings: Partial<PrintSettings>) => {
    setPrintSettings(prev => {
        const updated = {...prev, ...newSettings};
        localStorage.setItem('saeedErpPrintSettings', JSON.stringify(updated));
        return updated;
    });
  };

  const printWithQz = async () => {
    if (!printSettings.printer) {
        toast({ title: "No Printer Selected", description: "Please select a printer in Settings.", variant: "destructive"});
        return;
    }
     if (!item) {
        toast({ title: "Item not found", description: "Cannot print without item data.", variant: "destructive"});
        return;
    }

    try {
        const config = qz.configs.create(printSettings.printer);
        const { widthDots, heightDots } = printSettings.labelSize;
        const { offsetX, offsetY } = printSettings;


        let zplData = [
            '^XA', // Start
            `^LL${heightDots}`, // Label Length (height)
            `^PW${widthDots}`, // Label Width
            `^LH${offsetX},${offsetY}`, // Label Home (X,Y offsets)
            '^CI28', // UTF-8 Character Set
            
            // Item Name (centered) - Fit up to ~25 chars
            `^FO0,15,^FB${widthDots},1,0,C,0^A0N,22,22^FD${item.itemName.substring(0, 25)}^FS`,
        ];

        if (printType === 'barcode') {
            zplData.push(`^FO0,50,^FB${widthDots},1,0,C,0^BY2,2,45^BCN,45,N,N,N,A^FD${codeValue}^FS`);
            zplData.push(`^FO0,105,^FB${widthDots},1,0,C,0^A0N,18,18^FD${codeValue}^FS`);
        } else if (printType === 'qrcode') {
             zplData.push(`^FO0,50,^FB${widthDots},1,0,C,0^BQN,2,5^FDQA,${codeValue}^FS`);
        } else { // 'both'
             // Barcode (left)
            zplData.push(`^FO20,50^BY2,2,45^BCN,45,N,N,N,A^FD${codeValue}^FS`);
            // SKU text (below barcode)
            zplData.push(`^FO20,105,^FB180,1,0,C,0^A0N,18,18^FD${codeValue}^FS`);
            // QR Code (right)
            zplData.push(`^FO${widthDots - 120},50^BQN,2,4^FDQA,${codeValue}^FS`);
        }
        
        zplData.push('^XZ'); // End
        
        const dataToSend = zplData.join('\n');
        
        // Data must be an array of print jobs
        await qz.print(config, [
          { type: 'raw', format: 'zpl', data: dataToSend }
        ]);

        toast({ title: "Print Successful", description: `Label sent to printer: ${printSettings.printer}`});
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

                <div className="w-full p-4 border rounded-md bg-muted/50">
                <h3 className="text-center font-semibold mb-4">Preview</h3>
                 <LabelContent item={item} codeValue={codeValue} printType={printType} />
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
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-lg">Direct Label Printing (QZ Tray)</CardTitle>
                                    <CardDescription>
                                        Connect to QZ Tray to print directly to a label printer.
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="icon" onClick={() => setIsSettingsOpen(true)} disabled={!qzConnected}>
                                    <Settings className="h-4 w-4" />
                                    <span className="sr-only">Print Settings</span>
                                </Button>
                            </div>
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
                                <div className="text-sm text-muted-foreground p-3 bg-accent/30 rounded-md">
                                    <p><b>Selected Printer:</b> {printSettings.printer || 'None'}</p>
                                    <p><b>Label Size:</b> {printSettings.labelSize.name}</p>
                                    <p><b>Offsets:</b> X: {printSettings.offsetX}, Y: {printSettings.offsetY}</p>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button onClick={printWithQz} disabled={!qzConnected || !printSettings.printer || !codeValue}>
                                <Printer className="mr-2 h-4 w-4" /> Print with QZ Tray
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

        <PrintSettingsDialog
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            printers={printers}
            settings={printSettings}
            onSettingsChange={handleSettingsChange}
        />
      </main>
    </>
  );
}
