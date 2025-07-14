
import React from 'react';

// Mock data for various ERP modules

export interface GenericItem {
  id: string;
  [key: string]: any;
}

export interface ColumnDefinition {
  accessorKey: string;
  header: string;
  cell?: ({ row }: { row: { getValue: (key: string) => any } }) => JSX.Element | string | number;
}

const createMockData = (count: number, fields: string[]): GenericItem[] => {
  return Array.from({ length: count }, (_, i) => {
    const item: GenericItem = { id: `item-${i + 1}` };
    fields.forEach(field => {
      if (field.toLowerCase().includes('name') || field.toLowerCase().includes('item')) {
        item[field] = `Sample ${field.charAt(0).toUpperCase() + field.slice(1)} ${i + 1}`;
      } else if (field.toLowerCase().includes('quantity') || field.toLowerCase().includes('stock')) {
        item[field] = Math.floor(Math.random() * 100) + 1;
      } else if (field.toLowerCase().includes('price') || field.toLowerCase().includes('amount') || field.toLowerCase().includes('cost')) {
        item[field] = parseFloat((Math.random() * 500 + 10).toFixed(2));
      } else if (field.toLowerCase().includes('date')) {
        item[field] = new Date(Date.now() - Math.floor(Math.random() * 1e10)).toLocaleDateString();
      } else if (field.toLowerCase().includes('barcode')) {
        item[field] = `BC-${String(Math.floor(Math.random() * 1e8)).padStart(8, '0')}`;
      } else {
        item[field] = `Value ${i + 1}`;
      }
    });
    return item;
  });
};


const moduleDataConfig: Record<string, { fields: string[], count: number }> = {
  inventory: { fields: ['itemName', 'sku', 'quantity', 'unitPrice', 'category'], count: 20 },
  'inventory-barcode': { fields: ['itemName', 'barcode', 'quantity'], count: 15 },
  purchases: { fields: ['purchaseOrder', 'vendorName', 'purchaseDate', 'totalAmount', 'status'], count: 10 },
  sales: { fields: ['invoiceNumber', 'customerName', 'saleDate', 'totalAmount', 'paymentStatus'], count: 30 },
  expenses: { fields: ['expenseCategory', 'expenseDate', 'amount', 'description', 'paidTo'], count: 25 },
  customers: { fields: ['customerName', 'email', 'phone', 'address', 'joinDate'], count: 18 },
  vendors: { fields: ['vendorName', 'contactPerson', 'email', 'phone', 'productCategory'], count: 12 },
  logistics: { fields: ['shipmentId', 'routeName', 'driverName', 'status', 'estimatedDeliveryDate'], count: 8 },
  ipcc: { fields: ['ipccId', 'description', 'relatedModule', 'status', 'lastUpdated'], count: 5 },
  ipbt: { fields: ['ipbtId', 'taskName', 'assignedTo', 'dueDate', 'priority'], count: 7 },
  'purchases-cal': { fields: ['eventTitle', 'eventType', 'eventDate', 'relatedPO', 'notes'], count: 9 },
  'bank-statement': { fields: ['transactionDate', 'description', 'debit', 'credit', 'balance'], count: 40 },
};

export const getMockData = (slug: string): GenericItem[] => {
  const config = moduleDataConfig[slug];
  if (!config) return [];
  return createMockData(config.count, config.fields);
};

export const getColumns = (slug: string): ColumnDefinition[] => {
  const config = moduleDataConfig[slug];
  if (!config) return [];
  
  const columns = config.fields.map(field => ({
    accessorKey: field,
    header: field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), // Format field name to readable header
  }));

  // Example of custom cell rendering for price/amount fields
  columns.forEach(col => {
    if (col.accessorKey.toLowerCase().includes('price') || col.accessorKey.toLowerCase().includes('amount') || col.accessorKey.toLowerCase().includes('cost') || col.accessorKey.toLowerCase().includes('debit') || col.accessorKey.toLowerCase().includes('credit')) {
      col.cell = ({ row }) => {
        const amount = parseFloat(row.getValue(col.accessorKey));
        const formatted = new Intl.NumberFormat("en-AE", {
          style: "currency",
          currency: "AED",
        }).format(amount);
        return React.createElement('div', { className: "text-right font-medium" }, formatted);
      };
    }
    if (col.accessorKey.toLowerCase().includes('status')) {
       col.cell = ({ row }) => {
        const status = row.getValue(col.accessorKey) as string;
        let colorClass = '';
        if (status.toLowerCase().includes('paid') || status.toLowerCase().includes('delivered') || status.toLowerCase().includes('completed')) colorClass = 'text-green-600 bg-green-100';
        else if (status.toLowerCase().includes('pending') || status.toLowerCase().includes('processing')) colorClass = 'text-yellow-600 bg-yellow-100';
        else if (status.toLowerCase().includes('failed') || status.toLowerCase().includes('cancelled')) colorClass = 'text-red-600 bg-red-100';
        else colorClass = 'text-gray-600 bg-gray-100';
        
        return React.createElement('span', { className: `px-2 py-1 rounded-full text-xs font-medium ${colorClass}` }, status);
       };
    }
  });
  
  return columns;
};

export const getPageTitle = (slug: string): string => {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Management';
};

export const moduleSlugs = Object.keys(moduleDataConfig);

// Sample structure for dashboard summary - actual calculation would be complex
export const getDashboardSummary = () => ({
  totalSales: 125670,
  inventoryValue: 85300,
  totalPurchases: 62150,
  activeCustomers: 1280,
});
