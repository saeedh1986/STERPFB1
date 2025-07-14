
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { productCatalogPool } from '@/lib/data';
import { Trash2, PlusCircle, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const lineItemSchema = z.object({
  productId: z.string().optional(),
  description: z.string().min(1, 'Description is required.'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  unitPrice: z.coerce.number().min(0, 'Unit price cannot be negative.'),
});

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required.'),
  invoiceDate: z.string().min(1, 'Invoice date is required.'),
  billTo: z.string().min(1, 'Bill To is required.'),
  shipTo: z.string().min(1, 'Ship To is required.'),
  instructions: z.string().optional(),
  lineItems: z.array(lineItemSchema).min(1, 'At least one line item is required.'),
  vat: z.coerce.number().min(0).default(0),
  shipping: z.coerce.number().min(0).default(0),
  codFees: z.coerce.number().min(0).default(0),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export function CreateInvoiceForm() {
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: '119',
      invoiceDate: new Date().toLocaleDateString('en-CA'),
      billTo: 'Saif',
      shipTo: 'Saif',
      instructions: 'Amazon.ae # 408-3345681-9845153',
      lineItems: [],
      vat: 0,
      shipping: 10,
      codFees: 10,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const lineItems = form.watch('lineItems');
  const vat = form.watch('vat');
  const shipping = form.watch('shipping');
  const codFees = form.watch('codFees');

  useEffect(() => {
    const newSubtotal = lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    setSubtotal(newSubtotal);
  }, [lineItems]);

  useEffect(() => {
    const newTotal = subtotal + vat + shipping + codFees;
    setTotal(newTotal);
  }, [subtotal, vat, shipping, codFees]);

  const handleProductSelect = (productId: string, index: number) => {
    const product = productCatalogPool.find(p => p.id === productId);
    if (product) {
      update(index, {
        productId: product.id,
        description: product.itemName,
        quantity: 1,
        unitPrice: product.unitPrice,
      });
      form.clearErrors(`lineItems.${index}.description`);
    }
  };

  const addManualItem = () => {
    append({
      description: '',
      quantity: 1,
      unitPrice: 0,
    });
  };

  const onSubmit = (data: InvoiceFormValues) => {
    // In a real app, you would submit this data to a backend.
    console.log({ ...data, subtotal, total });
    alert('Invoice Submitted! Check the console for the data.');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <header className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">Saeed Store Electronics</h2>
                <p>Dubai, United Arab Emirates</p>
                <p>Website: S3eed.ae</p>
                <p>Email: info@s3eed.ae</p>
                <p>WhatsApp: +971553813831</p>
              </div>
              <div className="text-center">
                 <div className="flex justify-center items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">SBEED STORE</h1>
                        <p className="text-xl font-semibold">سعيد ستور</p>
                    </div>
                </div>
              </div>
            </header>

            <div className="bg-gray-800 text-white p-4 flex justify-between rounded-md">
                <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="flex items-center">
                                    <span className="font-bold text-lg mr-2">INVOICE NO.</span>
                                    <Input {...field} className="bg-gray-800 border-none text-white w-24" />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="invoiceDate"
                    render={({ field }) => (
                         <FormItem>
                            <FormControl>
                                <div className="flex items-center">
                                    <span className="font-bold text-lg mr-2">DATE</span>
                                    <Input type="date" {...field} className="bg-gray-800 border-none text-white" />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <FormField control={form.control} name="billTo" render={({ field }) => (<FormItem><FormLabel>BILL TO</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="shipTo" render={({ field }) => (<FormItem><FormLabel>SHIP TO</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="instructions" render={({ field }) => (<FormItem><FormLabel>INSTRUCTIONS</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <div>
              <Table>
                <TableHeader className="bg-gray-800">
                  <TableRow>
                    <TableHead className="text-white w-[45%]">DESCRIPTION</TableHead>
                    <TableHead className="text-white text-right">QUANTITY</TableHead>
                    <TableHead className="text-white text-right">UNIT PRICE</TableHead>
                    <TableHead className="text-white text-right">TOTAL</TableHead>
                    <TableHead className="text-white w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        {field.productId ? (
                           <p className="font-medium mt-2">{form.getValues(`lineItems.${index}.description`)}</p>
                        ) : (
                          <div className="flex gap-2">
                             <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn("w-full justify-between", !form.getValues(`lineItems.${index}.description`) && "text-muted-foreground")}
                                >
                                    Select product...
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search product..." />
                                    <CommandList>
                                    <CommandEmpty>No product found.</CommandEmpty>
                                    <CommandGroup>
                                        {productCatalogPool.map((product) => (
                                        <CommandItem
                                            key={product.id}
                                            value={product.itemName}
                                            onSelect={() => handleProductSelect(product.id, index)}
                                        >
                                            <Check className={cn("mr-2 h-4 w-4", form.getValues(`lineItems.${index}.productId`) === product.id ? "opacity-100" : "opacity-0")} />
                                            {product.itemName}
                                        </CommandItem>
                                        ))}
                                    </CommandGroup>
                                    </CommandList>
                                </Command>
                                </PopoverContent>
                            </Popover>
                            <span className="mx-2 mt-2 font-semibold">OR</span>
                             <FormField
                                control={form.control}
                                name={`lineItems.${index}.description`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                    <FormControl>
                                        <Input {...field} placeholder="Enter manual description" />
                                    </FormControl>
                                    </FormItem>
                                )}
                                />
                          </div>
                        )}
                        <FormMessage>{form.formState.errors.lineItems?.[index]?.description?.message}</FormMessage>
                      </TableCell>
                      <TableCell>
                        <FormField control={form.control} name={`lineItems.${index}.quantity`} render={({ field }) => ( <FormItem><FormControl><Input type="number" {...field} className="text-right" /></FormControl></FormItem> )} />
                      </TableCell>
                      <TableCell>
                        <FormField control={form.control} name={`lineItems.${index}.unitPrice`} render={({ field }) => ( <FormItem><FormControl><Input type="number" step="0.01" {...field} className="text-right" /></FormControl></FormItem> )} />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        د.إ {(lineItems[index].quantity * lineItems[index].unitPrice).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={addManualItem}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Item
              </Button>
               {form.formState.errors.lineItems?.root && (
                    <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.lineItems.root.message}</p>
                )}
            </div>
            
            <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-4">
                     <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-muted-foreground">SUBTOTAL</span>
                        <span className="font-medium">د.إ {subtotal.toFixed(2)}</span>
                    </div>
                    
                    <FormField
                        control={form.control}
                        name="vat"
                        render={({ field }) => (
                            <FormItem className="flex justify-between items-center">
                                <FormLabel className="text-muted-foreground">VAT</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">د.إ</span>
                                        <Input type="number" step="0.01" {...field} className="w-24 text-right" />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="shipping"
                        render={({ field }) => (
                             <FormItem className="flex justify-between items-center">
                                <FormLabel className="text-muted-foreground">SHIPPING & HANDLING</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">د.إ</span>
                                        <Input type="number" step="0.01" {...field} className="w-24 text-right" />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="codFees"
                        render={({ field }) => (
                            <FormItem className="flex justify-between items-center">
                                <FormLabel className="text-muted-foreground">COLLECT ON DELIVERY FEES</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">د.إ</span>
                                        <Input type="number" step="0.01" {...field} className="w-24 text-right" />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-between items-center border-t pt-2">
                        <span className="font-bold text-lg">TOTAL</span>
                        <span className="font-bold text-lg">د.إ {total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <footer className="text-center text-muted-foreground pt-8">
                <p>Thank You</p>
            </footer>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline">Preview</Button>
                <Button type="submit">Save Invoice</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
