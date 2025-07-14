
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

export const USD_TO_AED_RATE = 3.6725;

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
  if (slug === 'purchases-cal') {
    // This page has a custom data structure, handled separately
    return [];
  }


  let runningBalance = 5000;
  const data = Array.from({ length: count }, (_, i) => {
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
          item[field] = Math.floor(Math.random() * 3) + 1;
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
        case 'usd':
            item[field] = parseFloat((Math.random() * 75 + 5).toFixed(2));
            break;
        case 'exchangeRate':
            item[field] = USD_TO_AED_RATE;
            break;
        case 'aed':
            item[field] = parseFloat((item['usd'] * (item['exchangeRate'] || USD_TO_AED_RATE)).toFixed(4));
            break;
        case 'customsFees':
            item[field] = parseFloat(((item['usd'] * (item['exchangeRate'] || USD_TO_AED_RATE)) * 0.05).toFixed(4)); // 5% of AED
            break;
        case 'shippingFees':
            item[field] = parseFloat((Math.random() * 20 + 5).toFixed(4));
            break;
        case 'bankCharges':
            item[field] = parseFloat((Math.random() * 5 + 1).toFixed(4));
            break;
        case 'totalCost':
             // This is now calculated dynamically in the mock data creation
            break;
        case 'totalCostPerUnit':
            // This is now calculated dynamically in the mock data creation
            break;
        case 'amount':
           item[field] = parseFloat((Math.random() * 1500 + 30).toFixed(2));
           break;
        case 'credit':
        case 'debit':
          item[field] = parseFloat((Math.random() * 500 + 20).toFixed(2));
          break;
        case 'balance':
           // calculated post-loop
           break;
        case 'totalAmount': // Kept for backward compatibility if other parts use it
           const quantityTA = item['quantity'] || 1;
           const unitCostTA = item['unitCost'] || item['unitPrice'] || randomInventoryItem.unitPrice * 0.8; // Assume purchase cost is lower
           item[field] = parseFloat((quantityTA * unitCostTA).toFixed(2));
           break;
        case 'shipping':
        case 'shippingCost':
        case 'referralFees':
        case 'paymentFees':
          item[field] = parseFloat((Math.random() * -30).toFixed(2));
          break;
        case 'totalSales':
            const price = item['price'] || 0;
            const shippingFee = item['shipping'] || 0;
            const referral = item['referralFees'] || 0;
            const shippingC = item['shippingCost'] || 0;
            const payment = item['paymentFees'] || 0;
            item[field] = parseFloat((price + shippingFee + referral + shippingC + payment).toFixed(2));
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
             item[field] = slug === 'expenses' ? mockExpenseDescriptions[i % mockExpenseDescriptions.length] : `Sample Transaction Description ${i + 1}`;
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
        case 'refNumber':
            item[field] = `${Math.floor(Math.random() * 90000000) + 10000000}`;
            break;
        case 'transactionType':
            item[field] = Math.random() > 0.5 ? 'Transfers' : 'Card Payment';
            break;
        default:
          if (field.toLowerCase().includes('name') || field.toLowerCase().includes('item')) {
            item[field] = `Sample ${field.charAt(0).toUpperCase() + field.slice(1)} ${i + 1}`;
          } else {
             item[field] = `Value ${i + 1}`;
          }
      }
    });

    // Recalculate IPCC totals after all values are set
    if (slug === 'ipcc') {
        const exchangeRate = item['exchangeRate'] || USD_TO_AED_RATE;
        item['aed'] = parseFloat(((item['usd'] || 0) * exchangeRate).toFixed(4));
        
        const aed = item['aed'] || 0;
        const customs = item['customsFees'] || 0;
        const shipping = item['shippingFees'] || 0;
        const bank = item['bankCharges'] || 0;
        item['totalCost'] = parseFloat((aed + customs + shipping + bank).toFixed(4));

        const totalCost = item['totalCost'] || 0;
        const qty = item['quantity'] || 1;
        item['totalCostPerUnit'] = parseFloat((totalCost / qty).toFixed(4));
    }
     if (slug === 'bank-statement') {
        const isCredit = Math.random() > 0.6; // More debits than credits
        const amount = parseFloat((Math.random() * (isCredit ? 800 : 250) + 20).toFixed(2));
        if (isCredit) {
            item['credit'] = amount;
            item['debit'] = 0;
            runningBalance += amount;
        } else {
            item['debit'] = amount;
            item['credit'] = 0;
            runningBalance -= amount;
        }
        item['balance'] = runningBalance;
    }


    return item;
  });

  // Reverse the array so the latest transaction is first, and balance makes sense
  if (slug === 'bank-statement') {
    return data.reverse();
  }
  return data;
};

// Data for Purchases Calculator
export const purchasesCalSummaryData = [
    { id: 'pcs-1', date: '18-Aug-2024', invoiceNo: 'PI15963C001', priceUsd: 1441, priceAed: 5292.793, qty: 42, shipping: 1302, bankCharges: 115.5, total: 6710.293 },
    { id: 'pcs-2', date: '21-Sep-2024', invoiceNo: 'PI2415963C002', priceUsd: 4320, priceAed: 15867.36, qty: 140, shipping: 2534.08, bankCharges: 231, total: 18632.44 },
];

export const purchasesCalDetailsData = [
    { id: 'pcd-1', invoiceNo: 'PI15963C001', date: '18-Aug-2024', sku: 'FIFGAMSSC3B', priceUsd: 28, priceAed: 102.844, qty: 15, priceQty: 1542.66, shippingFees: 325.5, totalCost: 1868.16, unitCost: 124.544 },
    { id: 'pcd-2', invoiceNo: 'PI15963C001', date: '18-Aug-2024', sku: 'FIFGAMSSC3W', priceUsd: 28, priceAed: 102.844, qty: 15, priceQty: 1542.66, shippingFees: 325.5, totalCost: 1868.16, unitCost: 124.544 },
    { id: 'pcd-3', invoiceNo: 'PI15963C001', date: '18-Aug-2024', sku: 'FIFUXDTAM8B', priceUsd: 48, priceAed: 176.304, qty: 6, priceQty: 1057.824, shippingFees: 325.5, totalCost: 1383.324, unitCost: 230.554 },
    { id: 'pcd-4', invoiceNo: 'PI15963C001', date: '18-Aug-2024', sku: 'FIFUXDTAM8W', priceUsd: 48, priceAed: 176.304, qty: 6, priceQty: 1057.824, shippingFees: 325.5, totalCost: 1383.324, unitCost: 230.554 },
    { id: 'pcd-5', invoiceNo: 'PI2415963C002', date: '21-Sep-2024', sku: 'FIFGAMSSC3B', priceUsd: 28, priceAed: 102.844, qty: 30, priceQty: 3085.32, shippingFees: 422.25, totalCost: 3507.57, unitCost: 116.919 },
    { id: 'pcd-6', invoiceNo: 'PI2415963C002', date: '21-Sep-2024', sku: 'FIFGAMSSC3W', priceUsd: 28, priceAed: 102.844, qty: 30, priceQty: 3085.32, shippingFees: 422.25, totalCost: 3507.57, unitCost: 116.919 },
    { id: 'pcd-7', invoiceNo: 'PI2415963C002', date: '21-Sep-2024', sku: 'FIFUXDMAM8NB', priceUsd: 32.5, priceAed: 119.3725, qty: 80, priceQty: 9549.8, shippingFees: 1805.08, totalCost: 11354.88, unitCost: 141.936 },
];


const moduleDataConfig: Record<string, { fields: string[], count: number }> = {
  inventory: { fields: ['itemName', 'sku', 'quantity', 'unitPrice', 'category'], count: INVENTORY_ITEMS_POOL_SIZE },
  'inventory-barcode': { fields: ['itemName', 'barcode', 'quantity'], count: INVENTORY_ITEMS_POOL_SIZE },
  purchases: { fields: ['purchaseDate', 'supplier', 'sku', 'itemName', 'quantity', 'unitCost', 'totalCost'], count: 10 },
  sales: { fields: ['saleDate', 'customerName', 'orderId', 'sku', 'itemName', 'qtySold', 'qtyRtv', 'note', 'price', 'shipping', 'referralFees', 'shippingCost', 'paymentFees', 'totalSales'], count: 30 },
  invoices: { fields: [], count: 0 },
  expenses: { fields: ['expenseDate', 'description', 'supplier', 'category', 'amount'], count: 12 },
  customers: { fields: ['customerName', 'email', 'phone', 'address', 'joinDate'], count: 18 },
  vendors: { fields: ['vendorName', 'contactPerson', 'email', 'phone', 'productCategory'], count: VENDORS_POOL_SIZE },
  logistics: { fields: ['shipmentId', 'routeName', 'driverName', 'status', 'estimatedDeliveryDate'], count: 8 },
  ipcc: { fields: ['date', 'sku', 'quantity', 'usd', 'exchangeRate', 'aed', 'customsFees', 'shippingFees', 'bankCharges', 'totalCost', 'totalCostPerUnit'], count: 20 },
  ipbt: { fields: ['ipbtId', 'taskName', 'assignedTo', 'dueDate', 'priority'], count: 7 },
  'purchases-cal': { fields: [], count: 0 },
  'bank-statement': { fields: ['transactionDate', 'transactionType', 'refNumber', 'description', 'debit', 'credit', 'balance'], count: 40 },
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
    const currencyColumns = [
        'price', 'shipping', 'referralFees', 'shippingCost', 'paymentFees', 'totalSales', 
        'amount', 'unitCost', 'debit', 'credit', 'balance', 'totalAmount', 'unitPrice', 
        'totalCost', 'usd', 'aed', 'customsFees', 'shippingFees', 'bankCharges', 
        'totalCostPerUnit'
    ];
    if (currencyColumns.includes(col.accessorKey)) {
      col.cell = ({ row }) => {
        const amount = parseFloat(row.getValue(col.accessorKey));
        if (col.accessorKey === 'debit' && amount === 0) return React.createElement('div', { className: 'text-right' }, '-');
        if (col.accessorKey === 'credit' && amount === 0) return React.createElement('div', { className: 'text-right' }, '-');
        
        const formatOptions: Intl.NumberFormatOptions = {
          minimumFractionDigits: 2,
          maximumFractionDigits: col.accessorKey.match(/aed|Fees|Charges|Cost|PerUnit|usd|exchangeRate/i) ? 4 : 2
        };
        const formatted = new Intl.NumberFormat("en-US", formatOptions).format(amount || 0);
        
        const currencySymbol = col.accessorKey === 'usd' ? '$ ' : React.createElement(Image, { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UAE_Dirham_Symbol.svg/1377px-UAE_Dirham_Symbol.svg.png", alt: "AED", width: 14, height: 14, className: "inline-block" });

        return React.createElement(
          'div', 
          { className: `text-right font-medium flex items-center justify-end gap-1 ${col.accessorKey === 'debit' ? 'text-red-500' : col.accessorKey === 'credit' ? 'text-green-500' : ''}` }, 
          currencySymbol,
          formatted
        );
      };
    }
     if (col.accessorKey === 'exchangeRate') {
        col.cell = ({ row }) => {
            const rate = parseFloat(row.getValue(col.accessorKey));
            return React.createElement('div', { className: 'text-right' }, rate?.toFixed(4) || 'N/A');
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
  if (slug === 'ipcc') {
    return 'Item Purchased Cost Calculator';
  }
   if (slug === 'purchases-cal') {
    return 'Purchases Calculator';
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
