import { DashboardOverview } from "@/components/dashboard/overview-chart"
import { 
  Users, 
  MessageSquare, 
  Target, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

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
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Bem-vindo de volta! Aqui está um resumo do seu fluxo de IA.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="bg-primary text-primary-foreground h-9 px-4 rounded-md text-sm font-medium transition-colors hover:bg-primary/90">
            Baixar Relatório
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{stat.name}</h3>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
                <span className="text-[10px] text-muted-foreground ml-1">vs mês anterior</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight mb-4">Volume de Mensagens (IA vs User)</h3>
            <DashboardOverview />
          </div>
        </div>
        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-semibold leading-none tracking-tight mb-6">Atividade Recente</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center mr-3">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Novo lead qualificado por IA</p>
                  <p className="text-xs text-muted-foreground">há {i * 10} minutos atrás</p>
                </div>
                <div className="ml-auto font-medium text-xs text-green-500">
                  +$240.00
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-md transition-colors">
            Ver todas as atividades
          </button>
        </div>
      </div>
    </div>
  )
}
