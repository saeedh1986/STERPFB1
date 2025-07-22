
"use client";

import type { ReactNode } from 'react';
import { SidebarNav } from '@/components/SidebarNav';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ThemeProvider } from "next-themes";
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { PageHeader } from '@/components/PageHeader';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

const THEMES = ["light", "dark", "system", "theme-amber", "theme-blue", "theme-green"];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const { direction } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading application...</p>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem themes={THEMES}>
      <SidebarProvider>
          <Sidebar side={direction === 'rtl' ? 'right' : 'left'} collapsible="icon">
              <SidebarNav />
          </Sidebar>
          <SidebarInset>
            {children}
          </SidebarInset>
       </SidebarProvider>
    </ThemeProvider>
  );
}
