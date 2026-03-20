"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Building2, Search, Plus, ExternalLink, ShieldCheck } from "lucide-react"

export default function SuperAdminDashboard() {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          profiles(count)
        `)
      
      if (!error) setCompanies(data)
      setLoading(false)
    }
    fetchCompanies()
  }, [])

  if (loading) return <div className="p-8 animate-pulse text-center">Carregando painel global...</div>

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
              className="pl-12 pr-6 h-12 rounded-2xl border border-slate-100 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm w-72 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-6 h-12 rounded-2xl bg-primary text-white font-bold text-sm shadow-xl shadow-primary/20 hover:bg-opacity-90 transition-all active:scale-95">
            <Plus className="h-4 w-4" /> Nova Empresa
          </button>
        </div>
      </div>

      {/* Stats Quick View (Opcional, baseado no visual anterior) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total de Empresas</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{companies.length}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Planos Ativos</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{companies.filter(c => c.plan_type !== 'FREE').length}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Usuários Globais</p>
          <p className="text-3xl font-black text-slate-900 mt-2">157</p>
        </div>
      </div>

      {/* Companies List */}
      <div className="grid gap-6">
        {companies.map((company) => (
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
                  <p className="text-lg font-black text-emerald-500">Online</p>
                </div>
              </div>
              
              <div className="h-12 w-px bg-slate-100 hidden md:block"></div>
              
              <button className="flex items-center gap-2 text-primary font-black hover:text-opacity-80 transition-colors text-sm group-hover:translate-x-1 duration-300">
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
