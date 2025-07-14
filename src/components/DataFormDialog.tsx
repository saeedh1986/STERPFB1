
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { GenericItem, ColumnDefinition } from '@/lib/data';
import { inventoryItemsPool, expenseCategories, vendorsPool } from '@/lib/data';
import { useEffect } from 'react';

interface DataFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GenericItem) => void;
  defaultValues?: GenericItem | null;
  columns: ColumnDefinition[];
  title: string;
}

export function DataFormDialog({ isOpen, onClose, onSubmit, defaultValues, columns, title }: DataFormDialogProps) {

  // Create a dynamic Zod schema from columns
  const formSchema = z.object(
    columns.reduce((acc, col) => {
      // Make item name optional since it will be auto-filled
      if (col.accessorKey === 'itemName') {
        acc[col.accessorKey] = z.string().optional();
      } else {
        acc[col.accessorKey] = z.string().min(1, `${col.header} is required.`);
      }
      return acc;
    }, {} as Record<string, z.ZodString | z.ZodOptional<z.ZodString>>)
  );

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {},
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues || {});
    }
  }, [isOpen, defaultValues, form]);


  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmit(data);
  };
  
  const isSkuSelectMode = title.includes('Sales') || title.includes('Purchases');
  const isExpenseMode = title.includes('Expenses');
  const isSupplierSelectMode = title.includes('Purchases') || title.includes('Expenses');

  const handleSkuChange = (sku: string) => {
    const selectedItem = inventoryItemsPool.find(item => item.sku === sku);
    if (selectedItem) {
      form.setValue('itemName' as keyof FormValues, selectedItem.itemName);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {defaultValues ? "Make changes to the record here. Click save when you're done." : "Enter the details for the new record. Click create when you're done."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            {columns.map((col) => {

              if (isSkuSelectMode && col.accessorKey === 'sku') {
                return (
                   <FormField
                    key={col.accessorKey}
                    control={form.control}
                    name={col.accessorKey as keyof FormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{col.header}</FormLabel>
                        <Select onValueChange={(value) => {
                          field.onChange(value);
                          handleSkuChange(value);
                        }} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={`Select an ${col.header.toLowerCase()}`} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {inventoryItemsPool.map(item => (
                              <SelectItem key={item.sku} value={item.sku}>
                                {item.sku}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

              if (isSupplierSelectMode && col.accessorKey === 'supplier') {
                return (
                  <FormField
                    key={col.accessorKey}
                    control={form.control}
                    name={col.accessorKey as keyof FormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{col.header}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={`Select a ${col.header.toLowerCase()}`} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vendorsPool.map(vendor => (
                              <SelectItem key={vendor.id} value={vendor.vendorName}>
                                {vendor.vendorName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }
              
              if (isExpenseMode && col.accessorKey === 'category') {
                return (
                   <FormField
                    key={col.accessorKey}
                    control={form.control}
                    name={col.accessorKey as keyof FormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{col.header}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={`Select a ${col.header.toLowerCase()}`} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {expenseCategories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

              if (isSkuSelectMode && col.accessorKey === 'itemName') {
                return (
                   <FormField
                    key={col.accessorKey}
                    control={form.control}
                    name={col.accessorKey as keyof FormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{col.header}</FormLabel>
                        <FormControl>
                          <Input placeholder="Auto-filled" {...field} readOnly className="bg-muted" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

              return (
                <FormField
                  key={col.accessorKey}
                  control={form.control}
                  name={col.accessorKey as keyof FormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{col.header}</FormLabel>
                      <FormControl>
                        <Input placeholder={`Enter ${col.header.toLowerCase()}...`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{defaultValues ? 'Save Changes' : 'Create Record'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
