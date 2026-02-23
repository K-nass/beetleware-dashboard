import { useTranslations } from "next-intl";
import StatisticsCard from "../components/dashboard/statistics/StatisticsCard";
import ListingsByLocation from "../components/dashboard/charts/ListingsByLocation";
import ListingStatusDistribution from "../components/dashboard/charts/ListingStatusDistribution";
import CommissionByLocation from "../components/dashboard/charts/CommissionByLocation";

export default function DashboardPage() {
    const t = useTranslations("dashboard");
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-gray-600 mt-2">Overview of your platform performance</p>
            </div>
            
            <div className="flex gap-5">
                <StatisticsCard />
                <StatisticsCard />
                <StatisticsCard />
                <StatisticsCard />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ListingsByLocation />
                <ListingStatusDistribution />
            </div>

            <div className="grid grid-cols-1 gap-6">
                <CommissionByLocation />
            </div>
        </div>
    );
}