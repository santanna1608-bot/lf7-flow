"use client"

import { useState, useEffect } from "react"
import { KanbanBoard } from "@/components/crm/kanban-board"
import { Plus, ChevronDown, Layout } from "lucide-react"
import { FunnelModal } from "@/components/crm/funnel-modal"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/database"

type Funnel = Database['public']['Tables']['funnels']['Row']

export default function CRMPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [funnels, setFunnels] = useState<Funnel[]>([])
  const [activeFunnel, setActiveFunnel] = useState<Funnel | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  const fetchFunnels = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('user_id', session.user.id)
        .single()

      if (!profile || !('company_id' in profile) || !profile.company_id) return

      const { data } = await supabase
        .from('funnels')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: true })

      if (data) {
        setFunnels(data)
        if (data.length > 0 && !activeFunnel) {
          setActiveFunnel(data[0])
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFunnels()
  }, [])

  return (
    <div className="flex h-full flex-col space-y-8 max-w-[1400px] mx-auto pb-10 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter">CRM Kanban</h2>
          <p className="text-slate-400 font-medium text-sm">
            Gerencie o progresso dos seus leads e acompanhe as automações de IA.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Funnel Selector */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all shadow-2xl backdrop-blur-xl">
              <Layout className="h-4 w-4 text-primary" />
              <span className="text-xs font-black text-white uppercase tracking-widest">
                {activeFunnel?.name || "Selecionar Funil"}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1.5 backdrop-blur-2xl">
              {funnels.map(funnel => (
                <button
                  key={funnel.id}
                  onClick={() => setActiveFunnel(funnel)}
                  className="w-full text-left px-4 py-2.5 text-[10px] font-black text-slate-400 rounded-xl hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest"
                >
                  {funnel.name}
                </button>
              ))}
              {funnels.length === 0 && (
                <div className="px-4 py-2.5 text-[10px] text-slate-500 font-bold italic uppercase tracking-widest">Nenhum funil criado</div>
              )}
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-premium-gradient text-white h-11 px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest flex items-center shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="mr-2 h-4 w-4" /> Novo Funil
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {activeFunnel ? (
          <KanbanBoard activeFunnel={activeFunnel} />
        ) : (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/5 backdrop-blur-xl">
            <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/5">
              <Layout className="h-10 w-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight mb-2">Nenhum funil selecionado</h3>
            <p className="text-sm text-slate-500 font-medium">Crie seu primeiro funil para começar a gerenciar leads.</p>
          </div>
        )}
      </div>

      <FunnelModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchFunnels}
      />
    </div>
  )
}
