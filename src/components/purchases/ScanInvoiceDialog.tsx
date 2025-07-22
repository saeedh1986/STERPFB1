
"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { scanPurchaseInvoice } from '@/ai/flows/scan-purchase-invoice';
import { Loader2, UploadCloud } from 'lucide-react';
import { fileToDataURI } from '@/lib/utils';
import type { GenericItem } from '@/lib/data';

interface ScanInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (data: GenericItem) => void;
}

export function ScanInvoiceDialog({ isOpen, onClose, onScanComplete }: ScanInvoiceDialogProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select an invoice image to scan.",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    try {
      const invoiceImage = await fileToDataURI(selectedFile);
      const result = await scanPurchaseInvoice({ invoiceImage });
      
      // Transform the AI output to match the flat structure of the form pre-filler
      const prefillData: GenericItem = {
        purchaseDate: result.purchaseDate,
        supplier: result.supplier,
        purchaseType: result.purchaseType,
        totalCost: result.totalCost,
        shippingFees: result.shippingFee || 0,
        bankCharges: result.otherFees || 0,
      };

      if (result.lineItems && result.lineItems.length > 0) {
        // For simplicity, we'll use the first item for the main form fields
        // and a more advanced implementation could handle multiple items
        prefillData.sku = result.lineItems[0].sku;
        prefillData.itemName = result.lineItems[0].itemName;
        prefillData.quantity = result.lineItems.reduce((sum, item) => sum + item.quantity, 0);
        prefillData.unitCost = result.lineItems[0].unitCost; // This might need adjustment based on business logic
      }


      toast({
        title: "Scan Successful",
        description: "Invoice data has been extracted."
      });
      onScanComplete(prefillData);
    } catch (error) {
      console.error("Failed to scan invoice:", error);
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred during scanning.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
      setSelectedFile(null);
    }
  };
  
  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan Purchase Invoice</DialogTitle>
          <DialogDescription>
            Upload an image of your invoice. The AI will scan it and fill in the details automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="space-y-2">
                <Label htmlFor="invoice-upload">Invoice File</Label>
                <Input id="invoice-upload" type="file" accept="image/*,.pdf" onChange={handleFileChange} ref={fileInputRef} />
            </div>
            {selectedFile && (
                <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isScanning}>Cancel</Button>
          <Button onClick={handleScan} disabled={!selectedFile || isScanning}>
            {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
            {isScanning ? 'Scanning...' : 'Scan & Extract'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
