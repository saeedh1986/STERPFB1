
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
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarTrigger,
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

  const isModuleActive = (href: string, subItems?: NavItem[]) => {
    if (href === '/dashboard' || href === '/') {
        return pathname === href;
    }
    if (pathname.startsWith(href)) {
        return true;
    }
    if (subItems) {
        return subItems.some(sub => pathname.startsWith(sub.href));
    }
    return false;
  };
  
  const NavLink = ({ item }: { item: NavItem }) => (
    <SidebarMenuItem>
        <Link href={item.href} passHref legacyBehavior>
             <SidebarMenuButton asChild isActive={isModuleActive(item.href)} tooltip={t(item.labelKey)}>
                <item.icon />
                <span>{t(item.labelKey)}</span>
            </SidebarMenuButton>
        </Link>
    </SidebarMenuItem>
  );

  const NavAccordion = ({ titleKey, icon: Icon, items, value }: { titleKey: string, icon: LucideIcon, items: NavItem[], value: string }) => {
    const isActive = items.some(item => isModuleActive(item.href, item.subItems));
    
    return (
        <AccordionItem value={value} className="border-b-0">
            <AccordionTrigger className={cn(
                "hover:no-underline hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md",
                 isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}>
                <SidebarMenuButton asChild size="default" variant="ghost" className="w-full justify-start p-2 h-auto" isActive={isActive}>
                    <>
                        <Icon />
                        <span>{t(titleKey)}</span>
                    </>
                </SidebarMenuButton>
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
                            <Link href={item.href} passHref legacyBehavior>
                                <SidebarMenuSubButton asChild isActive={isModuleActive(item.href)}>
                                    <item.icon />
                                    <span>{t(item.labelKey)}</span>
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
            <Link href="/dashboard">
                <Image src={profile.logo} alt="Company Logo" width={32} height={32} />
            </Link>
            <span className="text-lg font-semibold">{profile.erpName}</span>
            <div className="grow" />
            <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <NavLink item={{ href: '/dashboard', labelKey: 'sidebar.dashboard', icon: LayoutDashboard }} />
          
          <Accordion type="multiple" defaultValue={['finance', 'sales', 'supply_chain', 'human_resources']} className="w-full">
            <NavAccordion titleKey="sidebar.finance" icon={Landmark} items={financeNavItems} value="finance" />
            <NavAccordion titleKey="sidebar.sales" icon={Handshake} items={salesNavItems} value="sales" />
            <NavAccordion titleKey="sidebar.supply_chain" icon={Truck} items={supplyChainNavItems} value="supply_chain" />
            <NavAccordion titleKey="sidebar.human_resources" icon={Users} items={hrNavItems} value="human_resources" />
          </Accordion>

        </SidebarMenu>
      </SidebarContent>

       <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/settings" passHref legacyBehavior>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/settings')} tooltip={t('sidebar.settings')}>
                         <Settings />
                        <span>{t('sidebar.settings')}</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
