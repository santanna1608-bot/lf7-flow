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
    <div className="max-w-[1400px] mx-auto space-y-12 pb-24 relative">
      {/* Admin Header (Premium Style - Light) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 flex items-center gap-4">
            Gestão de Ecossistema <ShieldCheck className="h-10 w-10 text-primary opacity-40" />
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Monitore e controle todas as instâncias do <span className="text-primary font-black">LF7 AI Flow</span> em escala global.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block group/search">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/search:text-primary transition-colors" />
            <input 
              placeholder="Identificar empresa ou ID..."
              className="pl-14 pr-6 h-14 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all text-sm w-80 shadow-sm text-slate-900 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 px-8 h-14 rounded-2xl bg-premium-gradient text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="h-5 w-5" /> Nova Instância
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

      {/* Stats Quick View (White Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in zoom-in duration-500 delay-150">
        {[
          { label: "Total Instâncias", value: stats.total, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Taxa de Atividade", value: stats.active, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Sinal de Alerta", value: stats.blocked, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Receita (MRR)", value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.mrr), icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
            <div className={cn(
              "h-16 w-16 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner group-hover:scale-110 transition-transform duration-500",
              stat.bg, stat.color
            )}>
              <stat.icon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 leading-tight mt-1 group-hover:text-primary transition-colors">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Companies List (Clean List Items) */}
      <div className="grid gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        {filteredCompanies.map((company) => (
          <div 
            key={company.id} 
            className="bg-white border border-slate-100 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-[2px] h-full bg-premium-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-8">
              <div className="h-20 w-20 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 shadow-inner group-hover:scale-105 group-hover:rotate-3 transition-all duration-500">
                <Building2 className="h-10 w-10 text-slate-300 group-hover:text-primary transition-all" />
              </div>
              <div>
                <h3 className="font-black text-2xl text-slate-900 tracking-tighter group-hover:text-primary transition-colors">{company.name}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm mt-1.5 font-medium">
                  <span className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">ID: {company.id.slice(0, 12)}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-200" />
                  <span className={cn(
                    "px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                    company.plan_type === 'PREMIUM' 
                      ? "bg-purple-50 text-purple-600 border-purple-100" 
                      : "bg-emerald-50 text-emerald-600 border-emerald-100"
                  )}>
                    {company.plan_type || 'FREE'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-16 mt-10 md:mt-0 w-full md:w-auto justify-between md:justify-end">
              <div className="flex gap-12">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estatura</p>
                  <p className="text-xl font-black text-slate-900 mt-1 tabular-nums tracking-tighter">{company.profiles?.[0]?.count || 0} <span className="text-[10px] text-slate-400 ml-1">users</span></p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</p>
                  <p className={cn(
                    "text-xl font-black mt-1 uppercase tracking-tighter",
                    company.account_status === 'bloqueado' ? "text-rose-500" : "text-emerald-500"
                  )}>
                    {company.account_status === 'bloqueado' ? 'Offline' : 'Online'}
                  </p>
                </div>
              </div>
              
              <div className="h-16 w-px bg-slate-100 hidden md:block"></div>
              
              <button 
                onClick={() => {
                  setSelectedCompany(company)
                  setIsManageModalOpen(true)
                }}
                className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:text-slate-900 transition-all group-hover:translate-x-3 duration-500"
              >
                Gerenciar <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {companies.length === 0 && (
          <div className="text-center py-24 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200 animate-in fade-in duration-1000">
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Nenhuma instância detectada no ecossistema.</p>
          </div>
        )}
      </div>
    </div>
  )
}
