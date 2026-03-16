import { api } from "./axios";
import {
  LandClassification,
  CreateLandClassificationCommand,
  UpdateLandClassificationCommand,
  ApiResponse
} from "@/types/settings";

export const landClassificationsApi = {
  // Create new land classification
  create: async (
    data: CreateLandClassificationCommand
  ): Promise<ApiResponse<void>> => {
    const response = await api.post("/land-classifications", data);
    return response.data;
  },

  // Update existing land classification
  update: async (
    id: number,
    data: UpdateLandClassificationCommand
  ): Promise<ApiResponse<void>> => {
    const response = await api.put(`/land-classifications/${id}`, {
      ...data,
      id
    });
    return response.data;
  },

  // Delete land classification
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/land-classifications/${id}`);
    return response.data;
  }
};
