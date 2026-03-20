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
  const supabase = createClientComponentClient<Database>()

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

      if (!profile?.company_id) return

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Layout className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold">Novo Funil de Vendas</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nome do Funil</label>
            <input
              type="text"
              placeholder="Ex: Vendas Diretas, Pós-Venda..."
              className="w-full rounded-xl border bg-muted/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">Estágios (Colunas)</label>
              <button 
                type="button"
                onClick={handleAddStage}
                className="text-xs font-bold text-primary flex items-center hover:underline"
              >
                <Plus className="mr-1 h-3 w-3" /> Adicionar Estágio
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

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border rounded-xl text-sm font-bold hover:bg-muted transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? "Criando..." : "Criar Funil"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
