import { getServerAccessToken } from "@/lib/auth/get-server-token";
import { redirect } from "next/navigation";
import StatisticsCard from "../../../components/features/dashboard/statistics/StatisticsCard";
import ListingsByLocation from "../../../components/features/dashboard/charts/ListingsByLocation";
import ListingStatusDistribution from "../../../components/features/dashboard/charts/ListingStatusDistribution";
import CommissionByLocation from "../../../components/features/dashboard/charts/CommissionByLocation";
import PageHeader from "../../../components/features/dashboard/pageHeader/PageHeader";

export default async function DashboardPage() {
    // Get access token from server session
    const token = await getServerAccessToken();
    
    // Redirect if not authenticated
    if (!token) {
        redirect("/login");
    }

    // Fetch chart data
    const [listingsByLocationRes, statusDistributionRes, commissionByLocationRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/charts/listings-by-location`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/charts/status-distribution`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/charts/commission-by-location`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        }),
    ]);

    // Handle responses
    if (!listingsByLocationRes.ok || !statusDistributionRes.ok || !commissionByLocationRes.ok) {
        if (listingsByLocationRes.status === 401 || statusDistributionRes.status === 401 || commissionByLocationRes.status === 401) {
            redirect("/login");
        }
        throw new Error('Failed to fetch dashboard chart data');
    }

    const [listingsByLocationData, statusDistributionData, commissionByLocationData] = await Promise.all([
        listingsByLocationRes.json(),
        statusDistributionRes.json(),
        commissionByLocationRes.json(),
    ]);

    // Extract data from standard response structure
    const listingsByLocation = listingsByLocationData.succeeded ? listingsByLocationData.data?.value || [] : [];
    const statusDistribution = statusDistributionData.succeeded ? statusDistributionData.data?.value || [] : [];
    const commissionByLocation = commissionByLocationData.succeeded ? commissionByLocationData.data?.value || [] : [];

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
                <ListingsByLocation data={listingsByLocation} />
                <ListingStatusDistribution data={statusDistribution} />
            </div>

            <div className="grid grid-cols-1 gap-6">
                <CommissionByLocation data={commissionByLocation} />
            </div>
        </div>
    );
}