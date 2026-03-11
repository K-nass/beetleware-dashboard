import { useTranslations } from "next-intl";
import StatisticsCard from "../../../components/features/dashboard/statistics/StatisticsCard";
import ListingsByLocation from "../../../components/features/dashboard/charts/ListingsByLocation";
import ListingStatusDistribution from "../../../components/features/dashboard/charts/ListingStatusDistribution";
import CommissionByLocation from "../../../components/features/dashboard/charts/CommissionByLocation";
import PageHeader from "../../../components/features/dashboard/pageHeader/PageHeader";

export default function DashboardPage() {
    const t = useTranslations("dashboard");
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
                <ListingsByLocation />
                <ListingStatusDistribution />
            </div>

            <div className="grid grid-cols-1 gap-6">
                <CommissionByLocation />
            </div>
        </div>
    );
}