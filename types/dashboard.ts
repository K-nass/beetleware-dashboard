// KPI metric with month-over-month comparison
export interface DashboardKpiItem {
  value: number;
  monthOverMonthPercent: number;
  isUp: boolean;
}

// Full KPI response shape
export interface DashboardKpisResponse {
  totalListings: DashboardKpiItem;
  pendingApprovals: DashboardKpiItem;
  totalUsers: DashboardKpiItem;
  propertiesSold: DashboardKpiItem;
  totalCommissions: DashboardKpiItem;
}

// Chart data items
export interface ListingsByLocationItem {
  cityId: number;
  cityName: string;
  count: number;
}

export interface StatusDistributionItem {
  statusId: number;
  statusName: string;
  count: number;
}

export interface CommissionByLocationItem {
  cityId: number;
  cityName: string;
  totalCommission: number;
}
