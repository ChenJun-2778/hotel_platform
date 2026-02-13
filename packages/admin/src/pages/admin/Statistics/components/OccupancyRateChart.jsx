import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * 房间入住率柱状图组件
 */
const OccupancyRateChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="hotel" 
          style={{ fontSize: 12 }}
        />
        <YAxis 
          style={{ fontSize: 12 }}
          label={{ value: '入住率 (%)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
        <Bar 
          dataKey="入住率" 
          fill="#1890ff" 
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OccupancyRateChart;
