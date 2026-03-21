"use client";

import { useState, useEffect, useCallback } from 'react';
import { FormDropdown } from './FormDropdown';
import { LookupItem } from '@/lib/api/lookup';
import { fetchRegionsAction } from '@/app/actions/lookup';

interface CityRegionDropdownsProps {
  cities: LookupItem[];           // passed from server
  initialCityId?: number | null;
  initialRegionId?: number | null;
  required?: boolean;
}

export function CityRegionDropdowns({
  cities,
  initialCityId,
  initialRegionId,
  required = false
}: CityRegionDropdownsProps) {
  const [selectedCityId, setSelectedCityId] = useState<number | null>(initialCityId ?? null);
  const [regionOptions, setRegionOptions] = useState<LookupItem[]>([]);
  const [regionLoading, setRegionLoading] = useState(false);
  const [regionError, setRegionError] = useState<string | null>(null);

  // Load regions for initial cityId on mount
  useEffect(() => {
    if (initialCityId) {
      setRegionLoading(true);
      fetchRegionsAction(initialCityId)
        .then(setRegionOptions)
        .catch(() => setRegionError('Failed to load regions'))
        .finally(() => setRegionLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCityChange = useCallback(async (cityId: number) => {
    setSelectedCityId(cityId);
    setRegionOptions([]);
    if (!cityId) return;
    try {
      setRegionLoading(true);
      setRegionError(null);
      const regions = await fetchRegionsAction(cityId);
      setRegionOptions(regions);
    } catch {
      setRegionError('Failed to load regions');
    } finally {
      setRegionLoading(false);
    }
  }, []);

  const isRegionDisabled = !selectedCityId || regionLoading || cities.length === 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          <select
            name="cityId"
            defaultValue={selectedCityId ?? ""}
            onChange={(e) => handleCityChange(Number(e.target.value))}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300 bg-white text-gray-900 appearance-none"
          >
            <option value="" disabled>Select a city</option>
            {cities.map((city) => (
              <option key={city.value} value={city.value}>{city.label}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <FormDropdown
        label="Region"
        name="regionId"
        defaultValue={initialRegionId && regionOptions.length > 0 ? initialRegionId : undefined}
        options={regionOptions}
        placeholder={
          !selectedCityId
            ? "Select a city first"
            : regionOptions.length === 0 && !regionLoading
            ? "No regions available"
            : "Select a region"
        }
        disabled={isRegionDisabled}
        required={required}
      />

      {regionError && (
        <p className="col-span-2 text-sm text-red-600">{regionError}</p>
      )}
    </div>
  );
}
