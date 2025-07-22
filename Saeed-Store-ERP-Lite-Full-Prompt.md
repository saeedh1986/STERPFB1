
# **Saeed Store ERP Lite - Full Application Prompt**

This document outlines the complete specifications for building the "Saeed Store ERP Lite" application.

---

### **1. Application Overview**

**App Name**: Saeed Store ERP Lite

**Primary Goal**: To build a lightweight, modern, and comprehensive Enterprise Resource Planning (ERP) system for a small to medium-sized business. The application must provide a user-friendly interface for managing core business operations, including product and inventory management, sales, purchases, expenses, accounting, and reporting. It should also feature AI-powered tools for intelligent assistance and allow for extensive user customization.

---

### **2. Core Features**

#### **2.1. Main Dashboard**
A central hub providing an at-a-glance overview of key business metrics.
-   **Metric Cards**: Prominent summary cards for Total Revenue, Net Profit, Total Sales (by order count), and Total Expenses.
-   **Visualizations**:
    -   A bar chart showing a month-by-month "Revenue and Expenses Overview".
    -   A pie chart illustrating "Inventory Distribution" of top products by quantity.
-   **Actionable Tables**:
    -   A "Recent Sales" table displaying the latest transactions.
    -   A "Low Stock Items" table flagging products that need reordering.

#### **2.2. Generic Data Management System**
-   **Reusable Data Table**: A core `DataTable` component to display, filter, and paginate data for all main modules.
-   **Full CRUD Functionality**: All modules must support Create, Read, Update, and Delete operations through a consistent, reusable `DataFormDialog`.
-   **Data Import/Export**:
    -   **Import from CSV**: Functionality to upload and import data from a CSV file into any data table.
    -   **Download CSV Template**: A button to download a correctly formatted CSV header template for any module.

#### **2.3. Product & Inventory Management**
-   **Product Catalog**: A master list of all products, including fields for name, SKU, category, brand, price, description, weights, dimensions, and an image.
-   **Categories & Brands**: Separate, manageable modules to define product categories and brands, which are then used in dropdowns within the Product Catalog.
-   **Inventory**: A module to track stock levels. Each inventory item is a unique combination of a product (SKU) and a warehouse.
-   **Warehouses**: A manageable list of all physical or virtual warehouses where stock is held.
-   **Inventory Transfer**: A dedicated page with a form to move a specified quantity of a product from one warehouse to another.
-   **Inventory Barcode Generator**: A tool to generate and print barcodes and QR codes for inventory items.
    -   **Customization**: Options to set the code value, print quantity, and format (barcode, QR code, or both).
    -   **Direct Printing**: Integration with the **QZ Tray** desktop client for direct-to-printer functionality, supporting ZPL commands for thermal label printers. Includes a settings dialog for printer selection, label size, and print offsets.
    -   **Browser Print**: Fallback option to print multiple labels on a standard sheet using the browser's print dialog.

#### **2.4. Sales & Invoicing**
-   **Sales**: A module to record all sales, linking products to customers.
    -   **Sales Channels**: Track sales via different channels ("Direct Sales", "Amazon AE", "Noon AE").
    -   **Fulfillment Warehouse**: Track which warehouse fulfilled the order (e.g., "Main Warehouse", "Amazon Warehouse").
-   **Invoice Management**: A complete invoicing system.
    -   **WYSIWYG Creator**: A "what you see is what you get" live preview form for creating professional invoices.
    -   **View & Download**: A page to view created invoices, print them, or save them as high-fidelity, pixel-perfect PDFs.

#### **2.5. CRM (Customer Relationship Management)**
-   A dedicated section for managing contacts.
-   **Customers**: Manage all customer information.
-   **Vendors**: Manage all supplier and vendor information.

#### **2.6. Accounting Suite**
-   **General Journal**: A chronological log of all financial transactions derived from sales, purchases, and expenses.
-   **Bank Statement**: A page to view bank transactions with functionality to import a CSV file.
    -   **AI Categorization**: Utilize a Genkit AI flow (`categorizeTransaction`) to automatically suggest expense categories for imported transactions.
-   **Financial Reports**: Dynamically generated reports based on application data.
    -   **Trial Balance**: A list of all general ledger accounts and their debit/credit balances.
    -   **Income Statement**: A report showing Revenues, Cost of Goods Sold, Gross Profit, Operating Expenses, and Net Income.
    -   **Balance Sheet**: A standard report showing Assets, Liabilities, and Equity.

#### **2.7. Reporting Suite**
A dedicated section for detailed, visual reports.
-   **Sales Report**: Total revenue, order count, AOV, sales over time, and top-selling products.
-   **Purchases Report**: Total costs, order count, purchase trends, and top suppliers.
-   **Expenses Report**: Total expenses, transaction counts, and a breakdown by category.
-   **Inventory Report**: Total value, unit counts, and highlighting of top-value, top-quantity, and low-stock items.

#### **2.8. Generative AI & Specialty Tools**
-   **Logistics Insights Tool**: A generative AI tool (`logisticsOptimization`) to analyze historical data and provide route optimizations and demand forecasts.
-   **Specialty Calculators**: Standalone pages for specialized calculations like "Purchases Cal."

#### **2.9. Authentication & Settings**
-   **Authentication**: A simple username/password login page for admin access.
-   **Settings Page**: A comprehensive page for customization.
    -   **Company Profile**: Manage company name, logo, ERP system name, and contact details, which are reflected across the app (invoices, login page, sidebar).
    -   **Appearance**: Switch between light/dark mode and select from multiple color themes (Amber, Blue, Green).
    -   **Accessibility**: Adjust the application's base font size (Default, Medium, Large).
    -   **Chart of Accounts**: A table to manage the general ledger accounts.
    -   **Danger Zone**: An option to reset all application data in `localStorage`.
-   **Localization**: The application must be fully translated for English (LTR) and Arabic (RTL). All UI text, including labels, buttons, headers, and form fields, must adapt to the selected language.

---

### **3. Technology Stack & Implementation Details**

-   **Framework**: Next.js with the App Router.
-   **Language**: TypeScript.
-   **UI Components**: shadcn/ui.
-   **Styling**: Tailwind CSS, with HSL CSS variables for theming.
-   **AI/Generative Features**: Genkit, using Google AI models.
-   **Forms**: React Hook Form with Zod for validation.
-   **Charts**: Recharts.
-   **Data Persistence**: Browser's `localStorage` for all application data.
-   **State Management**: React Context for global state (Authentication, Company Profile, Accessibility, Language, Currency).
-   **Direct Printing**: QZ Tray for raw ZPL printing.
-   **PDF Generation**: `html2canvas` and `jspdf` for creating PDFs from HTML.

---

### **4. Style & Design Guidelines**

-   **Layout**: Fully responsive and modern, using a collapsible sidebar for navigation. The layout must correctly adapt for both LTR and RTL directions.
-   **Primary Color**: A muted blue (`#5DADE2`). This should be one of the selectable theme colors.
-   **Background Color**: A light gray (`#F5F7FA`) for light mode, with a corresponding dark gray for dark mode.
-   **Accent Color**: A soft green (`#A3E4D7`).
-   **Font**: 'PT Sans' for both body text and headlines.
-   **Icons**: `lucide-react` for all in-app icons.
-   **Overall Feel**: Professional, clean, and modern, with subtle shadows and rounded corners. Utilize a "glassmorphism" effect with blurred, semi-transparent backgrounds for cards and the sidebar.
-   **Accessibility**: Ensure the app is accessible by using ARIA labels for icon-only buttons, proper semantic HTML, and ensuring keyboard navigability. The AED currency symbol must be white in dark mode.
-   **Image Placeholders**: Use `https://placehold.co/` with a `data-ai-hint` attribute for all placeholder images.
