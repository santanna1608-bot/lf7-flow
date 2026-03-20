"use client"
import { DashboardOverview } from "@/components/dashboard/overview-chart"
import { 
  Users, 
  MessageSquare, 
  Target, 
  TrendingUp,
  ShieldCheck,
  Send,
  AlertCircle,
  PlayCircle
} from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"

const stats = [
  {
    name: "Total de Leads",
    value: "1,284",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-100"
  },
  {
    name: "Conversas Ativas",
    value: "573",
    change: "+18.2%",
    trend: "up",
    icon: MessageSquare,
    color: "text-purple-600",
    bg: "bg-purple-100"
  },
  {
    name: "Taxa de Retenção IA",
    value: "94.2%",
    change: "+2.4%",
    trend: "up",
    icon: Target,
    color: "text-green-600",
    bg: "bg-green-100"
  },
  {
    name: "Leads Convertidos",
    value: "42",
    change: "-4.1%",
    trend: "down",
    icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-100"
  }
]

export default function DashboardPage() {
  const supabase = createClientComponentClient()
  const [userName, setUserName] = useState("Usuário")
  
  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', session.user.id)
          .single()
        if (profile?.full_name) setUserName(profile.full_name.split(' ')[0])
      }
    }
    loadUser()
  }, [])

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-medium text-slate-900">
          Olá, {userName} 👋 <span className="text-slate-400">bem-vindo ao seu painel</span>
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats Cards */}
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className={`text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.change} <span className="text-slate-300 font-normal">vs mês anterior</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-slate-800">{stat.value}</span>
              <span className="text-sm font-medium text-slate-400 mt-1">{stat.name}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Charts and activity can go here as before */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-8">
             <h3 className="font-bold text-slate-800">Leads por etapa (CRM)</h3>
             <button className="text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">Atualizar</button>
           </div>
           <p className="text-xs text-slate-400 -mt-6 mb-8">Quantidade de leads em cada coluna do Kanban</p>
           <div className="h-[250px] w-full bg-slate-50/50 rounded-2xl flex items-end p-6 gap-4 border border-dashed border-slate-200">
              <div className="flex-1 bg-blue-500/20 rounded-t-lg h-[20%]" />
              <div className="flex-1 bg-primary/20 rounded-t-lg h-[45%]" />
              <div className="flex-1 bg-blue-500/20 rounded-t-lg h-[80%]" />
              <div className="flex-1 bg-primary/20 rounded-t-lg h-[30%]" />
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center">
           <h3 className="font-bold text-slate-800 mb-8">Atividade Recente</h3>
           <p className="text-sm text-slate-400 italic">Nenhuma atividade detectada recentemente.</p>
        </div>
      </div>
    </div>
  )
}
