'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api/axios';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface LocationCommissionData {
  cityId: number;
  cityName: string;
  totalCommission: number;
}

interface ChartData {
  location: string;
  commission: number;
}

const CustomBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} />;
};

const formatYAxis = (value: number) => {
  if (value >= 1000000) return `${value / 1000000}M`;
  if (value >= 1000) return `${value / 1000}k`;
  return value.toString();
};

export default function CommissionByLocation() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard/charts/commission-by-location');
        console.log(response);
        if (response.data.succeeded) {
          const chartData: ChartData[] = response.data.data.value.map((item: LocationCommissionData) => ({
            location: item.cityName,
            commission: item.totalCommission,
          }));
          setData(chartData);
        }
      } catch (err) {
        console.error('Failed to fetch commission data:', err);
        setError('Failed to load commission data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">Commission Earned by Location</h2>
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">Commission Earned by Location</h2>
        <div className="flex items-center justify-center h-[250px]">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-6">Commission Earned by Location</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="location"
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '13px', fill: '#6b7280' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '13px', fill: '#6b7280' }}
            tickFormatter={formatYAxis}
            ticks={[0, 250000, 500000, 750000, 1000000]}
          />
          <Bar
            dataKey="commission"
            shape={<CustomBar />}
            maxBarSize={80}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#5DBEAA" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
