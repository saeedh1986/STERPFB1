
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
  loading: boolean;
}

const translations = { en, ar };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('erpLanguage') as Language | null;
    const initialLang = storedLanguage || 'en';
    setLanguage(initialLang); // Use the setter to correctly initialize everything
    setLoading(false);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const newDirection = lang === 'ar' ? 'rtl' : 'ltr';
    setDirection(newDirection);
    localStorage.setItem('erpLanguage', lang);
    if (typeof window !== 'undefined') {
        document.documentElement.lang = lang;
        document.documentElement.dir = newDirection;
    }
  };
  
  const t = useCallback((key: string, options?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let result = translations[language] as any;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallbackResult = translations.en as any;
        for (const fk of keys) {
          fallbackResult = fallbackResult?.[fk];
          if (fallbackResult === undefined) return key;
        }
        result = fallbackResult;
        break;
      }
    }
    
    if (typeof result === 'string' && options) {
      return Object.entries(options).reduce((acc, [optKey, optValue]) => {
        return acc.replace(`{{${optKey}}}`, String(optValue));
      }, result);
    }

    return result || key;
  }, [language]);


  const value = { language, direction, setLanguage, t, loading };

  return (
    <LanguageContext.Provider value={value}>
      {!loading && children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
