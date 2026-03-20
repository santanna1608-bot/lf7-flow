"use client"

import { StatsChart } from "@/components/dashboard/stats-chart"
import { 
  Users, 
  MessageSquare, 
  UserPlus,
  Target, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Download
} from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Dados estáticos removidos - substituídos por dashboardStats


export default function DashboardPage() {
  const supabase = createClientComponentClient()
  const [userName, setUserName] = useState("Usuário")
  const [downloading, setDownloading] = useState(false)
  const [dashboardStats, setDashboardStats] = useState<any[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  
  useEffect(() => {
    let mounted = true

    async function loadDashboardData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session || !mounted) {
          setLoadingStats(false)
          return
        }

        // Obter perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, company_id')
          .eq('user_id', session.user.id)
          .single()
        
        if (!mounted) return
        if (profile?.full_name) setUserName(profile.full_name.split(' ')[0])
        
        let leadsData = []
        if (profile?.company_id) {
          const { data: leads } = await supabase
            .from('leads')
            .select('*')
            .eq('company_id', profile.company_id)
          leadsData = leads || []
        }

        const total = leadsData.length
        const converted = leadsData.filter(l => l.status === 'Agendado' || l.status === 'Qualificado').length
        const active = leadsData.filter(l => l.status !== 'Perdido').length
        const retention = total > 0 ? 94.2 : 0

        setDashboardStats([
          { name: "Total de Leads", value: total.toLocaleString(), change: "+0%", trend: "up", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { name: "Conversas Ativas", value: active.toLocaleString(), change: "+0%", trend: "up", icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
          { name: "Taxa de Retenção IA", value: `${retention}%`, change: "+0%", trend: "up", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
          { name: "Leads Convertidos", value: converted.toLocaleString(), change: "+0%", trend: "up", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" }
        ])

        // Buscar mensagens para o gráfico
        let msgs: any[] | null = []
        if (profile?.company_id) {
          const { data } = await supabase
            .from('messages')
            .select('role, created_at')
            .eq('company_id', profile.company_id)
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          msgs = data
        }

        if (mounted && msgs) {
          const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
          const chartMap: any = {}
          
          // Inicializa os últimos 7 dias
          for (let i = 6; i >= 0; i--) {
            const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
            const dayName = days[date.getDay()]
            chartMap[dayName] = { name: dayName, ia: 0, user: 0 }
          }

          msgs.forEach(m => {
            const dayName = days[new Date(m.created_at).getDay()]
            if (chartMap[dayName]) {
              if (m.role === 'assistant' || m.role === 'ia') chartMap[dayName].ia++
              else chartMap[dayName].user++
            }
          })
          setChartData(Object.values(chartMap))
        }

        // Buscar atividades recentes (últimos 5 leads)
        let recentLeads: any[] | null = []
        if (profile?.company_id) {
          const { data } = await supabase
            .from('leads')
            .select('*')
            .eq('company_id', profile.company_id)
            .order('created_at', { ascending: false })
            .limit(5)
          recentLeads = data
        }

        if (mounted && recentLeads) {
          setActivities(recentLeads.map(lead => ({
            id: lead.id,
            title: lead.status === 'Qualificado' ? "Novo lead qualificado por IA" : "Novo lead no funil",
            time: `há ${Math.floor((Date.now() - new Date(lead.created_at).getTime()) / 60000)} min atrás`,
            amount: "+$240.00", // Fixado conforme design, ou pode ser dinâmico no futuro
            color: lead.status === 'Qualificado' ? "text-emerald-500" : "text-blue-500"
          })))
        }
      } catch (error) {
        console.error("Dashboard error:", error)
      } finally {
        if (mounted) setLoadingStats(false)
      }
    }

    loadDashboardData()
    
    // Timeout de segurança: desliga o loading após 5s se travar
    const timer = setTimeout(() => {
      if (mounted) setLoadingStats(false)
    }, 5000)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
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
        {loadingStats ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 animate-pulse shadow-sm" />
          ))
        ) : dashboardStats.map((stat) => (
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
             <StatsChart data={chartData} />
        </div>

        {/* Activity Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
           <h3 className="text-xl font-bold text-slate-800 mb-8 text-center">Atividade Recente</h3>
           
           <div className="space-y-6 flex-1">
             {activities.length > 0 ? activities.map((activity) => (
               <div key={activity.id} className="flex items-center justify-between group">
                 <div className="flex items-center gap-4">
                   <div className={cn(
                     "h-10 w-10 rounded-xl flex items-center justify-center",
                     activity.color.includes('emerald') ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500"
                   )}>
                      <UserPlus className="h-5 w-5" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-sm font-bold text-slate-800">{activity.title}</span>
                     <span className="text-xs text-slate-400">{activity.time}</span>
                   </div>
                 </div>
                 <span className={`text-sm font-bold ${activity.color}`}>{activity.amount}</span>
               </div>
             )) : (
               <div className="text-center py-10 text-slate-400 text-sm italic">
                 Nenhuma atividade recente.
               </div>
             )}
           </div>

           <Link 
             href="/crm"
             className="mt-10 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors text-center w-full"
           >
             Ver todas as atividades
           </Link>
        </div>
      </div>
    </div>
  )
}
