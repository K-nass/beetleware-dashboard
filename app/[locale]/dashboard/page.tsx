import { Suspense } from "react";
import { LayoutList, Users, Clock, BadgeCheck, DollarSign } from "lucide-react";
import StatisticsCard from "../../../components/features/dashboard/statistics/StatisticsCard";
import ListingsByLocation from "../../../components/features/dashboard/charts/ListingsByLocation";
import ListingStatusDistribution from "../../../components/features/dashboard/charts/ListingStatusDistribution";
import CommissionByLocation from "../../../components/features/dashboard/charts/CommissionByLocation";
import PageHeader from "../../../components/features/dashboard/pageHeader/PageHeader";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { fetchApi } from "@/lib/api/fetch-api";
import { CACHE_TAGS, CACHE_TTL } from "@/lib/api/cache-config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchChartData(endpoint: string): Promise<any[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchApi<{ value?: any[] }>(endpoint, {
    revalidate: CACHE_TTL.ANALYTICS,
    tags: [CACHE_TAGS.DASHBOARD],
  });
  return data?.value ?? [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchKPIs(): Promise<any | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await fetchApi<any>("/dashboard/kpis", {
      revalidate: CACHE_TTL.ANALYTICS,
      tags: [CACHE_TAGS.DASHBOARD],
    });
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  // Start all promises in parallel
  const kpisPromise = fetchKPIs();
  const listingsByLocationPromise = fetchChartData("/dashboard/charts/listings-by-location");
  const statusDistributionPromise = fetchChartData("/dashboard/charts/status-distribution");
  const commissionByLocationPromise = fetchChartData("/dashboard/charts/commission-by-location");

  const kpis = await kpisPromise;

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of your platform performance" />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        <StatisticsCard
          label="Total Listings"
          value={kpis?.totalListings?.value ?? 0}
          percent={kpis?.totalListings?.monthOverMonthPercent ?? 0}
          isUp={kpis?.totalListings?.isUp ?? true}
          Icon={LayoutList}
        />
        <StatisticsCard
          label="Pending Approvals"
          value={kpis?.pendingApprovals?.value ?? 0}
          percent={Math.abs(kpis?.pendingApprovals?.monthOverMonthPercent ?? 0)}
          isUp={kpis?.pendingApprovals?.isUp ?? false}
          Icon={Clock}
        />
        <StatisticsCard
          label="Total Users"
          value={kpis?.totalUsers?.value ?? 0}
          percent={kpis?.totalUsers?.monthOverMonthPercent ?? 0}
          isUp={kpis?.totalUsers?.isUp ?? true}
          Icon={Users}
        />
        <StatisticsCard
          label="Properties Sold"
          value={kpis?.propertiesSold?.value ?? 0}
          percent={kpis?.propertiesSold?.monthOverMonthPercent ?? 0}
          isUp={kpis?.propertiesSold?.isUp ?? true}
          Icon={BadgeCheck}
        />
        <StatisticsCard
          label="Total Commissions"
          value={kpis?.totalCommissions?.value ?? 0}
          percent={kpis?.totalCommissions?.monthOverMonthPercent ?? 0}
          isUp={kpis?.totalCommissions?.isUp ?? true}
          Icon={DollarSign}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<LoadingSpinner />}>
          <ListingsByLocation dataPromise={listingsByLocationPromise} />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <ListingStatusDistribution dataPromise={statusDistributionPromise} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<LoadingSpinner />}>
          <CommissionByLocation dataPromise={commissionByLocationPromise} />
        </Suspense>
      </div>
    </div>
  );
}
