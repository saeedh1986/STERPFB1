
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Package, Barcode, ShoppingCart, CreditCard, TrendingUp,
  Users, Building, Truck, Layers, Combine, CalendarDays, Landmark, BotMessageSquare, Package2, Library, FileText, Calculator, BookOpen, Settings, Scale, FileSpreadsheet, AreaChart, PieChart, Users2, Tag, Copyright, Warehouse, ArrowRightLeft, Handshake, Briefcase
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useCompanyProfile } from '@/context/CompanyProfileContext';
import { useLanguage } from '@/context/LanguageContext';


interface NavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
  subItems?: NavItem[];
}

const financeNavItems: NavItem[] = [
  { href: '/invoices', labelKey: 'sidebar.invoices', icon: FileText },
  { href: '/expenses', labelKey: 'sidebar.expenses', icon: CreditCard },
  { 
    href: '/accounting', 
    labelKey: 'sidebar.accounting', 
    icon: Layers,
    subItems: [
      { href: '/general-journal', labelKey: 'sidebar.general_journal', icon: BookOpen },
      { href: '/bank-statement', labelKey: 'sidebar.bank_statement', icon: Landmark },
      { href: '/trial-balance', labelKey: 'sidebar.trial_balance', icon: Scale },
      { href: '/income-statement', labelKey: 'sidebar.income_statement', icon: PieChart },
      { href: '/balance-sheet', labelKey: 'sidebar.balance_sheet', icon: FileSpreadsheet },
    ]
  },
];

const salesNavItems: NavItem[] = [
  { href: '/sales', labelKey: 'sidebar.sales', icon: TrendingUp },
  { 
    href: '/crm', 
    labelKey: 'sidebar.crm', 
    icon: Users2,
    subItems: [
        { href: '/customers', labelKey: 'sidebar.customers', icon: Users },
        { href: '/vendors', labelKey: 'sidebar.vendors', icon: Building },
    ]
  },
];

const supplyChainNavItems: NavItem[] = [
  { href: '/purchases', labelKey: 'sidebar.purchases', icon: ShoppingCart },
  { 
    href: '/inventory', 
    labelKey: 'sidebar.inventory', 
    icon: Package,
    subItems: [
      { href: '/inventory', labelKey: 'sidebar.inventory_list', icon: Package },
      { href: '/warehouses', labelKey: 'sidebar.warehouses', icon: Warehouse },
      { href: '/inventory-barcode', labelKey: 'sidebar.inventory_barcode', icon: Barcode },
      { href: '/inventory-transfer', labelKey: 'sidebar.inventory_transfer', icon: ArrowRightLeft },
    ]
  },
  { href: '/logistics', labelKey: 'sidebar.logistics', icon: Truck },
];

const hrNavItems: NavItem[] = [
  { href: '/employees', labelKey: 'sidebar.employees', icon: Briefcase },
];


export function SidebarNav() {
  const pathname = usePathname();
  const { profile } = useCompanyProfile();
  const { t, direction } = useLanguage();

  const isModuleActive = (item: NavItem) => {
    if (item.href === '/dashboard' || item.href === '/') {
        return pathname === item.href;
    }
    // Check if the current path starts with the item's href, or if any sub-item is active
    if (pathname.startsWith(item.href)) {
        return true;
    }
    if (item.subItems) {
        return item.subItems.some(sub => pathname.startsWith(sub.href));
    }
    return false;
  };
  
  const NavLink = ({ item, isSubItem = false }: { item: NavItem, isSubItem?: boolean }) => (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        isModuleActive(item) ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' : 'text-sidebar-foreground',
        isSubItem && 'py-2',
        direction === 'rtl' && 'flex-row-reverse justify-start'
      )}
    >
      <item.icon className="h-5 w-5" />
      {t(item.labelKey)}
    </Link>
  );

  const NavAccordion = ({ titleKey, icon: Icon, items, value }: { titleKey: string, icon: LucideIcon, items: NavItem[], value: string }) => (
     <AccordionItem value={value} className="border-b-0">
        <AccordionTrigger className={cn(
            "px-3 py-2.5 text-sm font-medium hover:no-underline hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg [&[data-state=open]]:bg-sidebar-accent",
            direction === 'rtl' && 'flex-row-reverse'
        )}>
        <span className={cn(
            "flex items-center gap-3",
            direction === 'rtl' && 'flex-row-reverse'
        )}>
            <Icon className="h-5 w-5" />
            <span>{t(titleKey)}</span>
        </span>
        </AccordionTrigger>
        <AccordionContent className={cn(
            "pt-1",
            direction === 'rtl' ? "pr-7" : "pl-7"
        )}>
            <div className="flex flex-col gap-1">
            {items.map((item) => (
                 item.subItems ? (
                    <NavAccordion key={item.labelKey} titleKey={item.labelKey} icon={item.icon} items={item.subItems} value={item.href} />
                ) : (
                    <NavLink key={item.labelKey} item={item} isSubItem />
                )
            ))}
            </div>
        </AccordionContent>
    </AccordionItem>
  )

  return (
    <div className="flex h-full w-[240px] flex-col bg-sidebar text-sidebar-foreground glass-sidebar">
      <div className="flex h-20 items-center justify-center border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
           {profile.logo && <Image src={profile.logo} alt="Company Logo" width={160} height={160} className="object-contain" />}
          <span className="text-2xl font-headline">{profile.erpName}</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          <NavLink item={{ href: '/dashboard', labelKey: 'sidebar.dashboard', icon: LayoutDashboard }} />
          
          <Accordion type="multiple" defaultValue={['finance', 'sales', 'supply_chain', 'human_resources']} className="w-full">
            <NavAccordion titleKey="sidebar.finance" icon={Landmark} items={financeNavItems} value="finance" />
            <NavAccordion titleKey="sidebar.sales" icon={Handshake} items={salesNavItems} value="sales" />
            <NavAccordion titleKey="sidebar.supply_chain" icon={Truck} items={supplyChainNavItems} value="supply_chain" />
            <NavAccordion titleKey="sidebar.human_resources" icon={Users} items={hrNavItems} value="human_resources" />
          </Accordion>

        </nav>
      </ScrollArea>
       <div className="mt-auto border-t border-sidebar-border p-4">
          <Link
            href="/settings"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              pathname.startsWith('/settings')
                ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                : 'text-sidebar-foreground',
              direction === 'rtl' && 'flex-row-reverse justify-start'
            )}
          >
            <Settings className="h-5 w-5" />
            {t('sidebar.settings')}
          </Link>
      </div>
    </div>
  );
}

