
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Package, Barcode, ShoppingCart, CreditCard, TrendingUp,
  Users, Building, Truck, Layers, Combine, CalendarDays, Landmark, BotMessageSquare, Package2, Library
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  { href: '/expenses', label: 'Expenses', icon: CreditCard },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/vendors', label: 'Vendors', icon: Building },
  { href: '/logistics', label: 'Logistics', icon: Truck },
  { href: '/ipcc', label: 'IPCC', icon: Layers },
  { href: '/ipbt', label: 'IPBT', icon: Combine },
  { href: '/purchases-cal', label: 'Purchases Cal.', icon: CalendarDays },
  { href: '/bank-statement', label: 'Bank Statement', icon: Landmark },
  { href: '/logistics-insights', label: 'Logistics Insights', icon: BotMessageSquare },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-7 w-7 text-sidebar-primary" />
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
        </nav>
      </ScrollArea>
    </div>
  );
}
