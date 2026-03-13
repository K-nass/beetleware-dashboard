import { api } from "./axios";
import {
  RoleListItemDto,
  RoleDetailsDto,
  PageWithClaimsDto,
  RoleItemDto,
  AddRoleCommand,
  UpdateRoleCommand,
  GetRolesWithPaginationQuery,
  PaginatedRolesResponse,
  ApiResponse
} from "@/types/role";

export const rolesApi = {
  // Get paginated roles list
  getRoles: async (
    params: GetRolesWithPaginationQuery
  ): Promise<ApiResponse<PaginatedRolesResponse>> => {
    const response = await api.post("/roles/paginated", params);
    // The API returns data wrapped in a "value" property for the items
    if (response.data.data && response.data.data.value) {
      return {
        ...response.data,
        data: {
          items: response.data.data.value,
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          totalCount: response.data.data.totalCount || 0,
          totalPages: response.data.data.totalPages || 0
        }
      };
    }
    return response.data;
  },

  // Get role by ID
  getRoleById: async (id: number): Promise<ApiResponse<RoleDetailsDto>> => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },

  // Get pages with claims for permission selection
  getPagesWithClaims: async (): Promise<ApiResponse<PageWithClaimsDto[]>> => {
    const response = await api.get("/roles/pages-with-claims");
    // The API returns data wrapped in a "value" property
    if (response.data.data && response.data.data.value) {
      return {
        ...response.data,
        data: response.data.data.value
      };
    }
    return response.data;
  },

  // Get active internal roles for dropdowns
  getActiveInternalRoles: async (): Promise<ApiResponse<RoleItemDto[]>> => {
    const response = await api.get("/roles/active-internal");
    // The API returns data wrapped in a "value" property
    if (response.data.data && response.data.data.value) {
      return {
        ...response.data,
        data: response.data.data.value
      };
    }
    return response.data;
  },

  // Add new role
  addRole: async (data: AddRoleCommand): Promise<ApiResponse<void>> => {
    const response = await api.post("/roles/add", data);
    return response.data;
  },

  // Update existing role
  updateRole: async (
    id: number,
    data: UpdateRoleCommand
  ): Promise<ApiResponse<RoleDetailsDto>> => {
    const response = await api.put(`/roles/${id}`, data);
    return response.data;
  },

  // Delete role
  deleteRole: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
  }
};
