"use client";

import { useEffect, useRef } from "react";

interface PermissionsToggleProps {
  pageId: number;
  pageName: string;
  claimIds: number[];
  initialSelectedIds: number[];
}

/**
 * Client Island: manages the per-page "select all" checkbox with indeterminate state.
 * Toggling it checks/unchecks all claim checkboxes for that page via the DOM.
 */
export default function PermissionsToggle({
  pageId,
  pageName,
  claimIds,
  initialSelectedIds,
}: PermissionsToggleProps) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  const allSelected = claimIds.every((id) => initialSelectedIds.includes(id));
  const someSelected = claimIds.some((id) => initialSelectedIds.includes(id));

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [someSelected, allSelected]);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    // Find all claim checkboxes for this page and set their checked state
    claimIds.forEach((id) => {
      const el = document.getElementById(`claim-${id}`) as HTMLInputElement | null;
      if (el) el.checked = checked;
    });
    // Update indeterminate state
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = false;
    }
  };

  return (
    <div className="flex items-center">
      <input
        ref={checkboxRef}
        type="checkbox"
        id={`page-${pageId}`}
        defaultChecked={allSelected}
        onChange={handleToggle}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label
        htmlFor={`page-${pageId}`}
        className="ml-2 block text-sm font-semibold text-gray-900"
      >
        {pageName}
      </label>
    </div>
  );
}
