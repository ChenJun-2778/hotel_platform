import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * 用户增长面积图组件
 */
const UserGrowthChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorMerchants" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#52c41a" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          style={{ fontSize: 12 }}
        />
        <YAxis style={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="用户数" 
          stroke="#1890ff" 
          fillOpacity={1} 
          fill="url(#colorUsers)" 
        />
        <Area 
          type="monotone" 
          dataKey="商户数" 
          stroke="#52c41a" 
          fillOpacity={1} 
          fill="url(#colorMerchants)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default UserGrowthChart;
