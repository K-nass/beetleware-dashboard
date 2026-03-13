"use client";

import { useState, useEffect } from "react";
import { RoleDetailsDto, PageWithClaimsDto, AddRoleCommand, UpdateRoleCommand } from "@/types/role";

interface BaseRoleFormProps {
  initialData?: RoleDetailsDto | null;
  pagesWithClaims?: PageWithClaimsDto[];
  isSubmitting: boolean;
}

interface AddRoleFormProps extends BaseRoleFormProps {
  mode: 'add';
  onSubmit: (data: AddRoleCommand) => void;
}

interface EditRoleFormProps extends BaseRoleFormProps {
  mode: 'edit';
  onSubmit: (data: UpdateRoleCommand) => void;
}

type RoleFormProps = AddRoleFormProps | EditRoleFormProps;

interface FormErrors {
  roleName?: string;
  description?: string;
  claimIds?: string;
}

export default function RoleForm({
  initialData,
  pagesWithClaims = [],
  onSubmit,
  isSubmitting,
  mode
}: RoleFormProps) {
  const [roleName, setRoleName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [selectedClaimIds, setSelectedClaimIds] = useState<number[]>(initialData?.claimIds || []);
  const [errors, setErrors] = useState<FormErrors>({});

  // Ensure pagesWithClaims is always an array
  const safePages = Array.isArray(pagesWithClaims) ? pagesWithClaims : [];

  useEffect(() => {
    if (initialData) {
      setRoleName(initialData.name);
      setDescription(initialData.description);
      setIsActive(initialData.isActive);
      setSelectedClaimIds(initialData.claimIds || []);
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Role name validation
    if (!roleName.trim()) {
      newErrors.roleName = 'Role name is required';
    } else if (roleName.trim().length < 2) {
      newErrors.roleName = 'Role name must be at least 2 characters';
    } else if (roleName.trim().length > 100) {
      newErrors.roleName = 'Role name must not exceed 100 characters';
    }

    // Description validation
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (description.trim().length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    // Claims validation
    if (selectedClaimIds.length === 0) {
      newErrors.claimIds = 'At least one permission must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (mode === 'edit' && initialData) {
      const updateData: UpdateRoleCommand = {
        roleId: initialData.id,
        roleName: roleName.trim(),
        description: description.trim(),
        claimIds: selectedClaimIds,
        isActive
      };
      (onSubmit as (data: UpdateRoleCommand) => void)(updateData);
    } else {
      const addData: AddRoleCommand = {
        roleName: roleName.trim(),
        description: description.trim(),
        claimIds: selectedClaimIds,
        isActive
      };
      (onSubmit as (data: AddRoleCommand) => void)(addData);
    }
  };

  const handleClaimToggle = (claimId: number) => {
    setSelectedClaimIds(prev =>
      prev.includes(claimId)
        ? prev.filter(id => id !== claimId)
        : [...prev, claimId]
    );
  };

  const handlePageToggle = (pageId: number) => {
    const page = safePages.find(p => p.id === pageId);
    if (!page) return;

    const pageClaimIds = page.claims.map(c => c.id);
    const allSelected = pageClaimIds.every(id => selectedClaimIds.includes(id));

    if (allSelected) {
      // Deselect all claims in this page
      setSelectedClaimIds(prev => prev.filter(id => !pageClaimIds.includes(id)));
    } else {
      // Select all claims in this page
      setSelectedClaimIds(prev => {
        const newIds = [...prev];
        pageClaimIds.forEach(id => {
          if (!newIds.includes(id)) {
            newIds.push(id);
          }
        });
        return newIds;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Role Name */}
      <div>
        <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-1">
          Role Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="roleName"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className={`block w-full px-3 py-2 border ${
            errors.roleName ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          placeholder="Enter role name"
          disabled={isSubmitting}
        />
        {errors.roleName && (
          <p className="mt-1 text-sm text-red-600">{errors.roleName}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`block w-full px-3 py-2 border ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          placeholder="Enter role description"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Is Active */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={isSubmitting}
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
          Active
        </label>
      </div>

      {/* Permissions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Permissions <span className="text-red-500">*</span>
        </label>
        <div className="border border-gray-300 rounded-md p-4 max-h-96 overflow-y-auto">
          {safePages.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-900">No permissions available</p>
              <p className="mt-1 text-xs text-gray-500">
                Permissions need to be configured in the system before creating roles.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {safePages.map((page) => {
                const pageClaimIds = page.claims.map(c => c.id);
                const allSelected = pageClaimIds.every(id => selectedClaimIds.includes(id));
                const someSelected = pageClaimIds.some(id => selectedClaimIds.includes(id));

                return (
                  <div key={page.id} className="space-y-2">
                    {/* Page header with select all */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`page-${page.id}`}
                        checked={allSelected}
                        ref={(input) => {
                          if (input) {
                            input.indeterminate = someSelected && !allSelected;
                          }
                        }}
                        onChange={() => handlePageToggle(page.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor={`page-${page.id}`}
                        className="ml-2 block text-sm font-semibold text-gray-900"
                      >
                        {page.name}
                      </label>
                    </div>

                    {/* Claims */}
                    <div className="ml-6 space-y-2">
                      {page.claims.map((claim) => (
                        <div key={claim.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`claim-${claim.id}`}
                            checked={selectedClaimIds.includes(claim.id)}
                            onChange={() => handleClaimToggle(claim.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            disabled={isSubmitting}
                          />
                          <label
                            htmlFor={`claim-${claim.id}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {claim.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {errors.claimIds && (
          <p className="mt-1 text-sm text-red-600">{errors.claimIds}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {mode === 'edit' ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            mode === 'edit' ? 'Update Role' : 'Create Role'
          )}
        </button>
      </div>
    </form>
  );
}
