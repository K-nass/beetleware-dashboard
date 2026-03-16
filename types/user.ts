export interface ApiResponse<T> {
    statusCode:number;
    succeeded:boolean;
    message:string;
    data:T;
}

export interface User {
    id:string;
    email:string;
    fullName:string;
    role:string;
    permissions:string[];
    isActive:boolean;
}

export interface LoginData {
    user:User;
    token:string;
    refreshToken:string;
    isFirstTimeLogin:boolean;
}

export interface LoginCredentials {
    phoneNumber:string;
    password:string;
}

export type LoginResponse = ApiResponse<LoginData>;

// User Management Types
export enum UserTypeEnum {
    Internal = 1,
    External = 2
}

export interface UserListItem {
    id: number;
    email: string;
    fullName: string;
    phoneNumber: string | null;
    nationalId?: string | null;
    dateOfBirth?: string | null;
    genderId?: number | null;
    rolesNames?: string | null;
    roles?: string[] | null;
    joinedDate: string;
    isActive: boolean;
    userType?: UserTypeEnum;
}

export interface UserDetails extends UserListItem {
    permissions?: string[];
    metadata?: Record<string, any>;
}

export interface AddInternalUserRequest {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    role: string;
}

export interface AddExternalUserRequest {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    genderId: number;
    nationalId: string;
    dateOfBirth: string;
}

export interface UpdateInternalUserRequest {
    id: number;
    email: string;
    fullName: string;
    phoneNumber: string;
    role: string;
    password?: string;
}

export interface UpdateExternalUserRequest {
    id: number;
    email: string;
    fullName: string;
    phoneNumber: string;
    genderId: number;
    nationalId: string;
    dateOfBirth: string;
    password?: string;
}

export interface UsersListResponse {
    items: UserListItem[];
    totalCount?: number;
}

export interface UsersPaginatedResponse {
    items: UserListItem[];
    meta: {
        pageNumber: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
    };
}