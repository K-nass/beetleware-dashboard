import { LookupItem } from '@/lib/api/lookup';

/**
 * Helper function to create a dropdown change handler that integrates with existing form state
 * This maintains compatibility with the existing handleInputChange function pattern
 */
export function createDropdownChangeHandler<T>(
  field: keyof T,
  handleInputChange: (field: keyof T, value: any) => void
) {
  return (value: number) => {
    handleInputChange(field, value);
  };
}

/**
 * Helper function to find the selected option for a dropdown
 * Returns the LookupItem that matches the current form value
 */
export function findSelectedOption(
  options: LookupItem[],
  value: number | null | undefined
): LookupItem | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  return options.find(option => option.value === value);
}

/**
 * Helper function to get the display label for a form field value
 * Returns the human-readable label or a fallback if not found
 */
export function getDisplayLabel(
  options: LookupItem[],
  value: number | null | undefined,
  fallback: string = 'Not selected'
): string {
  const selectedOption = findSelectedOption(options, value);
  return selectedOption?.label || fallback;
}

/**
 * Helper function to validate that a required dropdown has a selection
 */
export function validateDropdownSelection(
  value: number | null | undefined,
  fieldName: string,
  required: boolean = true
): string | null {
  if (required && (value === null || value === undefined || value === 0)) {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Helper function to validate multiple dropdown selections
 * Returns an object with field names as keys and error messages as values
 */
export function validateDropdownSelections(
  formData: Record<string, any>,
  fieldValidations: Array<{
    field: string;
    displayName: string;
    required?: boolean;
  }>
): Record<string, string> {
  const errors: Record<string, string> = {};

  fieldValidations.forEach(({ field, displayName, required = true }) => {
    const error = validateDropdownSelection(formData[field], displayName, required);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}

/**
 * Helper function to check if form data contains valid IDs that exist in lookup data
 * Useful for handling cases where stored IDs might not exist in current lookup data
 */
export function validateFormDataAgainstLookups(
  formData: Record<string, any>,
  lookupMappings: Array<{
    field: string;
    options: LookupItem[];
    displayName: string;
  }>
): Array<{ field: string; displayName: string; invalidValue: any }> {
  const invalidFields: Array<{ field: string; displayName: string; invalidValue: any }> = [];

  lookupMappings.forEach(({ field, options, displayName }) => {
    const value = formData[field];
    if (value !== null && value !== undefined && value !== 0) {
      const exists = options.some(option => option.value === value);
      if (!exists) {
        invalidFields.push({
          field,
          displayName,
          invalidValue: value
        });
      }
    }
  });

  return invalidFields;
}

/**
 * Helper function to create form field mappings for lookup validation
 * This creates the mapping structure needed for validateFormDataAgainstLookups
 */
export function createLookupMappings(
  lookupData: any,
  fieldMappings: Array<{
    field: string;
    lookupKey: string;
    displayName: string;
  }>
) {
  return fieldMappings.map(({ field, lookupKey, displayName }) => ({
    field,
    options: lookupData?.[lookupKey] || [],
    displayName
  }));
}

/**
 * Type-safe helper for form field keys
 * Ensures that field names match the form data structure
 */
export type FormFieldKey<T> = keyof T;

/**
 * Helper to create strongly-typed dropdown change handlers
 */
export function createTypedDropdownHandler<T>(
  field: FormFieldKey<T>,
  handleInputChange: (field: FormFieldKey<T>, value: any) => void
) {
  return createDropdownChangeHandler(field, handleInputChange);
}