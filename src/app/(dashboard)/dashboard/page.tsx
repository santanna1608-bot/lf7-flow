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
        {/* Connection Status */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-40">
          <span className="text-sm font-medium text-slate-400">Status da Conexão</span>
          <div className="flex flex-col gap-3">
             <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold w-fit border border-emerald-100">
              Conectado
            </div>
          </div>
        </div>

        {/* Delivery Rate */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-40">
          <span className="text-sm font-medium text-slate-400">Taxa de entrega</span>
          <div className="flex flex-col">
            <span className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">66%</span>
            <span className="text-xs text-slate-400 mt-1">Enviadas + Total</span>
          </div>
        </div>

        {/* Error Rate */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-40">
          <span className="text-sm font-medium text-slate-400">Taxa de erro</span>
          <div className="flex flex-col">
            <span className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">0%</span>
            <span className="text-xs text-slate-400 mt-1">Erros + Total</span>
          </div>
        </div>

        {/* Total Leads */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-40">
          <span className="text-sm font-medium text-slate-400">Leads cadastrados</span>
          <div className="flex flex-col">
            <span className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">76</span>
            <span className="text-xs text-slate-400 mt-1">Total na base</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-8">
             <h3 className="font-bold text-slate-800">Leads por etapa (CRM)</h3>
             <button className="text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">Atualizar</button>
           </div>
           <p className="text-xs text-slate-400 -mt-6 mb-8">Quantidade de leads em cada coluna do Kanban</p>
           <div className="h-[250px] w-full bg-slate-50/50 rounded-2xl flex items-end p-6 gap-4 border border-dashed border-slate-200">
              {/* Simple Bar Chart Placeholder */}
              <div className="flex-1 bg-gradient-to-t from-secondary to-secondary/40 rounded-t-lg h-[20%]" />
              <div className="flex-1 bg-gradient-to-t from-primary to-primary/40 rounded-t-lg h-[45%]" />
              <div className="flex-1 bg-gradient-to-t from-secondary to-secondary/40 rounded-t-lg h-[80%]" />
              <div className="flex-1 bg-gradient-to-t from-primary to-primary/40 rounded-t-lg h-[30%]" />
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-8">
             <h3 className="font-bold text-slate-800">Desempenho das campanhas</h3>
             <button className="text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">Atualizar</button>
           </div>
           <div className="flex items-center justify-center py-4 relative">
              <div className="h-48 w-48 rounded-full border-[20px] border-secondary border-r-destructive/20 flex flex-col items-center justify-center">
                 <span className="text-3xl font-black text-slate-800">92%</span>
                 <span className="text-[10px] uppercase font-bold text-slate-400">Sucesso</span>
              </div>
           </div>
           <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-secondary" />
                <span className="text-xs font-bold text-slate-600">Enviadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive/20" />
                <span className="text-xs font-bold text-slate-600">Erros</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
