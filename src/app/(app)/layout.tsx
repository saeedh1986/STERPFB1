
"use client";

import type { ReactNode } from 'react';
import { SidebarNav } from '@/components/SidebarNav';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ThemeProvider } from "next-themes";
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

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
      <div className={cn(
        "grid min-h-screen w-full",
        direction === 'rtl' ? "md:grid-cols-[1fr_280px]" : "md:grid-cols-[280px_1fr]"
      )}>
        <div className={cn(
          "hidden bg-sidebar md:block glass-sidebar",
           direction === 'rtl' ? "border-l" : "border-r"
        )}>
          <SidebarNav />
        </div>
        <div className="flex flex-col">
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}
