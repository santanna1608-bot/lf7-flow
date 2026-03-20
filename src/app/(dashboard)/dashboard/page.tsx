"use client"

import { DashboardOverview } from "@/components/dashboard/overview-chart"
import { 
  Users, 
  MessageSquare, 
  Target, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Download
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
    bg: "bg-blue-50"
  },
  {
    name: "Conversas Ativas",
    value: "573",
    change: "+18.2%",
    trend: "up",
    icon: MessageSquare,
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    name: "Taxa de Retenção IA",
    value: "94.2%",
    change: "+2.4%",
    trend: "up",
    icon: Target,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    name: "Leads Convertidos",
    value: "42",
    change: "-4.1%",
    trend: "down",
    icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-50"
  }
]

const recentActivities = [
  {
    id: 1,
    title: "Novo lead qualificado por IA",
    time: "há 10 minutos atrás",
    amount: "+$240.00",
    color: "text-emerald-500"
  },
  {
    id: 2,
    title: "Novo lead qualificado por IA",
    time: "há 20 minutos atrás",
    amount: "+$240.00",
    color: "text-emerald-500"
  },
  {
    id: 3,
    title: "Novo lead qualificado por IA",
    time: "há 30 minutos atrás",
    amount: "+$240.00",
    color: "text-emerald-500"
  },
  {
    id: 4,
    title: "Novo lead qualificado por IA",
    time: "há 40 minutos atrás",
    amount: "+$240.00",
    color: "text-emerald-500"
  },
  {
    id: 5,
    title: "Novo lead qualificado por IA",
    time: "há 50 minutos atrás",
    amount: "+$240.00",
    color: "text-emerald-500"
  }
]

export default function DashboardPage() {
  const supabase = createClientComponentClient()
  const [userName, setUserName] = useState("Usuário")
  const [downloading, setDownloading] = useState(false)
  
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

  const handleDownloadReport = async () => {
    setDownloading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Obter o perfil para pegar o company_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('user_id', session.user.id)
        .single()

      if (!profile?.company_id) return

      // Buscar leads da empresa
      const { data: leads, error } = await supabase
        .from('leads')
        .select('name, phone, status, created_at')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false })

      if (error || !leads) {
        alert('Erro ao gerar relatório. Tente novamente.')
        return
      }

      // Gerar CSV
      const headers = ['Nome', 'Telefone', 'Status', 'Data de Cadastro']
      const csvRows = [
        '\uFEFF' + headers.join(';'), // Adiciona BOM para Excel ler acentos
        ...leads.map(lead => [
          `"${lead.name || ''}"`,
          `"${lead.phone || ''}"`,
          `"${lead.status || ''}"`,
          `"${new Date(lead.created_at).toLocaleDateString('pt-BR')}"`
        ].join(';'))
      ]
      const csvString = csvRows.join('\n')

      // Download do Arquivo
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.setAttribute('hidden', '')
      a.setAttribute('href', url)
      a.setAttribute('download', `relatorio_leads_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err) {
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Bem-vindo de volta! Aqui está um resumo do seu fluxo de IA.</p>
        </div>
        <button 
          onClick={handleDownloadReport}
          disabled={downloading}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563eb] text-white font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-wait",
            downloading && "animate-pulse"
          )}
        >
          {downloading ? "Gerando..." : "Baixar Relatório"}
          <Download className="h-4 w-4" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative group hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-semibold text-slate-500">{stat.name}</span>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-bold text-slate-900">{stat.value}</span>
              <div className="flex items-center gap-1 mt-2">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-rose-500" />
                )}
                <span className={`text-sm font-bold ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.change}
                </span>
                <span className="text-slate-400 text-sm ml-1">vs mês anterior</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-bold text-slate-800">Volume de Mensagens (IA vs User)</h3>
           </div>
           <DashboardOverview />
        </div>

        {/* Activity Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
           <h3 className="text-xl font-bold text-slate-800 mb-8 text-center">Atividade Recente</h3>
           
           <div className="space-y-6 flex-1">
             {recentActivities.map((activity) => (
               <div key={activity.id} className="flex items-center justify-between group">
                 <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                     <MessageSquare className="h-5 w-5" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-sm font-bold text-slate-800">{activity.title}</span>
                     <span className="text-xs text-slate-400">{activity.time}</span>
                   </div>
                 </div>
                 <span className={`text-sm font-bold ${activity.color}`}>{activity.amount}</span>
               </div>
             ))}
           </div>

           <button className="mt-10 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors text-center w-full">
             Ver todas as atividades
           </button>
        </div>
      </div>
    </div>
  )
}
