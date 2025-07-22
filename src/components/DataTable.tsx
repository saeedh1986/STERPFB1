

"use client";

import type { GenericItem, ColumnDefinition } from '@/lib/data';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { FilePlus, FilePenLine, Trash2, ChevronDown, Upload, Download, Barcode, ScanLine } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DataFormDialog } from './DataFormDialog';
import { categoriesPool, brandsPool, warehousesPool, userRoles, moduleSlugs, getBadgeVariantForAccountType } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScanInvoiceDialog } from './purchases/ScanInvoiceDialog';
import { useLanguage } from '@/context/LanguageContext';
import { CsvColumnMapper, type Mapping } from './CsvColumnMapper';
import { format } from 'date-fns';


interface DataTableProps {
  data: GenericItem[];
  columns: ColumnDefinition[];
  pageTitle: string;
}

const ITEMS_PER_PAGE = 10;

// Helper to create an invoice object from a sale
const createInvoiceFromSale = (sale: GenericItem): GenericItem => {
  const quantity = sale.qtySold || 1;
  const unitPrice = sale.price || 0;
  const subtotal = quantity * unitPrice;
  const vat = subtotal * 0.05;
  const shipping = sale.shipping || 0;
  const codFees = 0; // Assuming no COD fees for auto-generated invoices for now
  const total = subtotal + vat + shipping + codFees;

  return {
    invoiceNumber: sale.orderId,
    invoiceDate: sale.saleDate,
    billTo: sale.customerName,
    shipTo: sale.customerName,
    instructions: sale.note || `Order ID: ${sale.orderId}`,
    lineItems: [
      {
        productId: sale.sku,
        description: sale.itemName,
        quantity: quantity,
        unitPrice: unitPrice,
      },
    ],
    vat: parseFloat(vat.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    codFees: parseFloat(codFees.toFixed(2)),
    subtotal: parseFloat(subtotal.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};

export function DataTable({ data: initialData, columns, pageTitle }: DataTableProps) {
  const { t } = useLanguage();
  const pageSlug = moduleSlugs.find(slug => slug === pageTitle.toLowerCase().replace(/\s+/g, '-')) || pageTitle.toLowerCase().replace(/\s+/g, '-');
  
  const [tableData, setTableData] = useLocalStorage<GenericItem[]>(`erp-data-${pageSlug}`, initialData);

  const [globalFilter, setGlobalFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);
  const [isMappingDialogOpen, setIsMappingDialogOpen] = useState(false);
  const [csvData, setCsvData] = useState<{ headers: string[], lines: string[] } | null>(null);
  const [selectedItem, setSelectedItem] = useState<GenericItem | null>(null);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filteredData = useMemo(() => {
    let dataToFilter = [...tableData];
    if (globalFilter) {
      dataToFilter = dataToFilter.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(globalFilter.toLowerCase())
        )
      );
    }
    return dataToFilter;
  }, [tableData, globalFilter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const handleCreate = (prefilledData: GenericItem | null = null) => {
    setSelectedItem(prefilledData);
    setIsDialogOpen(true);
  };

  const handleUpdate = (item: GenericItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (itemId: string) => {
    setTableData(prev => prev.filter(item => item.id !== itemId));
    toast({ title: t('datatable.toast.item_deleted_title'), description: t('datatable.toast.item_deleted_desc', {itemId}) });
  };
  
  const handleFormSubmit = (values: GenericItem) => {
    if (selectedItem && selectedItem.id) { // Check if it's an update
      setTableData(prev => prev.map(item => item.id === selectedItem.id ? { ...item, ...values } : item));
      toast({ title: t('datatable.toast.item_updated_title'), description: t('datatable.toast.item_updated_desc') });
    } else { // It's a create
      const newItem = { ...selectedItem, ...values, id: `${pageSlug}-${Date.now()}` };
      setTableData(prev => [newItem, ...prev]);
      toast({ title: t('datatable.toast.item_created_title'), description: t('datatable.toast.item_created_desc') });
      
      // If a new sale is created, also create an invoice
      if (pageSlug === 'sales') {
        const newInvoice = createInvoiceFromSale(newItem);
        const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
        savedInvoices.unshift(newInvoice);
        localStorage.setItem('invoices', JSON.stringify(savedInvoices));
        toast({
            title: "Invoice Auto-Generated",
            description: `Invoice ${newInvoice.invoiceNumber} created from sale.`,
        });
      }
    }
    setIsDialogOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
          throw new Error("CSV file must have a header and at least one data row.");
        }
        
        const headerLine = lines[0].trim().replace(/\r/g, '');
        const headers = headerLine.split(',').map(h => h.trim());
        const dataLines = lines.slice(1);

        setCsvData({ headers, lines: dataLines });
        setIsMappingDialogOpen(true);

      } catch (error) {
        toast({
          title: t('datatable.toast.import_failed_title'),
          description: error instanceof Error ? error.message : "Could not parse the CSV file.",
          variant: "destructive",
        });
      } finally {
        if(fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  const handleMappingComplete = (mapping: Mapping) => {
    if (!csvData) return;
    
    try {
        const newRecords = csvData.lines.map((line, lineIndex) => {
            const record: GenericItem = { id: `imported-${Date.now()}-${lineIndex}` };
            const values = line.split(',').map(v => v.trim());

            Object.entries(mapping).forEach(([csvHeader, targetField]) => {
                if (targetField !== 'skip') {
                    const csvHeaderIndex = csvData.headers.indexOf(csvHeader);
                    if (csvHeaderIndex !== -1) {
                        record[targetField] = values[csvHeaderIndex] || '';
                    }
                }
            });
            return record;
        });

        setTableData(prev => [...newRecords, ...prev]);
        toast({
            title: t('datatable.toast.import_success_title'),
            description: t('datatable.toast.import_success_desc', { count: newRecords.length }),
        });
    } catch (error) {
         toast({
          title: t('datatable.toast.import_failed_title'),
          description: error instanceof Error ? error.message : "Could not process data with the provided mapping.",
          variant: "destructive",
        });
    }

    setIsMappingDialogOpen(false);
    setCsvData(null);
  };

  const handleDownloadTemplate = () => {
    const headers = columns.filter(c => c.accessorKey !== 'id').map(c => t(c.header)).join(',');
    const blob = new Blob([headers], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${pageTitle.replace(/\s+/g, '_')}_template.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: t('datatable.toast.template_download_title'),
      description: t('datatable.toast.template_download_desc'),
    });
  };

  const formOptions = {
    roles: userRoles.map(r => r.name),
    categories: categoriesPool,
    brands: brandsPool,
    warehouses: warehousesPool,
    salesChannels: ['Direct Sales', 'Amazon AE', 'Noon AE'],
    fulfillmentWarehouses: ['Main Warehouse', 'Amazon Warehouse', 'Noon Warehouse'],
    purchaseTypes: ['Inventory', 'Asset', 'Expense'],
  };


  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Input
          placeholder={t('datatable.filter_placeholder')}
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-wrap items-center justify-end gap-2">
          {pageTitle === 'Purchases' && (
            <Button onClick={() => setIsScanDialogOpen(true)} variant="outline">
              <ScanLine className="mr-2 h-4 w-4" /> {t('datatable.scan_invoice')}
            </Button>
          )}
          <Button onClick={() => handleCreate()}>
            <FilePlus className="mr-2 h-4 w-4" /> {t('datatable.create_new')}
          </Button>
           <label htmlFor="file-upload" className="cursor-pointer">
            <Button asChild variant="outline">
              <span><Upload className="mr-2 h-4 w-4" /> {t('datatable.import_csv')}</span>
            </Button>
          </label>
          <input id="file-upload" type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".csv" />
          <Button onClick={handleDownloadTemplate} variant="outline">
            <Download className="mr-2 h-4 w-4" /> {t('datatable.download_template')}
          </Button>
        </div>
      </div>

      <div className="rounded-md border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey} className="font-semibold">{t(column.header)}</TableHead>
              ))}
              <TableHead className="text-right font-semibold">{t('datatable.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => {
                    const cellValue = item[column.accessorKey];
                    const isImageUrl = typeof cellValue === 'string' && (cellValue.startsWith('https://placehold.co') || cellValue.startsWith('data:image'));

                    if (pageTitle === 'Chart of Accounts' && column.accessorKey === 'type') {
                        return (
                             <TableCell key={column.accessorKey}>
                                <Badge variant="outline" className={cn("border-transparent", getBadgeVariantForAccountType(cellValue as string))}>
                                    {cellValue}
                                </Badge>
                             </TableCell>
                        );
                    }

                    return (
                      <TableCell key={column.accessorKey}>
                        {isImageUrl
                          ? <Image src={cellValue} alt={item.itemName || 'Product Image'} width={40} height={40} className="rounded" data-ai-hint={item.dataAiHint} />
                          : cellValue
                        }
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" aria-label={`Actions for ${item.name || item.id}`}>
                          <span className="sr-only">Open menu</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleUpdate(item)}>
                          <FilePenLine className="mr-2 h-4 w-4" /> {t('datatable.update')}
                        </DropdownMenuItem>

                        {pageTitle === 'Product Catalog' && (
                           <DropdownMenuItem asChild>
                                <Link href={`/inventory-barcode/generate?sku=${item.sku}`}>
                                    <Barcode className="mr-2 h-4 w-4" /> {t('datatable.generate_code')}
                                </Link>
                           </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                    <Trash2 className="mr-2 h-4 w-4" /> {t('datatable.delete')}
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>{t('datatable.delete_confirm_title')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t('datatable.delete_confirm_desc')}
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>{t('settings.cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive hover:bg-destructive/90">
                                    {t('datatable.delete')}
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  {t('datatable.no_results')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            {t('datatable.previous')}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t('datatable.page_info', {currentPage, totalPages})}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            {t('datatable.next')}
          </Button>
        </div>
      )}

      {isMappingDialogOpen && csvData && (
        <CsvColumnMapper
            isOpen={isMappingDialogOpen}
            onClose={() => setIsMappingDialogOpen(false)}
            csvHeaders={csvData.headers}
            targetColumns={columns.filter(c => c.accessorKey !== 'id')}
            onSubmit={handleMappingComplete}
        />
      )}

      <DataFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleFormSubmit}
        defaultValues={selectedItem}
        columns={columns.filter(c => c.accessorKey !== 'id')} // Don't show ID in form
        title={selectedItem?.id ? `${t('datatable.edit_title')} ${pageTitle}` : `${t('datatable.create_title')} ${pageTitle}`}
        options={formOptions}
      />

      {pageTitle === 'Purchases' && (
        <ScanInvoiceDialog
          isOpen={isScanDialogOpen}
          onClose={() => setIsScanDialogOpen(false)}
          onScanComplete={(data) => {
            setIsScanDialogOpen(false);
            handleCreate(data);
          }}
        />
      )}
    </div>
  );
}
