'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { location: 'Riyadh', commission: 850000 },
  { location: 'Jeddah', commission: 620000 },
  { location: 'Dammam', commission: 480000 },
  { location: 'Mecca', commission: 350000 },
];

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
