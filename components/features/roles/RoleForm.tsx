import { RoleDetailsDto, PageWithClaimsDto } from "@/types/role";
import PermissionsToggle from "./PermissionsToggle";

interface RoleFormProps {
  initialData?: RoleDetailsDto | null;
  pagesWithClaims?: PageWithClaimsDto[];
  /** Hidden roleId field — only needed for edit mode */
  roleId?: number;
  error?: string | null;
}


export default function RoleForm({
  initialData,
  pagesWithClaims = [],
  roleId,
  error,
}: RoleFormProps) {
  const safePages = Array.isArray(pagesWithClaims) ? pagesWithClaims : [];
  const selectedClaimIds = initialData?.claimIds ?? [];

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Hidden roleId for edit mode */}
      {roleId !== undefined && (
        <input type="hidden" name="roleId" value={roleId} />
      )}

      {/* Role Name */}
      <div>
        <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-1">
          Role Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="roleName"
          name="roleName"
          defaultValue={initialData?.name ?? ""}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter role name"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialData?.description ?? ""}
          required
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter role description"
        />
      </div>

      {/* Is Active */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          value="true"
          defaultChecked={initialData?.isActive ?? true}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                const pageClaimIds = page.claims.map((c) => c.id);

                return (
                  <div key={page.id} className="space-y-2">
                    {/* Per-page select-all toggle — Client Island */}
                    <PermissionsToggle
                      pageId={page.id}
                      pageName={page.name}
                      claimIds={pageClaimIds}
                      initialSelectedIds={selectedClaimIds}
                    />

                    {/* Individual claim checkboxes */}
                    <div className="ml-6 space-y-2">
                      {page.claims.map((claim) => (
                        <div key={claim.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`claim-${claim.id}`}
                            name="claimIds"
                            value={claim.id.toString()}
                            defaultChecked={selectedClaimIds.includes(claim.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
      </div>
    </div>
  );
}
