
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getMockData, type GenericItem } from '@/lib/data';
import { ArrowRightLeft } from 'lucide-react';

const transferSchema = z.object({
  sku: z.string().min(1, "Product SKU is required."),
  fromWarehouse: z.string().min(1, "Source warehouse is required."),
  toWarehouse: z.string().min(1, "Destination warehouse is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
}).refine(data => data.fromWarehouse !== data.toWarehouse, {
  message: "Source and destination warehouses cannot be the same.",
  path: ["toWarehouse"],
});

type TransferFormValues = z.infer<typeof transferSchema>;

export default function InventoryTransferPage() {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<GenericItem[]>([]);
  const [products, setProducts] = useState<GenericItem[]>([]);
  const [warehouses, setWarehouses] = useState<GenericItem[]>([]);

  useEffect(() => {
    // In a real app, you'd fetch this data. Here we get it from our mock data lib.
    const invData = getMockData('inventory');
    const prodData = getMockData('product-catalog');
    const whData = getMockData('warehouses');

    setInventory(invData);
    setProducts(prodData);
    setWarehouses(whData);
  }, []);

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      sku: '',
      fromWarehouse: '',
      toWarehouse: '',
      quantity: 1,
    },
  });

  const onSubmit = (data: TransferFormValues) => {
    const { sku, fromWarehouse, toWarehouse, quantity } = data;

    // Find source inventory item
    const sourceItemIndex = inventory.findIndex(item => item.sku === sku && item.warehouse === fromWarehouse);
    
    if (sourceItemIndex === -1) {
      toast({ title: "Error", description: "Source item not found in the selected warehouse.", variant: "destructive" });
      return;
    }

    const sourceItem = inventory[sourceItemIndex];
    if (sourceItem.quantity < quantity) {
      toast({ title: "Error", description: `Not enough stock. Available: ${sourceItem.quantity}.`, variant: "destructive" });
      return;
    }
    
    const newInventory = [...inventory];

    // Decrease stock from source
    newInventory[sourceItemIndex] = { ...sourceItem, quantity: sourceItem.quantity - quantity };
    
    // Find destination inventory item
    const destItemIndex = newInventory.findIndex(item => item.sku === sku && item.warehouse === toWarehouse);

    if (destItemIndex !== -1) {
      // Increase stock in destination if item already exists
      const destItem = newInventory[destItemIndex];
      newInventory[destItemIndex] = { ...destItem, quantity: destItem.quantity + quantity };
    } else {
      // Create new inventory entry if it doesn't exist in destination
      const productDetails = products.find(p => p.sku === sku);
      if(productDetails) {
          newInventory.push({
            ...productDetails,
            id: `inv-${Date.now()}`,
            warehouse: toWarehouse,
            quantity: quantity,
          });
      } else {
          toast({ title: "Error", description: "Product details not found in catalog.", variant: "destructive" });
          return;
      }
    }

    // This is where you would typically send the update to a server.
    // For this app, we'll simulate it by updating state and logging to localStorage.
    localStorage.setItem('erp-data-inventory', JSON.stringify(newInventory));
    setInventory(newInventory); // Update local state to reflect change
    
    toast({
      title: "Transfer Successful",
      description: `${quantity} units of ${sku} moved from ${fromWarehouse} to ${toWarehouse}.`,
    });

    form.reset();
  };
  
  const fromWarehouseId = form.watch('fromWarehouse');
  const availableSkus = inventory.filter(item => item.warehouse === fromWarehouseId && item.quantity > 0);


  return (
    <>
      <PageHeader title="Inventory Transfer" />
      <main className="flex-1 p-4 md:p-6">
        <Card className="shadow-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Transfer Stock Between Warehouses</CardTitle>
            <CardDescription>
              Select an item and quantity to move from a source warehouse to a destination.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                 <FormField
                  control={form.control}
                  name="fromWarehouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Warehouse</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a source warehouse" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {warehouses.map(wh => (
                            <SelectItem key={wh.id} value={wh.name}>{wh.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product SKU</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!fromWarehouseId}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={!fromWarehouseId ? "Select a source warehouse first" : "Select a product SKU"}/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableSkus.map(item => (
                            <SelectItem key={`${item.id}-${item.warehouse}`} value={item.sku}>{`${item.sku} (${item.itemName}) - Stock: ${item.quantity}`}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toWarehouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Warehouse</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a destination warehouse" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {warehouses.map(wh => (
                            <SelectItem key={wh.id} value={wh.name}>{wh.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity to Transfer</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter quantity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </CardContent>
              <CardFooter>
                <Button type="submit">
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  Initiate Transfer
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
    </>
  );
}
