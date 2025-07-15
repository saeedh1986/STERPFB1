
# **App Name**: Saeed Store ERP Lite

## **1. Overview & Goal**

To create a lightweight, web-based Enterprise Resource Planning (ERP) system tailored for a small to medium-sized e-commerce business, specifically "Saeed Store Electronics." The application should provide a user-friendly interface to manage core business operations, including inventory, sales, purchases, expenses, and basic accounting. It must feature a powerful AI-driven insights tool for logistics and offer robust reporting capabilities.

## **2. Core Features**

### **2.1. Dashboard**
A central dashboard providing an at-a-glance overview of the business.
- **Summary Cards**: Prominent display of key metrics: Total Revenue, Net Profit, Total Sales, and Total Expenses.
- **Visualizations**:
    - A bar chart showing "Revenue and Expenses Overview" over time.
    - A pie chart showing "Inventory Distribution" for top products by quantity.
- **Actionable Tables**:
    - A "Recent Sales" table to display the latest transactions.
    - A "Low Stock Items" table to alert users to inventory that needs replenishing.

### **2.2. Standard Module Pages**
Each of the following modules should be presented in an interactive HTML table (Data Table component) with the following functionalities:
- Create, Read, Update, and Delete (CRUD) operations via a dialog form.
- Search/filter functionality.
- Import data from a CSV file.
- Download a CSV template for the specific module.
- **Modules**: Product Catalog, Inventory, Purchases, Sales, Expenses, Logistics, Customers, Vendors, and specialized calculators (`ipcc`, `ipbt`).

### **2.3. CRM (Customer Relationship Management)**
A dedicated section in the navigation for managing contacts.
- **Customers**: Manage customer information.
- **Vendors**: Manage supplier information.

### **2.4. Accounting Suite**
A set of financial tools and reports for basic bookkeeping.
- **General Journal**: A chronological log of all financial transactions derived from sales, purchases, and expenses.
- **Bank Statement**:
    - View bank account details and transaction history.
    - Import bank statements from a CSV file.
    - Utilize a Genkit AI flow (`categorizeTransaction`) to automatically suggest an expense category for imported transactions based on their description.
- **Financial Reports**:
    - **Income Statement**: A report showing Revenues, Cost of Goods Sold, Gross Profit, Operating Expenses, and the final **Net Income**.
    - **Balance Sheet**: A standard balance sheet report showing Assets, Liabilities, and Equity.
    - **Trial Balance**: A report listing all general ledger accounts and their debit/credit balances.

### **2.5. Reporting Suite**
A dedicated section for detailed, visual reports.
- **Sales Report**: Includes total revenue, order count, AOV, sales over time (bar chart), and a breakdown of top-selling products.
- **Purchases Report**: Includes total purchase cost, order count, purchases over time (bar chart), and a breakdown by supplier.
- **Expenses Report**: Includes total expenses, transaction count, expense breakdown by category (pie chart), and a detailed table.
- **Inventory Report**: Includes total inventory value, total units, unique SKUs, top products by value (bar chart), top products by quantity, and a low stock alert table.

### **2.6. Specialized Tools**
- **Invoice Management**:
    - A dedicated section to create, view, list, and delete invoices.
    - The invoice creation form should be a "What You See Is What You Get" (WYSIWYG) live preview that matches the final design.
    - Ability to add items from the product catalog or manually.
    - Automatically calculates subtotals, VAT, and totals.
    - **Functionality**: Print the invoice or save it as a high-quality, pixel-perfect PDF.
- **Inventory Barcode Generator**:
    - A tool to generate and print barcodes and QR codes for inventory items.
    - Provide options for customization (e.g., print type, quantity).
    - **Direct Printing**: Integrate with the QZ Tray desktop client for direct-to-printer functionality, supporting ZPL commands for thermal label printers.
- **Logistics Insights Tool (Generative AI)**:
    - A page with a form to analyze logistics data.
    - The user uploads a file with historical data and provides context (e.g., time of year, goals).
    - A Genkit AI flow (`logisticsOptimization`) processes the input to suggest optimal routes, forecast demand, identify trends, and provide actionable recommendations.

### **2.7. Settings & Customization**
A comprehensive settings page for user customization.
- **Company Profile**: Allow the administrator to update the company name, ERP system name, address/description, contact info, and upload a custom company logo. These details should be reflected across the app (login page, sidebar, invoices).
- **Appearance**:
    - **Mode**: Light, Dark, or System theme.
    - **Color**: Select from multiple theme colors (e.g., Amber, Blue, Green).
- **Accessibility**: Provide options to increase the application's font size (e.g., Default, Medium, Large) for better readability.
- **Data Management**:
    - A "Danger Zone" option to reset all application data stored in `localStorage` to its initial state.
    - A section to manage the "Chart of Accounts."

### **2.8. Authentication**
- A simple, secure login page for admin access. Authentication state should be managed and persisted.

## **3. Technology Stack & Implementation Details**
- **Framework**: Next.js with the App Router.
- **Language**: TypeScript.
- **UI Components**: shadcn/ui.
- **Styling**: Tailwind CSS.
- **AI/Generative Features**: Genkit, using Google AI models.
- **Charts**: Recharts, integrated via custom `ChartContainer` component.
- **Forms**: React Hook Form with Zod for validation.
- **Data Persistence**: Use the browser's `localStorage` to store all application data, simulating a database for this "Lite" version.
- **State Management**: Use React Context for global state (Authentication, Accessibility, Company Profile).

## **4. Style & Design Guidelines**
- **Layout**: The application must be fully responsive and provide a seamless experience on desktop, tablet, and mobile devices. Use modern CSS techniques like Flexbox and Grid to create clean, adaptive layouts.
- **Primary Color**: Muted blue (`#5DADE2`). This should be one of the selectable theme colors.
- **Background Color**: Light gray (`#F5F7FA`) for light mode, and a corresponding dark gray for dark mode.
- **Accent Color**: Soft green (`#A3E4D7`).
- **Font**: 'PT Sans' for both body text and headlines.
- **Icons**: `lucide-react` for all in-app icons.
- **Overall Feel**: Professional, clean, and modern, with subtle shadows and rounded corners on cards and interactive elements to create depth.

## **5. Accessibility (A11y)**
- Ensure the application is accessible to users with disabilities.
- All interactive elements must have clear focus states.
- Icon-only buttons must have `aria-label` attributes for screen readers.
- Use semantic HTML5 tags (`<main>`, `<nav>`, etc.).
- Ensure images have appropriate `alt` text.
- Provide user-configurable font sizes.
- Ensure good color contrast in both light and dark modes.
