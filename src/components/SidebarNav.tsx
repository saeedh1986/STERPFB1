
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Package, Barcode, ShoppingCart, CreditCard, TrendingUp,
  Users, Building, Truck, Layers, Combine, CalendarDays, Landmark, BotMessageSquare, Package2, Library, FileText, Calculator, BookOpen, Settings, Scale, FileSpreadsheet, AreaChart, PieChart, Users2
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
}

const navItems: NavItem[] = [
  { href: '/dashboard', labelKey: 'sidebar.dashboard', icon: LayoutDashboard },
  { href: '/product-catalog', labelKey: 'sidebar.product_catalog', icon: Library },
  { href: '/inventory', labelKey: 'sidebar.inventory', icon: Package },
  { href: '/inventory-barcode', labelKey: 'sidebar.inventory_barcode', icon: Barcode },
  { href: '/purchases', labelKey: 'sidebar.purchases', icon: ShoppingCart },
  { href: '/sales', labelKey: 'sidebar.sales', icon: TrendingUp },
  { href: '/invoices', labelKey: 'sidebar.invoices', icon: FileText },
  { href: '/expenses', labelKey: 'sidebar.expenses', icon: CreditCard },
  { href: '/logistics', labelKey: 'sidebar.logistics', icon: Truck },
  { href: '/ipcc', labelKey: 'sidebar.cost_calculator', icon: Calculator },
  { href: '/ipbt', labelKey: 'sidebar.ipbt', icon: Combine },
  { href: '/purchases-cal', labelKey: 'sidebar.purchases_cal', icon: CalendarDays },
  { href: '/logistics-insights', labelKey: 'sidebar.logistics_insights', icon: BotMessageSquare },
];

const crmNavItems: NavItem[] = [
    { href: '/customers', labelKey: 'sidebar.customers', icon: Users },
    { href: '/vendors', labelKey: 'sidebar.vendors', icon: Building },
];

const accountingNavItems: NavItem[] = [
    { href: '/general-journal', labelKey: 'sidebar.general_journal', icon: BookOpen },
    { href: '/bank-statement', labelKey: 'sidebar.bank_statement', icon: Landmark },
    { href: '/trial-balance', labelKey: 'sidebar.trial_balance', icon: Scale },
    { href: '/income-statement', labelKey: 'sidebar.income_statement', icon: PieChart },
    { href: '/balance-sheet', labelKey: 'sidebar.balance_sheet', icon: FileSpreadsheet },
];

const reportsNavItems: NavItem[] = [
    { href: '/reports/sales', labelKey: 'sidebar.sales_report', icon: TrendingUp },
    { href: '/reports/purchases', labelKey: 'sidebar.purchases_report', icon: ShoppingCart },
    { href: '/reports/expenses', labelKey: 'sidebar.expenses_report', icon: CreditCard },
    { href: '/reports/inventory', labelKey: 'sidebar.inventory_report', icon: Package },
];


export function SidebarNav() {
  const pathname = usePathname();
  const { profile } = useCompanyProfile();
  const { t } = useLanguage();

  const isModuleActive = (item: NavItem) => {
    if (item.href === '/dashboard' || item.href === '/') {
        return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground glass-sidebar">
      <div className="flex h-20 items-center justify-center border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-3 font-semibold">
           {profile.logo && <Image src={profile.logo} alt="Company Logo" width={40} height={40} className="object-contain" />}
          <span className="text-2xl font-headline">{profile.erpName}</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.labelKey}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isModuleActive(item)
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                  : 'text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {t(item.labelKey)}
            </Link>
          ))}
          
          <Accordion type="multiple" defaultValue={['reports', 'accounting', 'crm']} className="w-full">
            <AccordionItem value="crm" className="border-b-0">
              <AccordionTrigger className="px-3 py-2.5 text-sm hover:no-underline hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg [&[data-state=open]]:bg-sidebar-accent">
                <span className="flex items-center gap-3">
                  <Users2 className="h-5 w-5" />
                  {t('sidebar.crm')}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-7 pt-1">
                 <div className="flex flex-col gap-1">
                  {crmNavItems.map((item) => (
                     <Link
                      key={item.labelKey}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        isModuleActive(item)
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                          : 'text-sidebar-foreground'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {t(item.labelKey)}
                    </Link>
                  ))}
                 </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="reports" className="border-b-0">
              <AccordionTrigger className="px-3 py-2.5 text-sm hover:no-underline hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg [&[data-state=open]]:bg-sidebar-accent">
                <span className="flex items-center gap-3">
                  <AreaChart className="h-5 w-5" />
                  {t('sidebar.reports')}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-7 pt-1">
                 <div className="flex flex-col gap-1">
                  {reportsNavItems.map((item) => (
                     <Link
                      key={item.labelKey}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        isModuleActive(item)
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                          : 'text-sidebar-foreground'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {t(item.labelKey)}
                    </Link>
                  ))}
                 </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="accounting" className="border-b-0">
              <AccordionTrigger className="px-3 py-2.5 text-sm hover:no-underline hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg [&[data-state=open]]:bg-sidebar-accent">
                <span className="flex items-center gap-3">
                  <Layers className="h-5 w-5" />
                  {t('sidebar.accounting')}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-7 pt-1">
                 <div className="flex flex-col gap-1">
                  {accountingNavItems.map((item) => (
                     <Link
                      key={item.labelKey}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        isModuleActive(item)
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                          : 'text-sidebar-foreground'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {t(item.labelKey)}
                    </Link>
                  ))}
                 </div>
              </AccordionContent>
            </AccordionItem>
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
                : 'text-sidebar-foreground'
            )}
          >
            <Settings className="h-5 w-5" />
            {t('sidebar.settings')}
          </Link>
      </div>
    </div>
  );
}
