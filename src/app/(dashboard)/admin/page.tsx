"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Building2, Search, Plus, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { NewCompanyModal } from "@/components/admin/new-company-modal"
import { ManageCompanyModal } from "@/components/admin/manage-company-modal"

export default function SuperAdminDashboard() {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null)
  const supabase = createClientComponentClient()

  const fetchCompanies = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('companies')
      .select(`
        *,
        profiles(count)
      `)
      .order('created_at', { ascending: false })
    
    if (!error) setCompanies(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const filteredCompanies = companies?.filter(company => 
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.id?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  // Cálculos de Estatísticas
  const stats = {
    total: companies.length,
    active: companies.filter(c => c.account_status === 'ativo').length,
    blocked: companies.filter(c => c.account_status === 'bloqueado').length,
    mrr: companies
      .filter(c => c.account_status === 'ativo')
      .reduce((acc, c) => acc + (Number(c.negotiated_value) || 0), 0)
  }

  // Somente mostrar loading total se for a primeira carga e não tivermos dados
  if (loading && companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-pulse">
        <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Sincronizando LF7 AI Flow...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            Gestão de Empresas <ShieldCheck className="h-8 w-8 text-primary opacity-20" />
          </h1>
          <p className="text-slate-500 mt-2">Monitore e gerencie todas as instâncias do LF7 AI Flow em tempo real.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              placeholder="Buscar por nome ou ID..."
              className="pl-12 pr-6 h-12 rounded-2xl border border-slate-100 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm w-72 shadow-sm text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 h-12 rounded-2xl bg-primary text-white font-bold text-sm shadow-xl shadow-primary/20 hover:bg-opacity-90 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> Nova Empresa
          </button>
        </div>
      </div>

      <NewCompanyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCompanies}
      />

      <ManageCompanyModal 
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false)
          setSelectedCompany(null)
        }}
        onSuccess={fetchCompanies}
        company={selectedCompany}
      />

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Empresas</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ativas</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{stats.active}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
            <AlertCircle className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bloqueadas</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{stats.blocked}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
            <DollarSign className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MRR Estimado</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.mrr)}
            </p>
          </div>
        </div>
      </div>

      {/* Companies List */}
      <div className="grid gap-6">
        {filteredCompanies.map((company) => (
          <div 
            key={company.id} 
            className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-[1.25rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-inner group-hover:scale-110 transition-transform">
                <Building2 className="h-8 w-8 text-primary/40" />
              </div>
              <div>
                <h3 className="font-black text-xl text-slate-900">{company.name}</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm mt-1">
                  <span className="text-slate-400 font-mono text-xs">ID: {company.id.slice(0, 8)}...</span>
                  <span className="text-slate-200">•</span>
                  <span className={cn(
                    "px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                    company.plan_type === 'PREMIUM' 
                      ? "bg-purple-100 text-purple-600" 
                      : "bg-emerald-100 text-emerald-600"
                  )}>
                    {company.plan_type || 'FREE'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-12 mt-6 md:mt-0 w-full md:w-auto justify-between md:justify-end">
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Usuários</p>
                  <p className="text-lg font-black text-slate-900">{company.profiles?.[0]?.count || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Status</p>
                  <p className={cn(
                    "text-lg font-black",
                    company.account_status === 'bloqueado' ? "text-red-500" : "text-emerald-500"
                  )}>
                    {company.account_status === 'bloqueado' ? 'Bloqueado' : 'Online'}
                  </p>
                </div>
              </div>
              
              <div className="h-12 w-px bg-slate-100 hidden md:block"></div>
              
              <button 
                onClick={() => {
                  setSelectedCompany(company)
                  setIsManageModalOpen(true)
                }}
                className="flex items-center gap-2 text-primary font-black hover:text-opacity-80 transition-colors text-sm group-hover:translate-x-1 duration-300"
              >
                Gerenciar <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {companies.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">Nenhuma empresa encontrada.</p>
          </div>
        )}
      </div>
    </div>
  )
}
