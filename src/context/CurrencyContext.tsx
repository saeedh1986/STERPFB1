
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { USD_TO_AED_RATE } from '@/lib/data';

export type Currency = 'AED' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (value: number, options?: Intl.NumberFormatOptions) => string;
  getSymbol: () => string;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('AED');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCurrency = localStorage.getItem('erpCurrency') as Currency | null;
    if (storedCurrency && ['AED', 'USD'].includes(storedCurrency)) {
      setCurrencyState(storedCurrency);
    }
    setLoading(false);
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    localStorage.setItem('erpCurrency', newCurrency);
    setCurrencyState(newCurrency);
  };
  
  const getSymbol = useMemo(() => () => {
    return currency === 'AED' ? 'د.إ' : '$';
  }, [currency]);

  const formatCurrency = useMemo(() => (value: number, options: Intl.NumberFormatOptions = {}) => {
      const { minimumFractionDigits = 2, maximumFractionDigits = 2 } = options;
      
      const convertedValue = currency === 'USD' ? value / USD_TO_AED_RATE : value;

      return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(convertedValue);
  }, [currency]);


  const value = { currency, setCurrency, formatCurrency, getSymbol, loading };

  return (
    <CurrencyContext.Provider value={value}>
      {!loading && children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
