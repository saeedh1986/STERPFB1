
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
import { productCatalogPool, expenseCategories as defaultExpenseCategories, vendorsPool, USD_TO_AED_RATE, categoriesPool, brandsPool, warehousesPool } from '@/lib/data';
import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, ChevronsUpDown, Check } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';


interface DataFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GenericItem) => void;
  defaultValues?: GenericItem | null;
  columns: ColumnDefinition[];
  title: string;
  options?: {
    roles?: string[];
    categories?: GenericItem[];
    brands?: GenericItem[];
    warehouses?: GenericItem[];
  }
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


export function DataFormDialog({ isOpen, onClose, onSubmit, defaultValues, columns, title, options }: DataFormDialogProps) {

  const isBankStatement = title.includes('Bank Statement');
  const isUsers = title.includes('User');
  const [expenseCategories, setExpenseCategories] = useState(defaultExpenseCategories);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [newCategoryValue, setNewCategoryValue] = useState('');


  // Create a dynamic Zod schema from columns
  const formSchemaObject = columns.reduce((acc, col) => {
      if (col.accessorKey === 'itemName' || col.accessorKey === 'imageUrl') {
        acc[col.accessorKey] = z.string().optional();
      } else if (isBankStatement && ['debit', 'credit', 'balance'].includes(col.accessorKey)) {
        acc[col.accessorKey] = z.coerce.number().optional();
      }
      else if (title.includes('Cost Calculator') && ['usd', 'quantity', 'customsFees', 'shippingFees', 'bankCharges', 'aed', 'totalCost', 'totalCostPerUnit', 'exchangeRate'].includes(col.accessorKey)) {
        acc[col.accessorKey] = z.coerce.number().optional();
      } else if(isUsers && col.accessorKey === 'password' && !defaultValues) {
        // Password is only required when creating a new user
        acc[col.accessorKey] = z.string().min(1, `${col.header} is required.`);
      } else if (isUsers && col.accessorKey === 'password' && defaultValues) {
        // Password is optional when updating
        acc[col.accessorKey] = z.string().optional();
      }
      else {
         acc[col.accessorKey] = z.string().min(1, `${col.header} is required.`);
      }
      return acc;
    }, {} as Record<string, z.ZodTypeAny>);

  if (isBankStatement) {
      formSchemaObject['debit'] = z.coerce.number().optional();
      formSchemaObject['credit'] = z.coerce.number().optional();
  }
  
  const formSchema = z.object(formSchemaObject).refine(data => {
     if (isBankStatement) {
        return !(data.debit && data.credit);
     }
     return true;
  }, {
    message: "Cannot have both Debit and Credit values.",
    path: ['credit'],
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {},
  });

  const isCostCalculator = title.includes('Cost Calculator');
  const watchedFields = form.watch(['usd', 'quantity', 'customsFees', 'shippingFees', 'bankCharges', 'exchangeRate']);

  useEffect(() => {
    if (isCostCalculator) {
        const [usd, quantity, customsFees, shippingFees, bankCharges, exchangeRate] = watchedFields;
        const finalExchangeRate = parseFloat((exchangeRate || 0).toString()) || USD_TO_AED_RATE;
        const aed = parseFloat((usd || 0).toString()) * finalExchangeRate;
        const totalCost = aed + parseFloat((customsFees || 0).toString()) + parseFloat((shippingFees || 0).toString()) + parseFloat((bankCharges || 0).toString());
        const totalCostPerUnit = totalCost / (parseFloat((quantity || 1).toString()) || 1);

        form.setValue('aed' as keyof FormValues, parseFloat(aed.toFixed(4)));
        form.setValue('totalCost' as keyof FormValues, parseFloat(totalCost.toFixed(4)));
        form.setValue('totalCostPerUnit' as keyof FormValues, parseFloat(totalCostPerUnit.toFixed(4)));
    }
  }, [watchedFields, form, isCostCalculator]);


  useEffect(() => {
    if (isOpen) {
        // When opening the dialog, transform date strings from mock data into Date objects for the picker
        const transformedDefaults = { ...defaultValues };
        if (isCostCalculator && !transformedDefaults.exchangeRate) {
            (transformedDefaults as any).exchangeRate = USD_TO_AED_RATE;
        }

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
  }, [isOpen, defaultValues, form, columns, isCostCalculator]);


  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    // Transform Date objects back to string format before submitting
    const formattedData = { ...data };
    columns.forEach(col => {
        if (col.accessorKey.toLowerCase().includes('date') && data[col.accessorKey]) {
            (formattedData as any)[col.accessorKey] = format(new Date(data[col.accessorKey]), 'dd-MMM-yyyy');
        }
    });

    if (isBankStatement) {
        const debit = data.debit || 0;
        const credit = data.credit || 0;
        (formattedData as any).amount = credit > 0 ? credit : -debit;
        // Balance will be recalculated server-side or on data display
    }

    onSubmit(formattedData);
  };
  
  const isSkuSelectMode = title.includes('Sales') || title.includes('Purchases') || title.includes('Cost Calculator') || title.includes('Inventory');
  const isExpenseMode = title.includes('Expenses');
  const isProductCatalog = title.includes('Product Catalog');
  const isInventory = title.includes('Inventory');
  
  const handleSkuChange = (sku: string) => {
    const selectedItem = productCatalogPool.find(item => item.sku === sku);
    if (selectedItem) {
      form.setValue('itemName' as keyof FormValues, selectedItem.itemName);
      if (isInventory) {
          form.setValue('unitPrice' as keyof FormValues, selectedItem.unitPrice);
          form.setValue('category' as keyof FormValues, selectedItem.category);
      }
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

  const handleCreateCategory = () => {
    if (newCategoryValue && !expenseCategories.includes(newCategoryValue)) {
      setExpenseCategories(prev => [...prev, newCategoryValue]);
      form.setValue('category' as keyof FormValues, newCategoryValue);
      setComboboxOpen(false);
      setNewCategoryValue('');
    }
  };

  const calculatedFields = ['aed', 'totalCost', 'totalCostPerUnit'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {defaultValues ? "Make changes to the record here. Click save when you're done." : "Enter the details for the new record. Click create when you're done."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1" data-slot="scroll-area">
                <div className="space-y-4 px-6 py-4">
                    {columns.map((col) => {
                    
                    const isCalculated = isCostCalculator && calculatedFields.includes(col.accessorKey);

                    if (isUsers && col.accessorKey === 'role') {
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
                                      <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {options?.roles?.map(role => (
                                      <SelectItem key={role} value={role}>{role}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        );
                    }

                    if (isInventory && col.accessorKey === 'warehouse') {
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
                                      <SelectValue placeholder="Select a warehouse" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {options?.warehouses?.map(wh => (
                                      <SelectItem key={wh.id} value={wh.name}>{wh.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        );
                    }


                    if ((isProductCatalog || isInventory) && col.accessorKey === 'category') {
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
                                      <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {options?.categories?.map(cat => (
                                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        );
                    }

                     if (isProductCatalog && col.accessorKey === 'brand') {
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
                                      <SelectValue placeholder="Select a brand" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {options?.brands?.map(brand => (
                                      <SelectItem key={brand.id} value={brand.name}>{brand.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        );
                    }

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
                                    {productCatalogPool.map(item => (
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
                            <FormItem className="flex flex-col">
                                <FormLabel>{col.header}</FormLabel>
                                <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                        "w-full justify-between",
                                        !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value
                                        ? expenseCategories.find(
                                            (category) => category === field.value
                                            )
                                        : "Select a category"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                    <CommandInput 
                                        placeholder="Search or create..."
                                        value={newCategoryValue}
                                        onValueChange={setNewCategoryValue}
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                        <Button variant="ghost" className="w-full" onClick={handleCreateCategory}>
                                            Create "{newCategoryValue}"
                                        </Button>
                                        </CommandEmpty>
                                        <CommandGroup>
                                        {expenseCategories.map((category) => (
                                            <CommandItem
                                            value={category}
                                            key={category}
                                            onSelect={() => {
                                                form.setValue(col.accessorKey as keyof FormValues, category)
                                                setComboboxOpen(false)
                                            }}
                                            >
                                            <Check
                                                className={cn(
                                                "mr-2 h-4 w-4",
                                                category === field.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                )}
                                            />
                                            {category}
                                            </CommandItem>
                                        ))}
                                        </CommandGroup>
                                    </CommandList>
                                    </Command>
                                </PopoverContent>
                                </Popover>
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

                    // Do not render balance field in bank statement form
                    if (isBankStatement && col.accessorKey === 'balance') {
                        return null;
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
                                <Input 
                                    placeholder={`Enter ${col.header.toLowerCase()}...`}
                                    {...field}
                                    type={isUsers && col.accessorKey === 'password' ? 'password' : typeof field.value === 'number' ? 'number' : 'text'}
                                    step="any"
                                    readOnly={isCalculated || (isInventory && ['unitPrice','category'].includes(col.accessorKey))}
                                    className={(isCalculated || (isInventory && ['unitPrice','category'].includes(col.accessorKey))) ? 'bg-muted' : ''}
                                    onChange={(e) => {
                                        if (typeof field.value === 'number') {
                                            field.onChange(e.target.valueAsNumber || 0);
                                        } else {
                                            field.onChange(e.target.value);
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    );
                    })}
                    {isBankStatement && (
                        <>
                            <FormField
                                control={form.control}
                                name={"debit" as keyof FormValues}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Debit</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                step="any" 
                                                {...field} 
                                                placeholder="Enter debit amount" 
                                                onChange={(e) => {
                                                    field.onChange(e.target.valueAsNumber || 0);
                                                    form.setValue('credit' as keyof FormValues, 0);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={"credit" as keyof FormValues}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Credit</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                step="any" 
                                                {...field} 
                                                placeholder="Enter credit amount"
                                                onChange={(e) => {
                                                    field.onChange(e.target.valueAsNumber || 0);
                                                    form.setValue('debit' as keyof FormValues, 0);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                </div>
            </ScrollArea>
            <DialogFooter className="border-t pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{defaultValues ? 'Save Changes' : 'Create Record'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
