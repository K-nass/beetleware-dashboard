"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchAllLookupData, fetchRegions, LookupData, LookupItem } from '@/lib/api/lookup';

interface LookupContextValue {
  lookupData: LookupData | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
  getFilteredRegions: (cityId: number) => Promise<LookupItem[]>;
}

const LookupDataContext = createContext<LookupContextValue | undefined>(undefined);

interface LookupDataProviderProps {
  children: React.ReactNode;
}

export function LookupDataProvider({ children }: LookupDataProviderProps) {
  const [lookupData, setLookupData] = useState<LookupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLookupData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading lookup data...');
      const data = await fetchAllLookupData();
      console.log('Lookup data received:', data);
      setLookupData(data);
    } catch (err) {
      console.error('Failed to load lookup data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load lookup data');
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    loadLookupData();
  }, [loadLookupData]);

  const getFilteredRegions = useCallback(async (cityId: number): Promise<LookupItem[]> => {
    if (!cityId) {
      return [];
    }

    try {
      // Fetch regions specific to the selected city
      const regions = await fetchRegions(cityId);
      return regions;
    } catch (error) {
      console.error('Failed to fetch regions for city:', cityId, error);
      // Fallback to all regions if city-specific fetch fails
      return lookupData?.regions || [];
    }
  }, [lookupData]);

  useEffect(() => {
    loadLookupData();
  }, [loadLookupData]);

  const contextValue: LookupContextValue = {
    lookupData,
    loading,
    error,
    retry,
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