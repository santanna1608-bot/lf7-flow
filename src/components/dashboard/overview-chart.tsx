"use client"

import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

const data = [
  { name: 'Seg', mensagens: 400 },
  { name: 'Ter', mensagens: 300 },
  { name: 'Qua', mensagens: 200 },
  { name: 'Qui', mensagens: 278 },
  { name: 'Sex', mensagens: 189 },
  { name: 'Sáb', mensagens: 239 },
  { name: 'Dom', mensagens: 349 },
]

export function DashboardOverview() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              border: '1px solid #f1f5f9', 
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="mensagens" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorMsg)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
