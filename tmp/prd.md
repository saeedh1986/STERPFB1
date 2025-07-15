
# **App Name**: Saeed Store ERP Lite

## **1. Overview**

Saeed Store ERP Lite is a comprehensive, web-based Enterprise Resource Planning system designed for a modern e-commerce business. It provides tools for managing inventory, sales, purchases, expenses, and logistics, all within a clean, responsive, and accessible user interface. The application features a powerful dashboard for at-a-glance insights, detailed data tables for core modules, robust reporting capabilities, and integrated AI tools to assist with logistics and financial categorization.

## **2. Core Features**

### **2.1. Main Dashboard**
- **Key Metric Cards**: Display high-level summary data for:
    - Total Revenue
    - Net Profit
    - Total Sales (by order count)
    - Total Expenses
- **Visualizations**:
    - **Revenue vs. Expenses Overview**: A bar chart comparing total monthly sales against total monthly expenses.
    - **Inventory Distribution**: A pie chart showing the quantity distribution of top inventory items.
- **Actionable Data Tables**:
    - **Recent Sales**: A list of the most recent sales transactions with links to view details.
    - **Low Stock Items**: A list of inventory items that have fallen below a predefined stock threshold, with links to the inventory page.

### **2.2. Data Management Modules**
- **Generic Table View**: Implement a reusable `DataTable` component for displaying data for all core modules (Inventory, Sales, Purchases, Expenses, Customers, Vendors, etc.).
- **CRUD Operations**: Enable full Create, Read, Update, and Delete operations for all records within the data tables, managed through a reusable `DataFormDialog` component.
- **Data Import/Export**:
    - **Import from CSV**: Allow users to bulk-import data into any module from a CSV file.
    - **Download Template**: Provide a feature to download a pre-formatted CSV template for any module to ensure correct data structure for import.
- **Filtering and Pagination**: Include global search/filter functionality and pagination for all data tables to handle large datasets efficiently.

### **2.3. Inventory & Products**
- **Product Catalog**: A master list of all products with details like SKU, description, pricing, weights, dimensions, and images.
- **Inventory Management**: A dedicated view of current stock levels, including quantity on hand and unit price.
- **Barcode & QR Code Generation**: A tool to generate and print barcodes and QR codes for any product in the inventory.
    - **Customization**: Allow customization of the printed label, including value, number of labels, and type (barcode, QR code, or both).
    - **Direct Printing**: Integrate with **QZ Tray** to enable direct, raw printing to thermal label printers (e.g., Zebra) using ZPL. Include a settings dialog for printer selection, label size, and print offsets.
    - **Browser Print**: Provide a fallback option to print labels on a standard A4/Letter sheet via the browser's print dialog.

### **2.4. Sales & Invoicing**
- **Sales Tracking**: A module to record all sales transactions, linking products to customers.
- **Invoice Management**:
    - **Create Invoices**: A "what you see is what you get" (WYSIWYG) form to create professional, branded invoices. Users can add line items from the product catalog or manually.
    - **View & Print**: A dedicated page to view, print, or download invoices.
    - **PDF Export**: Generate a high-quality, pixel-perfect PDF of any invoice, ensuring the company logo, fonts, and layout are preserved.

### **2.5. Accounting & Finance**
- **General Journal**: A chronological record of all financial transactions derived from sales, purchases, and expenses.
- **Bank Statement**: A module to import and view bank transactions from a CSV file.
    - **AI Categorization**: Use a Genkit AI flow (`categorizeTransaction`) to automatically suggest an appropriate accounting category for each imported transaction based on its description.
- **Chart of Accounts**: A manageable list of all financial accounts (Assets, Liabilities, Equity, Revenue, Expenses).
- **Financial Reports**:
    - **Income Statement**: A report calculating and displaying revenue, cost of goods sold, gross profit, operating expenses, and **net income**.
    - **Balance Sheet**: A standard financial statement showing assets, liabilities, and equity.
    - **Trial Balance**: A report listing all accounts and their debit or credit balances to ensure they are equal.

### **2.6. Reports & Analytics**
- **Dedicated Reports Section**: A centralized location for all business reports.
- **Sales Report**: An overview of sales performance with charts for trends over time and tables for top-selling products.
- **Purchases Report**: An overview of purchasing activity with charts for costs over time and tables for spending by supplier.
- **Expenses Report**: A breakdown of operational expenses with a pie chart for category distribution and a detailed table.
- **Inventory Report**: An analysis of inventory, including total value, total units, a chart of top products by value, and a list of low-stock items.

### **2.7. CRM (Customer Relationship Management)**
- **Customers**: A module to manage customer information.
- **Vendors**: A module to manage supplier and vendor information.

### **2.8. Generative AI Tools**
- **Logistics Insights Tool**: A Genkit-powered tool (`logisticsOptimization`) that analyzes historical data and user inputs to suggest optimal logistics routes, forecast demand, and provide actionable recommendations.

### **2.9. Authentication & Settings**
- **Authentication**: A basic login system for admin access to the application.
- **Settings Page**: A centralized page for user and application configuration.
    - **Company Profile**: Allow the admin to change the company name, logo, contact information, and other details that appear on invoices and in the UI.
    - **Appearance**: Allow users to switch between light and dark modes and select from multiple color themes (e.g., Muted Blue, Soft Green).
    - **Accessibility**: Provide options to increase the application's base font size for better readability.
    - **Danger Zone**: Include an option to reset all application data stored in the browser.

## **3. Style & UI/UX Guidelines**

### **3.1. Color Palette & Theme**
- **Primary Color**: Muted Blue (`#5DADE2`)
- **Background Color**: Light Gray (`#F5F7FA`)
- **Accent Color**: Soft Green (`#A3E4D7`)
- **UI Framework**: Use **ShadCN UI** components as the base for all UI elements. Implement the color palette by updating the HSL CSS variables in `src/app/globals.css`.
- **Theming**: Support both light and dark modes. Ensure all components are styled correctly for both themes. The AED currency symbol should be white in dark mode.

### **3.2. Typography**
- **Font**: Use **'PT Sans'** (sans-serif) for all body and headline text to ensure a modern, readable interface.

### **3.3. Layout & Responsiveness**
- **Layout**: Use a clean, minimal layout with a persistent sidebar for navigation on desktop.
- **Responsiveness**: Ensure the application is fully responsive and provides an optimal user experience on desktop, tablet, and mobile devices. Layouts should adapt gracefully, and tables should be scrollable on smaller screens.

### **3.4. Accessibility**
- Implement accessibility best practices, including:
    - Providing `aria-label` attributes for icon-only buttons.
    - Using semantic HTML for page structure.
    - Ensuring clear focus states for all interactive elements.
    - Allowing users to adjust the font size via the settings page.

## **4. Technical Stack & Guidelines**

- **Framework**: Next.js with the App Router.
- **Language**: TypeScript.
- **Styling**: Tailwind CSS.
- **UI Components**: ShadCN UI.
- **AI/Generative Features**: Genkit.
- **State Management**: Use React Context for global state (e.g., Auth, Company Profile, Accessibility).
- **Data Persistence**: Use browser `localStorage` to store application data and user preferences.
- **Code Quality**: Adhere to modern React patterns, including functional components and hooks. Code should be clean, readable, and well-organized.
- **Image Placeholders**: Use `https://placehold.co/` for placeholder images and include a `data-ai-hint` attribute.

    