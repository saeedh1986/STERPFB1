
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Package, Barcode, ShoppingCart, CreditCard, TrendingUp,
  Users, Building, Truck, Layers, Combine, CalendarDays, Landmark, BotMessageSquare, Package2, Library, FileText, Calculator, BookOpen, Settings, Scale, FileSpreadsheet, AreaChart, PieChart, Users2, Tag, Copyright, Warehouse, ArrowRightLeft, Handshake, Briefcase, Wrench
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useCompanyProfile } from '@/context/CompanyProfileContext';
import { useLanguage } from '@/context/LanguageContext';


interface NavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
  subItems?: NavItem[];
}

const productNavItems: NavItem[] = [
    { href: '/product-catalog', labelKey: 'sidebar.product_catalog', icon: Library },
    { href: '/categories', labelKey: 'sidebar.categories', icon: Tag },
    { href: '/brands', labelKey: 'sidebar.brands', icon: Copyright },
];

const crmNavItems: NavItem[] = [
    { href: '/customers', labelKey: 'sidebar.customers', icon: Users },
    { href: '/vendors', labelKey: 'sidebar.vendors', icon: Building },
];

const supplyChainNavItems: NavItem[] = [
  { href: '/purchases', labelKey: 'sidebar.purchases', icon: ShoppingCart },
  { href: '/inventory', labelKey: 'sidebar.inventory_list', icon: Package },
  { href: '/inventory-transfer', labelKey: 'sidebar.inventory_transfer', icon: ArrowRightLeft },
  { href: '/warehouses', labelKey: 'sidebar.warehouses', icon: Warehouse },
  { href: '/logistics', labelKey: 'sidebar.logistics', icon: Truck },
];

const financeNavItems: NavItem[] = [
  { href: '/sales', labelKey: 'sidebar.sales', icon: TrendingUp },
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

const reportsNavItems: NavItem[] = [
    { href: '/reports/sales', labelKey: 'sidebar.sales_report', icon: AreaChart },
    { href: '/reports/purchases', labelKey: 'sidebar.purchases_report', icon: AreaChart },
    { href: '/reports/expenses', labelKey: 'sidebar.expenses_report', icon: PieChart },
    { href: '/reports/inventory', labelKey: 'sidebar.inventory_report', icon: AreaChart },
];

const toolsNavItems: NavItem[] = [
    { href: '/inventory-barcode', labelKey: 'sidebar.inventory_barcode', icon: Barcode },
    { href: '/logistics-insights', labelKey: 'sidebar.logistics_insights', icon: BotMessageSquare },
    { href: '/purchases-cal', labelKey: 'sidebar.purchases_cal', icon: Calculator },
];

const hrNavItems: NavItem[] = [
  { href: '/employees', labelKey: 'sidebar.employees', icon: Briefcase },
];


export function SidebarNav() {
  const pathname = usePathname();
  const { profile } = useCompanyProfile();
  const { t, direction } = useLanguage();
  const { state } = useSidebar();


  const isModuleActive = (href: string, subItems?: NavItem[]) => {
    if (href === '/dashboard' || href === '/') {
        return pathname === href;
    }
    if (subItems) {
        return subItems.some(sub => pathname.startsWith(sub.href));
    }
    return pathname.startsWith(href);
  };
  
  const NavLink = ({ item }: { item: NavItem }) => (
    <SidebarMenuItem>
        <Link href={item.href}>
             <SidebarMenuButton asChild isActive={isModuleActive(item.href)} tooltip={t(item.labelKey)}>
                <span>
                    <item.icon />
                    <span>{t(item.labelKey)}</span>
                </span>
            </SidebarMenuButton>
        </Link>
    </SidebarMenuItem>
  );

  const NavAccordion = ({ titleKey, icon: Icon, items, value }: { titleKey: string, icon: LucideIcon, items: NavItem[], value: string }) => {
    const isActive = items.some(item => isModuleActive(item.href, item.subItems));
    
    return (
        <AccordionItem value={value} className="border-b-0">
            <AccordionTrigger 
                className={cn(
                    "hover:no-underline hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-2",
                    "group flex w-full items-center gap-2 overflow-hidden text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2",
                     isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                     direction === 'rtl' && 'flex-row-reverse'
                )}
            >
                <div className={cn("flex items-center gap-2", direction === 'rtl' && 'flex-row-reverse')}>
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{t(titleKey)}</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1">
                <SidebarMenuSub>
                {items.map((item) => (
                    item.subItems ? (
                        <SidebarMenuSubItem key={item.labelKey} className="!p-0">
                             <NavAccordion titleKey={item.labelKey} icon={item.icon} items={item.subItems} value={item.href} />
                        </SidebarMenuSubItem>
                    ) : (
                        <SidebarMenuSubItem key={item.labelKey}>
                            <Link href={item.href}>
                                <SidebarMenuSubButton asChild isActive={isModuleActive(item.href)}>
                                    <span>
                                        <item.icon />
                                        <span>{t(item.labelKey)}</span>
                                    </span>
                                </SidebarMenuSubButton>
                            </Link>
                        </SidebarMenuSubItem>
                    )
                ))}
                </SidebarMenuSub>
            </AccordionContent>
        </AccordionItem>
    );
  }

  return (
    <>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 p-2">
            <Link href="/dashboard" className="flex items-center gap-2">
                <Image src={profile.logo} alt="Company Logo" width={32} height={32} />
                <span className={cn("text-lg font-semibold", state === 'collapsed' && 'hidden' )}>{profile.erpName}</span>
            </Link>
            <div className="grow" />
            <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <NavLink item={{ href: '/dashboard', labelKey: 'sidebar.dashboard', icon: LayoutDashboard }} />
          
          <Accordion type="multiple" defaultValue={['finance', 'sales', 'supply_chain', 'human_resources', 'products', 'crm', 'reports', 'tools']} className="w-full">
            <NavAccordion titleKey="sidebar.finance" icon={Landmark} items={financeNavItems} value="finance" />
            <NavAccordion titleKey="sidebar.products" icon={Package2} items={productNavItems} value="products" />
            <NavAccordion titleKey="sidebar.crm" icon={Handshake} items={crmNavItems} value="crm" />
            <NavAccordion titleKey="sidebar.supply_chain" icon={Truck} items={supplyChainNavItems} value="supply_chain" />
            <NavAccordion titleKey="sidebar.reports" icon={AreaChart} items={reportsNavItems} value="reports" />
            <NavAccordion titleKey="sidebar.tools" icon={Wrench} items={toolsNavItems} value="tools" />
            <NavAccordion titleKey="sidebar.human_resources" icon={Users} items={hrNavItems} value="human_resources" />
          </Accordion>

        </SidebarMenu>
      </SidebarContent>

       <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/settings">
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/settings')} tooltip={t('sidebar.settings')}>
                        <span>
                            <Settings />
                            <span>{t('sidebar.settings')}</span>
                        </span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
