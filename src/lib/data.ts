
import React from 'react';
import Image from 'next/image';

// Mock data for various ERP modules

export interface GenericItem {
  id: string;
  [key: string]: any;
}

export interface ColumnDefinition {
  accessorKey: string;
  header: string;
  cell?: ({ row }: { row: { getValue: (key: string) => any, original: GenericItem } }) => JSX.Element | string | number;
}

// Master product catalog
export const productCatalogPool: GenericItem[] = Array.from({ length: 40 }, (_, i) => ({
  id: `cat-item-${i + 1}`,
  itemName: `Master Product ${i + 1}`,
  sku: `SKU-${String(10001 + i)}`,
  unitPrice: parseFloat((Math.random() * 500 + 10).toFixed(2)),
  category: `Category ${String.fromCharCode(65 + (i % 5))}`,
  description: `This is the master description for Product ${i + 1}.`,
  productWeight: `${(Math.random() * 2).toFixed(2)} kg`,
  productDimensions: `${(Math.random() * 20).toFixed(1)}x${(Math.random() * 15).toFixed(1)}x${(Math.random() * 10).toFixed(1)} cm`,
  packageWeight: `${(Math.random() * 2 + 0.1).toFixed(2)} kg`,
  packageDimensions: `${(Math.random() * 20 + 2).toFixed(1)}x${(Math.random() * 15 + 2).toFixed(1)}x${(Math.random() * 10 + 2).toFixed(1)} cm`,
  imageUrl: `https://placehold.co/100x100.png`,
  dataAiHint: `product photo`,
}));


// Generate a pool of inventory items that can be referenced by other modules
const INVENTORY_ITEMS_POOL_SIZE = 20;
// Inventory is now a subset of the product catalog
export const inventoryItemsPool = productCatalogPool.slice(0, INVENTORY_ITEMS_POOL_SIZE).map((item, i) => ({
  ...item,
  id: `item-${i + 1}`,
  quantity: Math.floor(Math.random() * 100) + 1,
}));


// Generate a pool of vendors that can be referenced by other modules
const VENDORS_POOL_SIZE = 12;
export const vendorsPool = Array.from({ length: VENDORS_POOL_SIZE }, (_, i) => ({
  id: `vendor-${i + 1}`,
  vendorName: `Supplier Co ${String.fromCharCode(65 + i)}`,
  contactPerson: `Contact ${String.fromCharCode(65 + i)}`,
  email: `contact@supplier${String.fromCharCode(65 + i)}.com`,
  phone: `+971 55 555 100${i}`,
  productCategory: `Category ${String.fromCharCode(65 + (i % 4))}`
}));


const mockExpenseDescriptions = [
  "Domain subscription",
  "Business Lounge VIP Services",
  "Trade License fees",
  "Web Hosting Services",
  "WoodMart Premium WordPress Theme",
  "Office Supplies",
  "Internet Bill",
  "Electricity Bill",
  "Marketing Campaign",
  "Software License Renewal",
  "FBN Charge for Shipment",
  "Warehouse Storage Fee"
];

export const expenseCategories = [
  "IT & Software Subscriptions",
  "Government & Licensing",
  "Freelance Services",
  "Bank Expense",
  "Transport Expense",
  "FBN Charges",
  "Logistics & Shipping Fees",
  "Storage Expenses",
  "Office Utilities",
  "Marketing",
];


const createMockData = (count: number, fields: string[], slug: string): GenericItem[] => {
  if (slug === 'inventory') {
    return inventoryItemsPool;
  }
  if (slug === 'vendors') {
    return vendorsPool;
  }
  if (slug === 'product-catalog') {
    return productCatalogPool;
  }
  if (slug === 'invoices') {
    return []; // Invoice data will be handled by the form, not mock data.
  }


  return Array.from({ length: count }, (_, i) => {
    const item: GenericItem = { id: `${slug}-item-${i + 1}` };
    const randomInventoryItem = inventoryItemsPool[Math.floor(Math.random() * inventoryItemsPool.length)];
    const randomVendor = vendorsPool[Math.floor(Math.random() * VENDORS_POOL_SIZE)];

    fields.forEach(field => {
      switch (field) {
        case 'itemName':
          item[field] = randomInventoryItem.itemName;
          break;
        case 'sku':
          item[field] = randomInventoryItem.sku;
          break;
        case 'quantity':
        case 'stock':
        case 'qtySold':
          item[field] = Math.floor(Math.random() * 5) + 1;
          break;
        case 'qtyRtv':
          item[field] = Math.random() > 0.8 ? 1 : 0;
          break;
        case 'note':
           item[field] = item['qtyRtv'] ? 'Returned' : '';
           break;
        case 'price':
        case 'unitPrice':
        case 'unitCost':
          item[field] = parseFloat((randomInventoryItem.unitPrice * (0.9 + Math.random() * 0.2)).toFixed(2));
          break;
        case 'amount':
           item[field] = parseFloat((Math.random() * 1500 + 30).toFixed(2));
           break;
        case 'totalAmount': // Kept for backward compatibility if other parts use it
        case 'totalCost': // For purchases
           const quantity = item['quantity'] || 1;
           const unitCost = item['unitCost'] || item['unitPrice'] || randomInventoryItem.unitPrice * 0.8; // Assume purchase cost is lower
           item[field] = parseFloat((quantity * unitCost).toFixed(2));
           break;
        case 'shipping':
        case 'shippingCost':
        case 'referralFees':
        case 'paymentFees':
          item[field] = parseFloat((Math.random() * -30).toFixed(2));
          break;
        case 'totalSales':
            const price = item['price'] || 0;
            const shipping = item['shipping'] || 0;
            const referral = item['referralFees'] || 0;
            const shippingCost = item['shippingCost'] || 0;
            const payment = item['paymentFees'] || 0;
            item[field] = parseFloat((price + shipping + referral + shippingCost + payment).toFixed(2));
            break;
        case 'date':
        case 'purchaseDate':
        case 'saleDate':
        case 'expenseDate':
        case 'joinDate':
        case 'estimatedDeliveryDate':
        case 'lastUpdated':
        case 'eventDate':
        case 'transactionDate':
          item[field] = new Date(Date.now() - Math.floor(Math.random() * 1e10)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
          break;
        case 'barcode':
          item[field] = randomInventoryItem.sku; // Use SKU for barcode data
          break;
        case 'orderId':
            item[field] = `${Math.floor(Math.random()*100)}-${Math.floor(Math.random()*1000000)}-${Math.floor(Math.random()*1000000)}`;
            break;
        case 'supplier':
            item[field] = slug === 'expenses' ? randomVendor.vendorName : randomVendor.vendorName;
            break;
        case 'category':
             item[field] = slug === 'expenses' ? expenseCategories[i % expenseCategories.length] : `Category ${String.fromCharCode(65 + (i % 5))}`;
             break;
        case 'description':
             item[field] = slug === 'expenses' ? mockExpenseDescriptions[i % mockExpenseDescriptions.length] : `Sample Description ${i + 1}`;
             break;
        case 'productWeight':
          item[field] = `${(Math.random() * 2).toFixed(2)} kg`;
          break;
        case 'productDimensions':
          item[field] = `${(Math.random() * 20).toFixed(1)}x${(Math.random() * 15).toFixed(1)}x${(Math.random() * 10).toFixed(1)} cm`;
          break;
        case 'packageWeight':
          item[field] = `${(Math.random() * 2 + 0.1).toFixed(2)} kg`;
          break;
        case 'packageDimensions':
          item[field] = `${(Math.random() * 20 + 2).toFixed(1)}x${(Math.random() * 15 + 2).toFixed(1)}x${(Math.random() * 10 + 2).toFixed(1)} cm`;
          break;
        case 'imageUrl':
          item[field] = `https://placehold.co/100x100.png`;
          break;
        default:
          if (field.toLowerCase().includes('name') || field.toLowerCase().includes('item')) {
            item[field] = `Sample ${field.charAt(0).toUpperCase() + field.slice(1)} ${i + 1}`;
          } else {
             item[field] = `Value ${i + 1}`;
          }
      }
    });
    return item;
  });
};


const moduleDataConfig: Record<string, { fields: string[], count: number }> = {
  inventory: { fields: ['itemName', 'sku', 'quantity', 'unitPrice', 'category'], count: INVENTORY_ITEMS_POOL_SIZE },
  'inventory-barcode': { fields: ['itemName', 'barcode', 'quantity'], count: INVENTORY_ITEMS_POOL_SIZE },
  purchases: { fields: ['purchaseDate', 'supplier', 'sku', 'itemName', 'quantity', 'totalCost'], count: 10 },
  sales: { fields: ['saleDate', 'customerName', 'orderId', 'sku', 'itemName', 'qtySold', 'qtyRtv', 'note', 'price', 'shipping', 'referralFees', 'shippingCost', 'paymentFees', 'totalSales'], count: 30 },
  invoices: { fields: [], count: 0 },
  expenses: { fields: ['expenseDate', 'description', 'supplier', 'category', 'amount'], count: 12 },
  customers: { fields: ['customerName', 'email', 'phone', 'address', 'joinDate'], count: 18 },
  vendors: { fields: ['vendorName', 'contactPerson', 'email', 'phone', 'productCategory'], count: VENDORS_POOL_SIZE },
  logistics: { fields: ['shipmentId', 'routeName', 'driverName', 'status', 'estimatedDeliveryDate'], count: 8 },
  ipcc: { fields: ['ipccId', 'description', 'relatedModule', 'status', 'lastUpdated'], count: 5 },
  ipbt: { fields: ['ipbtId', 'taskName', 'assignedTo', 'dueDate', 'priority'], count: 7 },
  'purchases-cal': { fields: ['eventTitle', 'eventType', 'eventDate', 'relatedPO', 'notes'], count: 9 },
  'bank-statement': { fields: ['transactionDate', 'description', 'debit', 'credit', 'balance'], count: 40 },
  'product-catalog': { fields: ['imageUrl', 'itemName', 'sku', 'unitPrice', 'category', 'description', 'productWeight', 'productDimensions', 'packageWeight', 'packageDimensions'], count: 40 },
};

export const getMockData = (slug: string): GenericItem[] => {
  const config = moduleDataConfig[slug];
  if (!config) return [];
  // For inventory-barcode, we just need the items themselves
  if (slug === 'inventory-barcode') {
    return inventoryItemsPool;
  }
  return createMockData(config.count, config.fields, slug);
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
    if (col.accessorKey === 'imageUrl') {
        col.header = 'Image';
        col.cell = ({ row }) => {
            const imageUrl = row.getValue('imageUrl') as string;
            const itemName = row.getValue('itemName') as string;
            const dataAiHint = row.original.dataAiHint || 'product photo';
            return React.createElement(Image, { 
                src: imageUrl, 
                alt: itemName, 
                className: 'h-16 w-16 object-cover rounded-md',
                width: 64,
                height: 64,
                'data-ai-hint': dataAiHint,
            });
        };
    }
    if (['price', 'shipping', 'referralFees', 'shippingCost', 'paymentFees', 'totalSales', 'amount', 'unitCost', 'debit', 'credit', 'balance', 'totalAmount', 'unitPrice', 'totalCost'].includes(col.accessorKey)) {
      col.cell = ({ row }) => {
        const amount = parseFloat(row.getValue(col.accessorKey));
        const formatted = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
        const displayValue = `د.إ ${formatted}`;
        return React.createElement('div', { className: 'text-right font-medium' }, displayValue);
      };
    }
    if (col.accessorKey.toLowerCase().includes('status')) {
       col.cell = ({ row }) => {
        const status = row.getValue(col.accessorKey) as string;
        let colorClass = '';
        if (status && (status.toLowerCase().includes('paid') || status.toLowerCase().includes('delivered') || status.toLowerCase().includes('completed'))) colorClass = 'text-green-600 bg-green-100';
        else if (status && (status.toLowerCase().includes('pending') || status.toLowerCase().includes('processing'))) colorClass = 'text-yellow-600 bg-yellow-100';
        else if (status && (status.toLowerCase().includes('failed') || status.toLowerCase().includes('cancelled'))) colorClass = 'text-red-600 bg-red-100';
        else colorClass = 'text-gray-600 bg-gray-100';
        
        return React.createElement('span', { className: `px-2 py-1 rounded-full text-xs font-medium ${colorClass}` }, status);
       };
    }
  });
  
  return columns;
};

export const getPageTitle = (slug: string): string => {
  if (slug === 'product-catalog') {
    return 'Product Catalog';
  }
   if (slug === 'invoices') {
    return 'Invoices';
  }
  if (slug === 'inventory-barcode') {
    return 'Inventory Barcode';
  }
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
