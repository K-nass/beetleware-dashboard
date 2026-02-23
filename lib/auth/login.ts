import { LoginCredentials,LoginResponse } from "@/types/user";
import { api } from "../api/axios";

const auth = {
    login: async (credentials:LoginCredentials): Promise<LoginResponse> => {
        const response = await api.post("/auth/login",credentials);
        return response.data;
    }
}


export default auth;