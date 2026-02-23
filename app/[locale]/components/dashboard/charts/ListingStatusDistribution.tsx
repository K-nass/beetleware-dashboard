'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { api } from '@/lib/api/axios';

interface StatusData {
  statusId: number;
  statusName: string;
  count: number;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const statusColors: Record<string, string> = {
  'Active': '#4F86F7',
  'Sold': '#5DBEAA',
  'Rejected': '#EF4444',
  'Pending': '#F59E0B',
};

const CustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex justify-center gap-6 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600">
            {entry.value} ({entry.payload.value})
          </span>
        </div>
      ))}
    </div>
  );
};

export default function ListingStatusDistribution() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard/charts/status-distribution');
        
        if (response.data.succeeded && response.data.data?.value) {
          const chartData: ChartData[] = response.data.data.value.map((item: StatusData) => ({
            name: item.statusName,
            value: item.count,
            color: statusColors[item.statusName] || '#6B7280',
          }));
          setData(chartData);
        }
      } catch (err) {
        setError('Failed to load status distribution data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-6">Listing Status Distribution</h2>
      {loading ? (
        <div className="flex items-center justify-center h-[250px]">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[250px]">
          <div className="text-red-500">{error}</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
