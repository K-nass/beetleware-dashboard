"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FormDropdown } from './FormDropdown';
import { useLookupData } from '@/lib/contexts/LookupDataContext';
import { LookupItem, safeGetLookupArray } from '@/lib/api/lookup';

interface CityRegionDropdownsProps {
  cityId: number | null | undefined;
  regionId: number | null | undefined;
  onCityChange: (cityId: number) => void;
  onRegionChange: (regionId: number) => void;
  className?: string;
  required?: boolean;
}

export function CityRegionDropdowns({
  cityId,
  regionId,
  onCityChange,
  onRegionChange,
  className = "",
  required = false
}: CityRegionDropdownsProps) {
  const { lookupData, loading, error, getFilteredRegions } = useLookupData();
  const [regionOptions, setRegionOptions] = useState<LookupItem[]>([]);
  const [regionLoading, setRegionLoading] = useState(false);
  const [regionError, setRegionError] = useState<string | null>(null);

  // Load regions when city changes
  const loadRegionsForCity = useCallback(async (selectedCityId: number) => {
    if (!selectedCityId) {
      setRegionOptions([]);
      return;
    }

    try {
      setRegionLoading(true);
      setRegionError(null);
      
      // Use the context method to get filtered regions
      const regions = await getFilteredRegions(selectedCityId);
      setRegionOptions(regions);
    } catch (err) {
      console.error('Failed to load regions for city:', selectedCityId, err);
      setRegionError('Failed to load regions');
      setRegionOptions([]);
    } finally {
      setRegionLoading(false);
    }
  }, [getFilteredRegions]);

  // Handle city selection change
  const handleCityChange = useCallback((selectedCityId: number) => {
    onCityChange(selectedCityId);
    
    // Clear region selection when city changes
    if (regionId) {
      onRegionChange(0); // Reset to no selection
    }
    
    // Load regions for the new city
    loadRegionsForCity(selectedCityId);
  }, [onCityChange, onRegionChange, regionId, loadRegionsForCity]);

  // Handle region selection change
  const handleRegionChange = useCallback((selectedRegionId: number) => {
    onRegionChange(selectedRegionId);
  }, [onRegionChange]);

  // Load regions when component mounts with existing cityId
  useEffect(() => {
    if (cityId) {
      loadRegionsForCity(cityId);
    }
  }, [cityId, loadRegionsForCity]);

  const cities = safeGetLookupArray(lookupData, 'cities');
  const isRegionDisabled = !cityId || regionLoading || cities.length === 0;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {/* City Dropdown */}
      <FormDropdown
        label="City"
        value={cityId}
        options={cities}
        onChange={handleCityChange}
        placeholder="Select a city"
        loading={loading}
        error={error || undefined}
        required={required}
      />

      {/* Region Dropdown */}
      <FormDropdown
        label="Region"
        value={regionId}
        options={regionOptions}
        onChange={handleRegionChange}
        placeholder={
          !cityId 
            ? "Select a city first" 
            : regionOptions.length === 0 && !regionLoading
            ? "No regions available"
            : "Select a region"
        }
        disabled={isRegionDisabled}
        loading={regionLoading}
        error={regionError || undefined}
        required={required}
      />
    </div>
  );
}