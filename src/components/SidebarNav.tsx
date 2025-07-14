
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Package, Barcode, ShoppingCart, CreditCard, TrendingUp,
  Users, Building, Truck, Layers, Combine, CalendarDays, Landmark, BotMessageSquare, Package2, Library, FileText, Calculator, BookOpen
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/product-catalog', label: 'Product Catalog', icon: Library },
  { href: '/inventory', label: 'Inventory', icon: Package },
  { href: '/inventory-barcode', label: 'Inventory Barcode', icon: Barcode },
  { href: '/purchases', label: 'Purchases', icon: ShoppingCart },
  { href: '/sales', label: 'Sales', icon: TrendingUp },
  { href: '/invoices', label: 'Invoices', icon: FileText },
  { href: '/expenses', label: 'Expenses', icon: CreditCard },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/vendors', label: 'Vendors', icon: Building },
  { href: '/logistics', label: 'Logistics', icon: Truck },
  { href: '/ipcc', label: 'Cost Calculator', icon: Calculator },
  { href: '/ipbt', label: 'IPBT', icon: Combine },
  { href: '/purchases-cal', label: 'Purchases Cal.', icon: CalendarDays },
  { href: '/logistics-insights', label: 'Logistics Insights', icon: BotMessageSquare },
];

const accountingNavItems: NavItem[] = [
    { href: '/general-ledger', label: 'General Ledger', icon: BookOpen },
    { href: '/bank-statement', label: 'Bank Statement', icon: Landmark },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
           <Image src="https://s3eed.ae/wp-content/uploads/2025/04/logo13.png" alt="Saeed Store Logo" width={36} height={36} />
          <span className="text-xl font-headline">Saeed ERP</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard' && item.href !== '/')
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                  : 'text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
          
          <Accordion type="single" collapsible defaultValue="accounting" className="w-full">
            <AccordionItem value="accounting" className="border-b-0">
              <AccordionTrigger className="px-3 py-2.5 text-sm hover:no-underline hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg [&[data-state=open]]:bg-sidebar-accent">
                <span className="flex items-center gap-3">
                  <Layers className="h-5 w-5" />
                  Accounting
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-7 pt-1">
                 <div className="flex flex-col gap-1">
                  {accountingNavItems.map((item) => (
                     <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        pathname.startsWith(item.href)
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                          : 'text-sidebar-foreground'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                 </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

        </nav>
      </ScrollArea>
    </div>
  );
}
