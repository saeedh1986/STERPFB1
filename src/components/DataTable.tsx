
"use client";

import type { GenericItem, ColumnDefinition } from '@/lib/data';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { FilePlus, FilePenLine, Trash2, ChevronDown, Upload, Download, Barcode } from 'lucide-react';
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
import { categoriesPool, brandsPool, warehousesPool } from '@/lib/data';

interface DataTableProps {
  data: GenericItem[];
  columns: ColumnDefinition[];
  pageTitle: string;
}

const ITEMS_PER_PAGE = 10;

export function DataTable({ data: initialData, columns, pageTitle }: DataTableProps) {
  const [tableData, setTableData] = useState<GenericItem[]>(initialData);
  const [globalFilter, setGlobalFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleCreate = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleUpdate = (item: GenericItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (itemId: string) => {
    setTableData(prev => prev.filter(item => item.id !== itemId));
    toast({ title: "Item Deleted", description: `Item ${itemId} has been deleted.` });
  };
  
  const handleFormSubmit = (values: GenericItem) => {
    if (selectedItem) {
      // Update existing item
      setTableData(prev => prev.map(item => item.id === selectedItem.id ? { ...item, ...values } : item));
      toast({ title: "Item Updated", description: "The record has been successfully updated." });
    } else {
      // Create new item
      const newItem = { ...values, id: `new-${Date.now()}` };
      setTableData(prev => [newItem, ...prev]);
      toast({ title: "Item Created", description: "A new record has been successfully added." });
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
        
        const headerLine = lines[0].trim();
        const headers = headerLine.split(',').map(h => h.trim());
        const dataLines = lines.slice(1);
        
        const columnAccessors = columns.filter(c => c.accessorKey !== 'id').map(c => c.accessorKey);

        const newRecords = dataLines.map(line => {
          const values = line.split(',').map(v => v.trim());
          const record: GenericItem = { id: `new-${Date.now()}-${Math.random()}` };
          columnAccessors.forEach((accessor, index) => {
            record[accessor] = values[index] || '';
          });
          return record;
        });

        setTableData(prev => [...newRecords, ...prev]);
        toast({
          title: "Import Successful",
          description: `${newRecords.length} record(s) have been added.`,
        });

      } catch (error) {
        toast({
          title: "Import Failed",
          description: error instanceof Error ? error.message : "Could not parse the CSV file.",
          variant: "destructive",
        });
      } finally {
        // Reset file input
        if(fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const headers = columns.filter(c => c.accessorKey !== 'id').map(c => c.header).join(',');
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
      title: "Template Downloaded",
      description: "A CSV template has been downloaded.",
    });
  };

  const formOptions = {
    ...(pageTitle === 'Product Catalog' && {
        categories: categoriesPool,
        brands: brandsPool
    }),
    ...(pageTitle === 'Inventory' && {
        warehouses: warehousesPool,
        categories: categoriesPool,
    }),
    ...(pageTitle === 'Sales' && {
        salesChannels: ['Direct Sales', 'Amazon AE', 'Noon AE'],
        fulfillmentWarehouses: ['Main Warehouse', 'Amazon Warehouse', 'Noon Warehouse'],
    }),
  };


  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Input
          placeholder="Filter records..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleCreate}>
            <FilePlus className="mr-2 h-4 w-4" /> Create New
          </Button>
           <label htmlFor="file-upload" className="cursor-pointer">
            <Button asChild variant="outline">
              <span><Upload className="mr-2 h-4 w-4" /> Import from CSV</span>
            </Button>
          </label>
          <input id="file-upload" type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".csv" />
          <Button onClick={handleDownloadTemplate} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download Template
          </Button>
        </div>
      </div>

      <div className="rounded-md border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey} className="font-semibold">{column.header}</TableHead>
              ))}
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      {column.cell ? column.cell({ row: { getValue: (key: string) => item[key], original: item } }) : item[column.accessorKey]}
                    </TableCell>
                  ))}
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
                          <FilePenLine className="mr-2 h-4 w-4" /> Update
                        </DropdownMenuItem>

                        {pageTitle === 'Product Catalog' && (
                           <DropdownMenuItem asChild>
                                <Link href={`/inventory-barcode/generate?sku=${item.sku}`}>
                                    <Barcode className="mr-2 h-4 w-4" /> Generate Code
                                </Link>
                           </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the item.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive hover:bg-destructive/90">
                                    Delete
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
                  No results found.
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
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <DataFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleFormSubmit}
        defaultValues={selectedItem}
        columns={columns.filter(c => c.accessorKey !== 'id')} // Don't show ID in form
        title={selectedItem ? `Edit ${pageTitle}` : `Create New ${pageTitle}`}
        options={formOptions}
      />
    </div>
  );
}
