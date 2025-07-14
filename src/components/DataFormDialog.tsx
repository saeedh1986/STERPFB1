
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { GenericItem, ColumnDefinition } from '@/lib/data';
import { inventoryItemsPool, expenseCategories, vendorsPool } from '@/lib/data';
import { useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface DataFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GenericItem) => void;
  defaultValues?: GenericItem | null;
  columns: ColumnDefinition[];
  title: string;
}

// Helper to convert file to data URI
const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
};


export function DataFormDialog({ isOpen, onClose, onSubmit, defaultValues, columns, title }: DataFormDialogProps) {

  // Create a dynamic Zod schema from columns
  const formSchema = z.object(
    columns.reduce((acc, col) => {
      // Make item name optional since it will be auto-filled
      if (col.accessorKey === 'itemName') {
        acc[col.accessorKey] = z.string().optional();
      } else if (col.accessorKey === 'imageUrl') {
        // Image URL is optional, can be set via upload
        acc[col.accessorKey] = z.string().optional();
      }
      else {
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
        // When opening the dialog, transform date strings from mock data into Date objects for the picker
        const transformedDefaults = { ...defaultValues };
        columns.forEach(col => {
            if (col.accessorKey.toLowerCase().includes('date') && defaultValues?.[col.accessorKey]) {
                const dateParts = (defaultValues[col.accessorKey] as string).split('-');
                if (dateParts.length === 3) {
                    // Assuming format is DD-Mon-YYYY e.g., "01-Jan-2023"
                    const date = new Date(`${dateParts[1]} ${dateParts[0]}, ${dateParts[2]}`);
                    if (!isNaN(date.getTime())) {
                        (transformedDefaults as any)[col.accessorKey] = date;
                    }
                }
            }
        });
        form.reset(transformedDefaults || {});
    }
  }, [isOpen, defaultValues, form, columns]);


  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    // Transform Date objects back to string format before submitting
    const formattedData = { ...data };
    columns.forEach(col => {
        if (col.accessorKey.toLowerCase().includes('date') && data[col.accessorKey]) {
            (formattedData as any)[col.accessorKey] = format(new Date(data[col.accessorKey]), 'dd-MMM-yyyy');
        }
    });
    onSubmit(formattedData);
  };
  
  const isSkuSelectMode = title.includes('Sales') || title.includes('Purchases');
  const isExpenseMode = title.includes('Expenses');
  const isProductCatalog = title.includes('Product Catalog');
  
  const handleSkuChange = (sku: string) => {
    const selectedItem = inventoryItemsPool.find(item => item.sku === sku);
    if (selectedItem) {
      form.setValue('itemName' as keyof FormValues, selectedItem.itemName);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        try {
            const dataUri = await fileToDataURI(file);
            form.setValue('imageUrl' as keyof FormValues, dataUri);
        } catch (error) {
            console.error("Error converting file to Data URI", error);
        }
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

             if (col.accessorKey.toLowerCase().includes('date')) {
                return (
                  <FormField
                    key={col.accessorKey}
                    control={form.control}
                    name={col.accessorKey as keyof FormValues}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{col.header}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
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
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

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
              
              if ((isExpenseMode || title.includes('Purchases')) && col.accessorKey === 'supplier') {
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

              if (isProductCatalog && col.accessorKey === 'imageUrl') {
                return (
                  <div key={col.accessorKey} className="space-y-2">
                    <FormField
                      control={form.control}
                      name={col.accessorKey as keyof FormValues}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://... or upload a file below" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormItem>
                        <FormLabel>Or Upload Image</FormLabel>
                        <FormControl>
                            <Input type="file" accept="image/*" onChange={handleImageUpload} />
                        </FormControl>
                        <FormDescription>The uploaded image will replace the URL above.</FormDescription>
                    </FormItem>
                  </div>
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
