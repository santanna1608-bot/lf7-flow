"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { CreditCard, Search, Building2, Crown, Zap, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function adminSubscriptionsPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setCompanies(data)
      }
      setLoading(false)
    }

    fetchSubscriptions()
  }, [])

  const filteredCompanies = companies.filter(company => 
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.plan_type?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: companies.length,
    premium: companies.filter(c => c.plan_type === 'premium' || c.plan_type === 'pro').length,
    free: companies.filter(c => c.plan_type === 'free' || !c.plan_type).length
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Gestão de Assinaturas <CreditCard className="h-8 w-8 text-primary/40" />
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Monitore os planos e o status financeiro das empresas na plataforma.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-sm">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total de Empresas</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm">
            <Crown className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Planos Pagos</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{stats.premium}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm">
            <Zap className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Planos Gratuitos</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{stats.free}</p>
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por empresa ou plano..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4">Plano Atual</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Início da Assinatura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8">
                      <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{company.name}</p>
                          <p className="text-xs text-slate-400 font-mono tracking-tighter">
                            ID: {company.id?.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider",
                          company.plan_type === 'premium' || company.plan_type === 'pro'
                            ? "bg-amber-100 text-amber-700 border border-amber-200 shadow-sm"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        )}>
                          {company.plan_type || 'free'}
                        </span>
                        {(company.plan_type === 'premium' || company.plan_type === 'pro') && (
                          <Crown className="h-4 w-4 text-amber-500 animate-pulse" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-600">Ativa</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm text-slate-600 font-medium">
                        {company.subscription_start_date 
                          ? new Date(company.subscription_start_date).toLocaleDateString()
                          : new Date(company.created_at).toLocaleDateString()}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <CreditCard className="h-12 w-12 opacity-20" />
                      <p className="text-lg font-medium">Nenhuma assinatura encontrada.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
