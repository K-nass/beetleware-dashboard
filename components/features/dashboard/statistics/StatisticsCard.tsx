import { LucideIcon } from "lucide-react";

interface StatisticsCardProps {
  label: string;
  value: string | number;
  percent: number;
  isUp: boolean;
  Icon: LucideIcon;
}

export default function StatisticsCard({ label, value, percent, isUp, Icon }: StatisticsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow flex-1 min-w-[200px] mt-2">
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-gray-400 text-lg font-medium">{label}</h2>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="bg-blue-500 rounded-2xl p-4">
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-sm font-semibold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
            {isUp ? '+' : ''}{percent}%
          </span>
          <span className="text-gray-400 text-base">from last month</span>
        </div>
      </div>
    </div>
  );
}