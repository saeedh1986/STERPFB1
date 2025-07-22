

import { cn } from '@/lib/utils';


// Mock data for various ERP modules

export interface GenericItem {
  id: string;
  [key: string]: any;
}

export interface ColumnDefinition {
  accessorKey: string;
  header: string;
}

export const labelSizes = [
    { name: "40mm x 25mm", widthDots: 320, heightDots: 200 },
    { name: "50mm x 30mm", widthDots: 400, heightDots: 240 },
    { name: "60mm x 40mm", widthDots: 480, heightDots: 320 },
];
export type LabelSize = typeof labelSizes[0];


export const categoriesPool: GenericItem[] = [
    { id: 'cat-1', name: 'Microphones', description: 'Microphones for various purposes.' },
    { id: 'cat-2', name: 'Mixers', description: 'Audio mixers.' },
    { id: 'cat-3', name: 'Gaming handheld', description: 'Handheld gaming devices.' },
    { id: 'cat-4', name: 'Headset', description: 'Audio headsets.' },
    { id: 'cat-5', name: 'Airpods', description: 'Wireless earbuds.' },
    { id: 'cat-6', name: 'Microphone Accessores', description: 'Accessories for microphones.' },
];

export const brandsPool: GenericItem[] = [
    { id: 'brand-1', name: 'FIFINE', website: 'https://fifinemicrophone.com/' },
    { id: 'brand-2', name: 'Trimui', website: '' },
    { id: 'brand-3', name: 'MIYOO', website: '' },
    { id: 'brand-4', name: 'Generic', website: '' },
];

export const warehousesPool: GenericItem[] = [
    { id: 'wh-1', name: 'Main Warehouse', location: 'Dubai, UAE' },
    { id: 'wh-2', name: 'Amazon Warehouse', location: 'Amazon FBA Center, Dubai' },
    { id: 'wh-3', name: 'Noon Warehouse', location: 'Noon Fulfillment Center, Dubai' },
    { id: 'wh-4', name: 'Secondary Storage', location: 'Sharjah, UAE' },
];


// Master product catalog based on user provided data
export const productCatalogPool: GenericItem[] = [
  {
    id: 'prod-1',
    itemName: 'FIFINE XLR/USB Dynamic Microphone Black',
    sku: 'FIFUXDMAM8B',
    category: 'Microphones',
    brand: 'FIFINE',
    unitPrice: parseFloat((Math.random() * 200 + 150).toFixed(2)),
  },
  {
    id: 'prod-2',
    itemName: 'FIFINE XLR/USB Dynamic Microphone White',
    sku: 'FIFUXDMAM8W',
    category: 'Microphones',
    brand: 'FIFINE',
    unitPrice: parseFloat((Math.random() * 200 + 150).toFixed(2)),
  },
  {
    id: 'prod-3',
    itemName: 'FIFINE XLR/USB Dynamic Microphone Pink',
    sku: 'FIFUXDMAM8P',
    category: 'Microphones',
    brand: 'FIFINE',
    unitPrice: parseFloat((Math.random() * 200 + 150).toFixed(2)),
  },
  {
    id: 'prod-4',
    itemName: 'FIFINE Gaming Audio Mixer SC3 Black',
    sku: 'FIFGAMSSC3B',
    category: 'Mixers',
    brand: 'FIFINE',
    unitPrice: parseFloat((Math.random() * 100 + 80).toFixed(2)),
  },
  {
    id: 'prod-5',
    itemName: 'FIFINE Gaming Audio Mixer SC3 White',
    sku: 'FIFGAMSSC3W',
    category: 'Mixers',
    brand: 'FIFINE',
    unitPrice: parseFloat((Math.random() * 100 + 80).toFixed(2)),
  },
  {
    id: 'prod-6',
    itemName: 'Trimui Smart Pro Handheld Game 126 GB Black',
    sku: 'TSPHGCRB128G',
    category: 'Gaming handheld',
    brand: 'Trimui',
    unitPrice: parseFloat((Math.random() * 300 + 250).toFixed(2)),
  },
  {
    id: 'prod-7',
    itemName: 'MIYOO Mini Plus Portable Retro Handheld 64 GB Purple',
    sku: 'MMPPRHGCV2P64G',
    category: 'Gaming handheld',
    brand: 'MIYOO',
    unitPrice: parseFloat((Math.random() * 250 + 200).toFixed(2)),
  },
  {
    id: 'prod-8',
    itemName: 'FIFINE RGB Gaming Headset White',
    sku: 'FIFRGHH6WW',
    category: 'Headset',
    brand: 'FIFINE',
    unitPrice: parseFloat((Math.random() * 150 + 100).toFixed(2)),
  },
  {
    id: 'prod-9',
    itemName: 'FIFINE RGB Gaming Headset Pink',
    sku: 'FIFRGHH6WP',
    category: 'Headset',
    brand: 'FIFINE',
    unitPrice: parseFloat((Math.random() * 150 + 100).toFixed(2)),
  },
  {
    id: 'prod-10',
    itemName: 'FIFINE RGB Gaming Headset Black',
    sku: 'FIFRGHH6WB',
    category: 'Headset',
    brand: 'FIFINE',
    unitPrice: parseFloat((Math.random() * 150 + 100).toFixed(2)),
  },
  {
    id: 'prod-11',
    itemName: 'TWSM90 Eirpods',
    sku: 'TWSM89',
    category: 'Airpods',
    brand: 'Generic',
    unitPrice: parseFloat((Math.random() * 80 + 50).toFixed(2)),
  },
  {
    id: 'prod-12',
    itemName: 'Trimui Smart Pro Handheld Game 126 GB Retro Grey',
    sku: 'TSPHGCRRG128G',
    category: 'Gaming handheld',
    brand: 'Trimui',
    unitPrice: parseFloat((Math.random() * 300 + 250).toFixed(2)),
  },
  {
    id: 'prod-13',
    itemName: 'MIYOO Mini Plus Portable Retro Handheld 64 GB Retro Grey',
    sku: 'MMPPRHGCV2RG64G',
    category: 'Gaming handheld',
    brand: 'MIYOO',
    unitPrice: parseFloat((Math.random() * 250 + 200).toFixed(2)),
  },
  {
    id: 'prod-14',
    itemName: 'FIFINE TAM8 RGB BOOM ARM MIC black',
    sku: 'FIFUXDTAM8B',
    category: 'Microphones',
    brand: 'FIFINE',
    unitPrice: parseFloat((Math.random() * 180 + 120).toFixed(2)),
  },
  {
    id: 'prod-15',
    itemName: 'FIFINE TAM8 RGB BOOM ARM MIC Whaite', // Assuming 'Whaite' is a typo for 'White'
    sku: 'FIFUXDTAM8W',
    category: 'Microphones',
    brand: 'FIFINE',
    unitPrice: parseFloat((Math.random() * 180 + 120).toFixed(2)),
  },
  {
    id: 'prod-16',
    itemName: 'FIFINE AM8 NEO RGB MIC Black',
    sku: 'FIFUXDMAM8NB',
    category: 'Microphones',
    brand: 'FIFINE',
    unitPrice: parseFloat((Math.random() * 180 + 120).toFixed(2)),
  },
  {
    id: 'prod-17',
    itemName: 'FIFINE Wireless Lavalier MIC M6 Black',
    sku: 'FIFWLMM6B',
    category: 'Microphones',
    brand: 'FIFINE',
    unitPrice: parseFloat((Math.random() * 100 + 70).toFixed(2)),
  },
  {
    id: 'prod-18',
    itemName: 'FIFINE Wireless Lavalier System with 2 Microphones M8 Black',
    sku: 'FIFWLS2MM8B',
    category: 'Microphones',
    brand: 'FIFINE',
    unitPrice: parseFloat((Math.random() * 150 + 120).toFixed(2)),
  },
  {
    id: 'prod-19',
    itemName: 'FIFINE Microphone Arm Boom CS1 Black',
    sku: 'FIFMABCS1B',
    category: 'Microphone Accessores',
    brand: 'FIFINE',
    unitPrice: parseFloat((Math.random() * 80 + 60).toFixed(2)),
  },
  {
    id: 'prod-20',
    itemName: 'Trimui Smart Pro Handheld Game 64 GB Retro Grey',
    sku: 'TSPHGCRRG64G',
    category: 'Gaming handheld',
    brand: 'Trimui',
    unitPrice: parseFloat((Math.random() * 280 + 220).toFixed(2)),
  },
  {
    id: 'prod-21',
    itemName: 'Trimui Smart Pro Handheld Game Stand Retro Grey',
    sku: 'TSPHGCRRGNSDC',
    category: 'Gaming handheld',
    brand: 'Trimui',
    unitPrice: parseFloat((Math.random() * 50 + 30).toFixed(2)),
  },
  {
    id: 'prod-22',
    itemName: 'FIFINE Microphone Arm Boom CS1 Whaite', // Assuming 'Whaite' is a typo for 'White'
    sku: 'FIFMABCS1W',
    category: 'Microphone Accessores',
    brand: 'FIFINE',
    unitPrice: parseFloat((Math.random() * 80 + 60).toFixed(2)),
  },
].map(item => ({
    ...item,
    description: `This is the master description for ${item.itemName}.`,
    productWeight: `${(Math.random() * 2).toFixed(2)} kg`,
    productDimensions: `${(Math.random() * 20).toFixed(1)}x${(Math.random() * 15).toFixed(1)}x${(Math.random() * 10).toFixed(1)} cm`,
    packageWeight: `${(Math.random() * 2 + 0.1).toFixed(2)} kg`,
    packageDimensions: `${(Math.random() * 20 + 2).toFixed(1)}x${(Math.random() * 15 + 2).toFixed(1)}x${(Math.random() * 10 + 2).toFixed(1)} cm`,
    imageUrl: `https://placehold.co/100x100.png`,
    dataAiHint: `product photo`,
})));


// Generate a pool of inventory items that can be referenced by other modules
// This is now a flattened list of product stock per warehouse
export const inventoryItemsPool: GenericItem[] = productCatalogPool.flatMap((product, i) => {
    // Each product will be in 1 or 2 warehouses
    const numWarehouses = Math.random() > 0.5 ? 2 : 1;
    const assignedWarehouses = warehousesPool.slice(0, numWarehouses);

    return assignedWarehouses.map((warehouse, j) => ({
        ...product, // copy product details
        id: `inv-item-${i}-${j}`, // unique id for this inventory entry
        warehouse: warehouse.name,
        quantity: Math.floor(Math.random() * 20) + 1, // stock for this specific warehouse
    }));
});



// Generate a pool of vendors that can be referenced by other modules
export const vendorsPool = [
    { id: 'vendor-1', name: 'Ali Express', contact: '', email: '', address: '', website: 'https://www.aliexpress.com', city: '', country: 'China' },
    { id: 'vendor-2', name: 'fifinedesign', contact: '(861892) 263-8246', email: 'sales63@fifinedesign.com', address: 'Waijing Industry Village, No. 6, Duanzhou 3rd Road, Zhaoqing, Guangdong, China', website: '', city: 'Zhaoqing', country: 'China' },
    { id: 'vendor-3', name: 'Ancreu Technology Co., Ltd', contact: '1582046-6007', email: 'sales@dealspeeds.com', address: 'Room 406-412, hua Mei Building East, Huaqiangbei Street, Shenzhen, Guangdong, China', website: 'http://ancreu.com', city: 'Shenzhen', country: 'China' },
    { id: 'vendor-4', name: 'AliBaba', contact: '', email: '', address: '', website: 'https://www.alibaba.com', city: '', country: 'China' },
    { id: 'vendor-5', name: 'Power Carton Boxes Manufacturing LLC', contact: '', email: '', address: '', website: '', city: '', country: 'UAE' },
];

export const customersPool = [
    { id: 'cust-1', name: 'Amazon AE', contact: '', email: '', address: '', city: 'Dubai', country: 'UAE' },
    { id: 'cust-2', name: 'Noon AE', contact: '', email: '', address: '', city: 'Dubai', country: 'UAE' },
    { id: 'cust-3', name: 'Hamad Al Marzooqi', contact: '', email: 'Hamad.12233.mm@gmail.com', address: '', city: 'Abu Dhabi', country: 'UAE' },
    { id: 'cust-4', name: 'Saeed Alhebsi', contact: '(97155) 467-4949', email: '', address: '', city: 'Dubai', country: 'UAE' },
    { id: 'cust-5', name: 'Noora Abdulla', contact: '', email: '', address: '', city: 'Dubai', country: 'UAE' },
    { id: 'cust-6', name: 'Dmytro SHEMET Boxpark', contact: '(97156) 258-5044', email: 'motorcrashvine@gmail.com', address: '', city: 'Dubai', country: 'UAE' },
];

export const userRoles: GenericItem[] = [
    { id: 'role-1', name: 'Administrator', description: 'Full access to all modules and settings.' },
    { id: 'role-2', name: 'Sales Manager', description: 'Access to sales, customers, and reports.' },
    { id: 'role-3', name: 'Warehouse Staff', description: 'Access to inventory and logistics.' },
];

export const usersPool: GenericItem[] = [
    { id: 'user-1', name: 'admin', username: 'admin', password: 'password', role: 'Administrator', joinDate: '01-Jan-2024' },
    { id: 'user-2', name: 'Saeed Alhebsi', username: 'saeed', password: 'password', role: 'Administrator', joinDate: '01-Jan-2024' },
    { id: 'user-3', name: 'Ahmed Ali', username: 'ahmed', password: 'password', role: 'Sales Manager', joinDate: '15-Feb-2024' },
];


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
  "Customs Fees",
];

export const USD_TO_AED_RATE = 3.6725;

// Data for Bank Statement page
export const bankAccountDetails = {
    accountName: 'Saeed Store Electronics',
    accountNumber: '1012-XXXXXX-001',
    accountType: 'Business Advantage',
    cardNumber: 'XXXX XXXX XXXX 9876',
    accountIban: 'AE89033000001012XXXXXX001',
    accountCurrency: 'AED',
};

let runningBalance = 25480.50;
export const bankTransactionsData = Array.from({ length: 40 }, (_, i) => {
    const isCredit = Math.random() > 0.6; // More debits than credits
    const amount = parseFloat((Math.random() * (isCredit ? 800 : 250) + 20).toFixed(2));
    if (isCredit) {
        runningBalance += amount;
    } else {
        runningBalance -= amount;
    }
    return {
        id: `txn-${i + 1}`,
        date: new Date(Date.now() - (i * 86400000 * Math.random() * 3)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
        transactionType: isCredit ? 'Incoming Transfer' : (Math.random() > 0.5 ? 'Card Payment' : 'Outgoing Transfer'),
        refNumber: `${Math.floor(Math.random() * 90000000) + 10000000}`,
        description: isCredit ? `Payment from Customer #${Math.floor(Math.random() * 1000)}` : `Purchase from ${vendorsPool[i % vendorsPool.length].name}`,
        debit: isCredit ? 0 : amount,
        credit: isCredit ? amount : 0,
        balance: runningBalance,
        isAiCategorized: false,
    };
}).reverse();

export const chartOfAccountsData: GenericItem[] = [
  // Assets
  { id: 'coa-1', code: '1010', name: 'Cash and Bank', type: 'Asset' },
  { id: 'coa-2', code: '1200', name: 'Accounts Receivable', type: 'Asset' },
  { id: 'coa-3', code: '1400', name: 'Inventory Asset', type: 'Asset' },
  { id: 'coa-4', code: '1500', name: 'Prepaid Expenses', type: 'Asset' },
  // Liabilities
  { id: 'coa-5', code: '2010', name: 'Accounts Payable', type: 'Liability' },
  { id: 'coa-6', code: '2200', name: 'VAT Payable', type: 'Liability' },
  // Equity
  { id: 'coa-7', code: '3010', name: 'Owner\'s Equity', type: 'Equity' },
  { id: 'coa-8', code: '3200', name: 'Retained Earnings', type: 'Equity' },
  // Revenue
  { id: 'coa-9', code: '4010', name: 'Sales Revenue', type: 'Revenue' },
  { id: 'coa-10', code: '4020', name: 'Shipping Revenue', type: 'Revenue' },
  // Expenses
  { id: 'coa-11', code: '5010', name: 'Cost of Goods Sold', type: 'Expense' },
  { id: 'coa-12', code: '5020', name: 'Bank Charges', type: 'Expense' },
  { id: 'coa-13', code: '5030', name: 'Shipping & Logistics Fees', type: 'Expense' },
  { id: 'coa-14', code: '5040', name: 'Marketing Expenses', type: 'Expense' },
  { id: 'coa-15', code: '5050', name: 'Utilities', type: 'Expense' },
  { id: 'coa-16', code: '5060', name: 'IT & Software Subscriptions', type: 'Expense' },
  { id: 'coa-17', code: '5070', name: 'Government & Licensing', type: 'Expense' },
  { id: 'coa-18', code: '5080', name: 'Transport Expense', type: 'Expense' },
  { id: 'coa-19', code: '5090', name: 'FBN Charges', type: 'Expense' },
  { id: 'coa-20', code: '5100', name: 'Storage Expenses', type: 'Expense' },
  { id: 'coa-21', code: '5110', name: 'Freelance Services', type: 'Expense' },
  { id: 'coa-22', code: '5120', name: 'Customs Fees', type: 'Expense' },
];

const moduleDataConfig: Record<string, { fields: string[], count: number }> = {
  'product-catalog': { fields: ['imageUrl', 'itemName', 'sku', 'category', 'brand', 'unitPrice', 'description', 'productWeight', 'productDimensions', 'packageWeight', 'packageDimensions'], count: productCatalogPool.length },
  inventory: { fields: ['itemName', 'sku', 'warehouse', 'quantity', 'unitPrice', 'category'], count: 0 },
  'inventory-barcode': { fields: ['itemName', 'sku', 'quantity'], count: productCatalogPool.length },
  purchases: { fields: ['purchaseDate', 'purchaseType', 'supplier', 'sku', 'itemName', 'description', 'referenceNumber', 'quantity', 'unitCost', 'customsFees', 'shippingFees', 'bankCharges', 'totalCost'], count: 25 },
  sales: { fields: ['saleDate', 'customerName', 'orderId', 'sku', 'itemName', 'qtySold', 'qtyRtv', 'note', 'price', 'shipping', 'referralFees', 'shippingCost', 'paymentFees', 'totalSales', 'salesChannel', 'fulfillmentWarehouse'], count: 40 },
  invoices: { fields: [], count: 0 },
  expenses: { fields: ['expenseDate', 'description', 'supplier', 'category', 'amount', 'referenceNumber'], count: 20 },
  customers: { fields: ['name', 'contact', 'email', 'address', 'city', 'country'], count: customersPool.length },
  vendors: { fields: ['name', 'contact', 'email', 'address', 'website', 'city', 'country'], count: vendorsPool.length },
  employees: { fields: ['name', 'username', 'password', 'role', 'joinDate'], count: usersPool.length },
  roles: { fields: ['name', 'description'], count: userRoles.length },
  categories: { fields: ['name', 'description'], count: categoriesPool.length },
  brands: { fields: ['name', 'website'], count: brandsPool.length },
  warehouses: { fields: ['name', 'location'], count: warehousesPool.length },
  logistics: { fields: ['companyName', 'type', 'serviceDescription', 'contactDetails', 'location', 'notes'], count: 6 },
  ipcc: { fields: ['date', 'sku', 'quantity', 'usd', 'exchangeRate', 'aed', 'customsFees', 'shippingFees', 'bankCharges', 'totalCost', 'totalCostPerUnit'], count: 20 },
  ipbt: { fields: ['ipbtId', 'taskName', 'assignedTo', 'dueDate', 'priority'], count: 7 },
  'purchases-cal': { fields: [], count: 0 },
  'bank-statement': { fields: [], count: 0 }, 
  'inventory-transfer': { fields: [], count: 0 },
  'general-journal': { fields: [], count: 0 },
  'chart-of-accounts': { fields: ['code', 'name', 'type'], count: 0 },
  'trial-balance': { fields: [], count: 0 },
  'balance-sheet': { fields: [], count: 0 },
  'income-statement': { fields: [], count: 0 },
};

export const createMockData = (count: number, fields: string[], slug: string): GenericItem[] => {
  if (slug === 'inventory') {
    return inventoryItemsPool;
  }
  if (slug === 'vendors') {
    return vendorsPool;
  }
  if (slug === 'customers') {
    return customersPool;
  }
  if (slug === 'employees') {
    return usersPool;
  }
  if (slug === 'product-catalog') {
    return productCatalogPool;
  }
   if (slug === 'categories') {
    return categoriesPool;
  }
  if (slug === 'brands') {
    return brandsPool;
  }
   if (slug === 'warehouses') {
    return warehousesPool;
  }
  if (slug === 'roles') {
    return userRoles;
  }
  if (['invoices', 'purchases-cal', 'bank-statement', 'inventory-transfer', 'inventory-barcode'].includes(slug) || slug.endsWith('-journal') || slug.endsWith('-balance') || slug.endsWith('-sheet') || slug.endsWith('-statement')) {
    // These pages have custom data handling or are handled by dedicated page components
    if (slug === 'inventory-barcode') return productCatalogPool;
    return [];
  }
  
  if (slug === 'logistics') {
    return [
      { id: 'log-1', companyName: 'Qonooz', type: 'Inbound, Outbound Logistics', serviceDescription: 'Shipping locally to customers and providing shipment services from China', contactDetails: 'Hayder Allawi', location: 'UAE', notes: '' },
      { id: 'log-2', companyName: 'SHIP SMART TRANSPORT LLC', type: 'Outbound, Storage Services', serviceDescription: 'Shipping to Amazon FBA, Noon FBN, and providing storage services', contactDetails: '+971 50 432 5218', location: 'UAE', notes: '' },
      { id: 'log-3', companyName: 'Amazon Easy ship', type: 'Outbound Logistics', serviceDescription: 'Easy shipping to customers', contactDetails: '', location: 'UAE', notes: '' },
      { id: 'log-4', companyName: 'Noon Direct Ship', type: 'Outbound Logistics', serviceDescription: 'Direct shipments to customers', contactDetails: '', location: 'UAE', notes: '' },
      { id: 'log-5', companyName: 'Guangdong Hushida Electronic Co. Ltd.', type: 'Inbound Logistics', serviceDescription: 'Shipping from China to UAE', contactDetails: 'Niki Lee', location: 'China', notes: '' },
      { id: 'log-6', companyName: 'DHL', type: '', serviceDescription: '', contactDetails: '', location: '', notes: '' },
    ];
  }


  const data = Array.from({ length: count }, (_, i) => {
    const item: GenericItem = { id: `${slug}-item-${i + 1}` };
    const randomInventoryItem = inventoryItemsPool[Math.floor(Math.random() * inventoryItemsPool.length)];
    const randomVendor = vendorsPool[Math.floor(Math.random() * vendorsPool.length)];
    const randomCustomer = customersPool[Math.floor(Math.random() * customersPool.length)];

    fields.forEach(field => {
      switch (field) {
        case 'itemName':
          item[field] = randomInventoryItem.itemName;
          break;
        case 'sku':
          item[field] = randomInventoryItem.sku;
          break;
        case 'customerName':
            item[field] = randomCustomer.name;
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
          item[field] = parseFloat((randomInventoryItem.unitPrice * (1.2 + Math.random() * 0.3)).toFixed(2));
          break;
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
            item[field] = parseFloat(((item['unitCost'] * item['quantity']) * 0.05).toFixed(2)); // 5% of item cost
            break;
        case 'shipping':
        case 'shippingFees':
        case 'shippingCost':
            item[field] = parseFloat((Math.random() * 20 + 5).toFixed(2));
            break;
        case 'bankCharges':
            item[field] = parseFloat((Math.random() * 5 + 1).toFixed(2));
            break;
        case 'paymentFees':
            item[field] = parseFloat((Math.random() > 0.5 ? -12 : -15).toFixed(2));
            break;
        case 'referralFees':
            item[field] = parseFloat(((item['price'] || 0) * -0.15).toFixed(2)); // ~15% referral fee
            break;
        case 'totalCost':
            const quantity = item['quantity'] || 1;
            const unitCost = item['unitCost'] || item['unitPrice'] || 0;
            const itemsCost = quantity * unitCost;
            const landedCost = itemsCost + (item['customsFees'] || 0) + (item['shippingFees'] || 0) + (item['bankCharges'] || 0);
            item[field] = parseFloat(landedCost.toFixed(2));
            break;
        case 'totalSales':
            const price = item['price'] || 0;
            const shippingFee = item['shipping'] || 0;
            const referral = item['referralFees'] || 0;
            const shippingC = item['shippingCost'] || 0;
            const payment = item['paymentFees'] || 0;
            item[field] = parseFloat((price + shippingFee + referral + shippingC + payment).toFixed(2));
            break;
        case 'totalCostPerUnit':
            break;
        case 'amount':
           item[field] = parseFloat((Math.random() * 1500 + 30).toFixed(2));
           break;
        case 'totalAmount':
           const quantityTA = item['quantity'] || 1;
           const unitCostTA = item['unitCost'] || item['unitPrice'] || randomInventoryItem.unitPrice * 0.8;
           item[field] = parseFloat((quantityTA * unitCostTA).toFixed(2));
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
          item[field] = new Date(Date.now() - Math.floor(Math.random() * 3e9)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
          break;
        case 'barcode':
          item[field] = randomInventoryItem.sku;
          break;
        case 'orderId':
            item[field] = `${Math.floor(Math.random()*100)}-${Math.floor(Math.random()*1000000)}-${Math.floor(Math.random()*1000000)}`;
            break;
        case 'referenceNumber':
            item[field] = `PO-${Math.floor(Math.random() * 9000) + 1000}`;
            if (slug === 'expenses') {
              // Give some expenses a PO number to link them
              if (Math.random() > 0.5) {
                item[field] = `PO-${Math.floor(Math.random() * 5) + 1000}`; // Link to one of the first 5 purchases
              } else {
                 item[field] = `EXP-${Math.floor(Math.random() * 9000) + 1000}`;
              }
            }
            break;
        case 'supplier':
            item[field] = slug === 'expenses' ? randomVendor.name : randomVendor.name;
            break;
        case 'purchaseType':
            item[field] = ['Inventory', 'Asset', 'Expense'][i % 3];
            break;
        case 'salesChannel':
            item[field] = ['Direct Sales', 'Amazon AE', 'Noon AE'][i % 3];
            break;
        case 'fulfillmentWarehouse':
            const channel = item['salesChannel'];
            if(channel === 'Amazon AE') item[field] = ['Main Warehouse', 'Amazon Warehouse'][i % 2];
            else if(channel === 'Noon AE') item[field] = ['Main Warehouse', 'Noon Warehouse'][i % 2];
            else item[field] = 'Main Warehouse';
            break;
        case 'category':
             item[field] = slug === 'expenses' ? expenseCategories[i % expenseCategories.length] : `Category ${String.fromCharCode(65 + (i % 5))}`;
             break;
        case 'brand':
             item[field] = brandsPool[i % brandsPool.length].name;
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
        default:
          if (field.toLowerCase().includes('name') || field.toLowerCase().includes('item')) {
            item[field] = `Sample ${field.charAt(0).toUpperCase() + field.slice(1)} ${i + 1}`;
          } else {
             item[field] = `Value ${i + 1}`;
          }
      }
    });

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

    return item;
  });

  return data;
};

// This function now correctly checks localStorage before creating mock data.
export const getMockData = (slug: string): GenericItem[] => {
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem(`erp-data-${slug}`);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          return parsedData;
        }
      } catch (e) {
        console.error(`Failed to parse localStorage data for ${slug}, falling back to mock data.`, e);
      }
    }
  }

  const config = moduleDataConfig[slug];
  if (!config) {
    console.warn(`No mock data configuration for slug: ${slug}`);
    return [];
  }
  
  return createMockData(config.count, config.fields, slug);
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



export const getPageTitle = (slug: string): string => {
  const titles: Record<string, string> = {
    'product-catalog': 'Product Catalog',
    'invoices': 'Invoices',
    'inventory-barcode': 'Inventory Barcode',
    'inventory-transfer': 'Inventory Transfer',
    'ipcc': 'Item Purchased Cost Calculator',
    'purchases-cal': 'Item Purchased Cost Calculator',
    'bank-statement': 'Bank Statement',
    'vendors': 'Vendors',
    'employees': 'Employees',
    'general-journal': 'General Journal',
    'chart-of-accounts': 'Chart of Accounts',
    'trial-balance': 'Trial Balance',
    'balance-sheet': 'Balance Sheet',
    'income-statement': 'Income Statement',
  };

  if (titles[slug]) {
    return titles[slug];
  }
  
  if (slug === 'categories' || slug === 'brands' || slug === 'warehouses') {
      return slug.charAt(0).toUpperCase() + slug.slice(1);
  }
  
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const moduleSlugs = Object.keys(moduleDataConfig);

const LOW_STOCK_THRESHOLD = 10;

// Sample structure for dashboard summary - actual calculation would be complex
export const getDashboardSummaryData = () => {
    const salesData = getMockData('sales');
    const purchasesData = getMockData('purchases');
    const expensesData = getMockData('expenses');
    const inventoryData = getMockData('inventory');
    
    // --- FINANCIALS ---
    const totalRevenue = salesData.reduce((acc, sale) => acc + (sale.totalSales || 0), 0);
    const totalPurchases = purchasesData.reduce((acc, p) => acc + (p.totalCost || 0), 0);
    const totalOpEx = expensesData.reduce((acc, e) => acc + (e.amount || 0), 0);
    const totalExpenses = totalPurchases + totalOpEx; // COGS + OpEx
    const netProfit = totalRevenue - totalExpenses;

    // --- ORDERS & INVENTORY ---
    const totalOrders = salesData.length;
    const itemsSold = salesData.reduce((acc, sale) => acc + (sale.qtySold || 0), 0);
    
    // Aggregate inventory quantities across warehouses
    const aggregatedInventory = productCatalogPool.map(product => {
        const totalQuantity = inventoryData
            .filter(item => item.sku === product.sku)
            .reduce((sum, item) => sum + item.quantity, 0);
        return { ...product, quantity: totalQuantity };
    });

    const topInventoryByQuantity = [...aggregatedInventory].sort((a,b) => b.quantity - a.quantity).slice(0, 5);

    // --- CHART DATA ---
    const salesByMonth: Record<string, number> = {};
    const expensesByMonth: Record<string, number> = {};

    [...salesData, ...expensesData, ...purchasesData].forEach(item => {
        const date = new Date(item.saleDate || item.expenseDate || item.purchaseDate);
        const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        
        if (item.totalSales) {
            if (!salesByMonth[month]) salesByMonth[month] = 0;
            salesByMonth[month] += item.totalSales;
        }
        if (item.amount) { // Operating Expense
            if (!expensesByMonth[month]) expensesByMonth[month] = 0;
            expensesByMonth[month] += item.amount;
        }
         if (item.totalCost) { // Purchase (COGS)
            if (!expensesByMonth[month]) expensesByMonth[month] = 0;
            expensesByMonth[month] += item.totalCost;
        }
    });

    const allMonths = [...new Set([...Object.keys(salesByMonth), ...Object.keys(expensesByMonth)])];
    // A simple sort that should work for "Mon YYYY" format for recent years
    allMonths.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const barChartData = allMonths.map(month => ({
        name: month,
        sales: salesByMonth[month] || 0,
        expenses: expensesByMonth[month] || 0,
    }));
    
    const pieChartData = topInventoryByQuantity.map((item, index) => ({
        name: item.itemName,
        value: item.quantity,
        fill: `hsl(var(--chart-${index + 1}))`,
    }));

    // --- RECENT & LOW STOCK ---
    const recentSales = salesData.sort((a,b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()).slice(0, 5);
    const lowStockItems = aggregatedInventory.filter(item => item.quantity <= LOW_STOCK_THRESHOLD).sort((a,b) => a.quantity - b.quantity).slice(0, 5);

    return {
        financials: {
            totalRevenue,
            totalExpenses,
            netProfit,
        },
        orders: {
            totalOrders,
            itemsSold,
        },
        chartData: {
            barChart: barChartData,
            pieChart: pieChartData,
        },
        recentSales,
        lowStockItems,
    };
};


export const getBadgeVariantForAccountType = (type: string) => {
    switch (type) {
        case 'Asset': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
        case 'Liability': return 'bg-red-100 text-red-800 hover:bg-red-200';
        case 'Equity': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
        case 'Revenue': return 'bg-green-100 text-green-800 hover:bg-green-200';
        case 'Expense': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
        default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
};

const columnDefinitions: Record<string, ColumnDefinition[]> = {
  'product-catalog': [
    { accessorKey: 'imageUrl', header: 'datatable.headers.image' },
    { accessorKey: 'itemName', header: 'datatable.headers.itemName' },
    { accessorKey: 'sku', header: 'datatable.headers.sku' },
    { accessorKey: 'category', header: 'datatable.headers.category' },
    { accessorKey: 'brand', header: 'datatable.headers.brand' },
    { accessorKey: 'unitPrice', header: 'datatable.headers.unitPrice' },
  ],
  inventory: [
    { accessorKey: 'itemName', header: 'datatable.headers.itemName' },
    { accessorKey: 'sku', header: 'datatable.headers.sku' },
    { accessorKey: 'warehouse', header: 'datatable.headers.warehouse' },
    { accessorKey: 'quantity', header: 'datatable.headers.quantity' },
    { accessorKey: 'unitPrice', header: 'datatable.headers.unitPrice' },
  ],
  purchases: [
    { accessorKey: 'purchaseDate', header: 'datatable.headers.date' },
    { accessorKey: 'referenceNumber', header: 'datatable.headers.referenceNumber'},
    { accessorKey: 'purchaseType', header: 'datatable.headers.type' },
    { accessorKey: 'supplier', header: 'datatable.headers.supplier' },
    { accessorKey: 'sku', header: 'datatable.headers.sku' },
    { accessorKey: 'itemName', header: 'datatable.headers.itemName' },
    { accessorKey: 'description', header: 'datatable.headers.description' },
    { accessorKey: 'quantity', header: 'datatable.headers.quantity' },
    { accessorKey: 'unitCost', header: 'datatable.headers.unitCost' },
    { accessorKey: 'customsFees', header: 'datatable.headers.customsFees' },
    { accessorKey: 'shippingFees', header: 'datatable.headers.shippingFees' },
    { accessorKey: 'bankCharges', header: 'datatable.headers.bankCharges' },
    { accessorKey: 'totalCost', header: 'datatable.headers.totalCost' },
  ],
  sales: [
    { accessorKey: 'saleDate', header: 'datatable.headers.date' },
    { accessorKey: 'customerName', header: 'datatable.headers.customer' },
    { accessorKey: 'orderId', header: 'datatable.headers.orderId' },
    { accessorKey: 'sku', header: 'datatable.headers.sku' },
    { accessorKey: 'itemName', header: 'datatable.headers.itemName' },
    { accessorKey: 'qtySold', header: 'datatable.headers.qtySold' },
    { accessorKey: 'qtyRtv', header: 'datatable.headers.qtyRtv' },
    { accessorKey: 'note', header: 'datatable.headers.note' },
    { accessorKey: 'price', header: 'datatable.headers.price' },
    { accessorKey: 'shipping', header: 'datatable.headers.shipping' },
    { accessorKey: 'referralFees', header: 'datatable.headers.referralFees' },
    { accessorKey: 'shippingCost', header: 'datatable.headers.shippingCost' },
    { accessorKey: 'paymentFees', header: 'datatable.headers.paymentFees' },
    { accessorKey: 'totalSales', header: 'datatable.headers.totalSales' },
  ],
  expenses: [
    { accessorKey: 'expenseDate', header: 'datatable.headers.date' },
    { accessorKey: 'description', header: 'datatable.headers.description' },
    { accessorKey: 'supplier', header: 'datatable.headers.supplier' },
    { accessorKey: 'category', header: 'datatable.headers.category' },
    { accessorKey: 'amount', header: 'datatable.headers.amount' },
    { accessorKey: 'referenceNumber', header: 'datatable.headers.referenceNumber' },
  ],
  customers: [
    { accessorKey: 'name', header: 'datatable.headers.name' },
    { accessorKey: 'contact', header: 'datatable.headers.contact' },
    { accessorKey: 'email', header: 'datatable.headers.email' },
    { accessorKey: 'address', header: 'datatable.headers.address' },
    { accessorKey: 'city', header: 'datatable.headers.city' },
    { accessorKey: 'country', header: 'datatable.headers.country' },
  ],
  vendors: [
    { accessorKey: 'name', header: 'datatable.headers.name' },
    { accessorKey: 'contact', header: 'datatable.headers.contact' },
    { accessorKey: 'email', header: 'datatable.headers.email' },
    { accessorKey: 'address', header: 'datatable.headers.address' },
    { accessorKey: 'website', header: 'datatable.headers.website' },
    { accessorKey: 'city', header: 'datatable.headers.city' },
    { accessorKey: 'country', header: 'datatable.headers.country' },
  ],
   employees: [
    { accessorKey: 'name', header: 'datatable.headers.name' },
    { accessorKey: 'username', header: 'datatable.headers.username' },
    { accessorKey: 'role', header: 'datatable.headers.role' },
    { accessorKey: 'joinDate', header: 'datatable.headers.joinDate' },
  ],
  roles: [
    { accessorKey: 'name', header: 'datatable.headers.roleName' },
    { accessorKey: 'description', header: 'datatable.headers.description' },
  ],
  categories: [
    { accessorKey: 'name', header: 'datatable.headers.categoryName' },
    { accessorKey: 'description', header: 'datatable.headers.description' },
  ],
  brands: [
    { accessorKey: 'name', header: 'datatable.headers.brandName' },
    { accessorKey: 'website', header: 'datatable.headers.website' },
  ],
  warehouses: [
    { accessorKey: 'name', header: 'datatable.headers.warehouseName' },
    { accessorKey: 'location', header: 'datatable.headers.location' },
  ],
  logistics: [
    { accessorKey: 'companyName', header: 'datatable.headers.companyName' },
    { accessorKey: 'type', header: 'datatable.headers.type' },
    { accessorKey: 'serviceDescription', header: 'datatable.headers.serviceDescription' },
    { accessorKey: 'contactDetails', header: 'datatable.headers.contact' },
    { accessorKey: 'location', header: 'datatable.headers.location' },
    { accessorKey: 'notes', header: 'datatable.headers.notes' },
  ],
  ipcc: [
      { accessorKey: 'date', header: 'datatable.headers.date' },
      { accessorKey: 'sku', header: 'datatable.headers.sku' },
      { accessorKey: 'quantity', header: 'datatable.headers.quantity' },
      { accessorKey: 'usd', header: 'USD' },
      { accessorKey: 'aed', header: 'AED' },
      { accessorKey: 'totalCost', header: 'datatable.headers.totalCostAED' },
      { accessorKey: 'totalCostPerUnit', header: 'datatable.headers.unitCostAED' },
  ],
  ipbt: [
      { accessorKey: 'ipbtId', header: 'ID' },
      { accessorKey: 'taskName', header: 'Task' },
      { accessorKey: 'assignedTo', header: 'Assigned To' },
      { accessorKey: 'dueDate', header: 'Due Date' },
      { accessorKey: 'priority', header: 'Priority' },
  ],
   'chart-of-accounts': [
    { accessorKey: 'code', header: 'datatable.headers.code' },
    { accessorKey: 'name', header: 'datatable.headers.accountName' },
    { accessorKey: 'type', header: 'datatable.headers.type' },
  ],
};

export const getColumns = (slug: string): ColumnDefinition[] => {
  return columnDefinitions[slug] || [];
};
