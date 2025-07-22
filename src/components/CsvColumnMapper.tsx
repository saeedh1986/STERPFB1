
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { type ColumnDefinition } from '@/lib/data';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollArea } from './ui/scroll-area';

export type Mapping = {
  [csvHeader: string]: string; // csvHeader -> targetField accessorKey
};

interface CsvColumnMapperProps {
  isOpen: boolean;
  onClose: () => void;
  csvHeaders: string[];
  targetColumns: ColumnDefinition[];
  onSubmit: (mapping: Mapping) => void;
}

export function CsvColumnMapper({ isOpen, onClose, csvHeaders, targetColumns, onSubmit }: CsvColumnMapperProps) {
  const { t } = useLanguage();
  const [mapping, setMapping] = useState<Mapping>({});

  useEffect(() => {
    if (isOpen) {
      const initialMapping: Mapping = {};
      csvHeaders.forEach(header => {
        // Simple auto-matching logic
        const matchedColumn = targetColumns.find(col => 
            col.header.toLowerCase() === header.toLowerCase() ||
            t(col.header).toLowerCase() === header.toLowerCase()
        );
        initialMapping[header] = matchedColumn ? matchedColumn.accessorKey : 'skip';
      });
      setMapping(initialMapping);
    }
  }, [isOpen, csvHeaders, targetColumns, t]);

  const handleMappingChange = (csvHeader: string, targetField: string) => {
    setMapping(prev => ({
      ...prev,
      [csvHeader]: targetField,
    }));
  };

  const handleSubmit = () => {
    onSubmit(mapping);
  };
  
  const unmappedRequiredFields = targetColumns
    .filter(tc => !Object.values(mapping).includes(tc.accessorKey))
    .map(tc => t(tc.header));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('datatable.mapper.title')}</DialogTitle>
          <DialogDescription>{t('datatable.mapper.description')}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <ScrollArea className="h-96">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>{t('datatable.mapper.csv_column')}</TableHead>
                        <TableHead>{t('datatable.mapper.target_field')}</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {csvHeaders.map(header => (
                        <TableRow key={header}>
                        <TableCell className="font-medium">{header}</TableCell>
                        <TableCell>
                            <Select
                            value={mapping[header] || 'skip'}
                            onValueChange={(value) => handleMappingChange(header, value)}
                            >
                            <SelectTrigger>
                                <SelectValue placeholder={t('datatable.mapper.select_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="skip" className="text-muted-foreground">{t('datatable.mapper.skip_column')}</SelectItem>
                                {targetColumns.map(col => (
                                <SelectItem key={col.accessorKey} value={col.accessorKey}>
                                    {t(col.header)}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </ScrollArea>
             {unmappedRequiredFields.length > 0 && (
                <div className="mt-4 text-sm text-destructive p-3 bg-destructive/10 rounded-md">
                    <p className="font-bold">{t('datatable.mapper.warning_title')}</p>
                    <p>{t('datatable.mapper.warning_desc')} {unmappedRequiredFields.join(', ')}</p>
                </div>
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{t('settings.cancel')}</Button>
          <Button onClick={handleSubmit}>{t('datatable.mapper.submit_button')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

