
"use client";

import type { ReactNode } from 'react';
import { SidebarNav } from '@/components/SidebarNav';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
// import { ThemeProvider } from "next-themes"; // Uncomment if using next-themes

export default function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
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
    // <ThemeProvider attribute="class" defaultTheme="system" enableSystem> // Uncomment if using next-themes
      <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-sidebar md:block">
          <SidebarNav />
        </div>
        <div className="flex flex-col">
          {children}
        </div>
      </div>
    // </ThemeProvider> // Uncomment if using next-themes
  );
}
