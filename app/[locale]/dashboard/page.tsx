import { Suspense } from "react";
import { getServerAccessToken } from "@/lib/auth/get-server-token";
import { redirect } from "next/navigation";
import StatisticsCard from "../../../components/features/dashboard/statistics/StatisticsCard";
import ListingsByLocation from "../../../components/features/dashboard/charts/ListingsByLocation";
import ListingStatusDistribution from "../../../components/features/dashboard/charts/ListingStatusDistribution";
import CommissionByLocation from "../../../components/features/dashboard/charts/CommissionByLocation";
import PageHeader from "../../../components/features/dashboard/pageHeader/PageHeader";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";

async function fetchChartData(endpoint: string, token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) redirect("/login");
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  const result = await response.json();
  return result.succeeded ? result.data?.value || [] : [];
}

export default async function DashboardPage() {
  const token = await getServerAccessToken();
  if (!token) redirect("/login");

  // Start all promises in parallel (don't await yet)
  const listingsByLocationPromise = fetchChartData("/dashboard/charts/listings-by-location", token);
  const statusDistributionPromise = fetchChartData("/dashboard/charts/status-distribution", token);
  const commissionByLocationPromise = fetchChartData("/dashboard/charts/commission-by-location", token);

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of your platform performance" />

      <div className="flex gap-5">
        <StatisticsCard />
        <StatisticsCard />
        <StatisticsCard />
        <StatisticsCard />
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
