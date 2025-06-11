
"use client";

import type { GenericItem, ColumnDefinition } from '@/lib/data';
import React, { useState, useMemo } from 'react';
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { FilePlus, FilePenLine, Trash2, ChevronDown, Upload, Download, Filter } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"

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
  const [selectedItem, setSelectedItem] = useState<GenericItem | null>(null);
  const { toast } = useToast();

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
    // Mock create: add a new empty item or open a form dialog
    toast({ title: "Create Item", description: "Mock create action for " + pageTitle });
    // Example: const newItem = { id: `new-${Date.now()}`, ...columns.reduce((acc, col) => ({...acc, [col.accessorKey]: ''}), {})};
    // setTableData(prev => [newItem, ...prev]);
  };

  const handleUpdate = (item: GenericItem) => {
    setSelectedItem(item);
    toast({ title: "Update Item", description: `Mock update action for item: ${item.id}` });
    // In a real app, this would open a form dialog pre-filled with item's data
  };

  const handleDelete = (itemId: string) => {
    setTableData(prev => prev.filter(item => item.id !== itemId));
    toast({ title: "Item Deleted", description: `Item ${itemId} has been deleted.` });
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "File Uploaded",
        description: `${file.name} selected. In a real app, this would be processed.`,
      });
      // Mock: console.log("Uploaded file:", file.name);
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Data",
      description: `Data for ${pageTitle} would be exported. (Mock action)`,
    });
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
        <div className="flex gap-2">
          <Button onClick={handleCreate} variant="outline">
            <FilePlus className="mr-2 h-4 w-4" /> Create New
          </Button>
           <label htmlFor="file-upload" className="cursor-pointer">
            <Button asChild variant="outline">
              <span><Upload className="mr-2 h-4 w-4" /> Refresh Data</span>
            </Button>
          </label>
          <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} accept=".xlsx, .xlsm, .csv" />
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>

      <div className="rounded-md border shadow-sm">
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
                      {column.cell ? column.cell({ row: { getValue: (key: string) => item[key] } }) : item[column.accessorKey]}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleUpdate(item)}>
                          <FilePenLine className="mr-2 h-4 w-4" /> Update
                        </DropdownMenuItem>
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
    </div>
  );
}
