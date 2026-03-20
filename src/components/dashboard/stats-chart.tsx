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

interface ChartData {
  name: string
  ia: number
  user: number
}

export function StatsChart({ data }: { data?: ChartData[] }) {
  const chartData = data && data.length > 0 ? data : [
    { name: 'Seg', ia: 0, user: 0 },
    { name: 'Ter', ia: 0, user: 0 },
    { name: 'Qua', ia: 0, user: 0 },
    { name: 'Qui', ia: 0, user: 0 },
    { name: 'Sex', ia: 0, user: 0 },
    { name: 'Sáb', ia: 0, user: 0 },
    { name: 'Dom', ia: 0, user: 0 },
  ]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
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
            dataKey="ia" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorIA)" 
            name="IA"
          />
          <Area 
            type="monotone" 
            dataKey="user" 
            stroke="#8b5cf6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorUser)" 
            name="Usuário"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
