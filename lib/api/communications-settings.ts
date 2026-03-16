import { api } from "./axios";
import {
  CommunicationsSettings,
  UpdateCommunicationsSettingsCommand,
  ApiResponse
} from "@/types/settings";

export const communicationsSettingsApi = {
  // Update communications settings
  update: async (
    data: UpdateCommunicationsSettingsCommand
  ): Promise<ApiResponse<CommunicationsSettings>> => {
    try {
      const response = await api.put("/communicationssettings", data);
      return response.data;
    } catch (error: any) {
      return {
        statusCode: error?.response?.status || 500,
        succeeded: false,
        message: error?.response?.data?.message || error?.message || 'Failed to update communications settings',
        errors: error?.response?.data?.errors || null,
        data: {} as CommunicationsSettings
      };
    }
  }
};
