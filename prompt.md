
# **App Name**: Saeed Store ERP Lite

## Core Features:

-   **Dashboard**: An insightful dashboard featuring key metric summary cards (Total Revenue, Net Profit, Sales, Expenses), a bar chart comparing monthly revenue and expenses, a pie chart for inventory distribution, and actionable tables for "Recent Sales" and "Low Stock Items".
-   **Modular Data Management**: Display various business modules as interactive HTML tables with full CRUD (Create, Read, Update, Delete) functionality. Modules include:
    -   Product Catalog
    -   Inventory
    -   Purchases
    -   Sales
    -   Expenses
    -   Logistics
-   **CRM (Customer Relationship Management)**: A dedicated section for managing contacts, including:
    -   Customers
    -   Vendors
-   **Accounting Suite**: A comprehensive set of accounting tools, including:
    -   **General Journal**: A chronological record of all financial transactions.
    -   **Bank Statement**: View and import bank transactions with AI-powered category suggestions.
    -   **Income Statement**: Automatically calculates and displays revenue, costs, and net income.
    -   **Balance Sheet**: Presents a clear view of assets, liabilities, and equity.
    -   **Trial Balance**: A summary of all ledger balances to ensure debits equal credits.
-   **Reporting Suite**: A dedicated section for detailed reports, including:
    -   **Sales Report**: Analyzes revenue, order volume, and top-selling products.
    -   **Purchases Report**: Tracks purchase costs and supplier performance.
    -   **Expenses Report**: Breaks down spending by category with visual charts.
    -   **Inventory Report**: Provides insights into stock value, quantities, and low-stock alerts.
-   **Invoice Management**:
    -   Create professional invoices using a WYSIWYG (What You See Is What You Get) form.
    -   Generate high-quality, pixel-perfect PDF versions of invoices for saving or printing.
    -   List, view, and manage all created invoices.
-   **Inventory Barcode & QR Code Generation**: A tool to generate and print barcodes and QR codes for inventory items, with support for direct-to-printer functionality via QZ Tray.
-   **Data Operations**:
    -   **Import from CSV**: Allow users to bulk-import data into tables.
    -   **Download CSV Template**: Provide a template to ensure correct formatting for imports.
-   **AI-Powered Tools**:
    -   **Logistics Insights**: A generative AI tool to suggest optimal logistics routes based on historical data and current conditions.
    -   **Transaction Categorization**: An AI agent that automatically suggests expense categories when importing a bank statement.
-   **Authentication**: Secure admin access through a basic username and password login system.
-   **Settings & Customization**:
    -   **Company Profile**: Allow the admin to change the company name, logo, and contact information, which updates across the app (invoices, login page, sidebar).
    -   **Appearance**: Users can switch between light and dark modes and select a primary theme color (e.g., blue, green, amber).
    -   **Accessibility**: Users can adjust the application's base font size (Default, Medium, Large) for better readability.

## Style & Design Guidelines:

-   **Primary Color**: Muted blue (`#5DADE2`) to provide a professional and calming interface.
-   **Background Color**: Light gray (`#F5F7FA`) for a clean, modern backdrop that ensures readability.
-   **Accent Color**: Soft green (`#A3E4D7`) to highlight key actions and elements.
-   **Font**: 'PT Sans' (sans-serif) for all body and headline text for a modern, readable interface.
-   **Layout**: A clean, minimal, and fully responsive layout that works on desktop, tablet, and mobile devices. Use shadcn/ui components and Tailwind CSS for styling.
-   **Icons**: Utilize the `lucide-react` icon library for a consistent and modern look.
-   **AED Currency Symbol**: Ensure the AED currency symbol is displayed correctly and appears white in dark mode for visibility.
-   **User Experience**: Use subtle transitions for page loads and data updates. Incorporate toast notifications for user feedback on actions like creating, updating, or deleting data.

## Technical Stack & Implementation Details:

-   **Framework**: Next.js with the App Router.
-   **Language**: TypeScript.
-   **UI Components**: shadcn/ui.
-   **Styling**: Tailwind CSS, with theme variables defined in `globals.css`.
-   **State Management**: React Context for global state (Authentication, Accessibility, Company Profile). Client-side state managed with `useState` and `useEffect`.
-   **Forms**: `react-hook-form` with `zod` for validation.
-   **Charts**: `recharts` integrated via a custom `ChartContainer` component.
-   **AI Functionality**: Genkit for all generative AI features.
-   **PDF Generation**: Use `html2canvas` and `jspdf` to convert invoice components to downloadable PDFs, ensuring high fidelity and correct alignment.
-   **Direct Printing**: Integrate `qz-tray` for direct-to-printer functionality for labels.
-   **Data Persistence**: Use browser `localStorage` to persist user data (invoices, table data modifications) and user preferences (auth, theme, profile).
