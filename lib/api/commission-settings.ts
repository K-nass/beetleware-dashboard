import { api } from "./axios";
import {
  CommissionOfferSettings,
  UpdateCommissionOfferSettingsCommand,
  UpdateGlobalCommissionRateCommand,
  UpdateMinOfferPercentCommand,
  UpdateMaxOfferPercentCommand,
  ApiResponse
} from "@/types/settings";

export const commissionSettingsApi = {
  // Get current commission and offer settings
  get: async (): Promise<ApiResponse<CommissionOfferSettings>> => {
    try {
      const response = await api.get("/commissionoffersettings");
      return response.data;
    } catch (error: any) {
      return {
        statusCode: error?.response?.status || 500,
        succeeded: false,
        message: error?.response?.data?.message || error?.message || 'Failed to fetch commission settings',
        errors: error?.response?.data?.errors || null,
        data: {} as CommissionOfferSettings
      };
    }
  },

  // Update all commission and offer settings
  updateAll: async (
    data: UpdateCommissionOfferSettingsCommand
  ): Promise<ApiResponse<CommissionOfferSettings>> => {
    try {
      const response = await api.put("/commissionoffersettings", data);
      return response.data;
    } catch (error: any) {
      return {
        statusCode: error?.response?.status || 500,
        succeeded: false,
        message: error?.response?.data?.message || error?.message || 'Failed to update commission settings',
        errors: error?.response?.data?.errors || null,
        data: {} as CommissionOfferSettings
      };
    }
  },

  // Update only global commission rate
  updateGlobalCommission: async (
    data: UpdateGlobalCommissionRateCommand
  ): Promise<ApiResponse<CommissionOfferSettings>> => {
    try {
      const response = await api.put(
        "/commissionoffersettings/global-commission",
        data
      );
      return response.data;
    } catch (error: any) {
      return {
        statusCode: error?.response?.status || 500,
        succeeded: false,
        message: error?.response?.data?.message || error?.message || 'Failed to update global commission rate',
        errors: error?.response?.data?.errors || null,
        data: {} as CommissionOfferSettings
      };
    }
  },

  // Update only minimum offer percentage
  updateMinOffer: async (
    data: UpdateMinOfferPercentCommand
  ): Promise<ApiResponse<CommissionOfferSettings>> => {
    try {
      const response = await api.put(
        "/commissionoffersettings/min-offer",
        data
      );
      return response.data;
    } catch (error: any) {
      return {
        statusCode: error?.response?.status || 500,
        succeeded: false,
        message: error?.response?.data?.message || error?.message || 'Failed to update minimum offer percentage',
        errors: error?.response?.data?.errors || null,
        data: {} as CommissionOfferSettings
      };
    }
  },

  // Update only maximum offer percentage
  updateMaxOffer: async (
    data: UpdateMaxOfferPercentCommand
  ): Promise<ApiResponse<CommissionOfferSettings>> => {
    try {
      const response = await api.put(
        "/commissionoffersettings/max-offer",
        data
      );
      return response.data;
    } catch (error: any) {
      return {
        statusCode: error?.response?.status || 500,
        succeeded: false,
        message: error?.response?.data?.message || error?.message || 'Failed to update maximum offer percentage',
        errors: error?.response?.data?.errors || null,
        data: {} as CommissionOfferSettings
      };
    }
  }
};
