"use client"

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

const data = [
  { name: 'Seg', mensagens: 400, leads: 24 },
  { name: 'Ter', mensagens: 300, leads: 13 },
  { name: 'Qua', mensagens: 200, leads: 98 },
  { name: 'Qui', mensagens: 278, leads: 39 },
  { name: 'Sex', mensagens: 189, leads: 48 },
  { name: 'Sáb', mensagens: 239, leads: 38 },
  { name: 'Dom', mensagens: 349, leads: 43 },
]

export function DashboardOverview() {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="mensagens" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorMsg)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
