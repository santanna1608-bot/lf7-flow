"use client"

import { useState } from "react"
import { X, User, Phone, Save } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface LeadCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialStatus: string
  companyId: string
  funnelId: string
}

export function LeadCreateModal({ isOpen, onClose, onSuccess, initialStatus, companyId, funnelId }: LeadCreateModalProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || loading) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          name: name.trim(),
          phone: phone.trim() || null,
          status: initialStatus,
          company_id: companyId,
          funnel_id: funnelId,
          ai_enabled: true
        })

      if (error) throw error

      onSuccess()
      onClose()
      setName("")
      setPhone("")
    } catch (err) {
      console.error('Erro ao criar lead:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Novo Lead</h3>
              <p className="text-xs text-muted-foreground">Etapa: {initialStatus}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nome Completo</label>
            <input
              type="text"
              placeholder="Digite o nome do lead..."
              className="w-full rounded-xl border bg-muted/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">WhatsApp / Telefone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Ex: 11999999999"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
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
              className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {loading ? "Salvando..." : "Salvar Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
