// API Response wrapper
export interface ApiResponse<T> {
  statusCode: number;
  succeeded: boolean;
  message: string;
  errors?: string[];
  data: T;
}

// Wrapper for list responses that have a "value" property
export interface ListDataWrapper<T> {
  value: T[];
}

// Role list item (for table/card display)
export interface RoleListItemDto {
  id: number;
  name: string;
  description: string;
  numberOfUsers: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string; // ISO date-time
  updatedBy: string;
  updatedAt: string; // ISO date-time
  permissions: string[];
}

// Role details (for edit/view)
export interface RoleDetailsDto {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  claimIds: number[];
  permissions: string[];
  numberOfUsers: number;
}

// Page with claims (for permission selection)
export interface PageWithClaimsDto {
  id: number;
  key: string;
  name: string;
  claims: ClaimDto[];
}

// Individual claim
export interface ClaimDto {
  id: number;
  key: string;
  name: string;
}

// Role item for dropdowns
export interface RoleItemDto {
  value: number;
  label: string;
}

// Add role command
export interface AddRoleCommand {
  roleName: string;
  description: string;
  claimIds: number[];
  isActive: boolean;
}

// Update role command
export interface UpdateRoleCommand {
  roleId: number;
  roleName: string;
  description: string;
  claimIds: number[];
  isActive: boolean;
}

// Pagination query
export interface GetRolesWithPaginationQuery {
  searchTerm?: string;
  sortColumn?: string;
  sortOrder?: 'asc' | 'desc';
  pageNumber: number;
  pageSize: number;
}

// Paginated response
export interface PaginatedRolesResponse {
  items: RoleListItemDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
