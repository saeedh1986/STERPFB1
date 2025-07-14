
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { productCatalogPool } from '@/lib/data';
import { Trash2, PlusCircle, Check, ChevronsUpDown, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import QRCode from 'qrcode.react';


const lineItemSchema = z.object({
  productId: z.string().optional(),
  description: z.string().min(1, 'Description is required.'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  unitPrice: z.coerce.number().min(0, 'Unit price cannot be negative.'),
});

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required.'),
  invoiceDate: z.date({ required_error: "Invoice date is required."}),
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
  const logoSrc = "https://s3eed.ae/wp-content/uploads/2025/04/logo13.png";

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: new Date(),
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

  const watchedFormValues = form.watch();

  useEffect(() => {
    const newSubtotal = watchedFormValues.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    setSubtotal(newSubtotal);
  }, [watchedFormValues.lineItems]);

  useEffect(() => {
    const { vat, shipping, codFees } = watchedFormValues;
    const newTotal = subtotal + (vat || 0) + (shipping || 0) + (codFees || 0);
    setTotal(newTotal);
  }, [subtotal, watchedFormValues.vat, watchedFormValues.shipping, watchedFormValues.codFees, watchedFormValues]);

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
    const submissionData = {
      ...data,
      invoiceDate: format(data.invoiceDate, 'yyyy-MM-dd'),
      subtotal,
      total,
      logo: logoSrc,
    };
    console.log(submissionData);
    alert('Invoice Submitted! Check the console for the data.');
  };

  const getQrCodeValue = () => {
    const { invoiceNumber, invoiceDate } = watchedFormValues;
    return `Invoice No: ${invoiceNumber}\nDate: ${format(invoiceDate || new Date(), 'PPP')}\nTotal: د.إ ${total.toFixed(2)}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <header className="flex justify-between items-start gap-4">
               <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-2">
                    <Image src={logoSrc} alt="Saeed Store Logo" width={100} height={100} className="object-contain" />
                </div>
                 <div>
                    <h2 className="text-2xl font-bold">Saeed Store Electronics</h2>
                    <p>Dubai, United Arab Emirates</p>
                    <p>Website: S3eed.ae</p>
                    <p>Email: info@s3eed.ae</p>
                    <p>WhatsApp: +971553813831</p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex justify-end items-center gap-4">
                  <div className="p-2 border rounded-md">
                     <QRCode value={getQrCodeValue()} size={80} level="H" />
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
                                    <Input {...field} className="bg-gray-800 border-none text-white w-36 font-mono" readOnly />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="invoiceDate"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="font-bold text-lg mr-2 mt-2">DATE</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal bg-gray-800 border-none text-white hover:bg-gray-700 hover:text-white",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
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
                        د.إ {(watchedFormValues.lineItems[index]?.quantity * watchedFormValues.lineItems[index]?.unitPrice || 0).toFixed(2)}
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

    