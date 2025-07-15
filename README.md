# Saeed Store ERP Lite - Application Prompt

This document contains the comprehensive prompt that describes the entire "Saeed Store ERP Lite" application, outlining all the features, styling, and technical specifications that have been implemented.

---

### **Prompt for "Saeed Store ERP Lite"**

You are an expert AI coding assistant. Your task is to build a full-stack web application based on the following requirements.

**App Name**: Saeed Store ERP Lite

**Core Features**:

*   **Dashboard**: A main dashboard that presents a high-level summary of key business metrics. It should feature summary cards for Total Revenue, Net Profit, Sales, and Total Expenses. Include charts for "Revenue and Expenses Overview" and "Inventory Distribution". Also, display tables for "Recent Sales" and "Low Stock Items".
*   **Data Modules**: Create pages for the following modules, each displaying its data in an interactive table with full CRUD (Create, Read, Update, Delete) functionality, plus import/export from/to CSV:
    *   Product Catalog
    *   Inventory
    *   Purchases
    *   Sales
    *   Expenses
    *   Logistics
    *   Customers
    *   Vendors
*   **Invoice Management**: A complete invoicing system allowing users to create, view, print, and save invoices as PDFs. The invoice creation form should be a "what you see is what you get" live preview of the final invoice design.
*   **Accounting Suite**:
    *   **General Journal**: A chronological log of all transactions from sales, purchases, and expenses.
    *   **Bank Statement**: A page to display bank transactions, with functionality to import a CSV and use an AI agent (`categorizeTransaction`) to automatically suggest expense categories.
    *   **Financial Reports**: Implement pages for Trial Balance, Income Statement, and Balance Sheet, dynamically calculated from the application's data.
*   **Reporting Suite**: Create a dedicated section for reports, including:
    *   **Sales Report**: Show total revenue, order counts, AOV, sales over time, and top products.
    *   **Purchases Report**: Show total costs, order counts, purchase trends, and top suppliers.
    *   **Expenses Report**: Show total expenses, transaction counts, and a breakdown by category.
    *   **Inventory Report**: Show total value, unit counts, and highlight top-value, top-quantity, and low-stock items.
*   **Specialty Tools**:
    *   **Inventory Barcode Generator**: Allow users to select a product and generate/print barcodes and QR codes for it, including support for direct-to-printer functionality using QZ Tray.
    *   **AI Logistics Insights**: A generative AI-powered tool (`logisticsOptimization`) to analyze historical data and suggest optimal logistics routes and forecasts based on user-provided goals and conditions.
*   **Authentication & Settings**:
    *   **Authentication**: Basic username/password login for admin access.
    *   **Settings Page**: A comprehensive page to manage:
        *   **Company Profile**: Allow the user to change the company name, logo, and contact information, which updates across the app (invoices, login page, sidebar).
        *   **Appearance**: Let the user change the application's color theme and light/dark mode.
        *   **Accessibility**: Provide options to increase the font size (Default, Medium, Large) for better readability.
        *   **Chart of Accounts**: A table to manage the general ledger accounts.
        *   **Danger Zone**: An option to reset all application data.

**Style & UI Guidelines**:

*   **Tech Stack**: Next.js (App Router), React, ShadCN UI components, Tailwind CSS, and Genkit for AI features.
*   **Primary Color**: A muted blue (`#5DADE2`).
*   **Background Color**: A light gray (`#F5F7FA`).
*   **Accent Color**: A soft green (`#A3E4D7`).
*   **Font**: 'PT Sans' for both headlines and body text.
*   **Layout**: Clean, minimal, modern, and fully responsive for desktop, tablet, and mobile devices. Use rounded corners and subtle shadows for a professional feel.
*   **Icons**: Use the `lucide-react` library for all icons.
*   **Accessibility**: Ensure the app is accessible. Use ARIA labels for icon-only buttons, proper semantic HTML, and ensure keyboard navigability. The AED currency symbol image must be white in dark mode.
