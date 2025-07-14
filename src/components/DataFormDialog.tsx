
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { GenericItem, ColumnDefinition } from '@/lib/data';
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
      acc[col.accessorKey] = z.string().min(1, `${col.header} is required.`);
      return acc;
    }, {} as Record<string, z.ZodString>)
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
            {columns.map((col) => (
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
            ))}
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
