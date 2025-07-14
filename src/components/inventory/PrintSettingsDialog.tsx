
"use client";

import React from 'react';
import qz from 'qz-tray';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type LabelSize, labelSizes } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import type { PrintSettings } from '@/app/(app)/inventory-barcode/generate/page';


interface PrintSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  printers: string[];
  settings: PrintSettings;
  onSettingsChange: (newSettings: Partial<PrintSettings>) => void;
}

export function PrintSettingsDialog({ isOpen, onClose, printers, settings, onSettingsChange }: PrintSettingsDialogProps) {
  const { toast } = useToast();
  
  const handleTestPrint = async () => {
    if (!settings.printer) {
        toast({ title: "No Printer Selected", description: "Please select a printer.", variant: "destructive"});
        return;
    }
    
    try {
        const config = qz.configs.create(settings.printer);
        const { widthDots, heightDots } = settings.labelSize;
        const { offsetX, offsetY } = settings;

        // A simple ZPL command to print a border for testing alignment
        const testData = [
            '^XA',
            `^LL${heightDots}`,
            `^PW${widthDots}`,
            `^LH${offsetX},${offsetY}`,
            `^FO0,0^GB${widthDots},${heightDots},2^FS`, // Box around the label
            `^FO10,10^A0N,20,20^FDTest Print^FS`,
            `^FO10,40^A0N,15,15^FDX:${offsetX}, Y:${offsetY}^FS`,
            '^XZ'
        ];
        
        await qz.print(config, {data: testData});
        toast({ title: "Test Print Sent", description: `Test label sent to ${settings.printer}`});
    } catch (err: any) {
        console.error("Test print failed:", err);
        toast({ title: "Test Print Failed", description: err.message, variant: "destructive"});
    }
  };

  const handleQuickAlign = (alignment: 'left' | 'center' | 'right') => {
    const { widthDots } = settings.labelSize;
    let newOffsetX = 0;
    // These are example values and might need tweaking
    if (alignment === 'center') {
        newOffsetX = Math.round(widthDots / 4);
    } else if (alignment === 'right') {
        newOffsetX = Math.round(widthDots / 2);
    }
    onSettingsChange({ offsetX: newOffsetX });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Print Label Settings</DialogTitle>
          <DialogDescription>
            Adjust printer settings and label positioning for accurate printing.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Printer</Label>
            <Select 
                value={settings.printer} 
                onValueChange={(value) => onSettingsChange({ printer: value })}
            >
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
          <div className="space-y-2">
            <Label>Label Size</Label>
            <Select
                value={settings.labelSize.name}
                onValueChange={(name) => {
                    const size = labelSizes.find(s => s.name === name);
                    if (size) onSettingsChange({ labelSize: size });
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                    {labelSizes.map(s => (
                        <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Label Position</Label>
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <Label htmlFor="offset-x" className="text-xs text-muted-foreground">Offset X</Label>
                    <Input
                        id="offset-x"
                        type="number"
                        value={settings.offsetX}
                        onChange={(e) => onSettingsChange({ offsetX: parseInt(e.target.value, 10) || 0 })}
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="offset-y" className="text-xs text-muted-foreground">Offset Y</Label>
                    <Input
                        id="offset-y"
                        type="number"
                        value={settings.offsetY}
                        onChange={(e) => onSettingsChange({ offsetY: parseInt(e.target.value, 10) || 0 })}
                    />
                </div>
            </div>
             <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => handleQuickAlign('left')}>Left</Button>
                <Button variant="outline" onClick={() => handleQuickAlign('center')}>Center</Button>
                <Button variant="outline" onClick={() => handleQuickAlign('right')}>Right</Button>
            </div>
          </div>
        </div>
        <DialogFooter>
            <Button variant="secondary" onClick={handleTestPrint}>Test Print</Button>
            <Button onClick={onClose}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
