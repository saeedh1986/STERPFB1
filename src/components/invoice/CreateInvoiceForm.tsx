
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Trash2, PlusCircle, Check, ChevronsUpDown, CalendarIcon, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import QRCode from 'qrcode.react';
import { useToast } from "@/hooks/use-toast";
import { useCompanyProfile } from '@/context/CompanyProfileContext';


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

const aedSymbol = <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UAE_Dirham_Symbol.svg/1377px-UAE_Dirham_Symbol.svg.png" alt="AED" width={14} height={14} className="inline-block dark:invert" />;


export function CreateInvoiceForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { profile } = useCompanyProfile();
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: new Date(),
      billTo: 'Saif',
      shipTo: 'Saif',
      instructions: 'Amazon.ae # 408-3345681-9845153',
      lineItems: [],
      vat: 5.00,
      shipping: 10,
      codFees: 10,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const watchedFormValues = form.watch();

  useEffect(() => {
    const newSubtotal = watchedFormValues.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const vatAmount = newSubtotal * 0.05;
    setSubtotal(newSubtotal);
    form.setValue('vat', parseFloat(vatAmount.toFixed(2)));
  }, [watchedFormValues.lineItems, form]);

  useEffect(() => {
    const { vat, shipping, codFees } = watchedFormValues;
    const newTotal = subtotal + (vat || 0) + (shipping || 0) + (codFees || 0);
    setTotal(newTotal);
  }, [subtotal, watchedFormValues.vat, watchedFormValues.shipping, watchedFormValues.codFees]);

  const handleProductSelect = (productId: string) => {
    const product = productCatalogPool.find(p => p.id === productId);
    if (product) {
      append({
        productId: product.id,
        description: product.itemName,
        quantity: 1,
        unitPrice: product.unitPrice,
      });
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
      invoiceDate: format(data.invoiceDate, 'dd-MMM-yyyy'),
      subtotal,
      total,
      logo: profile.logo,
    };
    
    const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    savedInvoices.unshift(submissionData);
    localStorage.setItem('invoices', JSON.stringify(savedInvoices));

    toast({
        title: "Invoice Saved",
        description: `Invoice ${submissionData.invoiceNumber} has been successfully saved.`,
    });

    router.push('/invoices');
  };
  
  const getQrCodeValue = () => {
    const { invoiceNumber, invoiceDate } = watchedFormValues;
    return `Invoice No: ${invoiceNumber}\nDate: ${format(invoiceDate || new Date(), 'dd-MMM-yyyy')}\nTotal: AED ${total.toFixed(2)}`;
  };
  
  const currencyFormatter = (value: number) => {
    if (isNaN(value)) return '0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="bg-white text-black p-4 sm:p-6 md:p-10 font-sans space-y-10">
              <header className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-8">
                  <div className="flex items-start gap-4">
                      {profile.logo && <Image src={profile.logo} alt="Company Logo" width={120} height={120} className="object-contain" />}
                      <div>
                          <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
                          <p className="text-sm text-gray-600">{profile.description}</p>
                          <p className="text-sm text-gray-600">Website: {profile.website}</p>
                          <p className="text-sm text-gray-600">Email: {profile.email}</p>
                          <p className="text-sm text-gray-600">WhatsApp: {profile.whatsapp}</p>
                      </div>
                  </div>
                  <div className="text-right w-full sm:w-auto">
                      <h1 className="text-4xl font-extrabold uppercase text-gray-800 tracking-wider">Invoice</h1>
                       <FormField
                          control={form.control}
                          name="invoiceNumber"
                          render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                  <div className="flex items-center justify-end">
                                    <p className="text-sm text-gray-500 mt-1">Invoice #: </p>
                                    <Input {...field} className="bg-white border-none shadow-none text-right h-auto p-0 m-0 w-32 text-sm text-gray-500 font-sans focus-visible:ring-0" readOnly />
                                  </div>
                                </FormControl>
                            </FormItem>
                          )}
                        />
                  </div>
              </header>

              <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-b border-gray-200 py-4">
                  <FormField control={form.control} name="billTo" render={({ field }) => (<FormItem><h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3><FormControl><Input className="font-medium text-gray-800 p-1 h-auto" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="shipTo" render={({ field }) => (<FormItem><h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ship To</h3><FormControl><Input className="font-medium text-gray-800 p-1 h-auto" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField
                      control={form.control}
                      name="invoiceDate"
                      render={({ field }) => (
                        <FormItem className="sm:text-right">
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Invoice Date</h3>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"ghost"}
                                  className={cn(
                                    "w-full sm:w-auto justify-start sm:justify-end font-medium text-gray-800 p-1 h-auto hover:bg-gray-100",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd-MMM-yyyy")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
              </section>

              <section>
                <FormField control={form.control} name="instructions" render={({ field }) => (<FormItem><h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Instructions</h3><FormControl><Input className="text-sm text-gray-700 p-1 h-auto" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </section>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-gray-200 hover:bg-gray-50">
                      <TableHead className="w-[50%] text-gray-600 font-semibold">DESCRIPTION</TableHead>
                      <TableHead className="text-right text-gray-600 font-semibold">QTY</TableHead>
                      <TableHead className="text-right text-gray-600 font-semibold">UNIT PRICE</TableHead>
                      <TableHead className="text-right text-gray-600 font-semibold">TOTAL</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id} className="border-gray-200">
                        <TableCell className="font-medium py-3">
                           <FormField
                              control={form.control}
                              name={`lineItems.${index}.description`}
                              render={({ field: descriptionField }) => (
                                  <FormItem>
                                  <FormControl>
                                      <Input {...descriptionField} placeholder="Item description" className="h-auto p-1" />
                                  </FormControl>
                                  <FormMessage/>
                                  </FormItem>
                              )}
                            />
                        </TableCell>
                        <TableCell>
                          <FormField control={form.control} name={`lineItems.${index}.quantity`} render={({ field: qtyField }) => ( <FormItem><FormControl><Input type="number" {...qtyField} className="text-right h-auto p-1" /></FormControl></FormItem> )} />
                        </TableCell>
                        <TableCell>
                          <FormField control={form.control} name={`lineItems.${index}.unitPrice`} render={({ field: priceField }) => ( <FormItem><FormControl><Input type="number" step="0.01" {...priceField} className="text-right h-auto p-1" /></FormControl></FormItem> )} />
                        </TableCell>
                        <TableCell className="text-right py-3 font-medium">
                          <div className="flex items-center justify-end gap-1">
                            {aedSymbol}
                            <span>{currencyFormatter((watchedFormValues.lineItems[index]?.quantity || 0) * (watchedFormValues.lineItems[index]?.unitPrice || 0))}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-4 flex flex-wrap gap-4">
                  <Popover>
                      <PopoverTrigger asChild>
                      <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          role="combobox"
                      >
                          <PlusCircle className="mr-2 h-4 w-4" /> Add from Catalog
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
                                  onSelect={() => handleProductSelect(product.id)}
                              >
                                  <Check className={cn("mr-2 h-4 w-4", "opacity-0")} />
                                  {product.itemName}
                              </CommandItem>
                              ))}
                          </CommandGroup>
                          </CommandList>
                      </Command>
                      </PopoverContent>
                  </Popover>

                  <Button type="button" variant="outline" size="sm" onClick={addManualItem}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Manual Item
                  </Button>
                </div>
                 {form.formState.errors.lineItems?.root && (
                      <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.lineItems.root.message}</p>
                  )}
              </div>

               <div className="flex justify-end mt-10">
                  <div className="w-full max-w-sm space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium flex items-center gap-1">{aedSymbol} {currencyFormatter(subtotal)}</span>
                      </div>
                      <FormField
                          control={form.control}
                          name="vat"
                          render={({ field }) => (
                              <FormItem className="flex justify-between items-center">
                                  <FormLabel className="text-gray-600">VAT (5%)</FormLabel>
                                  <FormControl>
                                      <div className="flex items-center gap-1">
                                          <span className="font-medium flex items-center gap-1">{aedSymbol}</span>
                                          <Input readOnly type="number" step="0.01" {...field} className="w-28 text-right font-medium h-auto p-1 bg-gray-100" />
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
                                  <FormLabel className="text-gray-600">Shipping & Handling</FormLabel>
                                  <FormControl>
                                      <div className="flex items-center gap-1">
                                          <span className="font-medium flex items-center gap-1">{aedSymbol}</span>
                                          <Input type="number" step="0.01" {...field} className="w-28 text-right font-medium h-auto p-1" />
                                      </div>
                                  </FormControl>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="codFees"
                          render={({ field }) => (
                              <FormItem className="flex justify-between items-center pb-2 border-b border-gray-200">
                                  <FormLabel className="text-gray-600">Collect on Delivery Fees</FormLabel>
                                  <FormControl>
                                       <div className="flex items-center gap-1">
                                          <span className="font-medium flex items-center gap-1">{aedSymbol}</span>
                                          <Input type="number" step="0.01" {...field} className="w-28 text-right font-medium h-auto p-1" />
                                      </div>
                                  </FormControl>
                              </FormItem>
                          )}
                      />
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-bold text-base text-gray-800">Total Due</span>
                        <span className="font-bold text-base text-gray-800 flex items-center gap-1">{aedSymbol} {currencyFormatter(total)}</span>
                      </div>
                  </div>
              </div>

               <div className="flex justify-between items-end mt-16">
                  <div className="text-center">
                      <p className="font-semibold text-lg">Thank You!</p>
                      <p className="text-xs text-gray-500">We appreciate your business.</p>
                  </div>
                  <div className="p-2 border rounded-md">
                       <QRCode value={getQrCodeValue()} size={64} level="H" />
                    </div>
               </div>
            </div>
            <div className="flex justify-end gap-2 p-6 bg-muted/50 border-t">
                <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Save Invoice
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    