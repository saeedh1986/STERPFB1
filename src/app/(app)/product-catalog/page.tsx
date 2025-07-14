
"use client";

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { getMockData, getColumns, getPageTitle, inventoryItemsPool, productCatalogPool } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from 'lucide-react';

export default function ProductCatalogPage() {
  const pageTitle = "Product Catalog";
  const columns = getColumns('product-catalog');
  const [catalogData, setCatalogData] = useState(productCatalogPool);
  const { toast } = useToast();

  const inventorySkuSet = useMemo(() => new Set(inventoryItemsPool.map(item => item.sku)), []);

  const handleAddToInventory = (productToAdd: any) => {
    // Check if the product is already in inventory
    if (inventoryItemsPool.find(item => item.sku === productToAdd.sku)) {
      toast({
        title: "Already in Inventory",
        description: `"${productToAdd.itemName}" is already in your inventory.`,
        variant: "default",
      });
      return;
    }

    // Add to inventory (in-memory)
    const newInventoryItem = {
      ...productToAdd,
      id: `item-${inventoryItemsPool.length + 1}`,
      quantity: 0, // Start with 0 quantity
    };
    inventoryItemsPool.push(newInventoryItem);

    toast({
      title: "Product Added",
      description: `"${productToAdd.itemName}" has been added to your inventory.`,
    });

    // We can't dynamically update the other page's state, but we can reflect the change here
    // In a real app, this would trigger a re-fetch or state update.
    // For now, we just update the button state.
    // To see the result, navigate to the Inventory page.
    setCatalogData([...catalogData]); // Force re-render to update button state
  };

  return (
    <>
      <PageHeader title={pageTitle} />
      <main className="flex-1 p-4 md:p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-md border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column.accessorKey} className="font-semibold">{column.header}</TableHead>
                    ))}
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catalogData.length > 0 ? (
                    catalogData.map((item) => (
                      <TableRow key={item.id}>
                        {columns.map((column) => (
                          <TableCell key={column.accessorKey}>
                            {column.cell ? column.cell({ row: { getValue: (key: string) => item[key] } }) : item[column.accessorKey]}
                          </TableCell>
                        ))}
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handleAddToInventory(item)}
                            disabled={inventorySkuSet.has(item.sku)}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {inventorySkuSet.has(item.sku) ? 'In Inventory' : 'Add to Inventory'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                        No products found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
