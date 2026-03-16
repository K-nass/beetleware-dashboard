"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchRegions, LookupData, LookupItem } from '@/lib/api/lookup';

interface LookupContextValue {
  lookupData: LookupData | null;
  loading: boolean;
  error: string | null;
  getFilteredRegions: (cityId: number) => Promise<LookupItem[]>;
}

const LookupDataContext = createContext<LookupContextValue | undefined>(undefined);

interface LookupDataProviderProps {
  children: React.ReactNode;
  initialData: LookupData;
}

export function LookupDataProvider({ children, initialData }: LookupDataProviderProps) {
  const [lookupData] = useState<LookupData | null>(initialData);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const getFilteredRegions = useCallback(async (cityId: number): Promise<LookupItem[]> => {
    if (!cityId) {
      return [];
    }

    try {
      const regions = await fetchRegions(cityId);
      return regions;
    } catch (error) {
      return lookupData?.regions || [];
    }
  }, [lookupData]);

  const contextValue: LookupContextValue = {
    lookupData,
    loading,
    error,
    getFilteredRegions,
  };

  return (
    <LookupDataContext.Provider value={contextValue}>
      {children}
    </LookupDataContext.Provider>
  );
}

export function useLookupData(): LookupContextValue {
  const context = useContext(LookupDataContext);
  if (context === undefined) {
    throw new Error('useLookupData must be used within a LookupDataProvider');
  }
  return context;
}