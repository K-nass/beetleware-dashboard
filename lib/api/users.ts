import { api } from "./axios";
import {
    UserListItem,
    UserDetails,
    AddInternalUserRequest,
    AddExternalUserRequest,
    UpdateInternalUserRequest,
    UpdateExternalUserRequest,
    UsersListResponse,
    UsersPaginatedResponse,
    UserTypeEnum,
    ApiResponse
} from "@/types/user";

export interface UsersListRequest {
    searchTerm?: string;
    userType?: UserTypeEnum;
}

export interface UsersPaginatedRequest extends UsersListRequest {
    pageNumber: number;
    pageSize: number;
}

export const usersApi = {
    // List users (non-paginated)
    getUsers: async (params: UsersListRequest): Promise<ApiResponse<UsersListResponse>> => {
        const response = await api.get("/users/list", { params });
        return response.data;
    },

    // List users (paginated)
    getUsersPaginated: async (params: UsersPaginatedRequest): Promise<ApiResponse<UsersPaginatedResponse>> => {
        const response = await api.get("/users/paginated", { params });
        return response.data;
    },

    // Get user by ID
    getUserById: async (id: number): Promise<ApiResponse<UserDetails>> => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    // Add internal user
    addInternalUser: async (data: AddInternalUserRequest): Promise<ApiResponse<void>> => {
        const response = await api.post("/users/add-admin", data);
        return response.data;
    },

    // Add external user
    addExternalUser: async (data: AddExternalUserRequest): Promise<ApiResponse<void>> => {
        const response = await api.post("/users/add-external", data);
        return response.data;
    },

    // Update internal user
    updateInternalUser: async (data: UpdateInternalUserRequest): Promise<ApiResponse<void>> => {
        const response = await api.put("/users/update", data);
        return response.data;
    },

    // Update external user
    updateExternalUser: async (data: UpdateExternalUserRequest): Promise<ApiResponse<void>> => {
        const response = await api.put("/users/update-external", data);
        return response.data;
    },

    // Toggle user status
    toggleUserStatus: async (id: number): Promise<ApiResponse<void>> => {
        const response = await api.post(`/users/${id}/toggle-status`);
        return response.data;
    },

    // Delete user
    deleteUser: async (id: number): Promise<ApiResponse<void>> => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};
