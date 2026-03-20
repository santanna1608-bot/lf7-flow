"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { CreditCard, Building2, Search, CheckCircle2, AlertCircle, RefreshCcw, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

export default function adminFinancialPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()

  const fetchFinancialData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true })
    
    if (!error && data) {
      setCompanies(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchFinancialData()
  }, [])

  const toggleStatus = async (companyId: string, currentStatus: string) => {
    setUpdatingId(companyId)
    const newStatus = currentStatus === 'bloqueado' ? 'ativo' : 'bloqueado'
    
    const { error } = await supabase
      .from('companies')
      .update({ account_status: newStatus })
      .eq('id', companyId)

    if (!error) {
      setCompanies(prev => prev.map(c => 
        c.id === companyId ? { ...c, account_status: newStatus } : c
      ))
    }
    setUpdatingId(null)
  }

  const filteredCompanies = companies.filter(company => 
    company.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Gestão Financeira <CreditCard className="h-8 w-8 text-primary/40" />
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Controle de faturamento e bloqueio de acesso manual dos clientes.
          </p>
        </div>
        <button 
          onClick={fetchFinancialData}
          className="p-3 rounded-full hover:bg-slate-100 transition-colors text-slate-400 group"
          title="Recarregar dados"
        >
          <RefreshCcw className={cn("h-5 w-5 group-active:rotate-180 transition-transform", loading && "animate-spin")} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Empresas</p>
            <h3 className="text-2xl font-bold">{companies.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ativas</p>
            <h3 className="text-2xl font-bold">{companies.filter(c => c.account_status === 'ativo').length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bloqueadas</p>
            <h3 className="text-2xl font-bold">{companies.filter(c => c.account_status === 'bloqueado').length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">MRR Estimado</p>
            <h3 className="text-2xl font-bold">
              {formatter.format(companies.reduce((acc, curr) => acc + (Number(curr.negotiated_value) || 0), 0))}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar empresa pelo nome..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4">Asaas ID</th>
                <th className="px-6 py-4">Mensalidade</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8">
                      <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                          company.account_status === 'bloqueado' ? "bg-red-50 text-red-300" : "bg-primary/5 text-primary"
                        )}>
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{company.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono tracking-tighter">
                            {company.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {company.asaas_customer_id || 'N/D'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-black text-slate-700">
                        {formatter.format(company.negotiated_value || 0)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border",
                        company.account_status === 'bloqueado'
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      )}>
                        <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", company.account_status === 'bloqueado' ? "bg-red-600" : "bg-emerald-600")} />
                        {company.account_status || 'ativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          disabled={updatingId === company.id}
                          onClick={() => toggleStatus(company.id, company.account_status)}
                          className={cn(
                            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50",
                            company.account_status === 'bloqueado' ? 'bg-slate-200' : 'bg-primary'
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                              company.account_status === 'bloqueado' ? 'translate-x-0' : 'translate-x-5'
                            )}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Nenhuma empresa encontrada.
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
