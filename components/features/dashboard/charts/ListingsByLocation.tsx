'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

interface LocationData {
  cityId: number;
  cityName: string;
  count: number;
}

interface ChartData {
  location: string;
  listings: number;
}

interface ListingsByLocationProps {
  data: LocationData[];
}

const CustomBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} />;
};

export default function ListingsByLocation({ data }: ListingsByLocationProps) {
  const chartData: ChartData[] = data.map((item: LocationData) => ({
    location: item.cityName,
    listings: item.count,
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">Listings by Location</h2>
        <div className="flex items-center justify-center h-[250px]">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...chartData.map(item => item.listings));
  const yAxisMax = Math.ceil(maxValue / 100) * 100;
  const yAxisTicks = [0, yAxisMax * 0.25, yAxisMax * 0.5, yAxisMax * 0.75, yAxisMax];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-6">Listings by Location</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            ticks={yAxisTicks}
          />
          <Bar 
            dataKey="listings" 
            shape={<CustomBar />}
            maxBarSize={80}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#4F86F7" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
