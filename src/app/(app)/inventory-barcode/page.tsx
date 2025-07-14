
"use client";

import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { inventoryItemsPool } from '@/lib/data';
import { QrCode, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function InventoryBarcodePage() {
  return (
    <>
      <PageHeader title="Inventory Barcode Generator" />
      <main className="flex-1 p-4 md:p-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Generate Barcodes & QR Codes</CardTitle>
            <CardDescription>
              Select an item below to generate a printable barcode and QR code for your inventory management system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Available Products</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventoryItemsPool.map((item) => (
                  <li key={item.id} className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{item.itemName}</p>
                        <p className="text-sm text-muted-foreground">{item.sku}</p>
                      </div>
                      <Button asChild variant="outline" size="icon">
                        <Link href={`/inventory-barcode/generate?sku=${item.sku}`}>
                           <QrCode className="h-4 w-4" />
                           <span className="sr-only">Generate Code for {item.itemName}</span>
                        </Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
