"use client"

import { useState } from "react"
import { X, Plus, Trash2, Layout } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/database"

interface FunnelModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function FunnelModal({ isOpen, onClose, onSuccess }: FunnelModalProps) {
  const [name, setName] = useState("")
  const [stages, setStages] = useState<string[]>(["Novo Lead", "Qualificado", "Fechado"])
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  if (!isOpen) return null

  const handleAddStage = () => {
    setStages([...stages, "Novo Estágio"])
  }

  const handleRemoveStage = (index: number) => {
    setStages(stages.filter((_, i) => i !== index))
  }

  const handleStageChange = (index: number, value: string) => {
    const newStages = [...stages]
    newStages[index] = value
    setStages(newStages)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || stages.length === 0 || loading) return

    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('user_id', session.user.id)
        .single()

      if (!profile || !('company_id' in profile) || !profile.company_id) return

      const { error } = await supabase
        .from('funnels')
        .insert({
          name: name.trim(),
          stages: stages,
          company_id: profile.company_id
        })

      if (error) throw error

      onSuccess()
      onClose()
      setName("")
      setStages(["Novo Lead", "Qualificado", "Fechado"])
    } catch (err) {
      console.error('Erro ao criar funil:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-slate-50/10">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
              <Layout className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Novo Funil de Vendas</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Estruture seu processo</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Funil</label>
            <input
              type="text"
              placeholder="Ex: Vendas Diretas, Pós-Venda..."
              className="w-full h-14 rounded-2xl border border-slate-100 bg-slate-50 px-6 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-inner"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estágios (Colunas)</label>
              <button 
                type="button"
                onClick={handleAddStage}
                className="text-[10px] font-black text-primary flex items-center hover:scale-105 transition-transform uppercase tracking-widest"
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar Estágio
              </button>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {stages.map((stage, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                    value={stage}
                    onChange={(e) => handleStageChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStage(index)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 h-14 px-6 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 h-14 bg-primary text-white py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
            >
              {loading ? "Criando..." : "Criar Funil"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
