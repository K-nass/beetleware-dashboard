import { Suspense } from "react";
import { getServerAccessToken } from "@/lib/auth/get-server-token";
import { LayoutList, Users, Clock, BadgeCheck, DollarSign } from "lucide-react";
import StatisticsCard from "../../../components/features/dashboard/statistics/StatisticsCard";
import ListingsByLocation from "../../../components/features/dashboard/charts/ListingsByLocation";
import ListingStatusDistribution from "../../../components/features/dashboard/charts/ListingStatusDistribution";
import CommissionByLocation from "../../../components/features/dashboard/charts/CommissionByLocation";
import PageHeader from "../../../components/features/dashboard/pageHeader/PageHeader";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";

async function fetchChartData(endpoint: string, token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token ?? ''}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  const result = await response.json();
  return result.succeeded ? result.data?.value || [] : [];
}

async function fetchKPIs(token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/kpis`, {
    headers: {
      Authorization: `Bearer ${token ?? ''}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) return null;
  const result = await response.json();
  return result.succeeded ? result.data : null;
}

export default async function DashboardPage() {
  const token = await getServerAccessToken();

  // Start all promises in parallel
  const kpisPromise = fetchKPIs(token);
  const listingsByLocationPromise = fetchChartData("/dashboard/charts/listings-by-location", token);
  const statusDistributionPromise = fetchChartData("/dashboard/charts/status-distribution", token);
  const commissionByLocationPromise = fetchChartData("/dashboard/charts/commission-by-location", token);

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
