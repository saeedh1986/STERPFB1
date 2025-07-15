
# **App Name**: Saeed Store ERP Lite

## **1. Overview**

Saeed Store ERP Lite is a comprehensive, web-based Enterprise Resource Planning system designed for small to medium-sized businesses. It provides essential tools for managing inventory, sales, purchases, and finances, all within a clean, modern, and user-friendly interface. The application features a powerful dashboard for at-a-glance insights, detailed modules for core business functions, an integrated accounting suite, and generative AI tools to provide intelligent assistance for logistics and financial categorization.

## **2. Core Features**

### **2.1. Main Dashboard**
-   **Key Metric Cards**: Display high-level summary cards for Total Revenue, Net Profit, Sales, and Total Expenses.
-   **Visualizations**:
    -   A primary bar chart showing a month-by-month comparison of revenue versus expenses.
    -   A pie chart showing inventory distribution for top products by quantity.
-   **Actionable Tables**:
    -   A "Recent Sales" table showing the last five transactions.
    -   A "Low Stock Items" table flagging products that need reordering.

### **2.2. Standard Module Management**
-   For each of the core modules (Product Catalog, Inventory, Purchases, Sales, Expenses, Logistics, Customers, Vendors), provide a dedicated page with an interactive data table.
-   **CRUD Operations**: Enable full Create, Read, Update, and Delete operations for all records within each module via a consistent dialog-based form.
-   **Data Import/Export**:
    -   Allow users to import data into any module from a CSV file.
    -   Provide a "Download Template" button that exports a correctly formatted CSV header for users to fill out.
-   **Search and Pagination**: All tables must include global filtering/searching and pagination to handle large datasets.

### **2.3. Specialized Modules & Pages**
-   **Product Catalog**: A master list of all products the business can sell, including detailed information like dimensions, weight, and images.
-   **Inventory Barcode Generator**:
    -   A two-step process: select a product, then generate and customize labels.
    -   Generate both Barcodes and QR codes for selected inventory items.
    -   Provide options for browser-based printing (multiple labels per sheet) and direct-to-printer functionality using QZ Tray integration for thermal label printers.
-   **Invoicing**:
    -   A dedicated section to create, view, list, and delete invoices.
    -   The invoice creation form should be a "what you see is what you get" live preview of the final invoice.
    -   Allow adding items from the product catalog or as manual line items.
    -   Automatically calculate subtotal, VAT, and total.
    -   Generate a high-quality, professional PDF of the invoice for printing or saving, complete with company logo and a QR code.
-   **Logistics Insights Tool (Generative AI)**:
    -   An AI-powered tool that analyzes historical logistics data (uploaded as a file) along with current conditions to provide route optimizations, demand forecasts, and actionable recommendations.
-   **Bank Statement Import & Categorization (Generative AI)**:
    -   Allow users to upload a bank statement in CSV format.
    -   Use a Genkit flow to automatically suggest an appropriate accounting category for each transaction based on its description.
    -   Visually flag AI-categorized transactions in the UI.

### **2.4. Accounting Suite**
-   **General Journal**: A chronological list of every financial transaction from sales, purchases, and expenses.
-   **Trial Balance**: A report listing the final debit and credit balances of all general ledger accounts.
-   **Income Statement**: A financial report showing revenues, costs, and expenses to calculate the company's Net Income over a period.
-   **Balance Sheet**: A financial statement that reports the company's assets, liabilities, and equity at a specific point in time.

### **2.5. Reports**
-   Provide a dedicated "Reports" section with detailed pages for:
    -   **Sales Report**: Visualizing total revenue, orders, AOV, sales over time, and top-selling products.
    -   **Purchases Report**: Visualizing total purchase costs, order counts, costs over time, and top suppliers.
    -   **Expenses Report**: Visualizing total expenses, a breakdown by category (pie chart), and a detailed table.
    -   **Inventory Report**: Visualizing total inventory value, unit counts, top products by value/quantity, and low-stock items.

### **2.6. CRM**
-   Organize Customers and Vendors under a unified "CRM" section for easy contact management.

### **2.7. Authentication & Settings**
-   **Authentication**: Implement a basic username/password login system to secure access to the application.
-   **Settings Page**:
    -   **Company Profile**: Allow the admin to update the company name, contact information, and upload a company logo. These details should be reflected across the app (login page, sidebar, invoices).
    -   **Appearance**: Provide options to switch between light and dark modes and select from multiple color themes (e.g., Amber, Blue, Green).
    -   **Accessibility**: Allow users to adjust the application's base font size (e.g., Default, Medium, Large) for better readability.
    -   **Chart of Accounts**: Allow the user to manage the general ledger accounts.
    -   **Danger Zone**: Include an option to reset all application data stored in the browser.

## **3. Style & UX Guidelines**

### **3.1. Color Palette & Theme**
-   **Primary Color**: A professional and calming muted blue (`#5DADE2`).
-   **Background Color**: A clean, modern, and eye-friendly light gray (`#F5F7FA`).
-   **Accent Color**: A soft green (`#A3E4D7`) to highlight key actions and positive performance indicators.
-   **Theming**: The application must support multiple color themes and a dark mode. All UI components should adapt correctly to the selected theme.

### **3.2. Typography**
-   **Font**: Use 'PT Sans' (sans-serif) for all body and headline text to ensure clarity and readability.

### **3.3. Layout & Components**
-   **Layout**: Use a clean, minimal layout with a collapsible sidebar for navigation and a main content area.
-   **Responsiveness**: The application must be fully responsive and provide a seamless experience on desktop, tablet, and mobile devices. Layouts should stack gracefully, and tables should be scrollable on small screens.
-   **Components**: Utilize pre-built, production-quality components from the ShadCN UI library. Ensure consistency in design elements like rounded corners, shadows, and spacing.
-   **Icons**: Use the `lucide-react` library for all icons to maintain a consistent and modern visual style.
-   **Accessibility**:
    -   Ensure all interactive elements are keyboard-accessible and have clear focus states.
    -   Provide ARIA labels for all icon-only buttons.
    -   Use semantic HTML for proper page structure.
    -   Ensure all images have appropriate `alt` text.

## **4. Technical Stack**

-   **Framework**: Next.js with the App Router.
-   **Language**: TypeScript.
-   **UI**: React, ShadCN UI Components.
-   **Styling**: Tailwind CSS.
-   **AI/Generative Features**: Genkit, specifically using Google AI models.
-   **State Management**: React Context for global state (Auth, Theme, Accessibility, Company Profile).
-   **Forms**: React Hook Form with Zod for validation.
-   **Charts**: Recharts.
-   **Data Persistence**: Use browser `localStorage` to persist user data and settings.
-   **Direct Printing**: QZ Tray integration for label printing.
