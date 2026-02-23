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