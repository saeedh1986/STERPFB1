
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type FontSize = 'text-base' | 'text-lg' | 'text-xl';

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  loading: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>('text-base');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedFontSize = localStorage.getItem('erpFontSize') as FontSize | null;
    if (storedFontSize && ['text-base', 'text-lg', 'text-xl'].includes(storedFontSize)) {
      document.documentElement.classList.add(storedFontSize);
      setFontSizeState(storedFontSize);
    } else {
      document.documentElement.classList.add('text-base');
    }
    setLoading(false);
  }, []);

  const setFontSize = (size: FontSize) => {
    // Remove old size classes before adding the new one
    document.documentElement.classList.remove('text-base', 'text-lg', 'text-xl');
    document.documentElement.classList.add(size);
    localStorage.setItem('erpFontSize', size);
    setFontSizeState(size);
  };

  const value = { fontSize, setFontSize, loading };

  return (
    <AccessibilityContext.Provider value={value}>
      {!loading && children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
