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
    <div className="flex h-full flex-col space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">CRM Kanban</h2>
          <p className="text-muted-foreground text-sm">
            Gerencie o progresso dos seus leads e acompanhe as automações de IA.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Funnel Selector */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl hover:bg-slate-50 transition-all shadow-sm">
              <Layout className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-slate-700">
                {activeFunnel?.name || "Selecionar Funil"}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 p-1">
              {funnels.map(funnel => (
                <button
                  key={funnel.id}
                  onClick={() => setActiveFunnel(funnel)}
                  className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  {funnel.name}
                </button>
              ))}
              {funnels.length === 0 && (
                <div className="px-3 py-2 text-xs text-muted-foreground italic">Nenhum funil criado</div>
              )}
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-primary-foreground h-10 px-4 py-2 rounded-xl font-bold text-sm flex items-center shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="mr-2 h-4 w-4" /> Novo Funil
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {activeFunnel ? (
          <KanbanBoard activeFunnel={activeFunnel} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl bg-slate-50/50">
            <Layout className="h-16 w-16 text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-400">Nenhum funil selecionado</h3>
            <p className="text-sm text-slate-400">Crie seu primeiro funil para começar a gerenciar leads.</p>
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
